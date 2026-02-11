// Matching logic for AgroSoluce v1 scope
// Simple, explicit matching algorithm

import type { Cooperative as BaseCooperative } from '@/types';
import { BuyerRequest, MatchingResult, Cooperative } from './types';

/**
 * Match cooperatives to a buyer request
 * Returns sorted list of matches with scores
 */
export function matchCooperativesToRequest(
  request: BuyerRequest,
  coops: BaseCooperative[]
): MatchingResult[] {
  // Filter by commodity first
  let matches = coops.filter(c => c.commodity === request.commodity);

  // Filter by certifications if required
  if (request.requirements.certifications?.length) {
    matches = matches.filter(c =>
      (c.certifications || []).length > 0 &&
      request.requirements.certifications!.every(req =>
        (c.certifications || []).includes(req)
      )
    );
  }

  // Filter by EUDR requirement
  if (request.requirements.eudrRequired) {
    matches = matches.filter(c => c.complianceFlags?.eudrReady === true);
  }

  // Filter by child labor zero tolerance
  // Only allow low risk or unknown (unknown is acceptable but will score lower)
  if (request.requirements.childLaborZeroTolerance) {
    matches = matches.filter(
      c => {
        const risk = c.complianceFlags?.childLaborRisk;
        return risk === 'low' || risk === 'unknown' || !risk; // Treat undefined as unknown
      }
    );
  }

  // Calculate scores and add reasons
  const scoredMatches = matches.map(coop => {
    const score = computeScore(request, coop);
    const reasons = getMatchReasons(request, coop);
    
    // Convert BaseCooperative to Cooperative (ensuring required fields)
    const cooperative: Cooperative = {
      ...coop,
      country: coop.country || 'Unknown',
      commodity: coop.commodity || request.commodity,
      certifications: coop.certifications || [],
      complianceFlags: coop.complianceFlags || {}
    };
    
    return {
      cooperative,
      matchScore: score,
      reasons
    };
  });

  // Sort by score (highest first)
  return scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Compute match score for a cooperative
 * Returns a score from 0-100
 * Scoring is contextual: required features are baseline, optional features add value
 */
function computeScore(request: BuyerRequest, coop: BaseCooperative): number {
  let score = 0;
  const maxScore = 100;

  // Base score for passing all filters (30 points)
  // If we got here, the cooperative meets all required criteria
  score += 30;

  // Country match (25 points) - High value for geographic alignment
  if (coop.country === request.targetCountry) {
    score += 25;
  }

  // EUDR scoring - contextual based on requirement
  if (request.requirements.eudrRequired) {
    // If required, all matches already have it (filtered), so give bonus points
    // for having it when required (15 points)
    if (coop.complianceFlags?.eudrReady) {
      score += 15;
    }
  } else {
    // If not required, it's a nice-to-have bonus (10 points)
    if (coop.complianceFlags?.eudrReady) {
      score += 10;
    }
  }

  // Child labor risk scoring - contextual based on requirement
  if (request.requirements.childLaborZeroTolerance) {
    // If required, all matches already have low/unknown (filtered)
    // Give bonus for low risk (15 points), partial for unknown (5 points)
    const risk = coop.complianceFlags?.childLaborRisk;
    if (risk === 'low') {
      score += 15;
    } else if (risk === 'unknown' || !risk) {
      score += 5; // Unknown is acceptable but less ideal
    }
  } else {
    // If not required, still valuable to have low risk (10 points)
    const risk = coop.complianceFlags?.childLaborRisk;
    if (risk === 'low') {
      score += 10;
    } else if (risk === 'medium') {
      score += 5;
    }
  }

  // Volume match (20 points) - Important for supply chain planning
  if (coop.annualVolumeTons && request.minVolumeTons) {
    if (request.maxVolumeTons) {
      // Both min and max specified
      if (
        coop.annualVolumeTons >= request.minVolumeTons &&
        coop.annualVolumeTons <= request.maxVolumeTons
      ) {
        score += 20; // Perfect match
      } else if (coop.annualVolumeTons >= request.minVolumeTons * 0.8) {
        score += 12; // Close to minimum (80%+)
      } else if (coop.annualVolumeTons >= request.minVolumeTons * 0.5) {
        score += 6; // Partial match (50-80%)
      }
    } else {
      // Only minimum specified
      if (coop.annualVolumeTons >= request.minVolumeTons) {
        score += 20; // Meets minimum
      } else if (coop.annualVolumeTons >= request.minVolumeTons * 0.8) {
        score += 12; // Close to minimum
      }
    }
  }

  // Certification scoring (up to 20 points)
  const coopCerts = coop.certifications || [];
  if (request.requirements.certifications && request.requirements.certifications.length > 0) {
    const matchingCerts = request.requirements.certifications.filter(cert =>
      coopCerts.includes(cert)
    );
    // All required certifications are already met (filtered), so give bonus
    // 10 points for having all required, plus 2 points per additional cert (capped)
    if (matchingCerts.length === request.requirements.certifications.length) {
      score += 10; // Has all required
      const additionalCerts = coopCerts.length - matchingCerts.length;
      score += Math.min(additionalCerts * 2, 10); // Bonus for extra certs (max 10)
    }
  } else {
    // No certifications required, but having any is a bonus (5 points)
    if (coopCerts.length > 0) {
      score += Math.min(coopCerts.length * 2, 5);
    }
  }

  return Math.min(score, maxScore); // Cap at 100
}

/**
 * Get human-readable reasons for the match
 * Provides context on why this cooperative matches well
 */
function getMatchReasons(request: BuyerRequest, coop: BaseCooperative): string[] {
  const reasons: string[] = [];

  // Country match
  if (coop.country === request.targetCountry) {
    reasons.push('Matches target country');
  } else {
    reasons.push(`Located in ${coop.country}`);
  }

  // EUDR status
  if (coop.complianceFlags?.eudrReady) {
    if (request.requirements.eudrRequired) {
      reasons.push('EUDR-aligned documentation available (required)');
    } else {
      reasons.push('EUDR-aligned documentation available (bonus)');
    }
  } else if (request.requirements.eudrRequired) {
    // This shouldn't happen due to filtering, but handle edge case
    reasons.push('EUDR documentation status unknown');
  }

  // Child labor risk
  const childLaborRisk = coop.complianceFlags?.childLaborRisk || 'unknown';
  if (childLaborRisk === 'low') {
    reasons.push('Low child labor risk');
  } else if (childLaborRisk === 'unknown') {
    if (request.requirements.childLaborZeroTolerance) {
      reasons.push('Child labor risk assessment pending (acceptable)');
    } else {
      reasons.push('Child labor risk assessment pending');
    }
  } else if (childLaborRisk === 'medium' && !request.requirements.childLaborZeroTolerance) {
    reasons.push('Medium child labor risk (monitoring recommended)');
  }

  // Volume match
  if (coop.annualVolumeTons && request.minVolumeTons) {
    if (request.maxVolumeTons) {
      if (
        coop.annualVolumeTons >= request.minVolumeTons &&
        coop.annualVolumeTons <= request.maxVolumeTons
      ) {
        reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year (within range)`);
      } else if (coop.annualVolumeTons >= request.minVolumeTons) {
        reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year (exceeds max)`);
      } else if (coop.annualVolumeTons >= request.minVolumeTons * 0.8) {
        reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year (close to minimum)`);
      } else {
        reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year (below minimum)`);
      }
    } else {
      if (coop.annualVolumeTons >= request.minVolumeTons) {
        reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year (meets minimum)`);
      } else if (coop.annualVolumeTons >= request.minVolumeTons * 0.8) {
        reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year (close to minimum)`);
      }
    }
  } else if (coop.annualVolumeTons) {
    reasons.push(`Volume: ${coop.annualVolumeTons.toLocaleString()} tons/year`);
  }

  // Certifications
  const coopCerts = coop.certifications || [];
  if (request.requirements.certifications && request.requirements.certifications.length > 0) {
    const matchingCerts = request.requirements.certifications.filter(cert =>
      coopCerts.includes(cert)
    );
    if (matchingCerts.length === request.requirements.certifications.length) {
      reasons.push(`Has all ${matchingCerts.length} required certification(s): ${matchingCerts.join(', ')}`);
      const additionalCerts = coopCerts.filter(c => !request.requirements.certifications!.includes(c));
      if (additionalCerts.length > 0) {
        reasons.push(`Plus ${additionalCerts.length} additional certification(s)`);
      }
    }
  } else if (coopCerts.length > 0) {
    reasons.push(`Has ${coopCerts.length} certification(s): ${coopCerts.join(', ')}`);
  }

  return reasons;
}


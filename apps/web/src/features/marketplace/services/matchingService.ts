// Buyer-Seller Matching Service
// Matches buyers with suppliers based on requirements

import { getProducts } from '@/features/products/api/productsApi';
import { getCertifications } from '@/features/compliance/api/complianceApi';
import type { Product, Cooperative } from '@/types';

export interface BuyerRequirements {
  productName?: string;
  category?: string;
  minQuantity?: number;
  maxPrice?: number;
  requiredCertifications?: string[]; // e.g., ['organic', 'fair_trade']
  region?: string;
  eudrAligned?: boolean; // EUDR-aligned documentation and due diligence context
}

export interface MatchResult {
  product: Product;
  cooperative: Cooperative;
  matchScore: number; // 0-100
  matchReasons: string[];
  missingRequirements?: string[];
}

/**
 * Find suppliers matching buyer requirements
 */
export async function findSuppliers(
  requirements: BuyerRequirements,
  cooperatives: Cooperative[]
): Promise<MatchResult[]> {
  const results: MatchResult[] = [];

  // Get all products
  const { data: allProducts } = await getProducts();

  if (!allProducts) {
    return results;
  }

  // Filter products by basic requirements
  let filteredProducts = allProducts.filter((product) => {
    if (requirements.productName && !product.name.toLowerCase().includes(requirements.productName.toLowerCase())) {
      return false;
    }
    if (requirements.category && product.category_id !== requirements.category) {
      return false;
    }
    if (requirements.minQuantity && (product.quantity_available || 0) < requirements.minQuantity) {
      return false;
    }
    if (requirements.maxPrice && (product.price || 0) > requirements.maxPrice) {
      return false;
    }
    return true;
  });

  // Score each match
  for (const product of filteredProducts) {
    const cooperative = cooperatives.find((c) => c.id === product.cooperative_id);
    if (!cooperative) continue;

    const match = await scoreMatch(product, cooperative, requirements);
    if (match.matchScore > 0) {
      results.push(match);
    }
  }

  // Sort by match score (highest first)
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}

/**
 * Score a product-cooperative match against buyer requirements
 */
async function scoreMatch(
  product: Product,
  cooperative: Cooperative,
  requirements: BuyerRequirements
): Promise<MatchResult> {
  let score = 0;
  const matchReasons: string[] = [];
  const missingRequirements: string[] = [];

  // Base score for having a matching product
  score += 30;
  matchReasons.push('Produit correspondant disponible');

  // Check certifications
  if (requirements.requiredCertifications && requirements.requiredCertifications.length > 0) {
    const { data: certifications } = await getCertifications(cooperative.id);
    const activeCertTypes = (certifications || [])
      .filter((c) => c.status === 'active')
      .map((c) => c.certification_type);

    const hasAllCerts = requirements.requiredCertifications.every((reqCert) =>
      activeCertTypes.includes(reqCert)
    );

    if (hasAllCerts) {
      score += 30;
      matchReasons.push(`Certifications requises présentes: ${requirements.requiredCertifications.join(', ')}`);
    } else {
      const missing = requirements.requiredCertifications.filter((reqCert) => !activeCertTypes.includes(reqCert));
      missingRequirements.push(`Certifications manquantes: ${missing.join(', ')}`);
    }
  }

  // Check region
  if (requirements.region) {
    if (cooperative.region?.toLowerCase() === requirements.region.toLowerCase()) {
      score += 20;
      matchReasons.push(`Région correspondante: ${cooperative.region}`);
    } else {
      missingRequirements.push(`Région différente: ${cooperative.region || 'Non spécifiée'}`);
    }
  }

  // Check EUDR context (informational only)
  if (requirements.eudrAligned) {
    // Note: This checks for EUDR-aligned documentation and due diligence context only, not compliance determination
    if (cooperative.is_verified) {
      score += 20;
      matchReasons.push('EUDR-aligned documentation and due diligence context available');
    } else {
      missingRequirements.push('EUDR-aligned documentation and due diligence context not available');
    }
  }

  // Quantity match bonus
  if (requirements.minQuantity) {
    const available = product.quantity_available || 0;
    if (available >= requirements.minQuantity * 1.2) {
      score += 10;
      matchReasons.push('Quantité disponible supérieure à la demande');
    } else if (available >= requirements.minQuantity) {
      score += 5;
      matchReasons.push('Quantité disponible correspond à la demande');
    }
  }

  return {
    product,
    cooperative,
    matchScore: Math.min(score, 100),
    matchReasons,
    missingRequirements: missingRequirements.length > 0 ? missingRequirements : undefined,
  };
}

/**
 * Find buyers for a supplier's products
 */
export async function findBuyers(
  _product: Product, // Reserved for future implementation
  _cooperative: Cooperative, // Reserved for future implementation
  _buyerProfiles: any[] // Would be Buyer[] in a real implementation, reserved for future
): Promise<any[]> {
  // In a real implementation, this would match against buyer profiles and requirements
  // For now, return empty array
  return [];
}


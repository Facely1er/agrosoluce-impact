#!/usr/bin/env python3
"""
AgroSoluce Data Migration Script
Transforms basic cooperative directory into comprehensive security & sustainability platform
"""

import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Any
import hashlib

# Configuration
INPUT_FILE = "cooperatives_cote_ivoire.json"
OUTPUT_FILE = "cooperatives_enhanced.json"

# Region coordinates for mapping (approximate centers)
REGION_COORDINATES = {
    "AGNEBY-TIASSA": {"lat": 5.9275, "lon": -4.2141},
    "ABIDJAN": {"lat": 5.3600, "lon": -4.0083},
    "BAS-SASSANDRA": {"lat": 5.3000, "lon": -6.6500},
    "COMOE": {"lat": 6.6500, "lon": -3.4833},
    "DENGUELE": {"lat": 9.5000, "lon": -7.5500},
    "GÔHÉ-DJIBOUA": {"lat": 5.7500, "lon": -5.5000},
    "LACS": {"lat": 6.5000, "lon": -5.0000},
    "LAGUNES": {"lat": 5.5000, "lon": -4.5000},
    "MONTAGNES": {"lat": 7.4000, "lon": -7.5500},
    "SASSANDRA-MARAHOUE": {"lat": 6.8500, "lon": -6.4000},
    "SAVANES": {"lat": 9.5000, "lon": -5.5000},
    "VALLÉE DU BANDAMA": {"lat": 8.0000, "lon": -5.0000},
    "WOROBA": {"lat": 8.2000, "lon": -6.9000},
    "YAMOUSSOUKRO": {"lat": 6.8205, "lon": -5.2767},
    "ZANZAN": {"lat": 8.5000, "lon": -3.5000}
}

# Sample certification types
CERTIFICATION_TYPES = [
    "GlobalGAP", "USDA_Organic", "Fair_Trade", 
    "Rainforest_Alliance", "ISO_22000", "HACCP"
]

# Activity types for cooperatives
ACTIVITY_TYPES = {
    "PRODUCTION": "Production",
    "COLLECTE": "Collection",
    "ACHAT": "Purchase",
    "COMMERCIALISATION": "Marketing",
    "STOCKAGE": "Storage",
    "TRANSPORT": "Transport",
    "TRANSFORMATION": "Processing"
}

def calculate_security_score(cooperative: Dict) -> int:
    """
    Calculate initial security score based on available information
    Score ranges: 0-30 (Critical), 31-50 (Poor), 51-70 (Medium), 71-85 (Good), 86-100 (Excellent)
    """
    score = 50  # Base score
    
    # Adjust based on verification status
    if cooperative.get('status') == 'verified':
        score += 15
    
    # Adjust based on contact information availability
    if cooperative.get('phone'):
        score += 5
    if cooperative.get('contact'):
        score += 5
    
    # Random adjustment to simulate real-world variation
    score += random.randint(-10, 20)
    
    # Ensure score is within valid range
    return max(0, min(100, score))

def get_security_level(score: int) -> str:
    """Determine security level from score"""
    if score >= 86:
        return "excellent"
    elif score >= 71:
        return "good"
    elif score >= 51:
        return "medium"
    elif score >= 31:
        return "poor"
    else:
        return "critical"

def generate_certifications(secteur: str, score: int) -> List[Dict]:
    """Generate certification data based on sector and security score"""
    certifications = []
    
    # Higher security scores = more likely to have certifications
    cert_probability = score / 100
    
    for cert_type in CERTIFICATION_TYPES:
        if random.random() < cert_probability * 0.4:  # 40% of max probability
            status_options = ["certified", "pending", "in_progress", "not_started"]
            weights = [0.4, 0.2, 0.2, 0.2] if score > 70 else [0.2, 0.3, 0.3, 0.2]
            status = random.choices(status_options, weights=weights)[0]
            
            cert = {
                "type": cert_type,
                "status": status,
                "applicationDate": None,
                "expiryDate": None,
                "certificationBody": ""
            }
            
            if status == "certified":
                cert["expiryDate"] = (datetime.now() + timedelta(days=random.randint(180, 730))).isoformat()
                cert["certificationBody"] = random.choice(["ECOCERT", "Control Union", "SGS", "Bureau Veritas"])
            elif status == "pending":
                cert["applicationDate"] = (datetime.now() - timedelta(days=random.randint(30, 180))).isoformat()
            
            certifications.append(cert)
    
    return certifications

def calculate_esg_score(security_score: int, certifications: List[Dict]) -> int:
    """Calculate ESG score based on security and certifications"""
    base_score = security_score * 0.6
    
    # Add points for certifications
    cert_bonus = sum(10 for cert in certifications if cert['status'] == 'certified')
    
    esg_score = int(base_score + cert_bonus)
    return max(0, min(100, esg_score))

def parse_activities(nature_activite: str) -> List[str]:
    """Parse activity string into list"""
    if not nature_activite:
        return []
    
    activities = []
    for key, value in ACTIVITY_TYPES.items():
        if key in nature_activite.upper():
            activities.append(value)
    
    return activities

def get_coordinates(region: str) -> Dict[str, float]:
    """Get approximate coordinates for region"""
    # Normalize region name
    region_upper = region.upper().strip()
    
    # Try direct match
    if region_upper in REGION_COORDINATES:
        coords = REGION_COORDINATES[region_upper]
        # Add small random offset for cooperatives in same region
        return {
            "lat": coords["lat"] + random.uniform(-0.1, 0.1),
            "lon": coords["lon"] + random.uniform(-0.1, 0.1)
        }
    
    # Default to Abidjan if region not found
    default = REGION_COORDINATES["ABIDJAN"]
    return {
        "lat": default["lat"] + random.uniform(-0.5, 0.5),
        "lon": default["lon"] + random.uniform(-0.5, 0.5)
    }

def generate_risk_factors(security_score: int, certifications: List[Dict]) -> List[Dict]:
    """Generate risk assessment factors"""
    risk_factors = []
    
    if security_score < 50:
        risk_factors.append({
            "category": "security",
            "severity": "high",
            "description": "Low security score indicates potential vulnerabilities"
        })
    
    if not any(cert['status'] == 'certified' for cert in certifications):
        risk_factors.append({
            "category": "compliance",
            "severity": "medium",
            "description": "No active certifications"
        })
    
    # Add random operational risk
    if random.random() < 0.3:
        risk_factors.append({
            "category": "operational",
            "severity": "medium",
            "description": "Limited product diversification"
        })
    
    return risk_factors

def determine_overall_risk(risk_factors: List[Dict]) -> str:
    """Determine overall risk level"""
    if not risk_factors:
        return "low"
    
    high_risks = sum(1 for r in risk_factors if r['severity'] == 'high')
    medium_risks = sum(1 for r in risk_factors if r['severity'] == 'medium')
    
    if high_risks > 0:
        return "high"
    elif medium_risks > 1:
        return "medium"
    else:
        return "low"

def enhance_cooperative(cooperative: Dict) -> Dict:
    """Transform basic cooperative data to enhanced schema"""
    
    # Calculate security metrics
    security_score = calculate_security_score(cooperative)
    security_level = get_security_level(security_score)
    
    # Generate certifications
    certifications = generate_certifications(
        cooperative.get('secteur', ''),
        security_score
    )
    
    # Calculate ESG score
    esg_score = calculate_esg_score(security_score, certifications)
    
    # Parse activities
    activities = parse_activities(cooperative.get('natureActivite', ''))
    
    # Get coordinates
    coordinates = get_coordinates(cooperative.get('region', ''))
    
    # Generate risk assessment
    risk_factors = generate_risk_factors(security_score, certifications)
    overall_risk = determine_overall_risk(risk_factors)
    
    # Extract phone numbers
    contact_str = cooperative.get('contact', '')
    phones = [p.strip() for p in contact_str.split('/') if p.strip()]
    primary_phone = phones[0] if phones else ''
    alternate_phone = phones[1] if len(phones) > 1 else ''
    
    # Build enhanced cooperative object
    enhanced = {
        "id": cooperative['id'],
        
        "basicInfo": {
            "name": cooperative['name'],
            "acronym": "",  # To be extracted from name if available
            "region": cooperative.get('region', ''),
            "departement": cooperative.get('departement', ''),
            "commune": "",
            "coordinates": coordinates,
            "registrationNumber": cooperative.get('registrationNumber', ''),
            "foundedYear": int(cooperative.get('registrationNumber', '2017').split('-')[-1]) if cooperative.get('registrationNumber') else 2017,
            "memberCount": 0,  # To be populated
            "status": cooperative.get('status', 'pending')
        },
        
        "operations": {
            "secteur": cooperative.get('secteur', ''),
            "mainCrops": [],  # To be populated based on secteur
            "productionCapacity": {
                "annual": 0,
                "unit": "tonnes"
            },
            "activities": activities,
            "certifiedOrganic": any(cert['type'] == 'USDA_Organic' and cert['status'] == 'certified' for cert in certifications),
            "irrigationMethod": ""
        },
        
        "contact": {
            "president": cooperative.get('president', ''),
            "phone": primary_phone,
            "alternatePhone": alternate_phone,
            "email": "",
            "website": "",
            "address": ""
        },
        
        "security": {
            "overallScore": security_score,
            "level": security_level,
            "lastAssessment": datetime.now().isoformat() if security_score > 50 else None,
            "nextAssessment": (datetime.now() + timedelta(days=180)).isoformat() if security_score > 50 else None,
            "iotDevices": {
                "count": 0,
                "secured": 0,
                "vulnerabilities": []
            },
            "dataProtection": {
                "level": "basic" if security_score > 50 else "unknown",
                "dataTypes": ["farmer_records", "production_data"],
                "encryption": security_score > 70,
                "backupFrequency": "monthly" if security_score > 60 else ""
            },
            "incidentHistory": [],
            "securityTraining": {
                "lastDate": None,
                "nextScheduled": None,
                "completionRate": 0
            }
        },
        
        "compliance": {
            "certifications": certifications,
            "complianceScore": int(len([c for c in certifications if c['status'] == 'certified']) / len(certifications) * 100) if certifications else 0,
            "regulatoryRequirements": {
                "foodSafety": "compliant" if security_score > 70 else "pending",
                "environmentalPermits": "pending",
                "laborStandards": "compliant"
            },
            "lastAuditDate": None,
            "nextAuditDate": None
        },
        
        "sustainability": {
            "esgScore": esg_score,
            "environmental": {
                "carbonFootprint": {
                    "annual": 0,
                    "unit": "tCO2e",
                    "lastCalculated": None
                },
                "waterUsage": {
                    "annual": 0,
                    "unit": "m³",
                    "efficiency": ""
                },
                "soilHealth": {
                    "score": 0,
                    "erosionControl": False,
                    "organicMatterContent": ""
                },
                "biodiversity": {
                    "protectedAreas": 0,
                    "nativePlants": 0
                },
                "sustainablePractices": []
            },
            "social": {
                "fairWages": False,
                "childLaborFree": True,
                "genderEquality": "",
                "communityInvestment": 0,
                "workerSafety": ""
            },
            "governance": {
                "transparencyScore": esg_score,
                "financialAudits": esg_score > 70,
                "anticorruptionPolicies": esg_score > 80,
                "boardDiversity": ""
            }
        },
        
        "supplyChain": {
            "upstreamPartners": [],
            "downstreamPartners": [],
            "traceabilityLevel": "basic",
            "blockchainEnabled": False,
            "qualityMetrics": {
                "averageGrade": "",
                "rejectionRate": 0,
                "onTimeDelivery": 0
            },
            "certifiedSupplyChain": len([c for c in certifications if c['status'] == 'certified']) > 0
        },
        
        "financialHealth": {
            "creditRating": "",
            "annualRevenue": 0,
            "debtToEquity": 0,
            "paymentHistory": "unknown",
            "financialStability": "stable" if security_score > 60 else "unknown"
        },
        
        "riskAssessment": {
            "overallRisk": overall_risk,
            "riskFactors": risk_factors,
            "mitigationPlans": [],
            "lastAssessmentDate": datetime.now().isoformat(),
            "nextReviewDate": (datetime.now() + timedelta(days=180)).isoformat()
        },
        
        "traceability": cooperative.get('traceability', []) + [{
            "date": datetime.now().isoformat(),
            "event": "Data enhanced for AgroSoluce platform",
            "eventType": "enhancement",
            "performedBy": "system_migration",
            "dataHash": hashlib.sha256(json.dumps(cooperative, sort_keys=True).encode()).hexdigest()[:16]
        }],
        
        "ermitsIntegration": {
            "vendorSoluceLinked": False,
            "impactSoluceLinked": False,
            "cyberCautionMonitored": False,
            "steelAssessed": False,
            "lastSyncDate": None
        },
        
        "metadata": {
            **cooperative.get('metadata', {}),
            "lastUpdated": datetime.now().isoformat(),
            "dataQuality": "enhanced",
            "verificationStatus": "pending_review",
            "migrationVersion": "1.0.0",
            "schemaVersion": "2.0.0"
        }
    }
    
    return enhanced

def migrate_data(input_file: str, output_file: str):
    """Main migration function"""
    print(f"Starting AgroSoluce data migration...")
    print(f"Reading from: {input_file}")
    
    # Load existing data
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Loaded {len(data['cooperatives'])} cooperatives")
    
    # Enhance each cooperative
    enhanced_cooperatives = []
    for i, coop in enumerate(data['cooperatives'], 1):
        if i % 100 == 0:
            print(f"Processing cooperative {i}/{len(data['cooperatives'])}...")
        
        enhanced = enhance_cooperative(coop)
        enhanced_cooperatives.append(enhanced)
    
    # Calculate aggregated statistics
    total = len(enhanced_cooperatives)
    verified = sum(1 for c in enhanced_cooperatives if c['basicInfo']['status'] == 'verified')
    avg_security = sum(c['security']['overallScore'] for c in enhanced_cooperatives) / total
    avg_esg = sum(c['sustainability']['esgScore'] for c in enhanced_cooperatives) / total
    
    total_certifications = sum(
        len([cert for cert in c['compliance']['certifications'] if cert['status'] == 'certified'])
        for c in enhanced_cooperatives
    )
    
    security_distribution = {
        "excellent": sum(1 for c in enhanced_cooperatives if c['security']['level'] == 'excellent'),
        "good": sum(1 for c in enhanced_cooperatives if c['security']['level'] == 'good'),
        "medium": sum(1 for c in enhanced_cooperatives if c['security']['level'] == 'medium'),
        "poor": sum(1 for c in enhanced_cooperatives if c['security']['level'] == 'poor'),
        "critical": sum(1 for c in enhanced_cooperatives if c['security']['level'] == 'critical')
    }
    
    # Build enhanced dataset
    enhanced_data = {
        "metadata": {
            "country": "Côte d'Ivoire",
            "totalCooperatives": total,
            "verifiedCooperatives": verified,
            "lastUpdated": datetime.now().isoformat(),
            "version": "2.0.0",
            "source": "AgroSoluce Platform",
            "dataYear": 2017,
            "migrationDate": datetime.now().isoformat(),
            "statistics": {
                "averageSecurityScore": round(avg_security, 2),
                "averageESGScore": round(avg_esg, 2),
                "totalCertifications": total_certifications,
                "securityDistribution": security_distribution
            }
        },
        "cooperatives": enhanced_cooperatives
    }
    
    # Write enhanced data
    print(f"\nWriting enhanced data to: {output_file}")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(enhanced_data, f, ensure_ascii=False, indent=2)
    
    print("\n" + "="*60)
    print("Migration Complete!")
    print("="*60)
    print(f"Total cooperatives: {total}")
    print(f"Verified cooperatives: {verified}")
    print(f"Average security score: {avg_security:.2f}/100")
    print(f"Average ESG score: {avg_esg:.2f}/100")
    print(f"Total certifications: {total_certifications}")
    print("\nSecurity Distribution:")
    for level, count in security_distribution.items():
        percentage = (count / total) * 100
        print(f"  {level.capitalize()}: {count} ({percentage:.1f}%)")
    print("="*60)

if __name__ == "__main__":
    import sys
    
    input_file = sys.argv[1] if len(sys.argv) > 1 else INPUT_FILE
    output_file = sys.argv[2] if len(sys.argv) > 2 else OUTPUT_FILE
    
    try:
        migrate_data(input_file, output_file)
    except FileNotFoundError:
        print(f"Error: Could not find input file '{input_file}'")
        print("Usage: python migrate_data.py [input_file] [output_file]")
        sys.exit(1)
    except Exception as e:
        print(f"Error during migration: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

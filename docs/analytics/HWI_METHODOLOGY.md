# Household Welfare Index (HWI) Methodology

## Overview

The Household Welfare Index (HWI) is a composite indicator that measures household distress through pharmaceutical purchasing patterns at pharmacies in cocoa-growing regions of Côte d'Ivoire. Higher HWI scores indicate greater household stress and potential ESG risks in agricultural supply chains.

## Strategic Purpose

The HWI serves as an **early warning system** for:
- Living income shortfalls (EUDR Article 3 compliance)
- Child labor risk conditions (ICI standards)
- Gender equity issues (Fairtrade 3.5, Rainforest Alliance Chapter 4)
- Healthcare access barriers (CSDDD Article 8)
- Food security crises (SDG 2)

## Scoring Methodology

### Score Range
- **0-25 (Green)**: Normal conditions - routine monitoring
- **25-50 (Yellow)**: Elevated stress - increased surveillance needed
- **50-75 (Red)**: Crisis conditions - activate response mechanisms
- **75-100 (Black)**: Severe crisis - emergency intervention required

### Calculation Formula

```
HWI Score = Σ (Component Score × Category Weight)
```

Where:
- Component Score = (Category Share / Empirical Maximum) × 100
- Category Share = Quantity of category / Total pharmaceutical quantity
- Empirical Maximum = Historical crisis threshold for each category

## 7 Medication Categories

### 1. Antimalarials (25% weight)
**ESG Framework**: EUDR Article 3, ISSB S2, Living Income Benchmarks

**Rationale**: Malaria is the primary workforce health issue in cocoa-growing regions. High antimalarial consumption indicates reduced agricultural productivity and family economic stress.

**Empirical Maximum**: 35% of total sales = severe epidemic

### 2. Pediatric ORS/Zinc (20% weight)
**ESG Framework**: CSDDD Article 8, SDG 6, ICI Child Labor Standards

**Rationale**: Diarrheal disease in children indicates WASH infrastructure failures and food insecurity. 

**Empirical Maximum**: 15% of total sales = WASH crisis

### 3. Prenatal Vitamins (15% weight)
**ESG Framework**: Fairtrade 3.5, Rainforest Alliance Chapter 4, SDG 3

**Rationale**: Prenatal vitamin consumption indicates maternal health needs and healthcare access quality.

**Empirical Maximum**: 8% of total sales = high pregnancy without adequate care

### 4. Contraceptives (15% weight)
**ESG Framework**: UN Women Empowerment Principles, Gender Equity, SDG 5

**Rationale**: Contraceptive purchases indicate women's reproductive autonomy and family planning access.

**Empirical Maximum**: 5% of total sales = family planning crisis

### 5. Micronutrients (10% weight)
**ESG Framework**: SDG 2 (Zero Hunger), Living Income Gap Analysis

**Rationale**: Micronutrient supplementation needs indicate food insecurity and dietary diversity deficits.

**Empirical Maximum**: 12% of total sales = severe malnutrition

### 6. ARVs (10% weight)
**ESG Framework**: ILO Convention 111, SDG 3, Healthcare Access

**Rationale**: Antiretroviral therapy consumption indicates HIV burden and healthcare system quality.

**Empirical Maximum**: 8% of total sales = high HIV burden

### 7. Antibiotics (5% weight)
**ESG Framework**: WHO Antimicrobial Resistance Strategy

**Rationale**: Antibiotic consumption indicates general bacterial infection rates and environmental health.

**Empirical Maximum**: 20% of total sales = severe infection outbreak

## Response Protocols

**Yellow Alert (25-50)**: Increase monitoring, engage cooperative leadership, activate health programs

**Red Alert (50-75)**: Emergency cost-of-living adjustments, mobile clinics, direct household support

**Black Alert (75-100)**: Supply chain intervention, emergency humanitarian assistance, consider suspension

## Usage

### Accessing HWI Data
Navigate to `/hwi` in the web application to view:
- Current HWI scores by pharmacy
- Alert distributions
- Component breakdowns
- Time series trends

### Running Calculations
```bash
# Calculate HWI from existing VRAC data
npm run hwi:calculate

# Or during migration
npm run vrac:migrate
```

## Limitations

1. **Proxy Indicator**: Measures pharmaceutical purchases, not direct welfare outcomes
2. **Access Bias**: Only captures households with pharmacy access
3. **Sample Size**: Limited to 4 pharmacies (not representative of all cocoa regions)
4. **Seasonality**: Malaria and agricultural cycles create predictable variation

---

**Document Status**: Final  
**Last Updated**: February 2026  
**Author**: ERMITS Research Team

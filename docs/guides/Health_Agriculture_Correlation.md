# Health-Agriculture Correlation Model

## Overview

This document describes the scientific foundation and implementation of AgroSoluce's health-agriculture correlation analytics, leveraging VRAC (pharmacy surveillance) data to understand how workforce health impacts agricultural productivity in cocoa-growing regions of Côte d'Ivoire.

## Scientific Foundation

### Academic Research

Research demonstrates that malaria significantly impacts agricultural productivity:

- **Harvest Efficiency Impact**: Malaria reduces farmer harvest efficiency by 40-60%
- **Labor Productivity**: Malaria episodes cause an average of 5-10 lost workdays per incident
- **Seasonal Pattern**: Peak malaria transmission (Aug-Dec) overlaps with critical pre-harvest preparation period
- **Economic Impact**: In cocoa regions, malaria burden correlates with production declines

**Key References**: See `VRAC/LITERATURE_REVIEW_Malaria_Agriculture.txt` for detailed academic citations and research synthesis.

## Data Sources

### VRAC Pharmacy Surveillance Data

The platform integrates pharmacy sales data from 4 key pharmacies in cocoa-growing regions:

1. **Tanda Pharmacy** (Gontougo region) - Primary cocoa zone
2. **Prolife Pharmacy** (Gontougo region) - Primary cocoa zone  
3. **Olympique Pharmacy** (La Mé region) - Secondary cocoa zone
4. **Attobrou Pharmacy** (Abidjan) - Urban control group

**Data Period**: January 2020 - December 2024 (5 years)

**Key Metrics**:
- Total pharmaceutical sales by product
- Antimalarial medication sales (proxy for malaria burden)
- Antimalarial share (% of total sales)
- Regional health index computation

### Data Processing Pipeline

Located in `packages/data-insights/`:

1. **Raw Data Ingestion**: CSV files from `VRAC/` directory
2. **Product Categorization**: Map pharmaceutical codes to therapeutic categories
3. **Health Index Enrichment**: Compute antimalarial share as malaria proxy (see `healthIndexEnrichment.ts`)
4. **Regional Aggregation**: Combine pharmacy data by cocoa region
5. **Time-Series Analysis**: Track trends over 2020-2024 period

## Health Index Calculation

### Antimalarial Share as Malaria Proxy

The core health metric is the **antimalarial share**:

```
Antimalarial Share = Antimalarial Sales / Total Pharmaceutical Sales
```

**Rationale**:
- High antimalarial share indicates elevated malaria burden
- Captures actual medication-seeking behavior
- More granular than district-level hospital data
- Provides monthly resolution for trend analysis

**Implementation**: `packages/data-insights/src/enrichment/healthIndexEnrichment.ts`

### Regional Health Index

Aggregate antimalarial share by cocoa region:

- **Gontougo Region**: Primary cocoa zone (Tanda + Prolife pharmacies)
- **La Mé Region**: Secondary cocoa zone (Olympique pharmacy)
- **Abidjan (Urban Control)**: Non-agricultural urban baseline (Attobrou pharmacy)

## Time-Lag Correlation Analysis

### Key Insight: Seasonal Misalignment

**Malaria Surge Period**: August - December (rainy season)
**Cocoa Harvest Period**: October - March (Marketing Year)

The 2-4 month lag between malaria surges and harvest periods reveals the mechanism:

1. **Aug-Sep**: Peak malaria transmission reduces farmer capacity
2. **Oct-Dec**: Impaired workforce affects early harvest efficiency
3. **Jan-Mar**: Production shortfalls become visible in marketing year data

**Documentation**: See `VRAC/TIME_LAG_ANALYSIS.txt` for detailed temporal correlation analysis.

## Competitive Advantage

### The Human Health Signal

Traditional agricultural monitoring relies heavily on:
- Satellite crop monitoring (NDVI, weather data)
- Market price signals
- Historical production data

**AgroSoluce's Unique Value**:
- **Human health signal** that complements (not competes with) satellite data
- Early warning system for productivity issues via health trends
- Granular regional resolution through pharmacy network
- Monthly data frequency enables proactive interventions

**Strategic Context**: See `VRAC/COMPETITIVE_LANDSCAPE_ANALYSIS.txt`

## Platform Integration

### Cooperative Workspace Features

**Health Data Tab**: 
- Antimalarial sales trends by pharmacy
- Regional health index visualization
- Time-series charts (2020-2024)
- Surge detection (Aug-Dec peaks)

**Production Metrics Tab**:
- Harvest efficiency tracking
- Production volume data
- Cocoa Marketing Year (MY) integration

**Regional Insights Tab**:
- Health-productivity correlation display
- Academic research findings
- Time-lag analysis visualization
- Regional comparison (Gontougo vs La Mé vs Abidjan)

### Cooperative Profile Enhancements

- **Health Index Badge**: Display regional malaria burden score
- **Pharmacy Data Connection**: Show relevant pharmacy surveillance data for cooperative's location
- **Trend Indicators**: 5-year antimalarial share trends

## Use Cases

### Supply Chain Intelligence

**For Buyers/Traders**:
- Forecast production risks based on health trends
- Identify regions with elevated health burden
- Plan interventions and support programs

**For Cooperatives**:
- Understand workforce health challenges
- Advocate for health interventions
- Track impact of health programs

**For Development Partners**:
- Target malaria prevention efforts to high-impact regions
- Measure health intervention effectiveness
- Optimize resource allocation

## Farmers First Alignment

The health monitoring model aligns with AgroSoluce's **Farmers First** philosophy:

- Workforce health directly impacts farmer welfare
- Health data enables targeted interventions
- Transparent health metrics support farmer advocacy
- Academic validation ensures data credibility

## Data Privacy & Ethics

- Pharmacy data is aggregated and anonymized
- No individual patient information
- Regional-level analysis only
- Compliant with health data regulations

## Future Enhancements

### Phase 2-3 Roadmap

1. **Predictive Analytics**: Machine learning models for production forecasting
2. **Expanded Pharmacy Network**: Additional surveillance sites
3. **Real-time Dashboards**: Monthly data updates
4. **API Access**: Export health index data for forecasting partners
5. **Partnership Integration**: Health intervention organizations (per `VRAC/STRATEGIC_PARTNERSHIP_PLAN.txt`)

## References

### Key Documentation Files

- `VRAC/LITERATURE_REVIEW_Malaria_Agriculture.txt` - Academic research synthesis
- `VRAC/TIME_LAG_ANALYSIS.txt` - Temporal correlation analysis
- `VRAC/EXECUTIVE_SUMMARY_Literature.txt` - Executive overview
- `VRAC/COMPETITIVE_LANDSCAPE_ANALYSIS.txt` - Market positioning
- `VRAC/STRATEGIC_PARTNERSHIP_PLAN.txt` - Business model

### Data Files

- `VRAC/ETAT_ListeProduitsVendus*.csv` - Raw pharmacy sales data
- `VRAC/ETAT_2080QTE*.csv` - Quantity-focused sales data
- `packages/data-insights/src/catalog.ts` - Pharmacy profiles

### Code Implementation

- `packages/data-insights/src/enrichment/healthIndexEnrichment.ts` - Health index calculation
- `packages/data-insights/src/pipeline/` - Data processing pipeline
- `apps/web/src/components/` - (To be created) Health data visualization components

---

**Last Updated**: Platform transformation Phase 1
**Version**: 1.0.0
**Status**: Documentation Complete

© 2025 ERMITS Corporation. Cultivating Secure Agriculture through Health Intelligence.

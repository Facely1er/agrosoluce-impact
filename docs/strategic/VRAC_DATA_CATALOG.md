# VRAC Data Catalog

## Overview

The VRAC (pharmacy surveillance) dataset provides pharmacy sales data from Côte d'Ivoire used as a proxy for workforce health in cocoa-producing regions. Antimalarial sales (ARTEFAN, PLUFENTRINE) correlate with community malaria burden and can inform supply chain intelligence and ESG monitoring.

## Data Sources

| Source | Format | Content |
|--------|--------|---------|
| ETAT_2080QTE*.csv | Top 20 products by quantity | 20 rows per period |
| ETAT_ListeProduitsVendus*.csv | Full product catalog | Full product list with Code, Désignation, Qté vendue |

## Pharmacy Coverage

| Pharmacy | Region | Location | CSV Data |
|----------|--------|----------|----------|
| Grande Pharmacie de Tanda | Gontougo (cocoa) | Tanda | PROLIFE/2080, TANDA/2080, TANDA/ |
| Pharmacie Prolife | Gontougo (cocoa) | Tabagne | PROLIFE/2080 |
| Pharmacie Olympique | Abidjan (urban) | Abidjan | PDF only (OLYMPIQUE/TOP100, OLYMPIQUE/TOTAL) |
| Pharmacie Attobrou | La Mé (cocoa) | La Mé | PDF only (ATTOBROU/) |

## Period Coverage

| Pharmacy | 2022 | 2023 | 2024 | 2025 |
|----------|------|------|------|------|
| Tanda | ✓ | ✓ | ✓ | ✓ |
| Prolife | ✓ | ✓ | ✓ | ✓ |
| Olympique | PDF | PDF | PDF | PDF |
| Attobrou | PDF | PDF | PDF | PDF |

## Processing Pipeline

1. Run `npm run vrac:process` (or `npx tsx scripts/vrac/processVracData.ts`)
2. Script reads CSV from `VRAC/` folder
3. Outputs normalized JSON to `apps/web/public/data/vrac/processed.json`

## Product Taxonomy

- **Antimalarial**: ARTEFAN, PLUFENTRINE (artemether/lumefantrine)
- **Antibiotic**: AMOXICILLINE, ACLAV, METRONIDAZOLE, etc.
- **Analgesic**: PARACETAMOL, PARAMED, NOVALGINE, DICLOFENAC, etc.

## Use Cases

- Regional health index (antimalarial share by pharmacy/period)
- Cocoa supply intelligence (workforce health proxy)
- ESG/social risk monitoring
- Integration with Marcus Weather, Satelligence, or commodity platforms

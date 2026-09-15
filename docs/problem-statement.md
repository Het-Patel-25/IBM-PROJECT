# Problem Statement

## GridSentinel AI — Power Grid Asset Monitoring & Failure Prediction System

---

## The Audience

**Primary users:** Operations engineers, field maintenance technicians, and department managers at electrical utility companies who monitor and maintain transformer and feeder infrastructure.

**Secondary users:** Grid operations supervisors who need oversight of maintenance activities without direct technical access to AI prediction tools.

---

## The Problem in Depth

### 1. Reactive Maintenance is Expensive and Dangerous

The electrical power grid is one of the most critical pieces of physical infrastructure in any country. A single transformer failure can knock out power to tens of thousands of homes, cause cascading failures across interconnected grid segments, and trigger millions of dollars in emergency repair costs and outage penalties.

Transformers and feeders don't fail instantly — they **degrade gradually** through measurable physical processes:

- **Thermal aging**: Winding hotspot temperature above 98°C accelerates insulation breakdown exponentially (Arrhenius aging law, IEC 60076-7)
- **Mechanical wear**: Vibration above 3.5 mm/s (ISO 10816 Class II) indicates bearing failure, loose windings, or mounting resonance
- **Moisture ingress**: Humidity above 75% in older assets causes paper insulation to absorb moisture, dramatically reducing dielectric strength
- **Load cycling**: Repeated overloading (>85% rated capacity) causes thermal runaway in high-ambient-temperature conditions
- **Age degradation**: Asset design life per IEC 60076 is ~25 years; failure rates increase sharply after year 15

Every one of these signals is measurable with standard SCADA sensors. Yet most utility operations teams default to **calendar-based maintenance** (inspect every 6 or 12 months) regardless of actual asset health — because they lack the tooling to analyse sensor data in real time across hundreds of simultaneous assets.

**Emergency repairs cost 3–5× more than planned maintenance.** A transformer that could have been serviced for $8,000 during a scheduled window instead fails catastrophically, requiring emergency parts, overnight shipping, contractor overtime, and customer compensation — totalling $30,000–$60,000 per incident.

### 2. Data Exists But Goes Unanalysed

Modern SCADA systems collect sensor readings every 1–15 minutes per asset. For a utility operating 500 assets, that is **over 700,000 data points per day**. No operations team can manually review this data. Without automated AI-driven analysis, the data flows into storage systems and is never used for predictive decisions.

### 3. Security and Access Control is Absent from Most Tools

Operational Technology (OT) security in the power sector is a growing regulatory requirement (NERC CIP standards). Yet most monitoring dashboards have no role-based access control:

- **Field employees** see AI failure probability scores and risk rankings they cannot act on — and which, if misinterpreted, could cause panic or incorrect actions
- **Contractors and temporary staff** have the same view as senior engineers
- **Audit trails are absent** — there is no record of who saw which alert, who dispatched a technician, or who changed a maintenance status

### 4. Lack of Geospatial Situational Awareness

Grid operators managing hundreds of assets across wide geographic areas have no single view showing *where* their highest-risk assets are relative to incoming weather fronts, storm cells, or flood zones. A transformer exposed to a hurricane-force wind event while already running at 85% load is exponentially more likely to fail — yet most monitoring dashboards have no geospatial component at all.

### 5. Why Now

AI hardware and software costs have dropped dramatically. Random Forest models that required expensive compute clusters in 2010 run in milliseconds on a laptop in 2025. Physics-informed machine learning — encoding domain knowledge (IEC standards, thermal equations) directly into feature engineering — makes it possible to build accurate predictive models from realistic-sized datasets without years of labelled failure data. Simultaneously, react-leaflet and free-tier weather APIs make it viable to build a live geospatial digital twin at college-project cost.

---

## Why Existing Solutions Don't Solve This

| Existing approach | Gap |
|---|---|
| Calendar-based maintenance | Ignores actual sensor health signals entirely |
| Manual SCADA dashboards | Cannot correlate 5+ sensor streams across hundreds of assets simultaneously |
| Enterprise SCADA vendors (GE, ABB, Siemens) | Cost $500K–$5M per deployment; inaccessible for colleges, small utilities, or proof-of-concept work |
| Generic ML platforms | Require data scientists, training pipelines, and do not encode electrical engineering domain knowledge |
| Existing monitoring tools | No RBAC, no geospatial map, no closed-loop maintenance workflow, no crew planning integration |

---

## Quantified Impact

- **Average transformer emergency repair cost**: $30,000–$60,000 vs. $6,000–$10,000 planned
- **Average outage duration from transformer failure**: 4–18 hours
- **NERC CIP compliance cost for access control violations**: $1M+ per incident
- **Proportion of grid failures that are predictable from sensor data**: estimated 60–70% (IEA, 2023)

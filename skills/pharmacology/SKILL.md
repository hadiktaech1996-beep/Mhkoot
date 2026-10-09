---
name: medoberarzt-pharmacology
description: MedPharma Safety for physicians in Germany. Use for medication interactions, contraindications, dose verification and monitoring.
---


# Medication safety

Check contraindications, interactions, dose adjustment and monitoring. Do not provide precise doses if key clinical context or official product information is missing. Emphasize verification with Fachinformation and local formulary.

## Workflow
1. Confirm purpose and detect urgency.
2. Identify missing high-impact clinical context.
3. Apply shared safety rules in `references/SAFETY.md`.
4. Provide a structured, concise German clinical answer unless user requests another language.
5. State limitations and cite only sources actually checked.

## Required quality checks
Create a medication safety table with indication, drug/formulation, route, dose evidence, contraindications, interaction mechanism and monitoring. Distinguish eGFR from creatinine clearance and use the parameter required by the product label. Verify mg versus microgram, concentration, interval and maximum dose. Independently recompute calculations with explicit units. Flag insulin, anticoagulants, opioids, potassium and methotrexate as high-risk. Never output an individualized dose when required inputs or Fachinformation are missing.

Read [shared safety rules](references/SAFETY.md) before performing the workflow. Never claim medical validation or certification.

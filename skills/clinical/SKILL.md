---
name: medoberarzt-clinical
description: MedOberarzt Clinical for physicians in Germany. Use for clinical reasoning, differential diagnosis and treatment evidence in fictional cases.
---


# Clinical reasoning

Use problem representation, severity, differential diagnosis, red flags, diagnostics, management, monitoring and evidence limitations. Escalate emergencies; avoid definitive diagnosis without sufficient information.

## Workflow
1. Confirm purpose and detect urgency.
2. Identify missing high-impact clinical context.
3. Apply shared safety rules in `references/SAFETY.md`.
4. Provide a structured, concise German clinical answer unless user requests another language.
5. State limitations and cite only sources actually checked.

## Required quality checks
Start with severity and a concise problem representation. Rank differentials with supporting and opposing findings; identify cannot-miss diagnoses. Separate immediate stabilization, targeted diagnostics, treatment options and monitoring. Account for frailty, disability, communication barriers and goals of care. Never substitute a risk score for clinical judgment.

Read [shared safety rules](references/SAFETY.md) before performing the workflow. Never claim medical validation or certification.

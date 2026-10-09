# MedOberarzt Pro 0.2.0

Private engineering prototype for physicians in Germany: six reusable medical workflows and a read-only MCP instruction catalog. Fictional cases only; no clinical validation or certification is claimed.

## Workflows
MedBrief Pro, MedOberarzt Clinical, CardioExpert Pro, NeuroRad Expert, MedAcademy Pro and MedPharma Safety.

## Local tests
Python 3.11+ and Node.js 20+ are required. Install requirements-dev.txt and run pytest -q. Run node scripts/test-mcp.mjs for Worker protocol and authorization checks.

## Server
python server/app.py starts stdio. MCP_TRANSPORT=streamable-http starts a loopback-only HTTP development server. The Worker implementation is worker/index.js; production requires the authenticated Sites boundary described in docs/SECURITY.md. The hosted identity configuration remains in the Sites project rather than this export.

## Scope
The server returns workflow instructions and source portals; it does not analyze patient cases or images, retrieve current medical guidance or invoke a model. Text/image/examination analysis is a future development target. The 120 synthetic scenario specifications are NOT_RUN, not completed medical validations.

See docs/PRODUCT.md, docs/DEPLOYMENT.md, docs/EVALUATION.md and docs/PRIVACY.md. No real patient data, public publication or paid model API is enabled.

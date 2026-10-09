# Deployment and iPhone handoff
Private hosted Worker: Sites-managed HTTPS/authentication, owner-only access. Runtime source: worker/index.js. Build: bash scripts/build.sh; validation: node scripts/validate-artifact.mjs; protocol checks: node scripts/test-mcp.mjs.
Python local tests: pip install -r requirements-dev.txt; pytest -q. Default stdio: python server/app.py. Local HTTP: MCP_TRANSPORT=streamable-http python server/app.py (loopback only).
Private ChatGPT connection: retrieve the provisioned Sites plugin and offer its installation UI; the owner must install/connect. Verify with a real read-only tool call after connection, not merely endpoint probes. Mobile UI availability is account/surface dependent; use Safari on iPhone if needed. A desktop computer is not required for this project's build work.
GitHub: private repository name proposed medoberarzt-pro. Create only after the owner's explicit approval and a connected GitHub capability. Sites source storage is separate and does not mean a GitHub repository exists.
Public release: explicitly approved audience change, completed clinical/privacy/security/regulatory gates and OpenAI submission review. No paid infrastructure or model API is enabled by this project.

Verified private endpoint: https://medoberarzt-pro-hadi.bubblyeagle2.chatgpt.site/mcp
The portable package points to this owner-only endpoint for development; it is not ready for public distribution.

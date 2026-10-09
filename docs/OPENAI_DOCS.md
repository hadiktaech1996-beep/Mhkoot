# Official documentation checked — 09.10.2026
- Packaging: https://developers.openai.com/plugins/build/plugins
- MCP implementation: https://developers.openai.com/plugins/build/mcp-server
- Authentication: https://developers.openai.com/plugins/build/auth
- Submission: https://developers.openai.com/plugins/deploy/submission
- Quality/policy: https://developers.openai.com/plugins/plugin-guidelines
Use a portable root plugin.json and mcp.json. Skills folders ship with the package. Public submission requires a configured HTTPS endpoint and review; a package file is not a published plugin. Submitted integrations need positive/negative cases, review access and a walkthrough. Do not submit this prototype as a finished clinical product.
The local MCP config is for development only; replace with a verified HTTPS registration for distribution. Do not invent a registered plugin ID.

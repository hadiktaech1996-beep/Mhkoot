"""Read-only instruction catalog. No patient data or model inference accepted."""
import os
from pathlib import Path
from typing import Literal
from mcp.server.fastmcp import FastMCP
from mcp.types import ToolAnnotations
ROOT = Path(__file__).resolve().parents[1]
Skill = Literal['medbrief', 'clinical', 'cardiology', 'neurorad', 'academy', 'pharmacology']
SKILLS = {'medbrief', 'clinical', 'cardiology', 'neurorad', 'academy', 'pharmacology'}
READ_ONLY = ToolAnnotations(readOnlyHint=True, destructiveHint=False, idempotentHint=True, openWorldHint=False)
mcp = FastMCP('MedOberarzt Pro', host='127.0.0.1', port=int(os.getenv('PORT', '8000')), stateless_http=True, json_response=True)
@mcp.tool(annotations=READ_ONLY)
def list_medical_skills() -> list[str]:
    """List six physician workflow identifiers. Accepts no case data."""
    return sorted(SKILLS)
@mcp.tool(annotations=READ_ONLY)
def get_skill_instructions(skill: Skill) -> str:
    """Read one workflow and safety rules. Supply only its identifier, never patient information."""
    if skill not in SKILLS:
        raise ValueError('Unknown skill identifier')
    return (ROOT/'core/SAFETY.md').read_text(encoding='utf-8')+'\n\n'+(ROOT/'skills'/skill/'SKILL.md').read_text(encoding='utf-8')
@mcp.tool(annotations=READ_ONLY)
def list_reference_sources() -> dict[str, str]:
    """List source portals. Does not search or verify guideline currency."""
    return {'AWMF':'https://register.awmf.org/', 'ESC':'https://www.escardio.org/Guidelines', 'PubMed':'https://pubmed.ncbi.nlm.nih.gov/', 'EMA':'https://www.ema.europa.eu/'}
if __name__ == '__main__':
    transport = os.getenv('MCP_TRANSPORT', 'stdio')
    if transport not in {'stdio','streamable-http'}:
        raise SystemExit('Unsupported transport')
    mcp.run(transport=transport)

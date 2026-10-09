import asyncio
import sys
from pathlib import Path
import pytest
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'server'))
from app import get_skill_instructions, list_medical_skills
@pytest.mark.parametrize('skill', list_medical_skills())
def test_complete_skill(skill):
    text = get_skill_instructions(skill)
    assert 'Do not invent' in text
    assert 'Required quality checks' in text
    assert (ROOT/'skills'/skill/'references/SAFETY.md').is_file()
@pytest.mark.parametrize('skill',['../LICENSE.txt','clinical/../../README.md','', 'unknown'])
def test_traversal_rejected(skill):
    with pytest.raises(ValueError):
        get_skill_instructions(skill)
def test_real_stdio_protocol():
    async def run():
        async with stdio_client(StdioServerParameters(command=sys.executable,args=[str(ROOT/'server/app.py')])) as (r,w):
            async with ClientSession(r,w) as session:
                result=await session.initialize()
                assert result.serverInfo.name=='MedOberarzt Pro'
                tools=(await session.list_tools()).tools
                assert len(tools)==3
                assert all(t.annotations.readOnlyHint for t in tools)
                for k in list_medical_skills():
                    result=await session.call_tool('get_skill_instructions',{'skill':k})
                    assert not result.isError
                result=await session.call_tool('get_skill_instructions',{'skill':'../README.md'})
                assert result.isError
                assert not (await session.call_tool('list_reference_sources',{})).isError
    asyncio.run(run())

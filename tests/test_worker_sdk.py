import asyncio,subprocess
from pathlib import Path
import httpx
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

def test_worker_with_official_mcp_client():
 script=Path(__file__).resolve().parents[1]/'scripts/test-sdk-server.mjs'
 proc=subprocess.Popen(['node',str(script)],stdout=subprocess.PIPE,text=True)
 try:
  port=int(proc.stdout.readline())
  async def run():
   async with httpx.AsyncClient(trust_env=False) as client:
    async with streamable_http_client(f'http://127.0.0.1:{port}/mcp',http_client=client) as (r,w,_):
     async with ClientSession(r,w) as s:
      assert (await s.initialize()).serverInfo.name=='MedOberarzt Pro'
      assert len((await s.list_tools()).tools)==3
      for skill in ['medbrief','clinical','cardiology','neurorad','academy','pharmacology']:
       assert not (await s.call_tool('get_skill_instructions',{'skill':skill})).isError
      assert not (await s.call_tool('list_medical_skills',{})).isError
      assert not (await s.call_tool('list_reference_sources',{})).isError
  asyncio.run(run())
 finally:
  proc.terminate();proc.wait(timeout=5)

import asyncio, os, socket, subprocess, sys, time
from pathlib import Path
import httpx
from mcp import ClientSession
from mcp.client.streamable_http import streamable_http_client

def test_http_live():
 with socket.socket() as sock:
  sock.bind(('127.0.0.1',0)); port=sock.getsockname()[1]
 env={**os.environ,'MCP_TRANSPORT':'streamable-http','PORT':str(port)}
 server=Path(__file__).resolve().parents[1]/'server/app.py'
 proc=subprocess.Popen([sys.executable,str(server)],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 try:
  for _ in range(100):
   try:
    with socket.create_connection(('127.0.0.1',port),timeout=.1): break
   except OSError: time.sleep(.05)
  async def run():
   async with httpx.AsyncClient(trust_env=False) as client:
    async with streamable_http_client(f'http://127.0.0.1:{port}/mcp',http_client=client) as (r,w,_):
     async with ClientSession(r,w) as s:
      assert (await s.initialize()).serverInfo.name=='MedOberarzt Pro'
      assert len((await s.list_tools()).tools)==3
      for name,args in [('list_medical_skills',{}),('get_skill_instructions',{'skill':'clinical'}),('list_reference_sources',{})]:
       assert not (await s.call_tool(name,args)).isError
  asyncio.run(run())
 finally:
  proc.terminate(); proc.wait(timeout=5)

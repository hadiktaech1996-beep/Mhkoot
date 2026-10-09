import http from 'node:http';
import {handleMcp} from '../worker/index.js';
const server=http.createServer(async(req,res)=>{
 try{
  const chunks=[];for await(const c of req)chunks.push(c);
  const response=await handleMcp(new Request('http://localhost/mcp',{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})}));
  res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end();}
});
server.listen(0,'127.0.0.1',()=>console.log(server.address().port));

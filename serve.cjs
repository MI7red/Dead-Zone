// Optional local preview. No packages are required: node serve.cjs
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=__dirname,host=process.argv.includes('--lan')?'0.0.0.0':'127.0.0.1',port=Number(process.env.PORT)||4784;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json; charset=utf-8','.md':'text/markdown; charset=utf-8'};
http.createServer((request,response)=>{
  let file;try{const url=new URL(request.url,'http://localhost'),name=decodeURIComponent(url.pathname);file=path.resolve(root,'.'+(name.endsWith('/')?name+'index.html':name))}catch{response.writeHead(400);return response.end('Bad request')}
  if(!file.startsWith(root+path.sep)){response.writeHead(403);return response.end('Forbidden')}
  fs.readFile(file,(error,data)=>{if(error){response.writeHead(404);return response.end('Not found')}response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});response.end(data)});
}).listen(port,host,()=>console.log('Dead Zone preview: http://127.0.0.1:'+port+(host==='0.0.0.0'?' (LAN enabled)':'')));

const http=require('http');
const fs=require('fs');
const path=require('path');
const {exec}=require('child_process');
const root=path.resolve(__dirname,'..','website');
const port=8080;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.pdf':'application/pdf','.zip':'application/zip','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const server=http.createServer((req,res)=>{
 let url=decodeURIComponent(req.url.split('?')[0]); if(url==='/') url='/index.html';
 let file=path.resolve(root,'.'+url); if(!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden');}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found');} res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);});
});
server.listen(port,()=>{const url=`http://localhost:${port}`;console.log(`Athanas Inspires preview: ${url}`);if(process.platform==='win32')exec(`start "" "${url}"`);});

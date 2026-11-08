import http from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {homedir} from 'node:os';import {join} from 'node:path';import {randomBytes,createHash} from 'node:crypto';
const root=join(homedir(),'.fieldnotes-private');await mkdir(root,{recursive:true,mode:0o700});
const credentials=join(root,'local-credentials.json');let c;
try{c=JSON.parse(await readFile(credentials,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;c={ownerKey:randomBytes(32).toString('base64url'),SESSION_SECRET:randomBytes(48).toString('base64url'),DATA_ENCRYPTION_KEY:randomBytes(32).toString('hex')};await writeFile(credentials,JSON.stringify(c),{mode:0o600});}
Object.assign(process.env,{SESSION_SECRET:c.SESSION_SECRET,DATA_ENCRYPTION_KEY:c.DATA_ENCRYPTION_KEY,OWNER_ACCESS_HASH:createHash('sha256').update(c.ownerKey).digest('hex')});
await writeFile(join(root,'local-access-key.txt'),c.ownerKey+'\n',{mode:0o600});
const {default:handler}=await import('./handler.mjs');
const origins=new Set(['https://private.josephayinde.com','https://j0-fieldnotes-staging.vercel.app','http://127.0.0.1:8891']);
http.createServer(async(req,res)=>{
 if(req.headers.host!=='127.0.0.1:8891'){res.writeHead(403);return res.end('Host denied');}
 const origin=req.headers.origin;
 if(origin&&!origins.has(origin)){res.writeHead(403);return res.end('Origin denied');}
 if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type, X-Atlas-Write');res.setHeader('Access-Control-Allow-Private-Network','true');}
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 if(req.method==='GET'&&req.url==='/health'){res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({local:true}));return;}
 if(req.method==='GET'&&(['/','/bridge.js','/app.js','/hiring.js','/journal.js','/style.css','/story.css'].includes(req.url)||(req.url.startsWith('/story')&&!req.headers.authorization))){
  const file=req.url==='/'||req.url.startsWith('/story')?'index.html':req.url.slice(1);try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.setHeader('Cache-Control','no-store');return res.end(await readFile(new URL('../assets/'+file,import.meta.url)));}catch{res.writeHead(404);return res.end();}
 }
 return handler(req,res);
}).listen(8891,'127.0.0.1',()=>console.log('Fieldnotes local server ready at http://127.0.0.1:8891'));

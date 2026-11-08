import {readFile} from 'node:fs/promises';
import {settings,validKey,issueSession,validSession,sessionFrom,sameOrigin,COOKIE,validContextReader} from '../lib/security.mjs';
import {readState,saveState,validateBoard,Conflict} from '../lib/store.mjs';
import {buildContext,contextMarkdown,companySources,storyPage} from '../lib/context.mjs';
import {synthesize} from '../lib/synthesis.mjs';
const assets={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/journal.js':'journal.js','/hiring.js':'hiring.js','/story.css':'story.css'};
const mime={html:'text/html',css:'text/css',js:'text/javascript'};
const login=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>j0 / fieldnotes — private</title><style>body{background:#fafafa;color:#1f2a38;margin:0;font:14px system-ui}main{max-width:400px;margin:20vh auto;padding:28px}small{color:#8a929d;font:11px monospace}h1{font:36px Georgia;margin:32px 0 16px}p{line-height:1.8;color:#87919c}input{width:100%;box-sizing:border-box;border:0;border-bottom:1px solid #d9dee4;background:transparent;padding:18px 0;font:14px monospace;outline-offset:4px}button{background:transparent;border:0;color:#1f2a38;padding:24px 0;cursor:pointer}label{font-size:11px;color:#87919c}</style><main><small>j0 / fieldnotes · PRIVATE STAGING</small><h1>A little space of your own.</h1><p>Enter your owner access key to continue.</p><form method="post" action="/login"><label for="key">Owner access key</label><input id="key" name="key" type="password" maxlength="200" required autocomplete="current-password"><button>Open fieldnotes →</button></form></main></html>`;
async function body(req,limit){if(req.body!==undefined){const value=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(value)>limit)throw Error('BODY_TOO_LARGE');return value;}let s='';for await(const chunk of req){s+=chunk;if(Buffer.byteLength(s)>limit)throw Error('BODY_TOO_LARGE');}return s;}
export function createHandler(deps={readState,saveState,synthesize}){return async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
 const send=(code,data,type='application/json')=>{res.statusCode=code;res.setHeader('Content-Type',type+'; charset=utf-8');res.end(type==='application/json'?JSON.stringify(data):data);};
 const redirect=to=>{res.statusCode=303;res.setHeader('Location',to);res.end();};
 try{
 settings();const url=new URL(req.url,'http://local');const path=url.pathname==='/api/index'||url.pathname==='/api/index.mjs'?'/'+(url.searchParams.get('path')||''):url.pathname;
 if(path==='/login'&&req.method==='GET')return send(200,login,'text/html');
 if(path==='/login'&&req.method==='POST'){
  if(!sameOrigin(req))return send(403,{error:'Same-origin sign-in required'});
  const raw=await body(req,2048);const key=typeof req.body==='object'?req.body.key:new URLSearchParams(raw).get('key');
  if(!validKey(key))return send(401,login.replace('Enter your owner access key to continue.','That key did not match. Try again.'),'text/html');
  res.setHeader('Set-Cookie',`${COOKIE}=${issueSession()}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`);return redirect('/');
 }
 const readerPath=path==='/api/context'||path.startsWith('/api/context/source/');
 const reader=req.method==='GET'&&readerPath&&validContextReader(req);
 if(!reader&&!validSession(sessionFrom(req)))return path.startsWith('/api/')?send(401,{error:'Session ended. Export unsaved changes, then sign in again.'}):redirect('/login');
 if(req.method==='POST'&&!sameOrigin(req))return send(403,{error:'Same-origin write required'});
 if(path==='/logout'&&req.method==='POST'){res.setHeader('Set-Cookie',`${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);return redirect('/login');}
 if(req.method==='GET'&&assets[path]){const file=assets[path];return send(200,await readFile(new URL('../assets/'+file,import.meta.url),'utf8'),mime[file.split('.').pop()]);}
 if(path==='/api/library'&&req.method==='GET')return send(200,JSON.parse(await readFile(new URL('../assets/library.json',import.meta.url),'utf8')));
 if(path==='/api/context'&&req.method==='GET'){
  const state=(await deps.readState()).record;const packet=buildContext(state.board,(url.searchParams.get('q')||'').slice(0,2000),state.revision);
  if(url.searchParams.get('format')==='markdown'){res.setHeader('Content-Disposition','attachment; filename="company-context.md"');return send(200,contextMarkdown(packet),'text/markdown');}return send(200,packet);
 }
 if(path.startsWith('/api/context/source/')&&req.method==='GET'){
  const id=decodeURIComponent(path.slice('/api/context/source/'.length));const sources=companySources((await deps.readState()).record.board);const source=[...sources.entries,...sources.cards].find(s=>s.id===id);return source?send(200,source):send(404,{error:'Source not found in company context'});
 }
 if((path==='/story'||path.startsWith('/story/entry/'))&&req.method==='GET'){
  const state=(await deps.readState()).record;const entryId=path.startsWith('/story/entry/')?decodeURIComponent(path.slice('/story/entry/'.length)):null;
  if(entryId&&!(state.board.journalEntries||[]).some(e=>e.id===entryId))return send(404,{error:'Entry not found'});
  return send(200,storyPage(state.board,(url.searchParams.get('q')||'').slice(0,2000),entryId),'text/html');
 }
 if(path==='/api/board'&&req.method==='GET')return send(200,(await deps.readState()).record);
 if(req.method==='POST'&&req.headers['x-atlas-write']!=='1')return send(403,{error:'Write header required'});
 if(path==='/api/board'&&req.method==='POST'){const payload=JSON.parse(await body(req,3_500_000));return send(200,await deps.saveState(validateBoard(payload.board),payload.revision));}
 if(path==='/api/synthesize'&&req.method==='POST'){const payload=JSON.parse(await body(req,60_000));return send(200,await deps.synthesize(payload.entry,(await deps.readState()).record.board,payload.mode,req.headers['x-vercel-oidc-token']));}
 return send(404,{error:'Not found'});
 }catch(e){if(e instanceof Conflict)return send(409,{error:'Another window saved a newer version. Export your changes before reloading.'});if(e.message==='AUTH_NOT_CONFIGURED')return send(503,{error:'Private staging is locked until owner access is configured.'});if(e.message==='BODY_TOO_LARGE')return send(413,{error:'Entry or board exceeds the save limit.'});if(e instanceof SyntaxError||e.message.startsWith('Invalid ')||e.message==='Missing parent')return send(400,{error:'Invalid request; nothing saved.'});return send(503,{error:'Private storage or synthesis is unavailable. Your unsaved text remains in this window; export it before leaving.'});}
 };}
export default createHandler();

import {readFile,mkdir,rename,copyFile,readdir,unlink,open} from 'node:fs/promises';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {seal,unseal} from './security.mjs';
import '../assets/merge.js';
export class Conflict extends Error{}
export function publicRecord(record){return {...record,jobs:(record.jobs||[]).map(({id,entryId,status,attempts,error,createdAt,completedAt})=>({id,entryId,status,attempts,error,createdAt,completedAt}))};}
export function createStore(directory){
 const path=join(directory,'state.enc');let queue=Promise.resolve();
 async function readState(){
  try{return {record:unseal(await readFile(path,'utf8'))};}catch(e){if(e.code!=='ENOENT')throw e;return {record:JSON.parse(await readFile(new URL('../assets/seed.json',import.meta.url),'utf8'))};}
 }
 async function write(record){
  await mkdir(directory,{recursive:true,mode:0o700});const backups=join(directory,'backups');await mkdir(backups,{recursive:true,mode:0o700});
  try{await copyFile(path,join(backups,`${String(record.revision-1).padStart(10,'0')}.enc`));}catch(e){if(e.code!=='ENOENT')throw e;}
  const temp=path+'.tmp';const file=await open(temp,'w',0o600);try{await file.writeFile(seal(record));await file.sync();}finally{await file.close();}
  await rename(temp,path);const dir=await open(directory,'r');try{await dir.sync();}finally{await dir.close();}
  const files=(await readdir(backups)).filter(f=>f.endsWith('.enc')).sort();for(const file of files.slice(0,-100))await unlink(join(backups,file));
 }
 function transact(update){
  const operation=queue.then(async()=>{const {record}=await readState();const changed=await update(record);if(changed===false)return record;record.revision++;record.savedAt=new Date().toISOString();validateBoard(record.board);await write(record);return record;});
  queue=operation.catch(()=>{});return operation;
 }
 async function saveState(board,revision,{baseBoard,requests=[]}={}){
  return publicRecord(await transact(record=>{
   if(revision!==record.revision){if(!baseBoard)throw new Conflict();try{board=globalThis.fieldnotesMerge(baseBoard,board,record.board);}catch(e){throw new Conflict(e.message);}}
   record.board=validateBoard(board);record.jobs=record.jobs||[];
   if(!Array.isArray(requests)||requests.length>100)throw Error('Invalid AI requests');
   for(const request of requests){
    if(typeof request.id!=='string'||request.id.length>100||typeof request.entryId!=='string')throw Error('Invalid AI request');
    if(record.jobs.some(j=>j.id===request.id))continue;
    const entry=board.journalEntries?.find(e=>e.id===request.entryId);if(!entry)throw Error('Invalid AI entry');
    const input={text:entry.text,mode:entry.mode||'journal',scope:entry.contextScope||'company',supersedes:entry.supersedes||null};
    if(record.jobs.some(j=>j.entryId===entry.id&&JSON.stringify(j.input)===JSON.stringify(input)&&['queued','running','retrying','completed'].includes(j.status)))continue;
    if(record.jobs.filter(j=>['queued','running','retrying'].includes(j.status)).length>=100)throw Error('Invalid AI queue: finish pending entries first');
    record.jobs.push({id:request.id,entryId:entry.id,input,status:'queued',attempts:0,createdAt:new Date().toISOString()});
   }
   const terminal=record.jobs.filter(j=>['completed','failed','cancelled'].includes(j.status));const prune=new Set(terminal.slice(0,-200).map(j=>j.id));record.jobs=record.jobs.filter(j=>!prune.has(j.id));
  }));
 }
 return {readState,saveState,transact};
}
const store=createStore(process.env.FIELDNOTES_DATA_DIR||join(homedir(),'.fieldnotes-private','journal'));
export const {readState,saveState,transact}=store;
export function validateBoard(b){
 if(!b||b.version!==2||!Array.isArray(b.nodes)||!Array.isArray(b.edges)||b.nodes.length>5000||b.edges.length>10000)throw Error('Invalid board');
 const ids=new Set();
 for(const n of b.nodes){if(!n||typeof n.id!=='string'||n.id.length>100||ids.has(n.id)||!['region','idea','decision','question','experiment','principle','method'].includes(n.kind)||typeof n.title!=='string'||n.title.length>200||typeof n.body!=='string'||n.body.length>20000||!Number.isFinite(n.x)||!Number.isFinite(n.y)||Math.abs(n.x)>100000||Math.abs(n.y)>100000)throw Error('Invalid card');ids.add(n.id);}
 for(const n of b.nodes)if(n.region&&!ids.has(n.region))throw Error('Missing parent');
 const edgeIds=new Set();for(const e of b.edges){if(!e||typeof e.id!=='string'||edgeIds.has(e.id)||!ids.has(e.from)||!ids.has(e.to)||e.from===e.to||typeof e.label!=='string'||e.label.length>200)throw Error('Invalid edge');edgeIds.add(e.id);}
 if(!b.view||!['x','y','z'].every(k=>Number.isFinite(b.view[k]))||b.view.z<.15||b.view.z>3||Math.abs(b.view.x)>1e6||Math.abs(b.view.y)>1e6)throw Error('Invalid view');
 for(const key of ['journalDraft','thoughtDraft'])if(b[key]!==undefined&&(typeof b[key]!=='string'||b[key].length>12000))throw Error('Invalid draft');
 if(b.journalEntries!==undefined){if(!Array.isArray(b.journalEntries)||b.journalEntries.length>5000)throw Error('Invalid entries');const seen=new Set();for(const e of b.journalEntries){if(!e||!['id','date','text'].every(k=>typeof e[k]==='string')||e.text.length>12000||seen.has(e.id))throw Error('Invalid entry');if(e.contextScope!==undefined&&!['company','personal'].includes(e.contextScope))throw Error('Invalid context scope');if(e.supersedes!==undefined&&typeof e.supersedes!=='string')throw Error('Invalid correction reference');seen.add(e.id);}}
 return b;
}

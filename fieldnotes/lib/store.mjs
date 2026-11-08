import {readFile,writeFile,mkdir,rename,copyFile,readdir,unlink} from 'node:fs/promises';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {seal,unseal} from './security.mjs';
const directory=process.env.FIELDNOTES_DATA_DIR||join(homedir(),'.fieldnotes-private','journal');
const path=join(directory,'state.enc');
export class Conflict extends Error{}
export async function readState(){
 try{return {record:unseal(await readFile(path,'utf8'))};}catch(e){if(e.code!=='ENOENT')throw e;return {record:JSON.parse(await readFile(new URL('../assets/seed.json',import.meta.url),'utf8'))};}
}
let queue=Promise.resolve();
export function saveState(board,revision){
 const operation=queue.then(async()=>{
  await mkdir(directory,{recursive:true,mode:0o700});
  const {record}=await readState();if(revision!==record.revision)throw new Conflict();
  const next={board,revision:revision+1,savedAt:new Date().toISOString()};
  const backups=join(directory,'backups');await mkdir(backups,{recursive:true,mode:0o700});
  try{await copyFile(path,join(backups,`${String(record.revision).padStart(10,'0')}.enc`));}catch(e){if(e.code!=='ENOENT')throw e;}
  const temp=path+'.tmp';await writeFile(temp,seal(next),{mode:0o600});await rename(temp,path);
  const files=(await readdir(backups)).filter(f=>f.endsWith('.enc')).sort();
  for(const file of files.slice(0,-100))await unlink(join(backups,file));
  return {revision:next.revision,savedAt:next.savedAt};
 });queue=operation.catch(()=>{});return operation;
}
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

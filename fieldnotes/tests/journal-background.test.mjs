import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../assets/journal.js',import.meta.url),'utf8');
const hiring=await readFile(new URL('../assets/hiring.js',import.meta.url),'utf8');
const tick=()=>new Promise(r=>setImmediate(r));
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}
function setup(){
 const els=new Map();const $=s=>{if(!els.has(s))els.set(s,{value:'',checked:true,disabled:false,hidden:false,textContent:'',setAttribute(){},focus(){}});return els.get(s);};
 const requests=[],saves=[];let count=0;
 const ctx=vm.createContext({$,board:{nodes:[{id:'person',title:'Example Person',candidateKey:'example',body:'Stage: Considering'}],edges:[],journalEntries:[]},loaded:true,changeVersion:0,location:{search:''},URLSearchParams,Date,Map,Promise,window:{addEventListener(){}},document:{body:{classList:{toggle(){}}}},id:()=>String(++count),esc:String,node:()=>null,render(){},renderNodes(){},checkpoint(){},changed(){ctx.changeVersion++;},save:async()=>{},saveThrough:async version=>{saves.push(version);},fetch:async(url,opts)=>{const d=deferred();requests.push({input:JSON.parse(opts.body),...d});return d.promise;}});
 vm.runInContext(hiring,ctx);vm.runInContext(source,ctx);
 const run=s=>vm.runInContext(s,ctx);
 const type=text=>{$('#daily-entry').value=text;$('#daily-entry').oninput();};
 const result={summary:'Reflection',updates:[],hiringUpdates:[{nodeId:'person',note:'Talked today',evidence:'Example Person',fields:[]}],hiringQuestions:[],perspectives:[]};
 const finish=i=>requests[i].resolve({ok:true,json:async()=>result});
 return {$,ctx,run,type,requests,saves,finish};
}
test('AI submission captures an entry and durable request without disabling writing',async()=>{
 const h=setup();h.ctx.serverJobs=[];h.ctx.pendingAIRequests=new Map();
 h.type('Met Example Person');h.$('#synthesize').onclick();h.$('#synthesize').onclick();
 assert.equal(h.ctx.pendingAIRequests.size,1);assert.equal(h.ctx.board.journalEntries.length,1);
 assert.equal(h.$('#daily-entry').disabled,false);assert.equal(h.$('#save-entry').disabled,false);assert.equal(h.requests.length,0);
 h.type('Newer thought');h.$('#mode-think').onclick();h.type('A different angle');
 assert.equal(h.ctx.board.journalDraft,'Newer thought');assert.equal(h.ctx.board.thoughtDraft,'A different angle');
 assert.equal(h.ctx.board.journalEntries[0].text,'Met Example Person');
});
test('save acknowledgement releases captured entry while newer typing remains dirty',async()=>{
 const app=await readFile(new URL('../assets/app.js',import.meta.url),'utf8');const elements=new Map();const document={querySelector:s=>{if(!elements.has(s))elements.set(s,{});return elements.get(s);}};
 const requests=[];const ctx=vm.createContext({document,structuredClone,syncInspectorFields:()=>{},crypto:{randomUUID:()=>''},setTimeout,clearTimeout,Date,Promise,fetch:async()=>{const d=deferred();requests.push(d);return d.promise;}});
 vm.runInContext(await readFile(new URL('../assets/merge.js',import.meta.url),'utf8'),ctx);
 vm.runInContext(app.slice(0,app.indexOf("window.addEventListener('beforeunload'")),ctx);
 vm.runInContext("board={journalDraft:'first'};loaded=true;renderNodes=()=>{};renderNav=()=>{};syncInspectorFields=()=>{};changed();",ctx);
 const saved=vm.runInContext('saveThrough(changeVersion)',ctx);await tick();
 vm.runInContext("board.journalDraft='newer';changed();clearTimeout(saveTimer);",ctx);
 requests[0].resolve({ok:true,json:async()=>({revision:1,savedAt:new Date().toISOString()})});await saved;
 assert.equal(vm.runInContext('dirty',ctx),true);assert.equal(vm.runInContext('board.journalDraft',ctx),'newer');assert.equal(requests.length,1);
});

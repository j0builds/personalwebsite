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
test('AI waits for save, never disables writing, deduplicates and preserves newer drafts across modes',async()=>{
 const h=setup(),ack=deferred();h.ctx.saveThrough=()=>ack.promise;
 h.type('Met Example Person');h.$('#synthesize').onclick();h.$('#synthesize').onclick();await tick();
 assert.equal(h.requests.length,0);assert.equal(h.$('#daily-entry').disabled,false);assert.equal(h.$('#save-entry').disabled,false);
 ack.resolve();await tick();assert.equal(h.requests.length,1);
 h.type('A newer journal draft');h.$('#mode-think').onclick();h.type('Could we try a different tool?');
 h.finish(0);await h.run('aiQueue');
 assert.equal(h.$('#daily-entry').value,'Could we try a different tool?');assert.equal(h.ctx.board.journalDraft,'A newer journal draft');assert.equal(h.ctx.board.thoughtDraft,'Could we try a different tool?');
 assert.equal(h.requests[0].input.mode,'journal');assert.equal(h.ctx.board.journalEntries[0].hiringReceipt.length,1);assert.equal(h.run('activeEntry'),null);
});
test('queued notes run serially while plain save remains available; manual card edits survive',async()=>{
 const h=setup();h.type('Met Example Person');h.$('#synthesize').onclick();await tick();
 h.type('Next note');h.$('#synthesize').onclick();await tick();assert.equal(h.requests.length,1);
 h.type('Third note');await h.$('#save-entry').onclick();assert.equal(h.ctx.board.journalEntries.length,3);
 h.ctx.board.nodes[0].body='Stage: Manually updated';h.finish(0);await tick();assert.equal(h.requests.length,2);assert.equal(h.ctx.board.nodes[0].body,'Stage: Manually updated');
 h.finish(1);await h.run('aiQueue');assert.equal(h.$('#daily-entry').value,'Third note');assert.equal(h.requests[1].input.entry,'Next note');
});
test('changed scope discards late result; save failure never starts AI',async()=>{
 const h=setup();h.type('Met Example Person');h.$('#synthesize').onclick();await tick();h.ctx.board.journalEntries[0].contextScope='personal';h.finish(0);await h.run('aiQueue');assert.equal(h.ctx.board.journalEntries[0].proposal,null);
 const f=setup();f.ctx.saveThrough=async()=>{throw Error('Disk unavailable');};f.type('Unsaved note');f.$('#synthesize').onclick();await f.run('aiQueue');assert.equal(f.requests.length,0);assert.match(f.$('#ai-status').textContent,/Disk unavailable/);assert.equal(f.$('#daily-entry').value,'Unsaved note');
});
test('save acknowledgement releases captured entry while newer typing remains dirty',async()=>{
 const app=await readFile(new URL('../assets/app.js',import.meta.url),'utf8');const elements=new Map();const document={querySelector:s=>{if(!elements.has(s))elements.set(s,{});return elements.get(s);}};
 const requests=[];const ctx=vm.createContext({document,crypto:{randomUUID:()=>''},setTimeout,clearTimeout,Date,Promise,fetch:async()=>{const d=deferred();requests.push(d);return d.promise;}});
 vm.runInContext(app.slice(0,app.indexOf("window.addEventListener('beforeunload'")),ctx);
 vm.runInContext("board={journalDraft:'first'};loaded=true;changed();",ctx);
 const saved=vm.runInContext('saveThrough(changeVersion)',ctx);await tick();
 vm.runInContext("board.journalDraft='newer';changed();clearTimeout(saveTimer);",ctx);
 requests[0].resolve({ok:true,json:async()=>({revision:1,savedAt:new Date().toISOString()})});await saved;
 assert.equal(vm.runInContext('dirty',ctx),true);assert.equal(vm.runInContext('board.journalDraft',ctx),'newer');assert.equal(requests.length,1);
});

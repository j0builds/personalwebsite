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
test('save conflict remains visible in writer after subsequent typing',async()=>{
 const app=await readFile(new URL('../assets/app.js',import.meta.url),'utf8');const els=new Map();const document={querySelector:s=>{if(!els.has(s))els.set(s,{});return els.get(s);}};
 const ctx=vm.createContext({document,crypto:{randomUUID:()=>''},setTimeout,clearTimeout,Date,Promise,fetch:async()=>({ok:false,status:409,json:async()=>({error:'Another window saved a newer version.'})})});
 vm.runInContext(app.slice(0,app.indexOf("window.addEventListener('beforeunload'")),ctx);
 await vm.runInContext("board={journalDraft:'keep me'};loaded=true;changed();save();",ctx);
 vm.runInContext("board.journalDraft='keep me too';changed();clearTimeout(saveTimer)",ctx);
 assert.equal(els.get('#writer-save-error').hidden,false);assert.match(els.get('#writer-save-error').textContent,/newer version/);assert.match(els.get('#journal-save').textContent,/Not saved/);assert.equal(vm.runInContext('board.journalDraft',ctx),'keep me too');assert.equal(els.get('#writer-recovery').hidden,false);
});
test('fast initial fetch opens writer after bridge finishes loading handlers',async()=>{
 const app=await readFile(new URL('../assets/app.js',import.meta.url),'utf8');const bridge=await readFile(new URL('../assets/bridge.js',import.meta.url),'utf8');
 assert.ok(bridge.indexOf('await startFieldnotes()')>bridge.indexOf("'journal.js'"));
 const start=app.slice(app.indexOf('async function startFieldnotes()'),app.indexOf('\n',app.indexOf('async function startFieldnotes()')));let opened=0;
 const ctx=vm.createContext({fetch:async url=>({ok:true,json:async()=>url.endsWith('board')?{board:{nodes:[]},revision:1}:[]}),structuredClone,URLSearchParams,location:{search:''},render(){},status(){},$:()=>({click(){opened++;}})});
 vm.runInContext(start,ctx);assert.equal(opened,0);await vm.runInContext('startFieldnotes()',ctx);assert.equal(opened,1);
});
test('archive acknowledgement clears only the submitted draft and keeps a saved entry',async()=>{
 const h=setup();h.type('A saved journal entry');await h.$('#save-entry').onclick();
 assert.equal(h.ctx.board.journalEntries[0].text,'A saved journal entry');assert.equal(h.$('#daily-entry').value,'');assert.equal(h.ctx.board.journalDraft,'');assert.equal(h.$('#archive-confirmation').textContent,'Saved to archive');assert.match(h.$('#journal-entries').innerHTML,/A saved journal entry/);
});
test('failed save neither celebrates nor clears the draft',async()=>{
 const h=setup();h.ctx.saveThrough=async()=>{throw Error('offline')};h.type('Keep this unsaved note');await h.$('#save-entry').onclick();
 assert.equal(h.$('#daily-entry').value,'Keep this unsaved note');assert.equal(h.$('#archive-confirmation').textContent,'');assert.equal(h.$('#journal-error').textContent,'offline');
});
test('new typing during explicit save is not cleared by archive acknowledgement',async()=>{
 const h=setup();const d=deferred();h.ctx.saveThrough=()=>d.promise;h.type('First entry');const saving=h.$('#save-entry').onclick();h.type('A newer draft');d.resolve();await saving;
 assert.equal(h.$('#daily-entry').value,'A newer draft');assert.equal(h.ctx.board.journalDraft,'A newer draft');assert.equal(h.ctx.board.journalEntries[0].text,'First entry');
});
test('archive reads full entries across modes without replacing current writing',()=>{
 const h=setup();h.ctx.board.journalEntries=[{id:'past',mode:'think',date:'Yesterday',text:'An earlier thought',proposal:null}];h.type('Current draft');h.run('journalHistory()');assert.match(h.$('#journal-entries').innerHTML,/An earlier thought/);
 h.$('#journal-entries').onclick({target:{closest:()=>({dataset:{reflection:'past'}})}});
 assert.equal(h.$('#archive-entry-text').textContent,'An earlier thought');assert.equal(h.$('#daily-entry').value,'Current draft');h.$('#archive-continue').onclick();assert.match(h.$('#archive-notice').textContent,/draft/);assert.equal(h.$('#daily-entry').value,'Current draft');
 h.$('#journal-search').value='no match';h.$('#journal-search').oninput();assert.match(h.$('#journal-entries').innerHTML,/No entries match/);
});
test('reduced motion skips flight but confirms successful archival',async()=>{
 const h=setup();h.$('#journal-history').hidden=true;h.ctx.window.matchMedia=()=>({matches:true});let animations=0;h.$('#open-archive').animate=()=>{animations++};h.type('Quiet save');await h.$('#save-entry').onclick();assert.equal(animations,0);assert.equal(h.$('#archive-confirmation').textContent,'Saved to archive');
});
test('successful save animates a content-free paper into the archive',async()=>{
 const h=setup();h.$('#journal-history').hidden=true;h.ctx.window.matchMedia=()=>({matches:false});let flight=0,removed=false;
 h.$('#open-archive').animate=()=>({});h.$('#open-archive').getBoundingClientRect=()=>({left:600,top:30,width:80});h.$('#save-entry').getBoundingClientRect=()=>({left:400,top:500,width:80});
 h.ctx.document.createElement=()=>({style:{},setAttribute(){},animate(frames,options){flight++;assert.equal(options.duration,1000);return {finished:Promise.resolve()};},remove(){removed=true;}});h.$('#journal-dialog').append=()=>{};
 h.type('Saved text stays out of the animation');await h.$('#save-entry').onclick();await tick();assert.equal(flight,1);assert.equal(removed,true);
});

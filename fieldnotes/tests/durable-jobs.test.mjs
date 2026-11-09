import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';import {tmpdir} from 'node:os';
import {createStore,Conflict} from '../lib/store.mjs';import {createWorker} from '../lib/jobs.mjs';
process.env.OWNER_ACCESS_HASH='a'.repeat(64);process.env.SESSION_SECRET='b'.repeat(64);process.env.DATA_ENCRYPTION_KEY='c'.repeat(64);
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {resolve,promise};};
async function fixture(){
 const dir=await mkdtemp(tmpdir()+'/fieldnotes-jobs-'),store=createStore(dir);const {record}=await store.readState();
 record.board.nodes.push({id:'candidate',kind:'idea',title:'Example Person',candidateKey:'example',body:'Stage: Considering',x:0,y:0});
 record.board.journalEntries=[{id:'entry',text:'Example Person agreed to send samples.',date:'Today',mode:'journal',contextScope:'company'}];
 return {dir,store,record,cleanup:()=>rm(dir,{recursive:true,force:true}),enqueue:()=>store.saveState(record.board,record.revision,{requests:[{id:'job',entryId:'entry'}]})};
}
const proposal={summary:'Samples requested',updates:[],hiringUpdates:[{nodeId:'candidate',mention:'Example Person',note:'Agreed to send samples.',evidence:'Example Person agreed to send samples.',fields:[{field:'Next step',value:'Send samples',evidence:'send samples'}]}],hiringQuestions:[],perspectives:[]};
test('note and job saved atomically, encrypted, survive store reopen, complete once without a client',async()=>{
 const f=await fixture();try{
  const saved=await f.enqueue();assert.equal(saved.jobs[0].status,'queued');assert.equal(saved.board.journalEntries.length,1);
  assert.ok(!(await readFile(f.dir+'/state.enc','utf8')).includes('send samples'));
  const reopened=createStore(f.dir);const worker=createWorker(reopened,async()=>structuredClone(proposal));await worker.recover();await worker.runOne();
  let r=(await reopened.readState()).record;assert.equal(r.jobs[0].status,'completed');assert.match(r.board.nodes.find(n=>n.id==='candidate').body,/Next step: Send samples/);
  await reopened.saveState(r.board,r.revision,{requests:[{id:'job',entryId:'entry'},{id:'duplicate',entryId:'entry'}]});await worker.runOne();
  r=(await reopened.readState()).record;assert.equal(r.jobs.length,1);assert.equal(r.board.nodes.find(n=>n.id==='candidate').body.match(/Journal update/g).length,1);
 }finally{await f.cleanup();}
});
test('restart recovers a claimed job and commits result/status together',async()=>{
 const f=await fixture();try{await f.enqueue();await f.store.transact(r=>{r.jobs[0].status='running';r.jobs[0].attempts=1;});
 const worker=createWorker(createStore(f.dir),async()=>structuredClone(proposal));await worker.recover();await worker.runOne();const r=(await f.store.readState()).record;
 assert.equal(r.jobs[0].status,'completed');assert.equal(r.jobs[0].attempts,2);assert.equal(r.board.journalEntries[0].hiringReceipt.length,1);
 }finally{await f.cleanup();}
});
test('new drafts merge across worker revisions; manual candidate changes are not overwritten',async()=>{
 const f=await fixture();try{const saved=await f.enqueue();const gate=deferred(),started=deferred();const worker=createWorker(f.store,async()=>{started.resolve();return gate.promise;});const running=worker.runOne();await started.promise;
 const local=structuredClone(saved.board);local.journalDraft='Newer writing';local.nodes.find(n=>n.id==='candidate').body='Stage: Manually updated';
 await f.store.saveState(local,saved.revision,{baseBoard:saved.board});gate.resolve(structuredClone(proposal));await running;
 const r=(await f.store.readState()).record;assert.equal(r.board.journalDraft,'Newer writing');assert.equal(r.board.nodes.find(n=>n.id==='candidate').body,'Stage: Manually updated');assert.equal(r.board.journalEntries[0].hiringReceipt.length,0);assert.match(r.board.journalEntries[0].hiringSkipped[0],/changed/);
 const late=structuredClone(local);late.journalDraft='Even newer';const merged=await f.store.saveState(late,saved.revision,{baseBoard:local});assert.equal(merged.board.journalEntries[0].proposal.summary,proposal.summary);
 }finally{await f.cleanup();}
});
test('scope change or removal cancels late results; Think never applies hiring updates',async()=>{
 for(const change of ['privacy','remove','think']){const f=await fixture();try{
 if(change==='think')f.record.board.journalEntries[0].mode='think';await f.enqueue();const gate=deferred(),started=deferred();const w=createWorker(f.store,async()=>{started.resolve();return gate.promise;});const running=w.runOne();await started.promise;
 if(change!=='think')await f.store.transact(r=>{if(change==='remove')r.board.journalEntries=[];else r.board.journalEntries[0].contextScope='personal';});
 gate.resolve(structuredClone(proposal));await running;const r=(await f.store.readState()).record;assert.equal(r.jobs[0].status,change==='think'?'completed':'cancelled');assert.equal(r.board.nodes.find(n=>n.id==='candidate').body,'Stage: Considering');
 }finally{await f.cleanup();}}
});
test('unavailable AI retries durably then fails visibly, preserving note; new request retries',async()=>{
 const f=await fixture();try{await f.enqueue();let calls=0;const w=createWorker(f.store,async()=>{calls++;throw Error('unavailable');},{retryDelay:0});for(let i=0;i<3;i++)await w.runOne();let r=(await f.store.readState()).record;assert.equal(calls,3);assert.equal(r.jobs[0].status,'failed');assert.equal(r.board.journalEntries[0].text,f.record.board.journalEntries[0].text);
 await f.store.saveState(r.board,r.revision,{requests:[{id:'retry',entryId:'entry'}]});const good=createWorker(f.store,async()=>structuredClone(proposal));await good.runOne();r=(await f.store.readState()).record;assert.equal(r.jobs[1].status,'completed');
 }finally{await f.cleanup();}
});
test('same-field concurrency fails safely; invalid enqueue does not partially save',async()=>{
 const f=await fixture();try{const saved=await f.enqueue();const a=structuredClone(saved.board);a.journalDraft='one';await f.store.saveState(a,saved.revision);const b=structuredClone(saved.board);b.journalDraft='two';await assert.rejects(f.store.saveState(b,saved.revision,{baseBoard:saved.board}),Conflict);
 const current=(await f.store.readState()).record;await assert.rejects(f.store.saveState({...current.board,journalDraft:'must not save'},current.revision,{requests:[{id:'bad',entryId:'missing'}]}));assert.equal((await f.store.readState()).record.board.journalDraft,'one');
 }finally{await f.cleanup();}
});

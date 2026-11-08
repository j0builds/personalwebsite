import {readState,transact} from './store.mjs';
import {synthesize} from './synthesis.mjs';
import {companySources} from './context.mjs';
import '../assets/hiring.js';
const pending=j=>['queued','running','retrying'].includes(j.status);
function findEntry(record,job){
 const e=record.board.journalEntries?.find(e=>e.id===job.entryId);
 if(!e||e.text!==job.input.text||(e.mode||'journal')!==job.input.mode||(e.contextScope||'company')!==job.input.scope||(e.supersedes||null)!==job.input.supersedes||record.board.journalEntries.some(x=>x.supersedes===e.id))return null;
 return e;
}
export function createWorker(store={readState,transact},infer=synthesize,{retryDelay=30000}={}){
 let stopped=false,busy=false,timer;
 async function recover(){await store.transact(record=>{let changed=false;for(const j of record.jobs||[])if(j.status==='running'){j.status='queued';changed=true;}return changed;});}
 async function runOne(){
  if(busy||stopped)return false;busy=true;let job,context;
  try{
   await store.transact(record=>{
    const next=(record.jobs||[]).find(j=>pending(j)&&j.status!=='running'&&(!j.retryAt||j.retryAt<=Date.now()));if(!next)return false;
    if(!findEntry(record,next)){next.status='cancelled';next.error='Entry changed; AI result was not applied.';return;}
    next.status='running';next.attempts++;delete next.error;
    next.baseline=Object.fromEntries(record.board.nodes.filter(n=>n.candidateKey).map(n=>[n.id,n.body]));
    job=structuredClone(next);context=structuredClone(record.board);
   });
   if(!job)return false;
   const proposal=await infer(job.input.text,context,job.input.mode);
   await store.transact(record=>{
    const current=(record.jobs||[]).find(j=>j.id===job.id);if(!current||current.status!=='running')return false;
    const entry=findEntry(record,job);if(!entry){current.status='cancelled';current.error='Entry changed; AI result was not applied.';return;}
    entry.proposal=proposal;
    if(job.input.mode==='journal'&&!entry.hiringApplied&&(proposal.hiringUpdates||[]).length){
     const eligible=new Set(companySources(record.board).cards.map(c=>c.id.slice(5)));
     const baseline=Object.fromEntries(Object.entries(job.baseline).filter(([id])=>eligible.has(id)));
     globalThis.applyFieldnotesHiringUpdates(record.board,entry,baseline);
    }
    current.status='completed';current.completedAt=new Date().toISOString();delete current.baseline;delete current.retryAt;
   });
   return true;
  }catch(e){
   if(job)await store.transact(record=>{const current=record.jobs?.find(j=>j.id===job.id);if(!current||current.status!=='running')return false;
    current.status=current.attempts<3?'retrying':'failed';current.retryAt=Date.now()+retryDelay*current.attempts;current.error='Local AI unavailable or returned an invalid result. Your entry is saved.';
   });
   return false;
  }finally{busy=false;}
 }
 async function loop(){if(stopped)return;try{await runOne();}catch{console.error('Fieldnotes worker could not persist job state; will retry.');}if(!stopped){timer=setTimeout(loop,1000);timer.unref?.();}}
 return {recover,runOne,async start(){await recover();void loop();},stop(){stopped=true;clearTimeout(timer);}};
}

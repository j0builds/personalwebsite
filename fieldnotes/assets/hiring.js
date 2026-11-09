'use strict';
// Pure transformation; caller checkpoints the board before invoking it.
function applyHiringUpdates(board,entry,baseline){
 if(entry.hiringApplied)return {updated:[],skipped:[]};
 const updated=[],skipped=[];
 for(const u of entry.proposal?.hiringUpdates||[]){
  const target=board.nodes.find(n=>n.id===u.nodeId&&n.candidateKey);
  if(!target||target.body!==baseline[u.nodeId]){skipped.push('Card changed while processing. Review and retry this person.');continue;}
  let body=target.body;const changes=[];
  for(const f of u.fields||[]){
   if(!['Stage','Role being considered','Owner','Last contact','Next step','Follow-up date'].includes(f.field))continue;
   const line=f.field+': '+f.value;const re=new RegExp('^'+f.field+':[^\\n]*','m');
   const old=body.match(re)?.[0]||'(not recorded)';
   body=re.test(body)?body.replace(re,()=>line):line+'\n'+body;
   changes.push({field:f.field,before:old,after:line,evidence:f.evidence});
  }
  body+=`\n\n${entry.date} · Journal update\n${u.note}\nSource: ${u.evidence}`;
  if(body.length>20000){skipped.push(target.title+': card is full; journal retained.');continue;}
  updated.push({nodeId:target.id,title:target.title,beforeBody:target.body,afterBody:body,changes});target.body=body;
 }
 entry.hiringApplied=true;entry.hiringReceipt=updated;entry.hiringSkipped=skipped;
 return {updated,skipped};
}
if(typeof module!=='undefined')module.exports={applyHiringUpdates};

globalThis.applyFieldnotesHiringUpdates=applyHiringUpdates;

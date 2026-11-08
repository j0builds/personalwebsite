'use strict';
let journalBusy=false,activeEntry=null,journalMode="journal",editorVersion=0;
const aiJobs=new Map();let aiQueue=Promise.resolve();
const draftKey=()=>journalMode==='think'?'thoughtDraft':'journalDraft';
const synthesisLabel=()=>journalMode==='think'?'Explore angles →':'Save & update cards →';
const jdialog=$('#journal-dialog');
const scope=()=>$('#company-context').checked?'company':'personal';
function createEntry(text){const priorId=new URLSearchParams(location.search).get('revise');return {id:id(),date:localDate(),createdAt:new Date().toISOString(),mode:journalMode,text,contextScope:scope(),supersedes:(board.journalEntries||[]).some(e=>e.id===priorId)?priorId:undefined,proposal:null,applied:false};}
function syncScope(entry){entry.contextScope=scope();}

$('#toggle-tools').onclick=()=>{const active=document.body.classList.toggle('editing');$('#toggle-tools').setAttribute('aria-pressed',String(active));$('#toggle-tools').setAttribute('aria-label',active?'Hide board tools':'Show board tools');renderNodes();};
function journalError(message){$('#journal-error').hidden=!message;$('#journal-error').textContent=message;}
function localDate(){return new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});}
function journalHistory(){const query=($('#journal-search').value||'').toLowerCase();const entries=(board.journalEntries||[]).filter(e=>(e.mode||'journal')===journalMode).filter(e=>[e.text,e.date,e.proposal?.summary||''].join(' ').toLowerCase().includes(query));$('#journal-entries').innerHTML=entries.slice().reverse().map(e=>`<article class="journal-record"><h3>${esc(e.date)} · ${e.hiringReceipt?.length?'Hiring updated':e.mode==='think'?'Thinking aloud':e.applied?'Added to map':e.proposal?'Ready for review':'Saved reflection'}</h3><p>${esc(e.proposal?.summary||e.text.slice(0,180))}</p><button data-reflection="${esc(e.id)}">${e.applied?'Read reflection':'Continue reflection'}</button></article>`).join('')||(query?'<p>No reflections match this search.</p>':'<p>Your story starts with the next entry.</p>');}
$('#open-journal').onclick=()=>{if(!loaded)return;if(journalBusy){jdialog.showModal();return;}editorVersion++;$('#journal-date').textContent=localDate().toUpperCase();$('#daily-entry').value=board[draftKey()]||'';$('#journal-result').hidden=true;activeEntry=null;journalError('');$('#journal-search').value='';journalHistory();jdialog.showModal();$('#daily-entry').focus();};
$('#close-journal').onclick=()=>jdialog.close();
$('#daily-entry').oninput=()=>{editorVersion++;board[draftKey()]=$('#daily-entry').value;$('#journal-result').hidden=true;activeEntry=null;changed();$('#journal-save').textContent='Draft will autosave with your board';};
function showProposal(entry){activeEntry=entry;$('#journal-result').hidden=!entry.proposal;if(!entry.proposal)return;$('#journal-summary').textContent=entry.proposal.summary;renderReflectionExtras(entry);$('#journal-proposals').innerHTML=entry.proposal.updates.map((u,i)=>{const route=u.regionIds.map(r=>node(r)?.title).filter(Boolean).join(' · ')||'Unsorted';const prior=u.existingNodeId?node(u.existingNodeId):null;return `<article class="proposal"><label><input type="checkbox" data-update="${i}" ${entry.applied?'disabled':''} checked><div><div class="proposal-route">${esc(u.kind)} · ${esc(route)}${prior?' · append to '+esc(prior.title):''}</div><h3>${esc(u.title)}</h3><p>${esc(u.body)}</p></div></label><details><summary>From your entry</summary><p>${esc(u.evidence)}</p></details></article>`;}).join('');$('#apply-journal').disabled=!!entry.applied||!entry.proposal.updates.length;$('#apply-journal').textContent=entry.applied?'Already added':'Add to my map';}
$('#journal-entries').onclick=e=>{if(journalBusy)return;const b=e.target.closest('[data-reflection]');if(!b)return;editorVersion++;const entry=board.journalEntries.find(e=>e.id===b.dataset.reflection);$('#daily-entry').value=entry.text;$('#company-context').checked=entry.contextScope!=='personal';showProposal(entry);journalError('');};
function aiStatus(message){$('#ai-status').textContent=message;}
function stillViewing(job){return editorVersion===job.editorVersion&&journalMode===job.mode&&$('#daily-entry').value.trim()===job.text;}
function matchingEntry(job){return board.journalEntries?.find(e=>e.id===job.id&&e.text===job.text&&(e.mode||'journal')===job.mode&&e.contextScope===job.scope);}
function queueSynthesis(entry,target){
 if(aiJobs.has(entry.id)){aiStatus('Already queued · keep writing');return;}
 const job={id:entry.id,text:entry.text,mode:entry.mode||'journal',scope:entry.contextScope,editorVersion,target};
 aiJobs.set(job.id,job);aiStatus('Saving entry · AI queued');
 aiQueue=aiQueue.then(async()=>{
  try{
   await saveThrough(job.target);
   if(!matchingEntry(job))throw Error('Entry changed; run AI again when ready.');
   aiStatus('Entry saved · AI working in the background · keep writing');
   const baseline=Object.fromEntries(board.nodes.filter(n=>n.candidateKey).map(n=>[n.id,n.body]));
   const r=await fetch('/api/synthesize',{method:'POST',headers:{'Content-Type':'application/json','X-Atlas-Write':'1'},body:JSON.stringify({entry:job.text,mode:job.mode})});
   const proposal=await r.json();if(!r.ok)throw Error(proposal.error||'Synthesis unavailable.');
   // Undo, import, a privacy change, or another edit may have replaced the entry.
   const current=matchingEntry(job);if(!current)throw Error('Entry changed; AI result was not applied.');
   current.proposal=proposal;
   if(job.mode==='journal'&&!current.hiringApplied&&(proposal.hiringUpdates||[]).length){checkpoint();applyHiringUpdates(board,current,baseline);render();}
   changed();await saveThrough(changeVersion);
   if(stillViewing(job))showProposal(current);
   journalHistory();aiStatus(current.hiringReceipt?.length?'Saved · hiring cards updated':'Saved · reflection ready in Earlier reflections');
  }catch(e){aiStatus('AI update incomplete: '+e.message+' Your writing is retained; use Save entry if a save error is shown.');}
  finally{aiJobs.delete(job.id);if(aiJobs.size)aiStatus('AI queued · '+aiJobs.size+' remaining · keep writing');}
 });
}
function captureEntry(){
 const text=$('#daily-entry').value.trim();if(!text)throw Error('A word, a sentence, a little of today. Start anywhere.');
 board.journalEntries=board.journalEntries||[];
 let entry=board.journalEntries.find(e=>e.text===text&&(e.mode||'journal')===journalMode);
 if(!entry){entry=createEntry(text);board.journalEntries.push(entry);}
 syncScope(entry);board[draftKey()]=$('#daily-entry').value;changed();return entry;
}
$('#synthesize').onclick=()=>{
 if(!loaded)return;
 try{journalError('');const entry=captureEntry();queueSynthesis(entry,changeVersion);void save();journalHistory();}
 catch(e){journalError(e.message);}
};
// The journal is durable before AI starts; unfinished AI needs this tab to stay open.
window.addEventListener('beforeunload',e=>{if(aiJobs.size){e.preventDefault();e.returnValue='';}});
$('#apply-journal').onclick=()=>{
 const entry=activeEntry;if(!entry?.proposal||entry.applied)return;
 const selectedUpdates=Array.from($('#journal-proposals').querySelectorAll('input:checked')).map(e=>entry.proposal.updates[Number(e.dataset.update)]);if(!selectedUpdates.length){journalError('Choose at least one update, or leave this as a journal entry.');return;}
 checkpoint();let added=0;const updatedIds=[];
 for(const u of selectedUpdates){let target=node(u.existingNodeId);if(target&&target.kind!=='region'&&target.body.length+u.body.length+entry.date.length+4<=20000){target.body+=`\n\n${entry.date}\n${u.body}`;updatedIds.push(target.id);}
 else{const region=node(u.regionIds[0]);const siblings=board.nodes.filter(n=>n.region===region?.id).length;target={id:id(),title:u.title,body:u.body,kind:u.kind,region:region?.id||'',x:region?region.x+290+(siblings%3)*290:100+(added%4)*290,y:region?region.y+90+Math.floor(siblings/3)*210:1000+Math.floor(added/4)*210,sourceEntry:entry.id};board.nodes.push(target);updatedIds.push(target.id);added++;}
 for(const rid of u.regionIds){if(node(rid)&&!board.edges.some(e=>e.from===rid&&e.to===target.id))board.edges.push({id:id(),from:rid,to:target.id,label:'from reflection'});}
 }
 entry.applied=true;entry.appliedNodeIds=updatedIds;board[draftKey()]='';changed();render();showProposal(entry);journalHistory();$('#journal-save').textContent='Added to your map';jdialog.close();if(updatedIds.length){focusNode(node(updatedIds[0]));$('#inspector').hidden=true;}
};

$('#journal-search').oninput=journalHistory;
$('#save-entry').onclick=async()=>{
 if(!loaded)return;const version=editorVersion;
 try{
  journalError('');const entry=captureEntry();await saveThrough(changeVersion);
  if(editorVersion===version){activeEntry=entry;$('#journal-save').textContent='Entry saved privately';}
  journalHistory();
 }catch(e){journalError(e.message);}
};

function setJournalMode(mode){
 if(journalBusy)return;
 editorVersion++;journalMode=mode;activeEntry=null;
 $('#mode-journal').setAttribute('aria-pressed',String(mode==='journal'));$('#mode-think').setAttribute('aria-pressed',String(mode==='think'));
 $('#journal-heading').textContent=mode==='think'?'Let it be unfinished.':'Start anywhere.';
 $('.journal-intro').textContent=mode==='think'?'A decision, a possibility, a tangle of thoughts. Put it here.':'What happened, what changed, what’s on your mind.';
 $('#daily-entry').placeholder=mode==='think'?'I’m trying to decide whether…':'Today I noticed…';
 $('#daily-entry').value=board[draftKey()]||'';$('#synthesize').textContent=synthesisLabel();$('#journal-result').hidden=true;
 $('.journal-disclosure').textContent=mode==='think'?'Explore angles uses this thought and relevant company history. Thinking stays exploratory; it won’t change hiring cards.':'Saved company entries become context for future reflections. AI updates clearly named hiring cards when requested.';
 $('#journal-search').value='';journalError('');journalHistory();$('#daily-entry').focus();
}
$('#mode-journal').onclick=()=>setJournalMode('journal');$('#mode-think').onclick=()=>setJournalMode('think');
function renderReflectionExtras(entry){
 const context=entry.proposal.contextUsed;$('#context-receipt').hidden=!context;
 if(context){$('#context-sources').innerHTML=`<p>${context.coverage.includedSources} of ${context.coverage.eligibleSources} eligible sources retrieved. Earlier thoughts are not treated as commitments.</p>`+context.sources.map(s=>`<p><a href="${esc(s.url)}">${esc(s.title)}</a> · ${esc(s.type)}</p>`).join('');}

 const receipt=entry.hiringReceipt||[];
 $('#hiring-receipt').innerHTML=receipt.map(r=>`<div class="hiring-result"><strong>${esc(r.title)} · updated</strong><p>${r.changes.map(c=>esc(c.after)).join('<br>')||'Dated note added.'}</p><button data-view-candidate="${esc(r.nodeId)}">Open card ↗</button></div>`).join('')+(receipt.length?'<button id="undo-hiring">Undo these hiring updates</button>':'')+(entry.hiringSkipped||[]).concat(entry.proposal.hiringQuestions||[]).map(q=>`<p class="hiring-question">${esc(q)}</p>`).join('');
 $('#thought-perspectives').innerHTML=(entry.proposal.perspectives||[]).map(p=>`<section class="perspective"><h3>${esc(p.angle)}</h3><p>${esc(p.thought)}</p><p class="angle-question">${esc(p.question)}</p></section>`).join('');
 $('.journal-apply-row').hidden=!(entry.proposal.updates||[]).length;
}
$('#hiring-receipt').onclick=async e=>{
 const view=e.target.closest('[data-view-candidate]');if(view){const target=node(view.dataset.viewCandidate);if(target){jdialog.close();focusNode(target);}return;}
 if(e.target.id!=='undo-hiring'||!activeEntry||journalBusy)return;
 const receipt=activeEntry.hiringReceipt||[];
 if(receipt.some(r=>node(r.nodeId)?.body!==r.afterBody)){journalError('A card was edited after this update. Its newer notes are preserved; edit that card directly.');return;}
 checkpoint();for(const r of receipt)node(r.nodeId).body=r.beforeBody;
 activeEntry.hiringReceipt=[];activeEntry.hiringApplied=false;changed();render();showProposal(activeEntry);journalHistory();await save();
};

$('#company-context').onchange=()=>{if(activeEntry&&!journalBusy){activeEntry.contextScope=scope();changed();}};
const reviseId=new URLSearchParams(location.search).get('revise');if(reviseId){$('#revision-note').hidden=false;$('#revision-note').textContent='This correction will supersede the earlier entry in AI context. The original remains in your Story.';}

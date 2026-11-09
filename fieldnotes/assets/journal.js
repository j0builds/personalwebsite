'use strict';
let journalBusy=false,activeEntry=null,journalMode="journal",editorVersion=0;

const draftKey=()=>journalMode==='think'?'thoughtDraft':'journalDraft';
const synthesisLabel=()=>journalMode==='think'?'Explore angles →':'Save & update cards →';
const jdialog=$('#journal-dialog');
const scope=()=>$('#company-context').checked?'company':'personal';
function createEntry(text){const priorId=new URLSearchParams(location.search).get('revise');return {id:id(),date:localDate(),createdAt:new Date().toISOString(),mode:journalMode,text,contextScope:scope(),supersedes:(board.journalEntries||[]).some(e=>e.id===priorId)?priorId:undefined,proposal:null,applied:false};}
function syncScope(entry){entry.contextScope=scope();}

$('#toggle-tools').onclick=()=>{const active=document.body.classList.toggle('editing');$('#toggle-tools').setAttribute('aria-pressed',String(active));$('#toggle-tools').setAttribute('aria-label',active?'Hide board tools':'Show board tools');renderNodes();};
function journalError(message){$('#journal-error').hidden=!message;$('#journal-error').textContent=message;}
function localDate(){return new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});}
let archiveFilter='all',archiveEntryId=null;
function journalHistory(){
 const query=($('#journal-search').value||'').toLowerCase();const savedIds=typeof lastSyncedBoard==='undefined'?null:new Set((lastSyncedBoard?.journalEntries||[]).map(e=>e.id));const all=(board.journalEntries||[]).filter(e=>!savedIds||savedIds.has(e.id));
 const entries=all.filter(e=>archiveFilter==='all'||(e.mode||'journal')===archiveFilter).filter(e=>[e.text,e.date,e.proposal?.summary||''].join(' ').toLowerCase().includes(query));
 $('#archive-count').textContent=String(all.length);
 $('#archive-results').textContent=entries.length+' '+(entries.length===1?'entry':'entries');
 $('#journal-entries').innerHTML=entries.slice().reverse().map(e=>`<button class="archive-row" data-reflection="${esc(e.id)}"><span class="archive-row-meta">${esc(e.date)} · ${e.mode==='think'?'Think':'Journal'}${e.contextScope==='personal'?' · Personal':''}</span><span class="archive-row-title">${esc(e.text.split('\n').find(x=>x.trim())?.slice(0,100)||'Untitled entry')}</span><span class="archive-row-preview">${esc(e.text.slice(0,180))}</span><span class="archive-row-arrow" aria-hidden="true">↗</span></button>`).join('')||'<p class="archive-empty">'+(query?'No entries match. Try another word.':'Nothing here yet. Save a little of today.')+'</p>';
}
function closeArchive(){ jdialog.setAttribute('aria-labelledby','journal-heading');$('#writer-page').hidden=false;$('#journal-history').hidden=true;$('#open-archive').setAttribute('aria-expanded','false');$('#open-archive').focus(); }
$('#open-archive').onclick=()=>{journalHistory();$('#archive-reading').hidden=true;$('#archive-browse').hidden=false;$('#journal-history').hidden=false;jdialog.setAttribute('aria-labelledby','archive-heading');$('#writer-page').hidden=true;jdialog.scrollTop=0;$('#open-archive').setAttribute('aria-expanded','true');$('#journal-search').focus();};
$('#close-archive').onclick=closeArchive;
$('#archive-back').onclick=()=>{$('#archive-reading').hidden=true;$('#archive-browse').hidden=false;$('#journal-search').focus();};
$('.archive-filters').onclick=e=>{const b=e.target.closest('[data-archive-filter]');if(!b)return;archiveFilter=b.dataset.archiveFilter;for(const el of $('.archive-filters').querySelectorAll('button'))el.setAttribute('aria-pressed',String(el===b));journalHistory();};
function entryArchived(entry,version){
 journalHistory();$('#archive-confirmation').textContent='Saved to archive';
 // Only clear the exact submitted draft. Typing while a save is in flight wins.
 if(editorVersion===version){editorVersion++;board[draftKey()]='';$('#daily-entry').value='';activeEntry=null;$('#journal-result').hidden=true;changed();void save();}
 const target=$('#open-archive');
 if(!$('#journal-history').hidden)return;
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 if(!target.animate)return;
 target.animate([{opacity:.4},{opacity:1}],{duration:650,easing:'ease-out'});
 const from=$('#save-entry').getBoundingClientRect(),to=target.getBoundingClientRect();
 const paper=document.createElement('span');paper.className='archive-flight';paper.setAttribute('aria-hidden','true');paper.style.left=(from.left+from.width/2)+'px';paper.style.top=from.top+'px';jdialog.append(paper);
 const animation=paper.animate([{opacity:0,transform:'translate(-50%,0) scale(1)'},{opacity:1,offset:.15,transform:'translate(-50%,-12px) rotate(-6deg) scale(1)'},{opacity:0,transform:`translate(${to.left+to.width/2-from.left-from.width/2}px,${to.top-from.top}px) rotate(8deg) scale(.25)`}],{duration:650,easing:'cubic-bezier(.22,.68,0,1)'});
 animation.finished.catch(()=>{}).finally(()=>paper.remove());
}

$('#open-journal').onclick=()=>{if(!loaded)return;if(journalBusy){jdialog.showModal();return;}editorVersion++;$('#journal-date').textContent=localDate().toUpperCase();$('#daily-entry').value=board[draftKey()]||'';$('#journal-result').hidden=true;activeEntry=null;journalError('');$('#journal-search').value='';journalHistory();refreshAIStatus();jdialog.showModal();$('#daily-entry').focus();};
$('#close-journal').onclick=()=>jdialog.close();
$('#daily-entry').oninput=()=>{$('#archive-confirmation').textContent='';editorVersion++;board[draftKey()]=$('#daily-entry').value;$('#journal-result').hidden=true;activeEntry=null;changed();};
function showProposal(entry){activeEntry=entry;$('#journal-result').hidden=!entry.proposal;if(!entry.proposal)return;$('#journal-summary').textContent=entry.proposal.summary;renderReflectionExtras(entry);$('#journal-proposals').innerHTML=entry.proposal.updates.map((u,i)=>{const route=u.regionIds.map(r=>node(r)?.title).filter(Boolean).join(' · ')||'Unsorted';const prior=u.existingNodeId?node(u.existingNodeId):null;return `<article class="proposal"><label><input type="checkbox" data-update="${i}" ${entry.applied?'disabled':''} checked><div><div class="proposal-route">${esc(u.kind)} · ${esc(route)}${prior?' · append to '+esc(prior.title):''}</div><h3>${esc(u.title)}</h3><p>${esc(u.body)}</p></div></label><details><summary>From your entry</summary><p>${esc(u.evidence)}</p></details></article>`;}).join('');$('#apply-journal').disabled=!!entry.applied||!entry.proposal.updates.length;$('#apply-journal').textContent=entry.applied?'Already added':'Add to my map';}
$('#journal-entries').onclick=e=>{
 const b=e.target.closest('[data-reflection]');if(!b)return;const entry=board.journalEntries.find(e=>e.id===b.dataset.reflection);if(!entry)return;
 archiveEntryId=entry.id;$('#archive-notice').textContent='';$('#archive-entry-meta').textContent=entry.date+' · '+(entry.mode==='think'?'Think':'Journal')+(entry.contextScope==='personal'?' · Personal':'');
 $('#archive-entry-text').textContent=entry.text;
 $('#archive-reflection').hidden=!entry.proposal;$('#archive-reflection').open=false;
 $('#archive-reflection-text').textContent=[entry.proposal?.summary,...(entry.proposal?.perspectives||[]).map(p=>p.angle+'\n'+p.thought+'\n'+p.question)].filter(Boolean).join('\n\n');
 $('#archive-story').href='/story/entry/'+encodeURIComponent(entry.id);$('#archive-browse').hidden=true;$('#archive-reading').hidden=false;$('#archive-back').focus();
};
function aiStatus(message){$('#ai-status').textContent=message;}
function refreshAIStatus(){
 const latest=[...new Map(serverJobs.map(j=>[j.entryId,j])).values()];
 const active=latest.filter(j=>['queued','running','retrying'].includes(j.status));
 const failed=latest.filter(j=>j.status==='failed');
 if(pendingAIRequests.size){aiStatus('Saving entry and AI job…');return;}
 if(active.length){aiStatus('Saved · '+active.length+' AI '+(active.length===1?'update':'updates')+' running on your Mac · safe to close this tab');return;}
 if(failed.length){aiStatus('Entry saved · local AI needs a retry. Open the entry and choose Save & update cards.');return;}
 if(serverJobs.some(j=>j.status==='completed'))aiStatus('Saved · AI updates ready in Archive');
 if(activeEntry){const current=board.journalEntries?.find(e=>e.id===activeEntry.id);if(current&&current.text===$('#daily-entry').value.trim()&&(current.mode||'journal')===journalMode)showProposal(current);}
}
function queueSynthesis(entry){
 if(![...pendingAIRequests.values()].some(r=>r.entryId===entry.id)){
  const request={id:id(),entryId:entry.id};pendingAIRequests.set(request.id,request);
 }
 changed();refreshAIStatus();
}
function captureEntry(){
 const text=$('#daily-entry').value.trim();if(!text)throw Error('A word, a sentence, a little of today. Start anywhere.');
 board.journalEntries=board.journalEntries||[];
 let entry=board.journalEntries.find(e=>e.text===text&&(e.mode||'journal')===journalMode);
 if(!entry){entry=createEntry(text);board.journalEntries.push(entry);}
 syncScope(entry);board[draftKey()]=$('#daily-entry').value;changed();return entry;
}
$('#synthesize').onclick=async()=>{
 if(!loaded)return;const version=editorVersion;
 try{journalError('');const entry=captureEntry();queueSynthesis(entry);activeEntry=entry;await saveThrough(changeVersion);entryArchived(entry,version);}
 catch(e){journalError(e.message);}
};
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
  entryArchived(entry,version);
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
 $('#journal-dialog .journal-disclosure:not(#ai-status):not(#revision-note)').textContent=mode==='think'?'Explore angles uses this thought and relevant company history. Thinking stays exploratory; it won’t change hiring cards.':'Saved company entries become context for future reflections. AI updates clearly named hiring cards when requested.';
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

$('#writer-retry').onclick=()=>save();
$('#writer-backup').onclick=()=>{const a=document.createElement('a');const url=URL.createObjectURL(new Blob([$('#daily-entry').value],{type:'text/plain'}));a.href=url;a.download='fieldnotes-unsaved-draft.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);};

$('#archive-continue').onclick=()=>{
 const entry=board.journalEntries.find(e=>e.id===archiveEntryId);if(!entry)return;
 if($('#daily-entry').value.trim()&&$('#daily-entry').value.trim()!==entry.text){$('#archive-notice').textContent='You have a draft in the writer. Save it first; it has been kept exactly as you left it.';return;}
 closeArchive();setJournalMode(entry.mode||'journal');$('#daily-entry').value=entry.text;$('#company-context').checked=entry.contextScope!=='personal';showProposal(entry);$('#daily-entry').focus();
};

jdialog.addEventListener?.('cancel',e=>{if(!$('#journal-history').hidden){e.preventDefault();closeArchive();}});

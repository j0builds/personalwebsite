'use strict';
const $=s=>document.querySelector(s), canvas=$('#canvas'),world=$('#world');
let board,library,revision=0,selected=null,selectedEdge=null,tool='select',linkFrom=null,gesture=null,space=false;
let history=[],future=[],saving=false,pending=false,dirty=false,conflict=false,saveTimer,editTimer,loaded=false;
const id=()=>crypto.randomUUID();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const node=key=>board.nodes.find(n=>n.id===key);
function status(text,kind=''){const e=$('#status');e.textContent=text;e.className='status '+kind;const js=$('#journal-save');if(js)js.textContent=text;}
function error(text){$('#error').textContent=text;$('#error').hidden=!text;}
function snapshot(){return JSON.stringify(board);}
function checkpoint(){history.push(snapshot());if(history.length>100)history.shift();future=[];updateHistory();}
function updateHistory(){$('#undo').disabled=!history.length;$('#redo').disabled=!future.length;}
function changed(){dirty=true;status('Unsaved changes…','dirty');clearTimeout(saveTimer);saveTimer=setTimeout(save,350);}
async function save(){
 clearTimeout(saveTimer);if(conflict||!loaded)return;if(saving){pending=true;return;}if(!dirty)return;
 saving=true;pending=false;$('#retry').hidden=true;const sent=snapshot();status('Saving privately…','dirty');
 try{const r=await fetch('/api/board',{method:'POST',headers:{'Content-Type':'application/json','X-Atlas-Write':'1'},body:JSON.stringify({revision,board:JSON.parse(sent)})});const result=await r.json();if(!r.ok){if(r.status===409)conflict=true;throw Error(result.error||'Save failed');}
 revision=result.revision;dirty=snapshot()!==sent;status(dirty?'Saving latest changes…':'Saved privately · '+new Date(result.savedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),dirty?'dirty':'');error('');
 }catch(e){dirty=true;$('#retry').hidden=conflict;status('Not saved · export a backup','failed');error(e.message+' Your changes remain in this window.');pending=false;
 }finally{saving=false;if(!conflict&&dirty&&pending)setTimeout(save,50);}
}
window.addEventListener('beforeunload',e=>{if(dirty||saving){e.preventDefault();e.returnValue='';}});
window.addEventListener('online',()=>{if(dirty&&!conflict)save();});
function setTool(next){tool=next;linkFrom=null;for(const t of ['select','pan','link']){const b=$('#'+t+'-tool');b.classList.toggle('active',t===tool);b.setAttribute('aria-pressed',String(t===tool));}canvas.classList.toggle('connecting',tool==='link');$('#hint').textContent=tool==='link'?'Click a source card, then a destination. Escape cancels.':tool==='pan'?'Drag anywhere to pan. Scroll or use + / − to zoom.':'Drag cards · drag empty space to pan · scroll to zoom';renderNodes();}
function transform(){document.documentElement.style.setProperty('--zoom',board.view.z);world.style.transform=`translate(${board.view.x}px,${board.view.y}px) scale(${board.view.z})`;canvas.style.backgroundSize=`${24*board.view.z}px ${24*board.view.z}px`;canvas.style.backgroundPosition=`${board.view.x}px ${board.view.y}px`;$('#zoom-level').textContent=Math.round(board.view.z*100)+'%';}
function worldPoint(clientX,clientY){const r=canvas.getBoundingClientRect();return {x:(clientX-r.left-board.view.x)/board.view.z,y:(clientY-r.top-board.view.y)/board.view.z};}
function zoom(factor,cx,cy){const r=canvas.getBoundingClientRect();cx=cx??r.left+r.width/2;cy=cy??r.top+r.height/2;const p=worldPoint(cx,cy);const z=Math.max(.15,Math.min(3,board.view.z*factor));board.view={x:cx-r.left-p.x*z,y:cy-r.top-p.y*z,z};transform();changed();}
function fit(){if(!board.nodes.length)return;const xs=board.nodes.map(n=>n.x),ys=board.nodes.map(n=>n.y);const minX=Math.min(...xs),minY=Math.min(...ys),maxX=Math.max(...xs)+260,maxY=Math.max(...ys)+180;const w=canvas.clientWidth,h=canvas.clientHeight;const z=Math.max(.15,Math.min(1.2,(w-100)/(maxX-minX),(h-130)/(maxY-minY)));board.view={x:(w-(maxX-minX)*z)/2-minX*z,y:(h-(maxY-minY)*z)/2-minY*z,z};transform();changed();}
function focusNode(n){selected=n.id;selectedEdge=null;const z=Math.max(.65,board.view.z);board.view={z,x:canvas.clientWidth/2-(n.x+130)*z,y:canvas.clientHeight/2-(n.y+75)*z};render();changed();}
function renderNodes(){
 $('#nodes').innerHTML=board.nodes.map(n=>`<article class="node ${selected===n.id?'selected':''} ${linkFrom===n.id?'connect-source':''}" data-id="${esc(n.id)}" data-kind="${esc(n.kind)}" style="left:${n.x}px;top:${n.y}px"><div class="stripe"></div><div class="node-content"><div class="node-top"><span>${esc(n.kind)}</span><span>${n.kind==='region'?(n.methods||[]).length+' methods':''}</span></div><div class="node-title">${esc(n.title||'Untitled')}</div><div class="node-body">${esc(n.body)}</div></div><button class="node-open" data-open="${esc(n.id)}" aria-label="Open ${esc(n.title)}">⋯</button></article>`).join('');
 renderEdges();
}
function renderEdges(){
 const height=key=>{const e=Array.from($('#nodes').children).find(e=>e.dataset.id===key);return e?.offsetHeight||150;};
 $('#edges').innerHTML=board.edges.map(e=>{const a=node(e.from),b=node(e.to);if(!a||!b)return '';const x1=a.x+130,y1=a.y+height(a.id)/2,x2=b.x+130,y2=b.y+height(b.id)/2;const dx=x2-x1,dy=y2-y1;const horizontal=Math.abs(dx)>Math.abs(dy);const ax=horizontal?a.x+(dx>=0?260:0):x1,ay=horizontal?y1:a.y+(dy>=0?height(a.id):0),bx=horizontal?b.x+(dx>=0?0:260):x2,by=horizontal?y2:b.y+(dy>=0?0:height(b.id));const path=horizontal?`M ${ax} ${ay} C ${(ax+bx)/2} ${ay}, ${(ax+bx)/2} ${by}, ${bx} ${by}`:`M ${ax} ${ay} C ${ax} ${(ay+by)/2}, ${bx} ${(ay+by)/2}, ${bx} ${by}`;return `<g data-edge="${esc(e.id)}"><path class="edge ${selectedEdge===e.id?'selected':''}" d="${path}"/><path class="hit" d="${path}"/><text x="${(ax+bx)/2}" y="${(ay+by)/2-8}" text-anchor="middle">${esc(e.label||'connects')}</text></g>`;}).join('');
}
function renderNav(){$('#regions').innerHTML=board.nodes.filter(n=>n.kind==='region').map(n=>`<button data-jump="${esc(n.id)}">${esc(n.title)}</button>`).join('');}
function renderInspector(){
 const n=node(selected),e=board.edges.find(e=>e.id===selectedEdge);$('#inspector').hidden=!n&&!e;$('#edit-form').hidden=!n;$('#edge-form').hidden=!e;$('#frameworks').replaceChildren();$('#relations').replaceChildren();if(!n&&!e)return;
 if(e){$('#edge-label').value=e.label||'';$('#relations').textContent=`${node(e.from).title} → ${node(e.to).title}`;return;}
 $('#title').value=n.title;$('#body').value=n.body;$('#kind').value=n.kind;$('#node-x').value=Math.round(n.x);$('#node-y').value=Math.round(n.y);$('#parent').innerHTML='<option value="">No region</option>'+board.nodes.filter(r=>r.kind==='region'&&r.id!==n.id).map(r=>`<option value="${esc(r.id)}">${esc(r.title)}</option>`).join('');$('#parent').value=n.region||'';$('#parent').disabled=n.kind==='region';
 const source=n.kind==='region'?n:node(n.region);const ids=source?.methods||[];
 if(ids.length){$('#frameworks').innerHTML='<div class="eyebrow">FRAMEWORK LIBRARY</div>'+ids.map(key=>{const m=library.methods.find(m=>m.id===key);return m?`<details><summary>${esc(m.title)}</summary><p>${esc(m.steps)}</p><p>${esc(m.limits)}</p><a href="${esc(m.source)}" target="_blank" rel="noopener noreferrer">Source ↗</a><p><button data-method="${esc(m.id)}">Add framework card</button></p></details>`:'';}).join('');}
 $('#relations').innerHTML='<div class="eyebrow">CONNECTIONS</div>'+board.edges.filter(e=>e.from===n.id||e.to===n.id).map(e=>`<button data-edge-select="${esc(e.id)}">${esc(e.label||'connects')} · ${esc(node(e.from===n.id?e.to:e.from)?.title)}</button>`).join('');
}
function render(){transform();renderNodes();renderNav();renderInspector();updateHistory();}
function select(key){selected=key;selectedEdge=null;renderNodes();renderInspector();}
function connect(key){if(!linkFrom){linkFrom=key;$('#hint').textContent='Now click the destination card';renderNodes();return;}if(linkFrom===key){linkFrom=null;renderNodes();return;}const exists=board.edges.some(e=>e.from===linkFrom&&e.to===key);if(!exists){checkpoint();const e={id:id(),from:linkFrom,to:key,label:''};board.edges.push(e);selectedEdge=e.id;selected=null;changed();}linkFrom=null;render();$('#hint').textContent='Connected. Click another source card, or choose Select.';}
canvas.addEventListener('pointerdown',e=>{
 if(e.button!==0&&e.button!==1)return;if(e.target.closest('.zoom'))return;
 const card=e.target.closest('.node'),edge=e.target.closest('[data-edge]');
 if(e.target.closest('[data-open]')){e.stopPropagation();if(tool==='link')connect(card.dataset.id);else select(card.dataset.id);return;}
 if(tool==='link'&&card){connect(card.dataset.id);return;}
 if(edge&&!card&&tool!=='pan'&&!space){selectedEdge=edge.dataset.edge;selected=null;render();return;}
 const drag=card&&tool!=='pan'&&!space&&e.button!==1;
 if(drag){selected=card.dataset.id;selectedEdge=null;renderNodes();renderInspector();}
 else if(!card){selected=null;selectedEdge=null;renderNodes();renderInspector();}
 const n=drag?node(selected):null;
 gesture={type:drag?'node':'pan',id:n?.id,x:e.clientX,y:e.clientY,ox:n?n.x:board.view.x,oy:n?n.y:board.view.y,before:snapshot(),moved:false};
 canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';
});
canvas.addEventListener('pointermove',e=>{if(!gesture)return;const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.hypot(dx,dy)>3)gesture.moved=true;if(!gesture.moved)return;
 if(gesture.type==='node'){const n=node(gesture.id);n.x=Math.max(-100000,Math.min(100000,gesture.ox+dx/board.view.z));n.y=Math.max(-100000,Math.min(100000,gesture.oy+dy/board.view.z));const card=Array.from($('#nodes').children).find(el=>el.dataset.id===n.id);card.style.left=n.x+'px';card.style.top=n.y+'px';renderEdges();}
 else{board.view.x=gesture.ox+dx;board.view.y=gesture.oy+dy;transform();}
});
function endGesture(){if(!gesture)return;if(gesture.moved){if(gesture.type==='node'){history.push(gesture.before);if(history.length>100)history.shift();future=[];renderInspector();updateHistory();}changed();}gesture=null;canvas.style.cursor='';}
canvas.addEventListener('pointerup',endGesture);canvas.addEventListener('pointercancel',endGesture);
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(Math.exp(-e.deltaY*.002),e.clientX,e.clientY);},{passive:false});
function add(kind,method){checkpoint();const rect=canvas.getBoundingClientRect();const p=worldPoint(rect.left+rect.width/2,rect.top+rect.height/2);const current=node(selected);const parent=current?.kind==='region'?current.id:current?.region||'';const n={id:id(),kind,title:method?.title||(kind==='region'?'New region':'New idea'),body:method?.steps||'',x:p.x-130+(current?290:0),y:p.y-75+(current?60:0),region:kind==='region'?'':parent,methods:method?[]:undefined};if(kind==='region')n.methods=[];board.nodes.push(n);if(parent&&kind!=='region')board.edges.push({id:id(),from:parent,to:n.id,label:'includes'});selected=n.id;selectedEdge=null;setTool('select');render();$('#title').focus();$('#title').select();changed();}
$('#select-tool').onclick=()=>setTool('select');$('#pan-tool').onclick=()=>setTool('pan');$('#link-tool').onclick=()=>setTool('link');$('#add-idea').onclick=()=>add('idea');$('#add-region').onclick=()=>add('region');$('#zoom-in').onclick=()=>zoom(1.2);$('#zoom-out').onclick=()=>zoom(1/1.2);$('#fit').onclick=fit;
$('#regions').onclick=e=>{const b=e.target.closest('[data-jump]');if(b)focusNode(node(b.dataset.jump));};$('#frameworks').onclick=e=>{const b=e.target.closest('[data-method]');if(b)add('method',library.methods.find(m=>m.id===b.dataset.method));};$('#relations').onclick=e=>{const b=e.target.closest('[data-edge-select]');if(b){selected=null;selectedEdge=b.dataset.edgeSelect;render();}};
$('#close-inspector').onclick=()=>{clearTimeout(editTimer);selected=null;selectedEdge=null;render();};
function applyNode(){const n=node(selected);if(!n)return;const patch={title:$('#title').value,body:$('#body').value,kind:$('#kind').value,region:$('#kind').value==='region'?'':$('#parent').value,x:Number($('#node-x').value),y:Number($('#node-y').value)};if(!Number.isFinite(patch.x)||!Number.isFinite(patch.y)||Math.abs(patch.x)>100000||Math.abs(patch.y)>100000){error('Coordinates must be within ±100,000.');return;}if(Object.entries(patch).every(([k,v])=>n[k]===v))return;checkpoint();Object.assign(n,patch);renderNodes();renderNav();changed();}
$('#edit-form').onsubmit=e=>{e.preventDefault();clearTimeout(editTimer);applyNode();};
// Persist text edits as they are typed; Apply is an explicit immediate save affordance.
$('#edit-form').addEventListener('input',()=>{applyNode();});
$('#edge-form').onsubmit=e=>{e.preventDefault();const edge=board.edges.find(x=>x.id===selectedEdge);if(edge){checkpoint();edge.label=$('#edge-label').value;renderEdges();changed();}};
$('#edge-label').oninput=()=>{const edge=board.edges.find(x=>x.id===selectedEdge);if(edge){checkpoint();edge.label=$('#edge-label').value;renderEdges();changed();}};
$('#nodes').addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b&&e.detail===0){if(tool==='link')connect(b.dataset.open);else select(b.dataset.open);}});
function remove(){if(!selected&&!selectedEdge)return;checkpoint();if(selected){board.nodes=board.nodes.filter(n=>n.id!==selected);board.edges=board.edges.filter(e=>e.from!==selected&&e.to!==selected);board.nodes.forEach(n=>{if(n.region===selected)n.region='';});}else board.edges=board.edges.filter(e=>e.id!==selectedEdge);selected=null;selectedEdge=null;render();changed();}
$('#delete').onclick=remove;
function undo(){if(!history.length)return;future.push(snapshot());board=JSON.parse(history.pop());selected=null;selectedEdge=null;render();changed();}
function redo(){if(!future.length)return;history.push(snapshot());board=JSON.parse(future.pop());selected=null;selectedEdge=null;render();changed();}
$('#undo').onclick=undo;$('#redo').onclick=redo;
window.addEventListener('keydown',e=>{const editing=/INPUT|TEXTAREA|SELECT/.test(e.target.tagName);if(editing)return;if(e.code==='Space'){space=true;e.preventDefault();}if(e.key==='Escape'){linkFrom=null;setTool('select');}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();}if((e.key==='Delete'||e.key==='Backspace')&&(selected||selectedEdge)){e.preventDefault();remove();}if(selected&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();checkpoint();const n=node(selected),step=e.shiftKey?50:10;n.x+=e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0;n.y+=e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0;render();changed();}});
window.addEventListener('keyup',e=>{if(e.code==='Space')space=false;});window.addEventListener('blur',()=>{space=false;endGesture();});
function download(){const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify({format:'company-atlas-whiteboard',exportedAt:new Date().toISOString(),board},null,2)],{type:'application/json'}));a.href=url;a.download='company-atlas-whiteboard.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
$('#retry').onclick=save;$('#export').onclick=download;$('#import').onclick=()=>$('#file').click();
function validateImport(b){if(!b||b.version!==2||!Array.isArray(b.nodes)||!Array.isArray(b.edges)||b.nodes.length>5000||b.edges.length>10000)throw Error('Invalid or oversized whiteboard.');const ids=new Set();const kinds=['region','idea','decision','question','experiment','principle','method'];for(const n of b.nodes){if(typeof n.id!=='string'||n.id.length>100||ids.has(n.id)||!kinds.includes(n.kind)||typeof n.title!=='string'||n.title.length>200||typeof n.body!=='string'||n.body.length>20000||!Number.isFinite(n.x)||!Number.isFinite(n.y)||Math.abs(n.x)>100000||Math.abs(n.y)>100000)throw Error('Invalid card in import.');ids.add(n.id);}for(const n of b.nodes)if(n.region&&!ids.has(n.region))throw Error('Missing parent region.');const eids=new Set();for(const e of b.edges){if(typeof e.id!=='string'||eids.has(e.id)||!ids.has(e.from)||!ids.has(e.to)||e.from===e.to||typeof e.label!=='string'||e.label.length>200)throw Error('Invalid connection in import.');eids.add(e.id);}return b;}
function migrateOld(old){if(!old||old.version!==1||!Array.isArray(old.custom)||!Array.isArray(old.notes))throw Error('Invalid earlier Atlas export.');const nodes=[];old.custom.forEach((r,i)=>nodes.push({id:r.id,kind:'region',title:r.title,body:r.question,x:80+i*340,y:1000,region:'',methods:[]}));const edges=[];old.notes.forEach((n,i)=>{nodes.push({id:n.id,kind:String(n.kind).toLowerCase(),title:n.title,body:(n.done?'[Resolved]\n':'')+n.body,x:80+(i%5)*300,y:1300+Math.floor(i/5)*230,region:n.region});edges.push({id:'old-'+n.id,from:n.region,to:n.id,label:'includes'});});return {version:2,nodes,edges};}
$('#file').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>10000000)throw Error('Import exceeds 10 MB.');const data=JSON.parse(await f.text());let incoming;if(data.format==='company-atlas-whiteboard')incoming=validateImport(data.board);else if(data.format==='joseph-company-atlas')incoming=migrateOld(data.board);else throw Error('Choose an Atlas JSON export.');
 const ids=new Set(board.nodes.map(n=>n.id)),eids=new Set(board.edges.map(e=>e.id));const additions=incoming.nodes.filter(n=>!ids.has(n.id));const merged={...board,nodes:[...board.nodes,...additions],edges:[...board.edges,...incoming.edges.filter(e=>!eids.has(e.id))]};validateImport(merged);const incomingJournal=incoming.journalEntries||[];if(!Array.isArray(incomingJournal)||incomingJournal.some(e=>!e||typeof e.id!=='string'||typeof e.text!=='string'||typeof e.date!=='string'||e.text.length>12000))throw Error('Invalid reflection history.');
 const journalById=new Map((board.journalEntries||[]).map(e=>[e.id,e]));for(const entry of incomingJournal)if(!journalById.has(entry.id))journalById.set(entry.id,entry);merged.journalEntries=[...journalById.values()];
 checkpoint();board=merged;render();fit();changed();error('Imported new cards, connections, and reflections. Existing IDs were kept; undo reverses this import.');
 }catch(err){error(err.message);}e.target.value='';};
(async()=>{try{const [a,b]=await Promise.all([fetch('/api/board'),fetch('/api/library')]);if(!a.ok||!b.ok)throw Error('Unable to open private storage');const record=await a.json();board=record.board;revision=record.revision;library=await b.json();loaded=true;render();status('Saved privately'+(record.savedAt?' · '+new Date(record.savedAt).toLocaleString():''));if(revision===0)fit();const params=new URLSearchParams(location.search);if(params.get('card')&&node(params.get('card')))focusNode(node(params.get('card')));else if(params.get('view')!=='map')$('#open-journal').click();}catch(e){status('Could not open board','failed');error(e.message+' Check your session and storage configuration, then reload.');}})();

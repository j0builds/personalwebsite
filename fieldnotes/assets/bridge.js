'use strict';
(()=>{
 const endpoint='http://127.0.0.1:8891',nativeFetch=window.fetch.bind(window);let key=sessionStorage.getItem('fieldnotes-local-key')||'';
 window.fetch=(input,options={})=>{const path=typeof input==='string'?input:'';if(path.startsWith('/api/')||path.startsWith('/story'))return nativeFetch(endpoint+path,{...options,headers:{...options.headers,Authorization:'Bearer '+key},cache:'no-store'});return nativeFetch(input,options);};
 const overlay=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;z-index:10000;background:#fafafa;display:grid;place-items:center';overlay.innerHTML='<form style="max-width:390px;padding:30px"><small>j0 / fieldnotes · ON YOUR MAC</small><h1 style="font:36px Georgia">A little space of your own.</h1><p style="line-height:1.7">Your writing stays on this computer. Start the Fieldnotes local server, then unlock it here.</p><label for="local-key">Local access key</label><input id="local-key" type="password" required autocomplete="current-password" style="display:block;width:100%;margin:18px 0;padding:12px;box-sizing:border-box"><button>Open fieldnotes →</button><p id="connect-error" role="alert"></p><p style="font-size:12px">No cloud AI or database. If asked, allow this site to connect to your local network.</p></form>';
 document.body.append(overlay);overlay.querySelector('input').value=key;
 function lock(){sessionStorage.removeItem('fieldnotes-local-key');location.href='/';}
 document.addEventListener('submit',e=>{if(e.target.getAttribute('action')==='/logout'){e.preventDefault();lock();}});
 document.addEventListener('click',async e=>{const a=e.target.closest('a');if(!a)return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname.startsWith('/api/context')){e.preventDefault();const r=await fetch(u.pathname+u.search);if(!r.ok){alert('Unlock your local journal first.');return;}const b=await r.blob();const link=document.createElement('a');link.href=URL.createObjectURL(b);link.download=u.searchParams.get('format')==='markdown'?'company-context.md':'company-context.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);}});
 async function open(){
  const error=overlay.querySelector('#connect-error');error.textContent='Connecting to your Mac…';
  try{const r=await fetch('/api/board');if(!r.ok){error.textContent='That local key did not match.';return;}await r.json();sessionStorage.setItem('fieldnotes-local-key',key);
   if(location.pathname.startsWith('/story')){const r=await fetch(location.pathname+location.search);if(!r.ok)throw Error();const html=await r.text();const doc=new DOMParser().parseFromString(html,'text/html');document.title=doc.title;document.body.innerHTML=doc.body.innerHTML;const css=document.createElement('link');css.rel='stylesheet';css.href='/story.css';document.head.append(css);return;}
   overlay.remove();for(const file of ['app.js','hiring.js','journal.js']){const s=document.createElement('script');s.src='/'+file;await new Promise((resolve,reject)=>{s.onload=resolve;s.onerror=reject;document.body.append(s);});}
  }catch{error.textContent='Cannot reach the local server. Open Start Fieldnotes on this Mac, then try again.';}
 }
 overlay.querySelector('form').onsubmit=e=>{e.preventDefault();key=overlay.querySelector('input').value.trim();open();};if(key)open();
})();

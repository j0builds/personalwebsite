'use strict';
// Three-way merge: independent edits combine; conflicting edits are never silently overwritten.
(()=>{
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 function merge(base,local,remote,path='board'){
  if(equal(local,base))return structuredClone(remote);
  if(equal(remote,base)||equal(local,remote))return structuredClone(local);
  if(Array.isArray(local)&&Array.isArray(remote)&&Array.isArray(base)&&['nodes','edges','journalEntries'].includes(path.split('.').at(-1))){
   const maps=[base,local,remote].map(xs=>new Map(xs.map(x=>[x.id,x])));
   const ids=new Set([...remote.map(x=>x.id),...local.map(x=>x.id)]);
   return [...ids].map(id=>merge(maps[0].get(id),maps[1].get(id),maps[2].get(id),path+'.'+id)).filter(x=>x!==undefined);
  }
  if(base&&local&&remote&&![base,local,remote].some(Array.isArray)&&[base,local,remote].every(x=>typeof x==='object')){
   const out={};for(const key of new Set([...Object.keys(base),...Object.keys(local),...Object.keys(remote)])){
    if(['__proto__','prototype','constructor'].includes(key))continue;
    const value=merge(base[key],local[key],remote[key],path+'.'+key);if(value!==undefined)out[key]=value;
   }return out;
  }
  throw Error('Concurrent edit at '+path+'. Export your changes before reloading.');
 }
 globalThis.fieldnotesMerge=merge;
})();

import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {createHandler} from '../server/handler.mjs';
import {issueSession,validSession,seal,unseal,COOKIE} from '../lib/security.mjs';
import {validateBoard,Conflict} from '../lib/store.mjs';
import {cleanResult} from '../lib/synthesis.mjs';
const key='test-only-not-a-deployed-access-key';
process.env.OWNER_ACCESS_HASH=createHash('sha256').update(key).digest('hex');process.env.SESSION_SECRET='a'.repeat(64);process.env.DATA_ENCRYPTION_KEY='b'.repeat(64);
const seed=JSON.parse(await readFile(new URL('../assets/seed.json',import.meta.url),'utf8'));
let record=structuredClone(seed);const handler=createHandler({readState:async()=>({record}),saveState:async(b,r)=>{if(r!==record.revision)throw new Conflict();record={board:b,revision:r+1,savedAt:new Date().toISOString()};return {revision:record.revision,savedAt:record.savedAt};},synthesize:async()=>({summary:'test',updates:[]})});
async function request(url,{method='GET',body,auth=false,origin='http://localhost:8890',headers={}}={}){const h={host:'localhost:8890',origin,...headers};if(auth)h.cookie=COOKIE+'='+issueSession();const req={url,method,body,headers:h};const out={headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;},end(s){this.body=s||'';}};await handler(req,out);return out;}
test('deny anonymous access to APIs, scripts, library, state and source',async()=>{for(const url of ['/api/board','/api/library','/api/synthesize','/app.js','/assets/seed.json','/assets/library.json','/lib/security.mjs']){const r=await request(url);assert.ok([303,401].includes(r.statusCode),url);assert.ok(!r.body.includes('Direction and strategy'));}});
test('login validates key, origin and secure cookie',async()=>{assert.equal((await request('/login',{method:'POST',body:'key=bad'})).statusCode,401);assert.equal((await request('/login',{method:'POST',body:'key='+key,origin:'https://evil.example'})).statusCode,403);const r=await request('/login',{method:'POST',body:'key='+key});assert.equal(r.statusCode,303);assert.match(r.headers['set-cookie'],/HttpOnly; Secure; SameSite=Strict/);});
test('session tamper, expiration and encryption tamper rejected',()=>{const t=issueSession();assert.ok(validSession(t));assert.equal(validSession(t+'x'),false);assert.equal(validSession(issueSession(Date.now()-9*3600_000)),false);const enc=seal({secret:'private text'});assert.ok(!enc.includes('private text'));assert.deepEqual(unseal(enc),{secret:'private text'});const edited=JSON.parse(enc);edited.tag=Buffer.alloc(16).toString('base64');assert.throws(()=>unseal(JSON.stringify(edited)));});
test('authorized save, conflict, CSRF, header checks and no-store',async()=>{const b=structuredClone(seed.board);b.journalDraft='fictional staging note';assert.equal((await request('/api/board',{method:'POST',auth:true,body:{revision:0,board:b}})).statusCode,403);assert.equal((await request('/api/board',{method:'POST',auth:true,origin:'https://evil.example',headers:{'x-atlas-write':'1'},body:{revision:0,board:b}})).statusCode,403);const r=await request('/api/board',{method:'POST',auth:true,headers:{'x-atlas-write':'1'},body:{revision:0,board:b}});assert.equal(r.statusCode,200);assert.equal((await request('/api/board',{method:'POST',auth:true,headers:{'x-atlas-write':'1'},body:{revision:0,board:b}})).statusCode,409);const read=await request('/api/board',{auth:true});assert.match(read.headers['cache-control'],/no-store/);assert.equal(JSON.parse(read.body).board.journalDraft,'fictional staging note');});
test('missing configuration locks all routes',async()=>{const save=process.env.SESSION_SECRET;delete process.env.SESSION_SECRET;assert.equal((await request('/login')).statusCode,503);process.env.SESSION_SECRET=save;});
test('schema rejects broken graph and oversized draft',()=>{const b=structuredClone(seed.board);b.edges.push({id:'broken',from:'missing',to:'R03',label:''});assert.throws(()=>validateBoard(b));assert.throws(()=>validateBoard({...seed.board,thoughtDraft:'x'.repeat(12001)}));});
test('thinking cannot produce mutations and ambiguous hiring is deferred',()=>{const entry='Alex will send samples.';const b={nodes:[{id:'a',title:'Alex One',candidateKey:'a',body:'',kind:'idea'},{id:'b',title:'Alex Two',candidateKey:'b',body:'',kind:'idea'}]};const p={summary:'test',updates:[],perspectives:[{angle:'Tools',thought:'Consider a trial',question:'What would you test?'}],hiringUpdates:[{nodeId:'a',mention:'Alex',note:entry,evidence:entry,fields:[]}]};assert.equal(cleanResult(p,entry,b,'think').hiringUpdates.length,0);assert.equal(cleanResult(p,entry,b,'journal').hiringUpdates.length,0);assert.equal(cleanResult(p,entry,b,'journal').hiringQuestions.length,1);});
test('context read token cannot read board, write, or retrieve personal sources',async()=>{
 process.env.CONTEXT_READ_TOKEN_HASH=createHash('sha256').update('test-reader').digest('hex');
 record.board.journalEntries=[{id:'allowed',date:'today',text:'Company note',mode:'think'},{id:'private',date:'today',text:'Personal secret',contextScope:'personal'}];
 const headers={authorization:'Bearer test-reader'};
 assert.equal((await request('/api/context',{headers})).statusCode,200);
 assert.equal((await request('/api/context/source/entry%3Aallowed',{headers})).statusCode,200);
 assert.equal((await request('/api/context/source/entry%3Aprivate',{headers})).statusCode,404);
 assert.equal((await request('/api/board',{headers})).statusCode,401);
 assert.equal((await request('/api/board',{method:'POST',headers,body:{}})).statusCode,401);
 assert.equal((await request('/story',{headers})).statusCode,303);
 delete process.env.CONTEXT_READ_TOKEN_HASH;
});

test('stale model evidence becomes a verbatim named-person note, never an inferred field change',()=>{
 const entry='Example Person: Stage: Interview. Next step: send portfolio.';
 const board={nodes:[{id:'person',title:'Example Person',candidateKey:'example',body:'Stage: Considering'}]};
 const raw={summary:'Considering',updates:[],hiringUpdates:[{nodeId:'person',mention:'Example Person',note:'Considering',evidence:'Stage: Considering',fields:[]}]};
 const result=cleanResult(raw,entry,board,'journal');assert.equal(result.hiringUpdates.length,1);assert.equal(result.hiringUpdates[0].evidence,entry);assert.deepEqual(result.hiringUpdates[0].fields,[]);assert.equal(result.summary,entry);
 assert.equal(cleanResult(raw,'Example Personson sent a note.',board,'journal').hiringUpdates.length,0);
 assert.equal(cleanResult(raw,entry,board,'think').hiringUpdates.length,0);
});

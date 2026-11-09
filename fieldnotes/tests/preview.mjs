// Local-only browser QA. No deployed credentials or real journal data.
import http from 'node:http';import {createHash} from 'node:crypto';import {readFile} from 'node:fs/promises';import {createHandler} from '../server/handler.mjs';import {Conflict} from '../lib/store.mjs';
if(process.env.VERCEL)throw Error('Test preview cannot run on Vercel');
process.env.OWNER_ACCESS_HASH=createHash('sha256').update('local-fictional-preview-only').digest('hex');process.env.SESSION_SECRET='p'.repeat(64);process.env.DATA_ENCRYPTION_KEY='c'.repeat(64);
let record=JSON.parse(await readFile(new URL('../assets/seed.json',import.meta.url),'utf8'));
const handler=createHandler({readState:async()=>({record}),saveState:async(board,revision)=>{if(revision!==record.revision)throw new Conflict();record={board,revision:revision+1,savedAt:new Date().toISOString()};return {revision:record.revision,savedAt:record.savedAt};},synthesize:async()=>{throw Error('AI not enabled in local security preview');}});
http.createServer(handler).listen(8890,'127.0.0.1',()=>console.log('Isolated private staging QA at http://127.0.0.1:8890'));

// Explicit, read-only context export for local agents. No remote destination.
import {readFile} from 'node:fs/promises';import {homedir} from 'node:os';import {join} from 'node:path';
const credentials=JSON.parse(await readFile(join(homedir(),'.fieldnotes-private','local-credentials.json'),'utf8'));
const url=new URL('http://127.0.0.1:8891/api/context');url.searchParams.set('q',process.argv.slice(2).join(' ').slice(0,2000));
const r=await fetch(url,{headers:{Authorization:`Bearer ${credentials.ownerKey}`},redirect:'error',signal:AbortSignal.timeout(20000)});
if(!r.ok)throw Error(`Local context unavailable (${r.status}); do not guess company facts.`);
process.stdout.write(JSON.stringify(await r.json(),null,2)+'\n');

// Read-only bridge for agents. Configure env privately; never put bearer tokens in URLs.
const base=process.env.FIELDNOTES_CONTEXT_URL,token=process.env.FIELDNOTES_CONTEXT_TOKEN;
if(!base||!token)throw Error('Set FIELDNOTES_CONTEXT_URL and FIELDNOTES_CONTEXT_TOKEN through your secret manager.');
const url=new URL('/api/context',base);if(url.protocol!=='https:')throw Error('Hosted context requires HTTPS.');
url.searchParams.set('q',process.argv.slice(2).join(' ').slice(0,2000));
const r=await fetch(url,{headers:{Authorization:`Bearer ${token}`},redirect:'error',signal:AbortSignal.timeout(20000)});
if(!r.ok)throw Error(`Private context unavailable (${r.status}); do not guess company facts.`);
process.stdout.write(JSON.stringify(await r.json(),null,2)+'\n');

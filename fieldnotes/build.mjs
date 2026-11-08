import {mkdir,copyFile,rm} from 'node:fs/promises';
await rm('public',{recursive:true,force:true});await mkdir('public',{recursive:true});
for(const name of ['index.html','app.js','hiring.js','merge.js','journal.js','style.css','story.css','bridge.js'])await copyFile('assets/'+name,'public/'+name);
await (await import('node:fs/promises')).writeFile('public/robots.txt','User-agent: *\nDisallow: /\n');

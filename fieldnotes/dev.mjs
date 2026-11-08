import http from 'node:http';
import handler from './api/index.mjs';
http.createServer(handler).listen(8890,'127.0.0.1',()=>console.log('Private staging preview: http://127.0.0.1:8890'));

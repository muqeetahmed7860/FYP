import 'dotenv/config';
import {resolve} from 'node:path';
import express from 'express';
import {app} from './app';
import {db} from './db';
if(process.argv.includes('--production')){app.use(express.static(resolve('dist')));app.get('/{*path}',(_q,s)=>s.sendFile(resolve('dist/index.html')));}else{const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);}
const port=Number(process.env.PORT??3000);await db.$connect();const server=app.listen(port,'127.0.0.1',()=>console.log(`HisabKetab AI: http://127.0.0.1:${port}`));for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>{void db.$disconnect().then(()=>process.exit(0));}));

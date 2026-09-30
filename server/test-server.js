import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createApp } from './app.js';
import { hashPassword } from './auth.js';
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'rbukhari-browser-'));
fs.writeFileSync(path.join(directory,'admin.json'),JSON.stringify({email:'admin@example.test',passwordHash:await hashPassword('Browser-test-only-123!')}));
const server=createApp({directory,limits:false,origins:['http://localhost:5174']}).listen(3002,'127.0.0.1',()=>console.log('Isolated browser test API ready.'));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));

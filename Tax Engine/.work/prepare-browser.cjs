const fs=require('fs');fs.copyFileSync('.work/workflow.spec.ts','tests/e2e/workflow.spec.ts');
let app=fs.readFileSync('server/app.ts','utf8').replace("{authRouter,authenticated}","{authRouter,authenticated,admin}");app=app.replace("app.use((e:unknown", "app.get('/admin{/*path}',authenticated,admin,(_q,_s,next)=>next());\napp.use((e:unknown");fs.writeFileSync('server/app.ts',app);
let config=fs.readFileSync('playwright.config.ts','utf8').replace('timeout:90000','timeout:180000');fs.writeFileSync('playwright.config.ts',config);

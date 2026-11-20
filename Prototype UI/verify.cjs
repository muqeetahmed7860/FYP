const { chromium } = require('C:/Users/Hp/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5173');
 await page.screenshot({path:'desktop-preview.png',fullPage:true});
 const routes=['home','transactions','budget','adaptive','recurring','goals','allocation','emergency','insights','health','assets','tax','reasoning','reconciliation','report','assistant','notifications','settings','admin','scan','login','signup','otp','forgot','onboarding'];
 const overflow=[];
 for(const width of [1440,768,375,320]){
  await page.setViewportSize({width,height:900});
  for(const r of routes){await page.goto('http://localhost:5173/#'+r);await page.waitForTimeout(25);const wide=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(wide)overflow.push(`${width}: ${r}`);}
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://localhost:5173/#home');
 await page.getByRole('button',{name:'Add transaction',exact:true}).click();
 await page.getByRole('button',{name:'Manual entry',exact:true}).click();
 await page.locator('[name=amount]').fill('1000');await page.locator('[name=merchant]').fill('Verification expense');
 await page.locator('#transaction-form button[type=submit]').click();
 assert.equal(await page.evaluate(()=>totals().balance),124500);
 assert.equal(await page.evaluate(()=>totals().expenses),73400);
 await page.goto('http://localhost:5173/#transactions');
 await page.locator('#transaction-search').fill('Verification expense');assert.equal(await page.locator('tbody tr').count(),1);
 await page.locator('tbody .transaction-row').click();await page.getByRole('button',{name:'Duplicate',exact:true}).click();assert.equal(await page.evaluate(()=>totals().expenses),74400);
 await page.locator('tbody .transaction-row').first().click();await page.getByRole('button',{name:'Delete',exact:true}).click();await page.getByRole('button',{name:'Delete transaction',exact:true}).click();assert.equal(await page.evaluate(()=>totals().expenses),73400);
 await page.goto('http://localhost:5173/#home');await page.getByRole('button',{name:'Record a voice expense'}).click();await page.getByRole('button',{name:'Play sample recording'}).click();await page.waitForTimeout(2700);await page.getByRole('button',{name:'Confirm all'}).click();assert.equal(await page.evaluate(()=>totals().expenses),76900);
 await page.goto('http://localhost:5173/#scan');await page.getByRole('button',{name:'Try sample receipt'}).click();await page.waitForTimeout(1300);await page.getByRole('button',{name:'Confirm transaction'}).click();assert.equal(await page.evaluate(()=>totals().expenses),77703);
 await page.goto('http://localhost:5173/#goals');await page.getByRole('button',{name:'Create goal'}).click();await page.locator('[name=name]').fill('Laptop');await page.locator('[name=target]').fill('200000');await page.getByRole('button',{name:'Save goal',exact:true}).click();assert.equal(await page.evaluate(()=>state.goals.length),4);
 await page.goto('http://localhost:5173/#allocation');await page.getByRole('button',{name:'Modify allocation'}).click();await page.locator('[name=allocation0]').fill('50000');await page.getByRole('button',{name:'Save allocation'}).click();assert.match(await page.locator('#allocation-error').innerText(),/must add up/);await page.getByRole('button',{name:'Close dialog'}).click();
 await page.goto('http://localhost:5173/#assistant');await page.locator('[name=message]').fill('How much can I spend this week?');await page.getByRole('button',{name:'Send',exact:true}).click();await page.waitForTimeout(750);assert.equal(await page.locator('.message').count(),2);
 await page.goto('http://localhost:5173/#signup');await page.locator('[name=name]').fill('Demo Student');await page.locator('[name=email]').fill('demo@example.com');await page.locator('[name=password]').fill('testing123');await page.locator('input[type=checkbox]').check();await page.getByRole('button',{name:'Create account',exact:true}).click();await page.locator('[name=otp]').fill('123456');await page.getByRole('button',{name:'Verify & continue'}).click();await page.getByRole('button',{name:'Let’s get started'}).click();assert.match(await page.locator('h1').innerText(),/Demo/);
 await page.setViewportSize({width:375,height:850});await page.goto('http://localhost:5173/#home');await page.screenshot({path:'mobile-preview.png',fullPage:true});
 console.log(JSON.stringify({routesChecked:routes.length,widths:[1440,768,375,320],overflow,errors,interactionTests:'passed'},null,2));
 await browser.close();if(errors.length||overflow.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});

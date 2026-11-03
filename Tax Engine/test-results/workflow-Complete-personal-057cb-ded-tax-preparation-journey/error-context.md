# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow.spec.ts >> Complete personal finance and guided tax preparation journey
- Location: tests\e2e\workflow.spec.ts:5:1

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.fill: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByLabel('Full name', { exact: true })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - strong [ref=e10]:
      - text: hisabketab
      - generic [ref=e11]: YOUR MONEY. MADE SIMPLE.
    - heading "A little clarity. Every day." [level=1] [ref=e12]: A little clarity.Every day.
    - paragraph [ref=e13]: Track your spending, make room for your goals and prepare for tax time — one simple step at a time.
    - generic [ref=e14]:
      - paragraph [ref=e15]: Your financial records stay private
      - paragraph [ref=e19]: Every number has a clear explanation
      - paragraph [ref=e21]: An experience that grows with you
    - generic [ref=e25]: Made for life in Pakistan · PKR
  - generic [ref=e26]:
    - generic [ref=e27]: WELCOME TO HISABKETAB
    - heading "Create your account" [level=2] [ref=e28]
    - paragraph [ref=e29]: A fresh start for your finances.
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]: Full name *
          - textbox "Full name *" [ref=e34]
        - generic [ref=e35]:
          - generic [ref=e36]: Email *
          - textbox "Email *" [ref=e37]
        - generic [ref=e38]:
          - generic [ref=e39]: Password *
          - textbox "Password * At least 12 characters, up to 72 characters." [ref=e40]
          - generic [ref=e41]: At least 12 characters, up to 72 characters.
      - button "Create account" [ref=e42] [cursor=pointer]
    - button "Already have an account? Sign in" [active] [ref=e43] [cursor=pointer]
    - button "Explore Demo Account" [ref=e44] [cursor=pointer]
    - paragraph [ref=e45]: Personal finance and tax preparation assistance. Not an official FBR filing service.
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | const password='Browser-test-password-12345';
  3  | async function navigate(page:Page,hash:string){await page.goto('/#'+hash);await expect(page.locator('main h1')).toBeVisible();}
  4  | async function add(page:Page,resource:string,values:Record<string,string>,selects:Record<string,string>={}){await navigate(page,resource);await page.getByRole('button',{name:/^Add /}).first().click();const dialog=page.getByRole('dialog');await dialog.locator('summary').filter({hasText:'More details'}).click();for(const [label,value]of Object.entries(values))await dialog.getByLabel(label,{exact:true}).fill(value);for(const [label,value]of Object.entries(selects))await dialog.getByRole('combobox',{name:label,exact:true}).selectOption({label:value});await dialog.getByRole('button',{name:'Save',exact:true}).click();await expect(dialog).not.toBeVisible();}
  5  | test('Complete personal finance and guided tax preparation journey',async({page})=>{
  6  |  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
> 7  |  const email=`browser-${Date.now()}@example.test`;await page.goto('/');await page.getByRole('button',{name:'New here? Create an account'}).click();await page.getByLabel('Full name',{exact:true}).fill('Browser Test');await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Create account',exact:true}).click();await expect(page.getByRole('heading',{name:'Welcome to HisabKetab AI',exact:true})).toBeVisible();
     |                                                                                                                                                                                                    ^ Error: locator.fill: Test timeout of 180000ms exceeded.
  8  |  await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('Salary',{exact:true}).check();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('Monthly income (PKR)',{exact:true}).fill('200000');await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Start using HisabKetab'}).click();await expect(page.getByRole('heading',{name:/Browser\./})).toBeVisible();
  9  |  await navigate(page,'profile');const financial=page.locator('details').filter({has:page.locator('summary',{hasText:'Financial & tax information'})});await financial.locator('summary').first().click();await financial.getByLabel('CNIC (enter only to replace)').fill('35202-1234567-1');await financial.getByRole('button',{name:'Save changes'}).click();await expect(page.getByText('Financial profile saved.',{exact:true})).toBeVisible();
  10 |  await page.getByLabel('Profile menu',{exact:true}).click();await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page.getByLabel('Profile menu',{exact:true})).toBeVisible();
  11 |  await add(page,'accounts',{'Account name':'Bank','Opening Balance':'0','Opening Date':'2025-07-01'});
  12 |  await navigate(page,'transactions');await page.getByRole('button',{name:'Add Income',exact:true}).click();let dialog=page.getByRole('dialog');await dialog.getByLabel('Amount',{exact:true}).fill('2400000');await dialog.locator('summary',{hasText:'More details'}).click();await dialog.getByLabel('Date',{exact:true}).fill('2026-06-01');await dialog.getByLabel('Notes',{exact:true}).fill('Annual salary');await dialog.getByRole('button',{name:'Save',exact:true}).click();await expect(dialog).not.toBeVisible();
  13 |  await add(page,'transactions',{'Amount':'100000','Date':'2026-06-02','Notes':'Living expenses'},{'Category':'Groceries'});
  14 |  await add(page,'budgets',{'Name':'June budget','Amount':'150000','Start Date':'2026-06-01','End Date':'2026-06-30'});
  15 |  await add(page,'goals',{'Name':'Education','Target Amount':'500000','Target Date':'2027-06-30'});
  16 |  await add(page,'assets',{'Description':'Laptop','Acquisition Date':'2025-07-01','Acquisition Cost':'100000','Current value':'100000','Source Of Funds':'Prior savings'});
  17 |  await add(page,'liabilities',{'Description':'Personal loan','Original Amount':'100000','Amount still owed':'100000','Lender':'Family','Start Date':'2025-07-01'});
  18 |  await add(page,'withholding',{'Amount':'120000','Payer':'Employer','Certificate Reference':'CERT-E2E'});
  19 |  await navigate(page,'calculation');await page.getByLabel('My income is ordinary resident income',{exact:false}).check();await page.getByRole('button',{name:'Save basic information'}).click();await expect(page.getByText('Tax information saved.',{exact:true})).toBeVisible();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('I have reviewed my tax paid',{exact:false}).check();await page.getByRole('button',{name:'Save review'}).click();await expect(page.getByRole('button',{name:'Save review'})).toBeEnabled();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByLabel('I reviewed what I own',{exact:true}).check();await page.getByLabel('I reviewed what I owe',{exact:true}).check();await page.getByRole('button',{name:'Save changes'}).click();await expect(page.getByRole('button',{name:'Save changes'})).toBeEnabled();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.getByRole('button',{name:'Calculate My Tax',exact:true}).click();await expect(page.getByRole('heading',{name:'Simple Explanation'})).toBeVisible();await expect(page.getByText('Rs. 42,000',{exact:true}).first()).toBeVisible();
  20 |  await page.locator('summary',{hasText:'How was this calculated?'}).click();await page.locator('summary',{hasText:'Legal references & calculation steps'}).click();await expect(page.getByRole('heading',{name:'Progressive income tax'})).toBeVisible();await page.getByRole('button',{name:'Continue',exact:true}).click();await page.locator('summary',{hasText:'Finalize this calculation'}).click();await page.getByRole('button',{name:'Finalize calculation',exact:true}).click();await page.getByRole('button',{name:'Confirm finalization'}).click();await expect(page.getByRole('button',{name:'Finalized',exact:true})).toBeDisabled();await page.getByRole('button',{name:'Prepare report'}).click();const download=page.waitForEvent('download');await page.getByRole('link',{name:'Download Report PDF'}).click();expect((await download).suggestedFilename()).toContain('hisabketab-tax');
  21 |  await navigate(page,'wealth');await page.getByRole('button',{name:'Generate wealth statement'}).click();await expect(page.getByRole('heading',{name:'Wealth at 2026-06-30'}).first()).toBeVisible();await navigate(page,'reconciliation');await page.getByRole('button',{name:'Run reconciliation'}).click();await expect(page.getByRole('cell',{name:'RECONCILED',exact:true})).toBeVisible();
  22 |  await navigate(page,'dashboard');await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'test-results/desktop.png',fullPage:true});for(const width of [320,375,768,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();}await page.setViewportSize({width:375,height:812});await page.screenshot({path:'test-results/mobile.png',fullPage:true});
  23 |  await page.getByLabel('Profile menu',{exact:true}).click();await page.getByRole('button',{name:'Sign out',exact:true}).click();await expect(page.getByRole('heading',{name:'Good to see you again.'})).toBeVisible();expect(errors).toEqual([]);
  24 | });
  25 | 
```
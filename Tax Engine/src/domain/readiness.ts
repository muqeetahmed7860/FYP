import type {TaxDataset} from './tax';
import {reconcile} from './finance';
import {wealthFlows} from './wealthFlows';

export type ReadinessStatus = 'COMPLETE' | 'INCOMPLETE' | 'NEEDS_REVIEW' | 'BLOCKED' | 'OPTIONAL';
export type ReadinessItem = {
  id:string; title:string; description:string; completedText:string; status:ReadinessStatus;
  group:'Personal Information'|'Financial Records'|'Wealth'|'System'; priority:number;
  action?:{label:string;route:string}; dependencies?:string[]; missingValue?:string;
};
export const taxRoute=(page:string,year:number,params:Record<string,string>={})=>
  `#${page}?${new URLSearchParams({taxYear:String(year),returnTo:'/tax',...params})}`;

/** The single readiness policy, used by live preparation and calculation snapshots. */
export function buildReadiness(dataset:TaxDataset,context:{rulesReady:boolean;hasReconciled:boolean;role?:string}) {
  const year=dataset.taxYear,p=dataset.taxProfile,flows=wealthFlows(dataset.transactions);
  const reconciliation=p?reconcile(p.openingWealth,dataset.wealth.netWealth,flows.income,flows.expenses,p.otherInflows,p.otherOutflows):null;
  const items:ReadinessItem[]=[];
  const add=(id:string,group:ReadinessItem['group'],priority:number,complete:boolean,title:string,description:string,completedText:string,label:string,page:string,params:Record<string,string>={},review=false)=>{
    items.push({id,group,priority,status:complete?'COMPLETE':review?'NEEDS_REVIEW':'INCOMPLETE',title:complete?completedText:title,description,completedText,action:complete?undefined:{label,route:taxRoute(page,year,params)}});
  };
  const profileReady=!!dataset.profile.cnic&&dataset.profile.occupation!==''&&dataset.profile.primaryIncomeType!==''&&dataset.profile.residentialStatus==='RESIDENT'&&!!p?.ordinaryResidentConfirmed;
  add('profile','Personal Information',1,profileReady,'Complete your financial profile','We need your occupation, income type, CNIC and confirmation of your basic tax information.','Financial profile complete','Complete Profile','profile',{section:'financial'});
  const income=dataset.transactions.filter(t=>t.type==='INCOME'),expenses=dataset.transactions.filter(t=>t.type==='EXPENSE');
  add('income','Financial Records',2,income.length>0,'Add your income',`No income has been recorded for Tax Year ${year}. Add salary, freelance, business or rental income for this year.`,'Income recorded','Add Income','transactions',{type:'INCOME',new:'1'});
  add('expenses','Financial Records',3,expenses.length>0&&p?.expensesReviewed!==false&&!!p,'Add or review your expenses',expenses.length?`Review your ${expenses.length} expense entries for Tax Year ${year}. These explain changes in your wealth; transfers do not count.`:`No expenses have been recorded for Tax Year ${year}. Add your personal expenses for wealth reconciliation.`,'Expenses recorded and reviewed',expenses.length?'Review Expenses':'Add Expense','transactions',{type:'EXPENSE',...(expenses.length?{}:{new:'1'})},expenses.length>0);
  const missingCertificate=dataset.withholding.some(w=>w.taxTreatment==='ADJUSTABLE'&&!w.certificateReference);
  add('withholding','Financial Records',4,!!p?.withholdingReviewed&&!missingCertificate,'Review tax already deducted',missingCertificate?'Add the missing certificate reference for adjustable tax paid.':'Add or review tax deducted from your salary, bank, property or other eligible income. Confirm the review even if none was deducted.','Withholding reviewed','Review Withholding','withholding',{},true);
  add('assets','Wealth',5,!!p?.assetsReviewed,'Review your assets',`Confirm your cash, bank balance, vehicle, property, investments and other assets at 30 June ${year}, including if you have none.`,'Assets reviewed','Review Assets','assets',{},true);
  add('liabilities','Wealth',6,!!p?.liabilitiesReviewed,'Review your loans and debts',`Confirm loans, credit-card balances and other liabilities at 30 June ${year}, including if you have none.`,'Loans and debts reviewed','Review Liabilities','liabilities',{},true);
  add('opening-wealth','Wealth',7,!!p&&p.openingWealthConfirmed!==false,'Add opening wealth',`Enter what you owned minus what you owed on 1 July ${year-1}. Enter zero if you had no opening wealth.`,'Opening wealth available','Add Opening Wealth','wealth',{section:'opening-wealth'});
  const dependencies=['income','expenses','assets','liabilities','opening-wealth'];
  const missing=dependencies.map(id=>items.find(i=>i.id===id)!).filter(i=>i.status!=='COMPLETE');
  const matched=!!reconciliation&&reconciliation.status==='RECONCILED';
  const blocked=missing.length>0;
  items.push({id:'reconciliation',group:'Wealth',priority:8,status:blocked?'BLOCKED':!context.hasReconciled?'INCOMPLETE':matched?'COMPLETE':'NEEDS_REVIEW',title:blocked?'Complete your wealth information':context.hasReconciled&&matched?'Wealth records matched':context.hasReconciled?'Resolve wealth difference':'Check your wealth records',description:blocked?`Before checking reconciliation: ${missing.map(i=>i.title.toLowerCase()).join('; ')}.`:context.hasReconciled&&!matched?'We found a difference between your financial records and calculated wealth. Review your records and explain any additional money received or paid.':'Compare opening wealth, income and expenses with what you owned and owed at year end.',completedText:'Wealth records matched',dependencies,missingValue:!blocked&&reconciliation&&!matched?reconciliation.difference:undefined,action:blocked?missing[0].action:context.hasReconciled&&matched?undefined:{label:context.hasReconciled?'Resolve Difference':'Check Wealth',route:taxRoute('reconciliation',year)}});
  items.push({id:'rules',group:'System',priority:9,status:context.rulesReady?'COMPLETE':'BLOCKED',title:context.rulesReady?'Tax rules ready':'Tax rules temporarily unavailable',description:context.rulesReady?'Verified rules are available for this tax year.':'Tax calculation for this tax year is temporarily unavailable because verified rules have not been configured for your records. Your administrator needs to resolve this.',completedText:'Tax rules ready',action:context.rulesReady?undefined:context.role==='ADMIN'?{label:'Manage Tax Rules',route:`/admin#tax?year=${year}`}:{label:'Contact Support',route:taxRoute('help',year)}});
  const completed=items.filter(i=>i.status==='COMPLETE').length,total=items.filter(i=>i.status!=='OPTIONAL').length;
  return {taxYear:year,readinessScore:Math.round(completed/total*100),percentage:Math.round(completed/total*100),completed,total,remaining:total-completed,ready:completed===total,items,reconciliation,nextAction:items.find(i=>['INCOMPLETE','NEEDS_REVIEW'].includes(i.status))?.action??items.find(i=>i.status==='BLOCKED')?.action,checks:items.map(i=>({label:i.completedText,complete:i.status==='COMPLETE'})),label:'Data completeness indicator — not FBR approval.'};
}
export type Readiness = ReturnType<typeof buildReadiness>;

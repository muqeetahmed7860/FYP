import type {FinancialData,TaxRule,TaxResult} from '../types/index';
import {validateFinancialData,validateRules} from './validation';
import {classifyIncome,classifyTaxpayer} from './incomeClassifier';
import {calculateProgressiveTax,round} from './taxCalculator';
import {calculateWithholding} from './withholdingCalculator';
import {reconcileWealth} from './wealthReconciliation';
import {explanationEngine} from './explanationEngine';
export function runTaxEngine(input:unknown,configuredRules:TaxRule[],years:number[]):TaxResult{
 const d:FinancialData=validateFinancialData(input,years);validateRules(configuredRules,d.user.taxYear);
 const start=`${d.user.taxYear-1}-07-01`,end=`${d.user.taxYear}-06-30`;
 const rules=configuredRules.filter(r=>r.taxYear===d.user.taxYear&&r.effectiveFrom<=start&&r.effectiveTo>=end);
 const {trace,add}=explanationEngine(),applied=new Map<string,TaxRule>();
 const record=(name:string,input:unknown,result:unknown,reason:string,r?:TaxRule,formula='',calculation='')=>{if(r)applied.set(r.ruleId,r);add({name,input,result,reason,ruleId:r?.ruleId??'ENGINE',section:r?.section??'',schedule:r?.schedule??'',formula,calculation});};
 record('Select tax-year rules',d.user.taxYear,rules.length,'Only rules covering the selected full tax year are eligible.');
 const classifications=classifyIncome(d,rules),incomeSummary:Record<string,number>={'Salary':0,'Business':0,'Property':0,'Capital Gains':0,'Other Sources':0};
 for(const c of classifications){incomeSummary[c.taxHead]=round((incomeSummary[c.taxHead]??0)+c.amount);record(`Classify ${c.transactionId}`,c.originalCategory,c.taxHead,c.reason,rules.find(r=>r.ruleId===c.ruleId));}
 const grossIncome=round(d.income.reduce((s,i)=>s+i.grossAmount,0));let deductions=0;
 const warnings:string[]=[];
 for(const e of d.expenses){const r=rules.find(r=>r.kind==='deduction'&&r.status==='active'&&r.parameters.category===e.category&&(r.taxpayerCategory==='all'||r.taxpayerCategory===d.user.taxpayerType));const value=r&&e.personalOrBusiness==='business'&&incomeSummary.Business>0?Math.min(e.amount*(r.parameters.rate??0),r.parameters.threshold??0,Math.max(0,incomeSummary.Business-deductions)):0;deductions=round(deductions+value);record(`Expense: ${e.category}`,e.amount,value,value?'Configured business deduction applied.':'Not deducted: personal expense or no applicable eligibility rule.',value?r:undefined,'min(expense × rate, cap, remaining business income)');if(!value&&e.personalOrBusiness==='business'&&e.amount>0)warnings.push(`${e.category}: expense not deducted; eligibility requires review.`);}
 const taxableIncome=round(Math.max(0,grossIncome-deductions));const selector=rules.find(r=>r.kind==='selection'&&r.status==='active');const taxpayer=classifyTaxpayer(d,taxableIncome,selector?.parameters.rate??1);
 record('Determine taxpayer classification',d.user.taxpayerType,taxpayer.classification,`Selected ${taxpayer.slabCategory} schedule; salary share ${taxableIncome?round(taxpayer.salary/taxableIncome*100):0}%.`,selector,selector?.formula);
 record('Calculate taxable income',grossIncome,taxableIncome,'Only configured deductions are subtracted.',rules.find(r=>r.section==='9'),'gross income − allowed deductions',`${grossIncome} − ${deductions} = ${taxableIncome}`);
 const slabRule=rules.find(r=>r.kind==='slab'&&r.taxpayerCategory===taxpayer.slabCategory&&r.status==='active');
 const surchargeRule=rules.find(r=>r.kind==='surcharge'&&r.taxpayerCategory===taxpayer.slabCategory&&r.status==='active');
 const missing:string[]=[];
 if(!selector||selector.parameters.rate===undefined)missing.push('taxpayer schedule selection rule');
 if(!slabRule)missing.push(`${taxpayer.slabCategory} slab rules`);
 if(!surchargeRule)missing.push('surcharge rule (including explicit zero-rate configuration)');
 if(classifications.some(c=>c.taxHead==='Unclassified'))missing.push('income classification rules');
 if(d.user.residentialStatus!=='resident')missing.push('non-resident treatment');
 if(d.income.some(i=>['property','capital-gains','other'].includes(i.type)&&i.grossAmount>0))missing.push('special income-head computation');
 if(d.withholdingTaxes.some(w=>['final','minimum'].includes(w.status)))missing.push('final/minimum regime liability');
 if(taxableIncome>150000000)missing.push('super tax and high-income provisions');
 if(taxpayer.classification==='mixed'&&taxableIncome>10000000)missing.push('mixed-income surcharge treatment');
 const blocked=missing.length>0;
 if(blocked)warnings.unshift(`RULE DATA REQUIRED: ${missing.join('; ')}. No complete liability is returned.`);
 const computed=!blocked&&slabRule?calculateProgressiveTax(taxableIncome,slabRule.slabs):null;
 const surcharge=computed&&surchargeRule?round(taxableIncome>(surchargeRule.parameters.threshold??0)?computed.tax*(surchargeRule.parameters.rate??0):0):null;
 const grossTax=computed?round(computed.tax+(surcharge??0)):null;
 if(computed){record('Apply progressive slab',taxableIncome,computed.tax,'Taxable income falls within the selected slab.',slabRule,slabRule?.formula,`${computed.slab.baseTax} + (${taxableIncome} − ${computed.slab.excessOver}) × ${computed.slab.rate} = ${computed.tax}`);record('Apply surcharge',computed.tax,surcharge,'Evaluate configured taxable-income threshold.',surchargeRule,surchargeRule?.formula,`${computed.tax} × ${taxableIncome>(surchargeRule?.parameters.threshold??0)?surchargeRule?.parameters.rate:0} = ${surcharge}`);}else record('Block incomplete calculation',missing,null,'Missing rules cannot be replaced with assumed rates.');
 const w=calculateWithholding(d,rules);warnings.push(...w.warnings);
 for(const item of w.items){record(`Review credit ${item.id}`,item.amount,item.eligible?item.amount:0,item.reason,rules.find(r=>r.kind==='withholding'&&r.section===item.section&&r.status==='active'));if(!item.eligible)warnings.push(`${item.description}: ${item.reason}`);}
 const netTaxPayable=grossTax===null?null:round(Math.max(0,grossTax-w.credits)),potentialRefund=grossTax===null?null:round(Math.max(0,w.credits-grossTax));
 record('Settle estimated liability',{grossTax,credits:w.credits},{netTaxPayable,potentialRefund},'Potential refund is an estimate, not approval under section 170.',rules.find(r=>r.section==='168'),'gross tax − eligible credits',grossTax===null?'RULE DATA REQUIRED':`${grossTax} − ${w.credits} = ${round(grossTax-w.credits)}`);
 const wealth=reconcileWealth(d,grossIncome);record('Prepare wealth statement',d.assets.map(a=>a.value),wealth.wealthStatement,'Sum assets and subtract liabilities.',rules.find(r=>r.section==='116'),'assets − liabilities',`${wealth.wealthStatement.assets} − ${wealth.wealthStatement.liabilities} = ${wealth.wealthStatement.netWealth}`);
 record('Reconcile wealth',wealth.reconciliation,wealth.reconciliation.difference,'Personal expenses are an inclusive annual total. Tax/business outflows belong in explicit signed wealth adjustments.',rules.find(r=>r.section==='116'),'(closing − opening) − (income − personal expenses + adjustments)',`${wealth.reconciliation.actualChange} − ${wealth.reconciliation.expectedChange} = ${wealth.reconciliation.difference}`);
 if(wealth.reconciliation.status!=='RECONCILED')warnings.push(`Rs. ${Math.abs(wealth.reconciliation.difference).toLocaleString('en-PK')} requires review before preparation of the final tax report.`);
 const readinessChecks=[{label:'Personal profile complete',complete:true},{label:'Income sources entered',complete:d.income.length>0},{label:'Withholding documented',complete:w.warnings.length===0&&d.withholdingTaxes.every(w=>w.certificateAvailable)},{label:'Assets entered',complete:d.assets.length>0},{label:'Liabilities declared (zero allowed)',complete:true},{label:'Personal expenses declared',complete:true},{label:'Opening wealth entered',complete:true},{label:'Wealth reconciled',complete:wealth.reconciliation.status==='RECONCILED'},{label:'Tax-year rule coverage complete',complete:!blocked},{label:'Credit treatment resolved',complete:w.items.every(i=>i.eligible)},{label:'Business expense eligibility resolved',complete:!warnings.some(w=>w.includes('expense not deducted'))}];
 const taxReadiness=Math.round(readinessChecks.filter(c=>c.complete).length/readinessChecks.length*100);record('Assess data readiness',readinessChecks,taxReadiness,'Equal-weight data completeness score; not a tax or legal conclusion.');
 return {createdAt:new Date().toISOString(),taxYear:d.user.taxYear,ruleVersion:[...new Set(rules.map(r=>r.version))].join(', '),effectiveDate:`${start} to ${end}`,source:slabRule?.source??'RULE DATA REQUIRED',taxpayerClassification:taxpayer.classification,slabCategory:taxpayer.slabCategory,incomeSummary,classifications,grossIncome,deductions,taxableIncome,grossTax,baseTax:computed?.tax??null,surcharge,credits:w.credits,netTaxPayable,potentialRefund,slab:computed?.slab??null,withholdingItems:w.items,...wealth,rulesApplied:[...applied.values()],calculationTrace:trace,taxReadiness,readinessChecks,warnings,blocked};
}

import {seedRules} from './rules';
import type {Rule,Slab} from '../src/domain/tax';
export const officialSource2027='https://download1.fbr.gov.pk/Docs/2026724177725705IncomeTaxOrdinanace2001.pdf';
export const rateCard2027='https://download1.fbr.gov.pk/Docs/202681113864992WithholdingTaxRatesCard2027.pdf';
const salaryRows:[string,string|null,string,string][]=[['0','600000','0','0'],['600000','1200000','0','0.01'],['1200000','2200000','6000','0.11'],['2200000','3200000','116000','0.20'],['3200000','4100000','316000','0.25'],['4100000','5600000','541000','0.29'],['5600000','7000000','976000','0.32'],['7000000',null,'1424000','0.35']];
const salarySlabs:Slab[]=salaryRows.map(([lowerBound,upperBound,baseTax,rate],sequence)=>({lowerBound,upperBound,baseTax,rate,excessOver:lowerBound,sequence}));
// A separately verified, persisted year/version. No runtime fallback to TY2026.
// Source: Ordinance amended 30 June 2026, printed pp. 506–509; rate-card pp. 1–2.
export const seedRules2027:Rule[]=seedRules.map(previous=>{
 const r=structuredClone(previous);r.id=`2027-${r.ruleCode}`;r.taxYear=2027;r.version=2;r.name=r.name.replaceAll('2026','2027');r.effectiveFrom='2026-07-01';r.effectiveTo='2027-06-30';
 const page=r.ruleType==='SURCHARGE'?'34':r.ruleType==='WITHHOLDING'?'314, 357–359':r.ruleType==='INCOME_CLASSIFICATION'?'49–98':r.ruleType==='SCOPE'?'35, section 113':'506–509';
 r.references=[{sourceDocument:'Income Tax Ordinance 2001, amended through 30 June 2026',url:officialSource2027,page}];
 if(r.ruleCode==='SALARY-SLABS'){r.slabs=salarySlabs;r.references.push({sourceDocument:'Official FBR withholding rate card TY2027',url:rateCard2027,page:'1–2'});}
 if(r.ruleCode==='SURCHARGE-SALARIED'){r.parameters={threshold:'10000000',rate:'0'};r.name='Salary surcharge removed by Finance Act 2026';}
 return r;
});

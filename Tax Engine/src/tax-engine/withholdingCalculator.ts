import type {FinancialData,TaxRule} from '../types/index';
import {round} from './taxCalculator';
export function calculateWithholding(d:FinancialData,rules:TaxRule[]){
 const items=d.withholdingTaxes.map(w=>{const r=rules.find(r=>r.kind==='withholding'&&r.section===w.section&&r.status==='active'&&r.parameters.nature===w.nature&&r.parameters.withholdingStatus===w.status);const eligible=!!r?.parameters.eligible&&w.certificateAvailable&&w.taxYear===d.user.taxYear;return {id:w.id,description:w.description,amount:w.amount,section:w.section,status:w.status,eligible,reason:!r?'RULE DATA REQUIRED: no matching credit rule.':!w.certificateAvailable?'Withholding certificate is missing.':eligible?`Eligible under ${r.ruleId}; section 168.`:'Final/minimum or non-creditable treatment: separate review required.'};});
 const warnings=d.income.filter(i=>i.taxWithheld>0&&!d.withholdingTaxes.some(w=>w.incomeId===i.id)).map(i=>`${i.id}: reported withholding needs a linked, documented record before credit can be claimed.`);
 return {items,credits:round(items.filter(w=>w.eligible).reduce((s,w)=>s+w.amount,0)),warnings};
}

import { financialSchema, ruleSchema, type FinancialData, type TaxRule } from '../types/index';
import {normalizeFinancialData} from '../services/financialAdapter';
export class ValidationError extends Error { constructor(public errors:string[]){super(errors.join('; '));} }
export function validateFinancialData(input:unknown, years:number[]):FinancialData {
 const parsed=financialSchema.safeParse(normalizeFinancialData(input));
 if(!parsed.success) throw new ValidationError(parsed.error.issues.map(e=>`${e.path.join('.')}: ${e.message}`));
 const d=parsed.data, errors:string[]=[];
 if(!years.includes(d.user.taxYear)) errors.push('Tax year does not exist in the rule database.');
 const ids=[...d.income.map(i=>i.id),...d.withholdingTaxes.map(i=>i.id),...d.expenses.flatMap(e=>e.id?[e.id]:[])];
 if(new Set(ids).size!==ids.length) errors.push('Duplicate transaction IDs are not allowed.');
 for(const i of d.income) if(i.taxWithheld>i.grossAmount) errors.push(`${i.id}: tax withheld exceeds gross income.`);
 const linked=new Set<string>();
 for(const w of d.withholdingTaxes){
  if(w.taxYear!==d.user.taxYear) errors.push(`${w.id}: withholding tax year does not match the selected year.`);
  if(w.incomeId){const i=d.income.find(i=>i.id===w.incomeId);if(!i)errors.push(`${w.id}: linked income does not exist.`);else if(i.taxWithheld!==w.amount)errors.push(`${w.id}: withholding amount must match its linked income.`);if(linked.has(w.incomeId))errors.push(`${w.id}: duplicate withholding link.`);linked.add(w.incomeId);}
 }
 if(errors.length) throw new ValidationError(errors);return d;
}
export function validateRules(input:unknown, year:number):TaxRule[]{
 if(!Array.isArray(input)||!input.length)throw new ValidationError(['At least one rule is required.']);
 const errors:string[]=[],rules:TaxRule[]=[];
 for(const item of input){const p=ruleSchema.safeParse(item);if(!p.success){errors.push(...p.error.issues.map(e=>`${e.path.join('.')}: ${e.message}`));continue;}const r=p.data;rules.push(r);
 if(r.taxYear!==year)errors.push(`${r.ruleId}: tax year mismatch.`);
 if(!Number.isFinite(Date.parse(r.effectiveFrom))||!Number.isFinite(Date.parse(r.effectiveTo))||r.effectiveFrom>r.effectiveTo)errors.push(`${r.ruleId}: invalid effective period.`);
 if(r.status==='active'&&!r.sourceUrl)errors.push(`${r.ruleId}: active rules require a source URL.`);
 if(r.kind==='selection'&&r.status==='active'&&r.parameters.rate===undefined)errors.push(`${r.ruleId}: salary-share rate required.`);
 if(r.kind==='classification'&&r.status==='active'&&!['Salary','Business','Property','Capital Gains','Other Sources'].includes(r.parameters.taxHead??''))errors.push(`${r.ruleId}: valid tax head required.`);
 if(['deduction','surcharge'].includes(r.kind)&&r.status==='active'&&(r.parameters.rate===undefined||r.parameters.threshold===undefined))errors.push(`${r.ruleId}: rate and threshold required.`);
 if(r.kind==='withholding'&&r.status==='active'&&(r.parameters.eligible===undefined||!r.parameters.nature||!r.parameters.withholdingStatus))errors.push(`${r.ruleId}: withholding eligibility, nature and status required.`);
 if(r.kind==='slab'&&r.status==='active'){
  const slabs=[...r.slabs].sort((a,b)=>a.lowerLimit-b.lowerLimit);
  if(!slabs.length||slabs[0].lowerLimit!==0||slabs.at(-1)?.upperLimit!==null)errors.push(`${r.ruleId}: slabs must cover zero through an unlimited final range.`);
  if(new Set(slabs.map(s=>s.slabId)).size!==slabs.length)errors.push(`${r.ruleId}: duplicate slab IDs.`);
  slabs.forEach((s,i)=>{if(s.excessOver!==s.lowerLimit)errors.push(`${s.slabId}: excess threshold must match lower limit.`);if(s.upperLimit!==null&&s.upperLimit<=s.lowerLimit)errors.push(`${s.slabId}: invalid range.`);if(i&&slabs[i-1].upperLimit!==s.lowerLimit)errors.push(`${s.slabId}: overlapping slab ranges or missing threshold.`);if(i){const prev=slabs[i-1];const expected=prev.baseTax+(s.lowerLimit-prev.excessOver)*prev.rate;if(Math.abs(expected-s.baseTax)>.01)errors.push(`${s.slabId}: base tax is not continuous with previous slab.`);}});
 }
 }
 if(new Set(rules.map(r=>r.ruleId)).size!==rules.length)errors.push('Duplicate Rule IDs are not allowed.');
 const selectors=rules.filter(r=>r.status==='active'&&r.kind!=='reference').map(r=>[r.kind,r.taxpayerCategory,r.incomeType,r.kind==='withholding'?r.section:''].join('|'));
 if(new Set(selectors).size!==selectors.length)errors.push('Ambiguous duplicate active rule selectors.');
 if(errors.length)throw new ValidationError(errors);return rules;
}

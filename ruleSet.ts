import {D} from './money';
type Condition={field:string;operator:string;value:string};
type Config={ruleCode:string;ruleType:string;incomeHead:string;taxpayerType:string;section:string;parameters:any;conditions:Condition[]};
function overlap(a:Condition[],b:Condition[]){
 const conditions=[...a,...b];for(const field of new Set(conditions.map(c=>c.field))){const group=conditions.filter(c=>c.field===field),sets=group.filter(c=>['EQ','IN'].includes(c.operator)).map(c=>c.operator==='EQ'?[c.value]:c.value.split(','));if(sets.length){const candidates=sets[0].filter(v=>sets.every(s=>s.includes(v)));if(!candidates.some(v=>group.every(c=>{if(c.operator==='NE')return v!==c.value;if(['GT','GTE','LT','LTE'].includes(c.operator)){try{return c.operator==='GT'?D(v).gt(c.value):c.operator==='GTE'?D(v).gte(c.value):c.operator==='LT'?D(v).lt(c.value):D(v).lte(c.value);}catch{return false;}}return true;})))return false;}
 const lows=group.filter(c=>['GT','GTE'].includes(c.operator)),highs=group.filter(c=>['LT','LTE'].includes(c.operator));for(const lo of lows)for(const hi of highs)if(D(lo.value).gt(hi.value)||D(lo.value).eq(hi.value)&&(lo.operator==='GT'||hi.operator==='LT'))return false;
 }return true;
}
export function validateRuleSet(rules:Config[]){
 const family=(r:Config)=>['FIXED_RATE','FINAL_TAX'].includes(r.ruleType)?'SEPARATE':['ALLOWABLE_EXPENSE','DEDUCTION'].includes(r.ruleType)?'EXPENSE':['WITHHOLDING','ADJUSTABLE_TAX'].includes(r.ruleType)?'CREDIT':r.ruleType;
 const identity=(r:Config)=>{const f=family(r);if(['INCOME_CLASSIFICATION','EXPENSE'].includes(f))return r.parameters.category;if(['CREDIT','TAX_CREDIT'].includes(f))return `${r.section}|${r.parameters.nature}|${r.parameters.treatment}`;if(['PROGRESSIVE_SLAB','SURCHARGE'].includes(f))return r.taxpayerType;if(['REPORTING_REQUIREMENT','EXEMPTION','SEPARATE','MINIMUM_TAX'].includes(f))return r.incomeHead;return '*';};
 for(let i=0;i<rules.length;i++)for(let j=i+1;j<rules.length;j++){const a=rules[i],b=rules[j];if(family(a)===family(b)&&identity(a)===identity(b)&&overlap(a.conditions,b.conditions))throw new Error(`Conflicting active rules: ${a.ruleCode} and ${b.ruleCode}.`);}
}

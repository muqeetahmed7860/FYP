// Normalize legacy tracker payloads without granting tax eligibility.
export function normalizeFinancialData(input:unknown):unknown {
 if(!input||typeof input!=='object'||Array.isArray(input))return input;
 const d=structuredClone(input) as Record<string,any>;
 const number=(v:unknown)=>typeof v==='string'&&v.trim()!==''&&Number.isFinite(Number(v))?Number(v):v;
 if(d.user&&typeof d.user==='object')d.user.taxYear=number(d.user.taxYear);
 for(const [field,amounts] of Object.entries({income:['grossAmount','taxWithheld'],expenses:['amount'],withholdingTaxes:['amount','taxYear'],assets:['value'],liabilities:['value'],wealthAdjustments:['amount']})){
  if(Array.isArray(d[field]))d[field]=d[field].map((row:unknown,index:number)=>{if(!row||typeof row!=='object'||Array.isArray(row))return row;const item={...row} as Record<string,any>;for(const amount of amounts)if(amount in item)item[amount]=number(item[amount]);if(field==='withholdingTaxes'){item.id??=`IMPORTED-WHT-${index+1}`;item.taxYear??=d.user?.taxYear;item.nature??='withholding';item.status??='configurable';item.certificateAvailable??=false;}return item;});
 }
 d.openingWealth=number(d.openingWealth);d.personalExpenses=number(d.personalExpenses);return d;
}

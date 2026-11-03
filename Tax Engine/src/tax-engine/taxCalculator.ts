import type {Slab} from '../types/index';
export const round=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
export function calculateProgressiveTax(income:number,slabs:Slab[]){
 if(!Number.isFinite(income)||income<0)throw new Error('Taxable income must be non-negative.');
 const slab=slabs.find((s,i)=> (i===0?income>=s.lowerLimit:income>s.lowerLimit)&&(s.upperLimit===null||income<=s.upperLimit));
 if(!slab)throw new Error('RULE DATA REQUIRED: no matching slab.');
 return {tax:round(slab.baseTax+Math.max(0,income-slab.excessOver)*slab.rate),slab};
}

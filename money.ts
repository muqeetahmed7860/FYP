import Decimal from 'decimal.js';
Decimal.set({precision:40,rounding:Decimal.ROUND_HALF_UP});
export type Money=Decimal.Value;
export const D=(v:Money)=>new Decimal(v);
export const cash=(v:Money)=>D(v).toDecimalPlaces(2).toFixed(2);
export const sum=(v:Money[])=>v.reduce<Decimal>((a,b)=>a.plus(b),D(0));
export const positive=(v:Money)=>Decimal.max(0,v);
export const min=(...v:Money[])=>Decimal.min(...v);
export const balance=(opening:Money,entries:Money[])=>cash(sum([opening,...entries]));
export function transferEntries(amount:Money){if(!D(amount).isPositive())throw new Error('Positive amount required.');return [cash(D(amount).negated()),cash(amount)];}

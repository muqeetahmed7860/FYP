import { z } from 'zod';
const money = z.number().finite().min(0).max(1e12);
export const taxpayerTypes = ['salaried','non-salaried','freelancer','business','rental','investment','mixed'] as const;
export const incomeTypes = ['salary','freelance','business','property','capital-gains','other'] as const;
export const financialSchema = z.object({
 user: z.object({ id:z.string().min(1), name:z.string().min(1), cnic:z.string().regex(/^\d{5}-\d{7}-\d$/,'CNIC must use 00000-0000000-0 format'), residentialStatus:z.enum(['resident','non-resident']), taxpayerType:z.enum(taxpayerTypes), taxYear:z.number().int().min(2000).max(2100) }),
 income:z.array(z.object({id:z.string().min(1),source:z.string().min(1,'Income is missing employer/source information'),type:z.enum(incomeTypes),grossAmount:money,taxWithheld:money.default(0)})),
 expenses:z.array(z.object({id:z.string().optional(),category:z.string().min(1),amount:money,personalOrBusiness:z.enum(['personal','business'])})),
 withholdingTaxes:z.array(z.object({id:z.string().min(1),incomeId:z.string().optional(),section:z.string().min(1),description:z.string().min(1),amount:money,taxYear:z.number().int(),nature:z.enum(['withholding','advance','credit']).default('withholding'),status:z.enum(['adjustable','final','minimum','configurable']).default('configurable'),certificateAvailable:z.boolean().default(false)})),
 assets:z.array(z.object({type:z.enum(['bank','cash','vehicle','property','investment','other']),description:z.string().min(1),value:money})),
 liabilities:z.array(z.object({type:z.enum(['loan','credit-card','other']),description:z.string().min(1),value:money})),
 openingWealth:money, personalExpenses:money,
 wealthAdjustments:z.array(z.object({description:z.string().min(1),amount:z.number().finite().min(-1e12).max(1e12)})).default([])
});
export type FinancialData = z.infer<typeof financialSchema>;
export const slabSchema=z.object({slabId:z.string().min(1),lowerLimit:money,upperLimit:money.nullable(),baseTax:money,rate:z.number().min(0).max(1),excessOver:money});
export const ruleSchema=z.object({
 ruleId:z.string().min(1),taxYear:z.number().int().min(2000).max(2100),version:z.string().min(1),title:z.string().min(1),
 kind:z.enum(['slab','classification','selection','deduction','withholding','reference','surcharge']),taxpayerCategory:z.string().min(1),incomeType:z.string().default('all'),
 source:z.string().min(1),sourceUrl:z.string().url().or(z.literal('')),section:z.string(),schedule:z.string(),division:z.string(),clause:z.string(),
 effectiveFrom:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),effectiveTo:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),status:z.enum(['active','disabled','required']),
 description:z.string(),conditions:z.string(),formula:z.string(),notes:z.string(),slabs:z.array(slabSchema).default([]),
 parameters:z.object({taxHead:z.string().optional(),category:z.string().optional(),rate:z.number().min(0).max(1).optional(),threshold:money.optional(),eligible:z.boolean().optional(),nature:z.enum(['withholding','advance','credit']).optional(),withholdingStatus:z.enum(['adjustable','final','minimum','configurable']).optional()}).default({})
});
export type TaxRule=z.infer<typeof ruleSchema>;
export type Slab=z.infer<typeof slabSchema>;
export type Trace={step:number;name:string;input:unknown;ruleId:string;section:string;schedule:string;formula:string;calculation:string;result:unknown;reason:string};
export type Classification={transactionId:string;originalCategory:string;taxHead:string;ruleId:string;reason:string;amount:number};
export type TaxResult={id?:string;createdAt:string;taxYear:number;ruleVersion:string;effectiveDate:string;source:string;taxpayerClassification:string;slabCategory:string;incomeSummary:Record<string,number>;classifications:Classification[];grossIncome:number;deductions:number;taxableIncome:number;grossTax:number|null;baseTax:number|null;surcharge:number|null;credits:number;netTaxPayable:number|null;potentialRefund:number|null;slab:Slab|null;withholdingItems:{id:string;description:string;amount:number;eligible:boolean;reason:string;section:string;status:string}[];wealthStatement:{assets:number;liabilities:number;netWealth:number};reconciliation:{openingWealth:number;closingWealth:number;income:number;personalExpenses:number;adjustments:number;expectedChange:number;actualChange:number;difference:number;status:string};rulesApplied:TaxRule[];calculationTrace:Trace[];taxReadiness:number;readinessChecks:{label:string;complete:boolean}[];warnings:string[];blocked:boolean};

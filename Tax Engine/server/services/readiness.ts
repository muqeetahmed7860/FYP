import type {DB} from '../db';
import {requireFound} from '../errors';
import {buildTaxDataset,ruleInclude} from './tax';
import {buildReadiness} from '../../src/domain/readiness';
import {calculateTax,TaxError,type Rule} from '../../src/domain/tax';

export async function taxReadiness(tx:DB,userId:string,year:number,role='USER') {
  const [dataset,ty,rules,lastCheck]=await Promise.all([
    buildTaxDataset(tx,userId,year),tx.taxYear.findUnique({where:{year}}),
    tx.taxRule.findMany({where:{taxYear:year},include:ruleInclude}),
    tx.wealthReconciliation.findFirst({where:{statement:{userId,taxYear:year}},orderBy:{id:'desc'}}),
  ]);
  const taxYear=requireFound(ty);let rulesReady=taxYear.status==='ACTIVE';
  if(rulesReady) {
    // Use the tax engine's own selection/validation; missing user confirmations
    // must not hide an unavailable rule set or prevent showing the checklist.
    try {
      calculateTax({...dataset,profile:{...dataset.profile,residentialStatus:'RESIDENT'},taxProfile:{openingWealth:'0',otherInflows:'0',otherOutflows:'0',adjustmentsExplanation:'',assetsReviewed:false,liabilitiesReviewed:false,withholdingReviewed:false,...dataset.taxProfile,ordinaryResidentConfirmed:true},withholding:dataset.withholding.map(w=>({...w,certificateReference:w.certificateReference||'readiness-validation-only'}))},JSON.parse(JSON.stringify(rules)) as Rule[],taxYear.ruleVersion);
    } catch(error) {
      if(!(error instanceof TaxError))throw error;
      rulesReady=!['TAX_RULE_NOT_FOUND','UNVERIFIED_TAX_RULE','TAX_RULE_CONFLICT','VALIDATION_ERROR'].includes(error.code);
    }
  }
  return buildReadiness(dataset,{rulesReady,hasReconciled:!!lastCheck,role});
}

/** Record changes invalidate explicit reviews; the next checklist uses live data. */
export async function invalidateTaxReview(tx:DB,userId:string,resource:string,years?:number[]) {
  const where={userId,...(years?{taxYear:{in:years}}:{})};
  if(resource==='transactions')await tx.taxProfile.updateMany({where,data:{expensesReviewed:false,assetsReviewed:false}});
  if(resource==='assets'||resource==='accounts')await tx.taxProfile.updateMany({where,data:{assetsReviewed:false}});
  if(resource==='liabilities')await tx.taxProfile.updateMany({where,data:{liabilitiesReviewed:false}});
  if(resource==='withholding')await tx.taxProfile.updateMany({where,data:{withholdingReviewed:false}});
}

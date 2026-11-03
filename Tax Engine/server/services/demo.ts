import {randomBytes,randomUUID} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {atomic,db,json} from '../db';
import {writeTransaction} from './ledger';
import {calculate} from './tax';
import {defaultPreferences} from '../../src/domain/preferences';
import {requireFound} from '../errors';
export async function createDemo(){
 const passwordHash=await bcrypt.hash(randomBytes(32).toString('hex'),12);
 const user=await atomic(async tx=>{
  const user=await tx.user.create({data:{email:`explore-${randomUUID()}@demo.hisabketab.local`,passwordHash,profile:{create:{name:'Abubakar Demo',cnic:'35202-0000000-1',occupation:'Salary',monthlyIncomeEstimate:'200000',essentialMonthlyExpenses:'25000',emergencySavings:'50000',dependents:2}},experience:{create:{preferences:json({...defaultPreferences,onboardingDone:true,level:'STANDARD'})}}}});
  const userId=user.id,categories=await tx.transactionCategory.findMany();
  const account=await tx.financialAccount.create({data:{userId,accountName:'Everyday bank',accountType:'BANK',openingBalance:'100000',openingDate:new Date('2025-07-01'),institution:'Fictional demo bank'}});
  const items=[['INCOME','Salary','2400000','2026-06-01','Annual salary'],['EXPENSE','Groceries','100000','2026-06-02','Household groceries']];
  const now=new Date(),year=now.getFullYear(),month=String(now.getMonth()+1).padStart(2,'0'),current=`${year}-${month}-01`;
  items.push(['INCOME','Salary','180000',current,'Monthly salary'],['EXPENSE','Rent','35000',current,'Home rent'],['EXPENSE','Food','4200',current,'Lunch & coffee'],['EXPENSE','Groceries','18000',current,'Weekly groceries']);
  for(const [type,category,amount,date,merchant]of items)await writeTransaction(tx,userId,{accountId:account.id,type:type as 'INCOME'|'EXPENSE',amount,date:new Date(date),categoryId:requireFound(categories.find(c=>c.type===type&&c.name===category)).id,merchant,description:'Fictional demo record',paymentMethod:'BANK',businessOrPersonal:'PERSONAL',taxRelevant:type==='INCOME',recurring:category==='Rent',source:'MANUAL',idempotencyKey:randomUUID(),person:'',subcategory:''});
  await tx.budget.create({data:{userId,name:'Monthly spending',period:'MONTHLY',startDate:new Date(current),endDate:new Date(Date.UTC(year,now.getMonth()+1,0)),amount:'80000'}});
  await tx.financialGoal.create({data:{userId,name:'Emergency reserve',targetAmount:'500000',currentAmount:'125000',targetDate:new Date(Date.UTC(year+1,11,31)),goalType:'EMERGENCY',minimumContribution:'10000'}});
  await tx.asset.create({data:{userId,description:'Family vehicle',assetType:'VEHICLE',acquisitionDate:new Date('2025-07-01'),acquisitionCost:'500000',currentDeclaredValue:'500000',sourceOfFunds:'Prior savings'}});
  await tx.liability.create({data:{userId,description:'Personal loan',liabilityType:'LOAN',originalAmount:'100000',outstandingAmount:'100000',monthlyPayment:'5000',lender:'Demo lender',startDate:new Date('2025-07-01')}});
  await tx.recurringObligation.create({data:{userId,merchant:'Home rent',category:'Rent',amount:'35000',intervalDays:30,nextDueDate:new Date(Date.UTC(year,now.getMonth()+1,1)),confidence:100,status:'CONFIRMED',fingerprint:'demo-rent'}});
  await tx.taxProfile.create({data:{userId,taxYear:2026,openingWealth:'500000',assetsReviewed:true,liabilitiesReviewed:true,withholdingReviewed:true,ordinaryResidentConfirmed:true}});
  await tx.withholdingTaxRecord.create({data:{userId,taxYear:2026,date:new Date('2026-06-30'),amount:'120000',section:'149',nature:'WITHHOLDING',payer:'Demo employer',certificateReference:'DEMO-CERTIFICATE',taxTreatment:'ADJUSTABLE'}});
  return user;
 });
 const calculation=await calculate(user.id,2026);
 await db.generatedReport.create({data:{userId:user.id,type:'TAX',snapshot:json(calculation)}});
 return user;
}

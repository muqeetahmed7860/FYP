import {db,type DB,json} from '../db';
import {preferenceSchema,configSchema} from '../../src/domain/preferences';
import {requireFound,AppError} from '../errors';
import {writeTransaction} from './ledger';
import {transactionSchema} from '../validation';

export async function preferences(userId:string,tx:DB=db){const row=await tx.userExperience.findUnique({where:{userId}});return preferenceSchema.parse(row?.preferences??{});}
export async function configuration(tx:DB=db){const row=await tx.systemSetting.findUnique({where:{key:'application'}});return configSchema.parse(row?.value??{});}
export const trashModels={transactions:'transaction',accounts:'financialAccount',budgets:'budget',goals:'financialGoal',assets:'asset',liabilities:'liability',withholding:'withholdingTaxRecord',recurring:'recurringObligation'} as const;
export async function archiveRecord(tx:DB,userId:string,resource:keyof typeof trashModels,snapshot:unknown){
 await tx.deletedRecord.deleteMany({where:{userId,expiresAt:{lt:new Date()}}});
 return tx.deletedRecord.create({data:{userId,resource,snapshot:json(snapshot),expiresAt:new Date(Date.now()+5*60000)}});
}
export async function restoreRecord(tx:DB,userId:string,id:string){
 const record=requireFound(await tx.deletedRecord.findFirst({where:{id,userId}}));
 if(record.expiresAt<new Date())throw new AppError('UNDO_EXPIRED','The undo window has ended. You can add this item again.',410);
 const resource=record.resource as keyof typeof trashModels, snapshot=record.snapshot as Record<string,any>;
 let restored;
 if(resource==='transactions'){
  const {id:_id,userId:_owner,createdAt:_createdAt,revision:_revision,...fields}=snapshot;
  restored=await writeTransaction(tx,userId,transactionSchema.parse({...fields,date:fields.date.slice(0,10),categoryId:fields.categoryId??undefined,destinationAccountId:fields.destinationAccountId??undefined}));
 }else{
  const {categories,allocations,...data}=snapshot;
  for(const key of ['openingDate','startDate','endDate','targetDate','acquisitionDate','date','nextDueDate'])if(data[key])data[key]=new Date(data[key]);
  if(categories)data.categories={create:categories.map((c:any)=>({categoryId:c.categoryId}))};
  if(allocations)data.allocations={create:allocations.map(({goalId:_id,createdAt,...a}:any)=>({...a,createdAt:new Date(createdAt)}))};
  restored=await (tx[trashModels[resource]] as any).create({data:{...data,userId}});
 }
 await tx.deletedRecord.delete({where:{id}});return restored;
}

import {type z} from 'zod';
import {atomic,audit,type DB} from '../db';
import {transactionSchema} from '../validation';
import {AppError,requireFound} from '../errors';
import {D,cash,balance,transferEntries} from '../../src/domain/money';
import {archiveRecord} from './experience';
export async function accounts(tx:DB,userId:string,asOf=new Date()){const rows=await tx.financialAccount.findMany({where:{userId,openingDate:{lte:asOf}},include:{entries:{where:{transaction:{date:{lte:asOf}}}}},orderBy:{accountName:'asc'}});return rows.map(({entries,...a})=>({...a,currentBalance:balance(a.openingBalance.toString(),entries.map(e=>e.amount.toString()))}));}
export async function saveTransaction(userId:string,input:unknown,id?:string){const data=transactionSchema.parse(input);return atomic(tx=>writeTransaction(tx,userId,data,id));}
export async function writeTransaction(tx:DB,userId:string,data:z.infer<typeof transactionSchema>,id?:string){
 const existing=id?requireFound(await tx.transaction.findFirst({where:{id,userId}})):null;
 if(existing&&data.revision!==existing.revision)throw new AppError('CONFLICT','Transaction changed. Reload before editing.',409);
 const ids=[data.accountId,...(data.type==='TRANSFER'?[data.destinationAccountId!]:[])];
 const owned=await tx.financialAccount.findMany({where:{id:{in:ids},userId,active:true}});
 if(owned.length!==ids.length)throw new AppError('AUTHORIZATION_ERROR','Select your active accounts.',403);
 if(owned.some(a=>a.openingDate>data.date))throw new AppError('VALIDATION_ERROR','Transaction predates account opening.');
 if(data.type!=='TRANSFER'){const category=await tx.transactionCategory.findFirst({where:{id:data.categoryId,type:data.type}});if(!category)throw new AppError('VALIDATION_ERROR','Category must match transaction type.');}
 const {revision:_revision,...fields}=data;
 const normalized={...fields,destinationAccountId:data.type==='TRANSFER'?data.destinationAccountId:null,categoryId:data.type==='TRANSFER'?null:data.categoryId,userId};
 const record=id?await tx.transaction.update({where:{id},data:{...normalized,revision:{increment:1}}}):await tx.transaction.create({data:normalized});
 if(id)await tx.ledgerEntry.deleteMany({where:{transactionId:id}});
 const amounts=data.type==='TRANSFER'?transferEntries(data.amount):[cash(data.type==='INCOME'?data.amount:D(data.amount).negated())];
 await tx.ledgerEntry.createMany({data:ids.map((accountId,i)=>({accountId,transactionId:record.id,amount:amounts[i]}))});
 await audit(tx,userId,id?'UPDATE':'CREATE','transaction',record.id);return record;
}
export async function deleteTransaction(userId:string,id:string){return atomic(async tx=>{const row=requireFound(await tx.transaction.findFirst({where:{id,userId}}));const undo=await archiveRecord(tx,userId,'transactions',row);await tx.transaction.delete({where:{id}});await audit(tx,userId,'DELETE','transaction',id);return {ok:true,undoId:undo.id,expiresAt:undo.expiresAt};});}

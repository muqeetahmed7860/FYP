import 'dotenv/config';
import {PrismaClient,Prisma} from '@prisma/client';
export const db=new PrismaClient();
export type DB=Prisma.TransactionClient;
export const json=(v:unknown):Prisma.InputJsonValue=>JSON.parse(JSON.stringify(v));
export const audit=(tx:DB,userId:string,action:string,entity:string,entityId:string,details?:unknown)=>tx.auditLog.create({data:{userId,action,entity,entityId,...(details===undefined?{}:{details:json(details)})}});
export async function atomic<T>(fn:(tx:DB)=>Promise<T>):Promise<T>{for(let n=0;;n++)try{return await db.$transaction(fn,{isolationLevel:'Serializable',timeout:20000});}catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError&&e.code==='P2034'&&n<3)continue;throw e;}}

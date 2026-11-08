import 'dotenv/config';
import {spawnSync} from 'node:child_process';
import {db} from '../server/db';

// Initialize a new application database once; redeployment never resets live rules.
try{
 const ruleCount=await db.taxRule.count();
 if(ruleCount){console.log('Existing tax configuration found; initialization skipped.');}
 else{
  const userCount=await db.user.count();
  if(userCount)throw new Error('This database has users but no tax rules. Review it before initialization.');
  const result=spawnSync(process.execPath,['--import','tsx','prisma/seed.ts'],{stdio:'inherit',env:{...process.env,NODE_ENV:'production'}});
  if(result.error)throw result.error;
  if(result.status!==0)throw new Error('Initial categories and tax rules could not be installed.');
 }
}finally{await db.$disconnect();}

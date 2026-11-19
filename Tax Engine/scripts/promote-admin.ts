import {db} from '../server/db';
const email=process.argv[2];if(!email)throw new Error('Usage: npm run admin -- registered-email');
const user=await db.user.update({where:{email:email.toLowerCase()},data:{role:'ADMIN'},select:{email:true}});console.log(`Administrator role assigned to ${user.email}.`);await db.$disconnect();

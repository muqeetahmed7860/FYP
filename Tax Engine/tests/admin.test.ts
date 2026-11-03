import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import {db} from '../server/db';
import {app} from '../server/app';
after(()=>db.$disconnect());
test('Admin clone, verify, publish and immutable version lifecycle',async()=>{
 const agent=supertest.agent(app),r=await agent.post('/api/auth/register').send({name:'Admin fixture',email:`admin-${crypto.randomUUID()}@example.test`,password:'Test-admin-password-123'}).expect(201),csrf=r.body.csrfToken;
 await db.user.update({where:{id:r.body.user.id},data:{role:'ADMIN'}});
 await agent.get('/api/admin/overview').expect(200);
 const version=Math.floor(Date.now()/1000);
 await agent.post('/api/admin/rules/clone').set('x-csrf-token',csrf).send({sourceYear:2026,sourceVersion:1,targetYear:2026,targetVersion:version}).expect(200);
 await agent.post('/api/admin/rules/publish').set('x-csrf-token',csrf).send({taxYear:2026,version}).expect(400);
 const rules=(await agent.get(`/api/tax/rules?year=2026&version=${version}`)).body;
 for(const source of rules){const draft={...source,verified:true};delete draft.id;delete draft.published;draft.effectiveFrom=draft.effectiveFrom.slice(0,10);draft.effectiveTo=draft.effectiveTo.slice(0,10);for(const key of ['slabs','references','conditions'])draft[key]=draft[key].map((item:any)=>{const out={...item};delete out.id;delete out.ruleId;delete out.verifiedAt;return out;});await agent.post('/api/admin/rules').set('x-csrf-token',csrf).send(draft).expect(201);}
 // Test publication on an isolated year so ordinary calculation tests keep their configured version.
 const target=2099;await db.taxYear.upsert({where:{year:target},create:{year:target,startDate:new Date('2098-07-01'),endDate:new Date('2099-06-30')},update:{}});
 await agent.post('/api/admin/rules/clone').set('x-csrf-token',csrf).send({sourceYear:2026,sourceVersion:version,targetYear:target,targetVersion:version}).expect(200);
 await db.taxRule.updateMany({where:{taxYear:target,version},data:{verified:true}});
 const result=await agent.post('/api/admin/rules/publish').set('x-csrf-token',csrf).send({taxYear:target,version}).expect(200);assert.equal(result.body.published,true);
 const published=await db.taxRule.findFirstOrThrow({where:{taxYear:target,version}});await assert.rejects(()=>db.taxRule.update({where:{id:published.id},data:{name:'Mutated'}}));
});

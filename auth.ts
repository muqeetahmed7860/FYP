import {Router,type Request,type Response,type NextFunction} from 'express';
import {randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import bcrypt from 'bcryptjs';
import {rateLimit} from 'express-rate-limit';
import {z} from 'zod';
import {db,atomic,audit} from './db';
import {AppError} from './errors';
import {createDemo} from './services/demo';
import {configuration} from './services/experience';
import {json} from './db';
import {defaultPreferences} from '../src/domain/preferences';
declare global{namespace Express{interface Request{userId:string;role:string;sessionId:string;csrfToken:string;}}}
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const credentials=z.object({email:z.string().email().max(254).transform(v=>v.trim().toLowerCase()),password:z.string().min(12).max(72).refine(v=>Buffer.byteLength(v,'utf8')<=72,'Password must be at most 72 UTF-8 bytes.')});
const dummyHash=bcrypt.hashSync('invalid-password-placeholder',12);
const options={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/',maxAge:7*86400000};
async function session(res:Response,userId:string,device='Browser'){const token=randomBytes(32).toString('hex'),csrfToken=randomBytes(32).toString('hex');await db.session.create({data:{id:hash(token),userId,csrfToken,device,expiresAt:new Date(Date.now()+7*86400000)}});res.cookie('hk_session',token,options);return csrfToken;}
export const authRouter=Router();
authRouter.use(['/login','/register','/demo'],rateLimit({windowMs:15*60000,limit:30,standardHeaders:'draft-8',legacyHeaders:false,message:{error:{code:'RATE_LIMIT',message:'Too many sign-in attempts. Please wait 15 minutes and try again.'}}}));
authRouter.post('/register',async(req,res)=>{const data=credentials.extend({name:z.string().trim().min(2).max(100)}).parse(req.body);const passwordHash=await bcrypt.hash(data.password,12);const config=await configuration();const user=await atomic(async tx=>{const u=await tx.user.create({data:{email:data.email,passwordHash,profile:{create:{name:data.name}},experience:{create:{preferences:json({...defaultPreferences,language:config.defaultLanguage})}}}});await audit(tx,u.id,'REGISTER','user',u.id);return u;});const csrfToken=await session(res,user.id);res.status(201).json({user:{id:user.id,email:user.email,role:user.role},csrfToken});});
authRouter.post('/login',async(req,res)=>{const data=credentials.parse(req.body),user=await db.user.findUnique({where:{email:data.email}}),valid=await bcrypt.compare(data.password,user?.passwordHash??dummyHash);if(!user||!valid||user.status!=='ACTIVE')throw new AppError('AUTHENTICATION_ERROR','Invalid email or password.',401);if(req.cookies.hk_session)await db.session.deleteMany({where:{id:hash(req.cookies.hk_session)}});await audit(db,user.id,'LOGIN','security',user.id);const csrfToken=await session(res,user.id,(req.header('user-agent')??'Browser').slice(0,160));res.json({user:{id:user.id,email:user.email,role:user.role},csrfToken});});
authRouter.get('/options',(_q,s)=>s.json({demo:process.env.NODE_ENV!=='production'||process.env.ALLOW_DEMO==='true'}));
authRouter.post('/demo',async(_q,s)=>{if(process.env.NODE_ENV==='production'&&process.env.ALLOW_DEMO!=='true')throw new AppError('NOT_FOUND','Demo is unavailable.',404);const user=await createDemo();const csrfToken=await session(s,user.id);s.status(201).json({user:{id:user.id,email:user.email,role:user.role},csrfToken});});
export async function authenticated(req:Request,_res:Response,next:NextFunction){const token=req.cookies.hk_session;if(typeof token!=='string')throw new AppError('AUTHENTICATION_ERROR','Please sign in.',401);const s=await db.session.findUnique({where:{id:hash(token)},include:{user:true}});if(!s||s.expiresAt<new Date()||s.user.status!=='ACTIVE')throw new AppError('AUTHENTICATION_ERROR','Session expired. Please sign in.',401);req.userId=s.userId;req.role=s.user.role;req.sessionId=s.id;req.csrfToken=s.csrfToken;if(!['GET','HEAD','OPTIONS'].includes(req.method)){const given=req.header('x-csrf-token')??'';if(Buffer.byteLength(given)!==Buffer.byteLength(s.csrfToken)||!timingSafeEqual(Buffer.from(given),Buffer.from(s.csrfToken)))throw new AppError('CSRF_ERROR','Request verification failed. Refresh and retry.',403);}next();}
export const admin=(req:Request,_res:Response,next:NextFunction)=>{if(req.role!=='ADMIN')throw new AppError('AUTHORIZATION_ERROR','Administrator access required.',403);next();};

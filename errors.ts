export class AppError extends Error{constructor(public code:string,message:string,public status=400){super(message);}}
export function requireFound<T>(v:T|null|undefined):T{if(!v)throw new AppError('NOT_FOUND','Record not found.',404);return v;}

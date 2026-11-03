import type {Trace} from '../types/index';
export function explanationEngine(){const trace:Trace[]=[];return {trace,add:(step:Omit<Trace,'step'>)=>trace.push({step:trace.length+1,...step})};}

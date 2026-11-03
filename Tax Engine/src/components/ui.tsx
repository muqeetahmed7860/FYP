import type {ReactNode} from 'react';
import {ArrowUpRight,CheckCircle2,AlertCircle} from 'lucide-react';
export const money=(n:number|null|undefined)=>n===null||n===undefined?'—':new Intl.NumberFormat('en-PK',{maximumFractionDigits:2}).format(n);
export const rupees=(n:number|null|undefined)=>n===null||n===undefined?'RULE DATA REQUIRED':`Rs. ${money(n)}`;
export const titleCase=(s:string)=>s.replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
export function Badge({children,tone='green'}:{children:ReactNode;tone?:'green'|'amber'|'blue'|'gray'}){return <span className={`badge ${tone}`}>{children}</span>;}
export function Card({title,subtitle,action,children,className=''}:{title?:string;subtitle?:string;action?:ReactNode;children:ReactNode;className?:string}){return <section className={`card ${className}`}>{title&&<div className="card-heading"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>}{children}</section>;}
export function Metric({label,value,caption,icon:Icon,accent=false}:{label:string;value:string;caption:string;icon:any;accent?:boolean}){return <div className={`metric ${accent?'accent':''}`}><div className="metric-top"><span>{label}</span><Icon size={18} aria-hidden="true"/></div><div className="metric-value">{value}</div><p>{caption}</p></div>;}
export function Table({headers,rows}:{headers:string[];rows:ReactNode[][]}){return <div className="table-wrap"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}{!rows.length&&<tr><td colSpan={headers.length}>No records entered.</td></tr>}</tbody></table></div>;}
export function Info({children,warning=false}:{children:ReactNode;warning?:boolean}){const Icon=warning?AlertCircle:CheckCircle2;return <div className={`info ${warning?'warning':''}`}><Icon size={18} aria-hidden="true"/><div>{children}</div></div>;}
export function LinkButton({children,onClick}:{children:ReactNode;onClick:()=>void}){return <button className="link-button" onClick={onClick}>{children}<ArrowUpRight size={16} aria-hidden="true"/></button>;}
export function KeyValues({rows}:{rows:[string,ReactNode][]}){return <dl className="key-values">{rows.map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>;}

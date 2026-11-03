import {useEffect,useState} from 'react';
import {request} from './client';
export function useTaxYears(userId?:string){const [years,setYears]=useState([2026,2027]);useEffect(()=>{if(!userId)return;let active=true;const load=()=>{void request<{year:number}[]>('/tax/years').then(rows=>{if(active)setYears(rows.map(r=>r.year).sort((a,b)=>a-b));}).catch(error=>console.error('Tax-year list unavailable:',error.message));};load();window.addEventListener('tax-years-updated',load);return()=>{active=false;window.removeEventListener('tax-years-updated',load);};},[userId]);return years;}

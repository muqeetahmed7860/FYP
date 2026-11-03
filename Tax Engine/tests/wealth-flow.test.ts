import {test} from 'node:test';
import assert from 'node:assert/strict';
import {wealthFlows} from '../src/domain/wealthFlows';
import {reconcile} from '../src/domain/finance';
test('Capital movements do not masquerade as wealth creation or consumption',()=>{const transactions=[{type:'INCOME',category:'Loan Received',amount:'10000'},{type:'EXPENSE',category:'Asset Purchase',amount:'5000'},{type:'EXPENSE',category:'Loan Principal',amount:'1000'},{type:'EXPENSE',category:'Other',amount:'200'}],flows=wealthFlows(transactions);assert.equal(flows.income,'0.00');assert.equal(flows.expenses,'200.00');assert.equal(reconcile('1000','800',flows.income,flows.expenses,'0','0').difference,'0.00');});

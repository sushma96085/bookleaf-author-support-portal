import test from 'node:test';
import assert from 'node:assert/strict';
import {suggest} from '../src/ai.js';
const cases=[
 ['Royalty inquiry','My royalty payout','I have not received payment','Royalty & Payments','Medium'],
 ['Incorrect ISBN escalation','Incorrect ISBN','My ISBN is wrong on the listing','ISBN & Metadata Issues','High'],
 ['Printing quality','Damaged copy','The print quality is poor','Printing & Quality','Medium'],
 ['Distribution issue','Amazon listing','My book is unavailable on Amazon','Distribution & Availability','Medium'],
 ['Production update','Book status','Please share the editing and production status','Book Status & Production Updates','Medium']
];
for(const [name,subject,description,category,priority] of cases){
 test(name,()=>{
  const result=suggest({subject,description});
  assert.equal(result.category,category);
  assert.equal(result.priority,priority);
  assert.ok(result.draft.includes('BookLeaf'));
 });
}

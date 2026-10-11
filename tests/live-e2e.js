import 'dotenv/config';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
const port=String(5109),base='http://127.0.0.1:'+port+'/api';
const server=spawn(process.execPath,['server.js'],{env:{...process.env,PORT:port},stdio:'pipe'});
let stderr='';server.stderr.on('data',d=>stderr+=d.toString());
async function request(path,method='GET',body,token){
 const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const data=await r.json().catch(()=>({}));return {status:r.status,data};
}
try{
 let ready=false;for(let i=0;i<35;i++){if(server.exitCode!==null)break;try{const r=await request('/health');if(r.status===200){ready=true;break}}catch{}await delay(1000)}
 assert.ok(ready,'Server failed to start: '+stderr.slice(-1000));
 const author=await request('/auth/login','POST',{email:process.env.SEED_AUTHOR_EMAIL||'priya.sharma@email.com',password:process.env.SEED_AUTHOR_PASSWORD});
 assert.equal(author.status,200,'Author login');assert.ok(author.data.token);
 const admin=await request('/auth/login','POST',{email:process.env.SEED_ADMIN_EMAIL||'admin@bookleaf.test',password:process.env.SEED_ADMIN_PASSWORD});
 assert.equal(admin.status,200,'Admin login');assert.ok(admin.data.token);
 const books=await request('/books','GET',null,author.data.token);
 assert.equal(books.status,200);assert.ok(books.data.length>0,'Seeded author has books');
 const ticket=await request('/tickets','POST',{bookId:books.data[0]._id,subject:'E2E Test Book Status',description:'Please share the current production status of this book.'},author.data.token);
 assert.equal(ticket.status,201,'Ticket creation');const id=ticket.data.id;assert.ok(id);
 const denied=await request('/admin/tickets/'+id,'PATCH',{status:'In Progress'},author.data.token);assert.equal(denied.status,403,'Author forbidden from admin endpoint');
 const updated=await request('/admin/tickets/'+id,'PATCH',{status:'In Progress',priority:'High'},admin.data.token);assert.equal(updated.status,200);
 const note=await request('/admin/tickets/'+id+'/notes','POST',{body:'Internal test note - must stay private'},admin.data.token);assert.equal(note.status,200);
 const reply=await request('/admin/tickets/'+id+'/reply','POST',{body:'BookLeaf team is reviewing your production status.'},admin.data.token);assert.equal(reply.status,200);
 const list=await request('/tickets','GET',null,author.data.token);assert.equal(list.status,200);
 const own=list.data.find(t=>t._id===id);assert.ok(own,'Author sees ticket');assert.equal(own.status,'In Progress');assert.ok(own.messages.some(m=>m.by==='admin'));
 assert.ok(!Object.hasOwn(own,'internalNotes'),'Author cannot read private notes');
 assert.ok(!Object.hasOwn(own,'aiDraft'),'Author cannot read AI draft');
 console.log('PASS: health, author login, admin login, books, ticket, role isolation, admin update, private notes, admin reply, author visibility');
}finally{server.kill('SIGTERM')}

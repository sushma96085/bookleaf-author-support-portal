import {readFileSync} from 'node:fs';
const categories=['Royalty & Payments','ISBN & Metadata Issues','Printing & Quality','Distribution & Availability','Book Status & Production Updates','General Inquiry'];
const kb=readFileSync(new URL('../data/knowledge-base.md',import.meta.url),'utf8');
export function suggest(ticket){
 const s=(ticket.subject+' '+ticket.description).toLowerCase();
 const category=/royalt|payout|payment/.test(s)?categories[0]:/isbn|metadata/.test(s)?categories[1]:/print|damag|quality/.test(s)?categories[2]:/amazon|flipkart|distribut|stock|unavailable/.test(s)?categories[3]:/production|status|editing|proofread|cover/.test(s)?categories[4]:categories[5];
 const priority=/isbn wrong|incorrect isbn|fraud|urgent|critical/.test(s)?'High':'Medium';
 const guidance={
 [categories[0]]:'Royalty is calculated as 80% of net profit and paid quarterly, normally within 45 days after quarter end, subject to a ₹1,000 minimum payout.',
 [categories[1]]:'BookLeaf assigns ISBNs; an incorrect ISBN requires prompt verification and escalation.',
 [categories[2]]:'Printing typically takes 5–7 business days. For quality complaints, please share photographs for verification; confirmed issues qualify for a free reprint.',
 [categories[3]]:'Marketplace listings typically take 7–10 business days. Stock resynchronization may take 24–48 hours.',
 [categories[4]]:'Our production workflow progresses through editing, cover design, typesetting, proofreading, ISBN assignment, printing, distribution setup and publication.',
 [categories[5]]:'Our support team will review the information and confirm the next step.'
 };
 return {category,priority,draft:'Thank you for contacting BookLeaf about '+ticket.subject+'. '+guidance[category]+' We will verify your specific case and update you.'};
}
export async function suggestAI(ticket){
 const fallback=suggest(ticket);
 if(!process.env.OPENAI_API_KEY)return fallback;
 try{
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),7000);
  let response;
  try{response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{'Authorization':'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.2,response_format:{type:'json_object'},messages:[{role:'system',content:'You assist BookLeaf support admins. Return only JSON with category, priority, draft. Allowed categories: '+categories.join('; ')+'. Priority Critical, High, Medium, Low. Ground replies only in this KB. Never invent ticket-specific resolutions.\n'+kb},{role:'user',content:JSON.stringify({subject:ticket.subject,description:ticket.description})}]})});}finally{clearTimeout(timeout)}
  if(!response.ok)return fallback;
  const data=await response.json();const obj=JSON.parse(data.choices?.[0]?.message?.content||'{}');
  if(!categories.includes(obj.category)||!['Critical','High','Medium','Low'].includes(obj.priority)||typeof obj.draft!=='string'||!obj.draft.trim())return fallback;
  return {category:obj.category,priority:obj.priority,draft:obj.draft.slice(0,3000)};
 }catch{return fallback}
}
export const categoriesList=categories;

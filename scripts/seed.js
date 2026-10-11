import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {User,Book} from '../src/models.js';
if(!process.env.MONGODB_URI)throw Error('MONGODB_URI required');
if(!process.env.SEED_ADMIN_PASSWORD||!process.env.SEED_AUTHOR_PASSWORD)throw Error('SEED_ADMIN_PASSWORD and SEED_AUTHOR_PASSWORD required');
const path=resolve(process.argv[2]||'data/bookleaf_sample_data.json');
const {authors}=JSON.parse(readFileSync(path,'utf8'));
if(!Array.isArray(authors)||authors.length===0)throw Error('Invalid sample dataset');
await mongoose.connect(process.env.MONGODB_URI);
try{
 const adminEmail=(process.env.SEED_ADMIN_EMAIL||'admin@bookleaf.test').toLowerCase();
 await User.findOneAndUpdate({email:adminEmail},{name:'BookLeaf Admin',email:adminEmail,role:'admin',passwordHash:await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD,12)},{upsert:true,new:true,runValidators:true});
 let books=0;
 for(const item of authors){
  const email=item.email.toLowerCase();
  const user=await User.findOneAndUpdate({email},{name:item.name,email,role:'author',passwordHash:await bcrypt.hash(process.env.SEED_AUTHOR_PASSWORD,12)},{upsert:true,new:true,runValidators:true});
  for(const b of item.books||[]){
   await Book.findOneAndUpdate({authorId:user._id,isbn:b.isbn},{authorId:user._id,title:b.title,isbn:b.isbn,genre:b.genre,publicationDate:b.publication_date?new Date(b.publication_date):undefined,status:b.status,mrp:b.mrp,copiesSold:b.total_copies_sold,royaltyEarned:b.total_royalty_earned,royaltyPaid:b.royalty_paid,royaltyPending:b.royalty_pending},{upsert:true,new:true,runValidators:true});
   books++;
  }
 }
 console.log('Seed complete:',authors.length,'authors,',books,'books, 1 admin');
}finally{await mongoose.disconnect()}

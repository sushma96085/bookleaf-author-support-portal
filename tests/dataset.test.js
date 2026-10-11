import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {authors}=JSON.parse(readFileSync(new URL('../data/bookleaf_sample_data.json',import.meta.url),'utf8'));
test('dataset has 10 authors',()=>assert.equal(authors.length,10));
test('dataset has 18 books',()=>assert.equal(authors.reduce((n,a)=>n+a.books.length,0),18));
test('author emails unique',()=>assert.equal(new Set(authors.map(a=>a.email)).size,authors.length));
test('book ids unique',()=>{const ids=authors.flatMap(a=>a.books.map(b=>b.book_id));assert.equal(new Set(ids).size,ids.length)});
test('royalties reconcile',()=>{for(const a of authors)for(const b of a.books)assert.equal(b.total_royalty_earned,b.royalty_paid+b.royalty_pending)});

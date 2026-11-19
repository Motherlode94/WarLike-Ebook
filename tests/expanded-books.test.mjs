import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ids=['ligne','jours','toi','dieu','ombres','heures','archives','neon'];
test('eight seasons contain 50 readable chapters and ten episodes without gaps',()=>{
 const all=new Set();
 for(const id of ids){
  const book=JSON.parse(readFileSync(new URL('../assets/seasons/'+id+'.json',import.meta.url),'utf8'));
  assert.equal(book.chapters.length,50,id);assert.equal(book.episodes.length,10,id);
  assert.deepEqual(book.episodes.flatMap(e=>e.chapters),Array.from({length:50},(_,i)=>i+1));
  book.chapters.forEach((chapter,index)=>{
   assert.equal(chapter.number,index+1);assert.ok(chapter.title.trim());
   const text=chapter.readingText||chapter.text;assert.equal(typeof text,'string',id+' '+chapter.number);
   assert.ok(text.trim().split(/\s+/).length>=70,id+' '+chapter.number+' needs narrative text');
   if(chapter.source?.startsWith('Suite originale ·')){assert.ok(!all.has(text));all.add(text);assert.ok(!/TODO|à rédiger|lorem ipsum/i.test(text))}
  });
 }
 assert.equal(all.size,229);
});
test('SEVEN exposes fifty numbered chapters, a prologue and speech controls',()=>{
 const html=readFileSync(new URL('../seven-livre.html',import.meta.url),'utf8');
 assert.equal((html.match(/id="chapitre-\d+"/g)||[]).length,50);
 for(const item of ['id="prologue"','seven-picker','seven-prev','seven-next','mountReadAloud','warlike-reading-seven','warlike-seven-tome-1.epub'])assert.ok(html.includes(item));
 for(let n=1;n<=50;n++)assert.ok(html.includes('id="chapitre-'+n+'"'));
 assert.ok(!html.includes('FIN DU TOME I.</p></section><section'));
});
test('speech is mounted by all shared readers and reset on close',()=>{
 const tools=readFileSync(new URL('../reader-tools.js',import.meta.url),'utf8');assert.ok(tools.includes('mountReadAloud'));
 for(const name of ['reader.html','saisons.html','nouveaux-romans.html']){
  const html=readFileSync(new URL('../'+name,import.meta.url),'utf8');assert.ok(html.includes('read-aloud.css'));
 }
 for(const name of ['saisons.html','nouveaux-romans.html'])assert.ok(readFileSync(new URL('../'+name,import.meta.url),'utf8').includes('warlike:reading-close'));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CATALOG,SEASONS,NOVELS,PDFS,getProgress,normalizeChapter,resumeUrl} from '../reading-dashboard.js';
test('dashboard represents all existing collections without fictional publication counts',()=>{
 assert.equal(SEASONS.length,8);assert.equal(NOVELS.length,5);assert.equal(PDFS.length,3);assert.equal(CATALOG.length,16);
 assert.equal(CATALOG.find(b=>b.id==='abime').total,50);
 assert.equal(CATALOG.find(b=>b.id==='valdorne').title,'Les Héritiers de Valdorne');
 assert.equal(CATALOG.find(b=>b.id==='arodan').title,'Arodan — Le Sang des Libres');
});
test('season handles duplicate, invalid and out of order chapter numbers',()=>{
 const book=CATALOG.find(b=>b.kind==='season'&&b.id==='heures');
 const data=new Map([['warlike:chapters:heures','[2,2,19,0,"x",51,1]']]);
 const progress=getProgress(book,key=>data.get(key)??null);
 assert.equal(progress.seen,3);assert.equal(progress.position,19);assert.equal(progress.next,20);
 assert.equal(resumeUrl(book,progress),'./saisons.html?livre=heures&chapitre=20');
 assert.equal(getProgress(book,()=>'{bad').seen,0);
});
test('novel resumes from correctly converted zero-based index',()=>{
 const book=CATALOG.find(b=>b.kind==='novel'&&b.id==='brume');
 assert.equal(getProgress(book,()=>null).started,false);
 const progress=getProgress(book,()=>String(12));
 assert.equal(progress.position,13);
 assert.equal(resumeUrl(book,progress),'./nouveaux-romans.html?livre=brume&chapitre=13');
});
test('PDF page resume preserves its page number',()=>{
 const book=CATALOG.find(b=>b.kind==='pdf'&&b.id==='ombres');
 const progress=getProgress(book,()=>String(8));
 assert.equal(progress.position,8);
 assert.equal(resumeUrl(book,progress),'./reader.html?livre=ombres&page=8');
});
test('HTML has all interactive dashboard hooks',()=>{
 const html=readFileSync(new URL('../ma-lecture.html',import.meta.url),'utf8');
 for(const id of ['started','chapters','finished','inProgress','catalog','search','kind','export','clear','notice'])assert.ok(html.includes('id="'+id+'"'),id+' missing');
 assert.equal(normalizeChapter(0,20),null);
 assert.equal(normalizeChapter(21,20),null);
});

 test('expanded seasons resume at 50 and previous progress stays readable',()=>{
 const item=CATALOG.find(b=>b.kind==='season'&&b.id==='jours');assert.equal(item.total,50);
 assert.equal(getProgress(item,()=>JSON.stringify(Array.from({length:20},(_,i)=>i+1))).finished,false);
 const progress=getProgress(item,()=>JSON.stringify(Array.from({length:50},(_,i)=>i+1)));assert.equal(progress.finished,true);assert.equal(progress.next,50);
 const seven=CATALOG.find(b=>b.id==='seven');assert.equal(resumeUrl(seven,getProgress(seven,()=> '49')),'./seven-livre.html?chapitre=50');
 });

test('jumping to final novel chapter does not imply all chapters opened',()=>{const book=CATALOG.find(b=>b.id==='abime');const data=new Map([['warlike-reading-abime','49'],['warlike:novel-chapters:abime','[1,50,50]']]);const p=getProgress(book,k=>data.get(k)??null);assert.equal(p.seen,2);assert.equal(p.position,50);assert.equal(p.finished,false);data.set('warlike:novel-chapters:abime',JSON.stringify(Array.from({length:50},(_,i)=>i+1)));assert.equal(getProgress(book,k=>data.get(k)??null).finished,true);});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STORE_KEY,cleanEntry,loadEntries,saveEntries,makeKey,bookmarkUrl,entryMatches} from '../reader-tools.js';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}};
const bookmark={type:'bookmark',kind:'season',book:'heures',position:13,quote:'',note:''};
test('validates references and avoids unsafe malformed imported records',()=>{
 assert.equal(cleanEntry({...bookmark,position:0}),null);
 assert.equal(cleanEntry({...bookmark,book:'../../bad'}),null);
 assert.equal(cleanEntry({...bookmark,type:'highlight',quote:''}),null);
 assert.equal(cleanEntry(bookmark).position,13);
});
test('bookmarks and annotations persist locally and have distinct book scopes',()=>{
 const db=storage(),a=cleanEntry(bookmark),b=cleanEntry({type:'note',kind:'novel',book:'brume',position:8,quote:'une phrase',note:'à retenir'});
 assert.equal(saveEntries([a,b],db),true);
 const saved=loadEntries(db);
 assert.equal(saved.length,2);
 assert.equal(entryMatches(saved[0],{kind:'season',book:'heures',position:13}),true);
 assert.equal(entryMatches(saved[1],{kind:'season',book:'heures',position:13}),false);
 assert.equal(makeKey(a),'season:heures:13');
 assert.ok(db.getItem(STORE_KEY).includes('brume'));
});
test('bookmark deep links resume at exact page or chapter',()=>{
 assert.equal(bookmarkUrl(bookmark),'./saisons.html?livre=heures&chapitre=13');
 assert.equal(bookmarkUrl({kind:'pdf',book:'dieu',position:5}),'./reader.html?livre=dieu&page=5');
 assert.equal(bookmarkUrl({kind:'novel',book:'arodan',position:41}),'./nouveaux-romans.html?livre=arodan&chapitre=41');
});
test('stored notes reject malformed storage and large entries are bounded',()=>{
 const db=storage();db.setItem(STORE_KEY,'{bad');
 assert.deepEqual(loadEntries(db),[]);
 const note=cleanEntry({type:'note',kind:'pdf',book:'toi',position:2,quote:'x'.repeat(800),note:'y'.repeat(1900)});
 assert.equal(note.quote.length,500);
 assert.equal(note.note.length,1500);
});
test('three source readers include notebook and change announcements',()=>{
 for(const file of ['reader.html','saisons.html','nouveaux-romans.html']){
  const html=readFileSync(new URL('../'+file,import.meta.url),'utf8');
  assert.ok(html.includes('reader-tools.js'),file+' missing notebook module');
  assert.ok(html.includes('reader-tools.css'),file+' missing styles');
  assert.ok(html.includes('warlike:reading-change'),file+' missing reader change event');
 }
});

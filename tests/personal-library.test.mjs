import test from 'node:test';
import assert from 'node:assert/strict';
import {validateImport,extensionOf,MAX_FILE_BYTES} from '../personal-books.js';
import {BACKUP_SCHEMA,createBackup,restoreBackup,validateBackup,PROGRESS_KEYS} from '../reading-backup.js';
const fakeStore=()=>{const values=new Map();return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)}};
test('PDF and EPUB import restrictions',()=>{
 assert.equal(extensionOf('Roman.PDF'),'pdf');assert.equal(extensionOf('saga.epub'),'epub');
 assert.equal(extensionOf('archive.exe'),null);
 assert.equal(validateImport({name:'Livre.pdf',size:200}).format,'pdf');
 assert.throws(()=>validateImport({name:'Virus.html',size:200}),/PDF et EPUB/);
 assert.throws(()=>validateImport({name:'Livre.epub',size:MAX_FILE_BYTES+1}),/30 Mio/);
});
test('reading backup retains only whitelisted keys and notes',()=>{
 const db=fakeStore();db.setItem('warlike:chapters:heures','[1,2,3]');db.setItem('warlike-reading-brume','8');db.setItem('warlike:reader-tools:v1','[{"kind":"season","book":"heures","position":2,"type":"bookmark"}]');db.setItem('unrelated-token','secret');
 const backup=createBackup(db);assert.equal(backup.schema,BACKUP_SCHEMA);
 assert.equal(Object.keys(backup.data).length,3);assert.ok(!JSON.stringify(backup).includes('secret'));
 const fresh=fakeStore();assert.equal(restoreBackup(backup,fresh),3);
 assert.equal(fresh.getItem('warlike-reading-brume'),'8');assert.equal(fresh.getItem('warlike:chapters:heures'),'[1,2,3]');
});
test('rejects malformed or unknown backup keys and out-of-bounds values',()=>{
 assert.throws(()=>validateBackup({schema:BACKUP_SCHEMA,data:{password:'x'}}),/non autorisé/);
 assert.throws(()=>validateBackup({schema:BACKUP_SCHEMA,data:{'warlike-reading-brume':'88'}}),/Index/);
 assert.throws(()=>validateBackup({schema:BACKUP_SCHEMA,data:{'warlike:chapters:heures':'[1,21]'}}),/invalides/);
 assert.throws(()=>validateBackup({schema:BACKUP_SCHEMA,data:{'warlike:reader-tools:v1':'[{"type":"note","kind":"pdf","book":"../../","position":1,"quote":"hey"}]'}}),/malformée/);
 assert.ok(PROGRESS_KEYS.includes('warlike:reader-tools:v1'));
});
test('restoration restores previous values when localStorage write fails',()=>{
 const map=new Map([['warlike-reading-brume','2']]);let fail=true;
 const db={getItem:k=>map.get(k)??null,setItem:(key,value)=>{if(key==='warlike:chapters:heures'&&fail){fail=false;throw Error('Quota')};map.set(key,value)},removeItem:k=>map.delete(k)};
 const data={schema:BACKUP_SCHEMA,data:{'warlike-reading-brume':'4','warlike:chapters:heures':'[1]'}};
 assert.throws(()=>restoreBackup(data,db),/annulée/);assert.equal(map.get('warlike-reading-brume'),'2');
});
test('V3 pages and links are present',async()=>{
 const {readFileSync}=await import('node:fs');
 const page=readFileSync(new URL('../mes-livres.html',import.meta.url),'utf8');
 for(const id of ['importForm','bookFile','personalBooks','epubArea','pdfArea','previous','next','reader'])assert.ok(page.includes('id="'+id+'"'),id);
 const dashboard=readFileSync(new URL('../ma-lecture.html',import.meta.url),'utf8');
 assert.ok(dashboard.includes('id="importBackup"'));
 assert.ok(dashboard.includes('mes-livres.html'));
});

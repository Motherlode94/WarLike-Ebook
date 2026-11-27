import {encryptReadingBackup,restoreEncryptedBackup} from './encrypted-reading-backup.js';
import {createBackup,restoreBackup} from './reading-backup.js';
import {loadEntries,bookmarkUrl} from './reader-tools.js';
import {openedChapters} from './novel-progress.js';
// WarLike Ebook — local reading dashboard. This module never changes manuscript content.
export const SEASONS=[
 ['ligne','La Dernière Ligne','Guerre / Drame'],['jours','Les Jours Interdits','Romance adulte'],
 ['toi','Jusqu’à Toi','Survival'],['dieu','Le Dieu Oublié','Dark Fantasy'],
 ['ombres','La Promesse des Ombres','Ninja / Fantasy'],['heures','Les Heures Creuses','Horreur surnaturelle'],
 ['archives','Les Archives du Silence','Policier / Mystère'],['neon','Les Fantômes de Néon','Cyberpunk']
];
export const NOVELS=[
 ['seven','WarLike SEVEN — Les voix derrière la lumière','Science-fiction / Musique'],
 ['brume','Les Veilleurs de Brume','Mystère surnaturel'],
 ['valdorne','Les Héritiers de Valdorne','Thriller adolescent'],
 ['arodan','Arodan — Le Sang des Libres','Épopée antique et révolte'],
 ['abime','Les Jardins de l’Abîme','Dark fantasy / Horreur spirituelle'],
 ['extinction','EXTINCTION 2091','Science-fiction / Apocalypse']
];
export const PDFS=[
 ['ombres','La Promesse des Ombres · extrait'],
 ['toi','Jusqu’à Toi · Les Terres Noyées'],
 ['dieu','Le Dieu Oublié · chapitres I à X']
];
export const CATALOG=[
 ...SEASONS.map(([id,title,genre])=>({kind:'season',id,title,genre,total:50,href:'./saisons.html?livre='+id})),
 ...NOVELS.map(([id,title,genre])=>({kind:'novel',id,title,genre,total:50,href:id==='seven'?'./seven-livre.html':'./nouveaux-romans.html?livre='+id})),
 ...PDFS.map(([id,title])=>({kind:'pdf',id,title,genre:'Manuscrit / PDF',total:0,href:'./reader.html?livre='+id}))
];
const safeStorage={
 get(key){try{return window.localStorage.getItem(key)}catch{return null}},
 remove(key){try{window.localStorage.removeItem(key);return true}catch{return false}}
};
export function normalizeChapter(value,total){
 const n=Number(value);return Number.isInteger(n)&&n>=1&&n<=total?n:null;
}
export function getProgress(item,get=safeStorage.get){
 if(item.kind==='season'){
  let raw=[];try{raw=JSON.parse(get('warlike:chapters:'+item.id)||'[]')}catch{}
  if(!Array.isArray(raw))raw=[];
  const chapters=[...new Set(raw.map(v=>normalizeChapter(v,item.total)).filter(Boolean))].sort((a,b)=>a-b);
  return {started:chapters.length>0,seen:chapters.length,total:item.total,position:chapters.at(-1)||1,
   next:chapters.length===item.total?item.total:Math.min(item.total,(chapters.at(-1)||0)+1),finished:chapters.length===item.total};
 }
 if(item.kind==='novel'){
  const saved=Number(get('warlike-reading-'+item.id));
  // Novels store a zero-based last chapter index. A missing key means no started reading.
  const started=get('warlike-reading-'+item.id)!==null&&Number.isInteger(saved)&&saved>=0&&saved<item.total;
  const position=started?saved+1:1;
  const chapters=openedChapters(get('warlike:novel-chapters:'+item.id),item.total);
  const seen=chapters.length;
  return {started:started||seen>0,seen,total:item.total,position:started?position:(chapters.at(-1)||1),next:started?position:(chapters.at(-1)||1),finished:seen===item.total};
 }
 const current=Number(get('warlike-ebook:page:'+item.id));
 const started=Number.isInteger(current)&&current>=1&&get('warlike-ebook:page:'+item.id)!==null;
 return {started,seen:started?current:0,total:0,position:started?current:1,next:started?current:1,finished:false};
}
export function resumeUrl(item,progress){
 const url=new URL(item.href,'https://warlike.local/');
 if(item.kind==='pdf')url.searchParams.set('page',String(progress.position));
 else url.searchParams.set('chapitre',String(progress.next));
 return url.pathname.replace(/^\//,'./')+url.search;
}
function element(tag,content,cls){const e=document.createElement(tag);if(content!==undefined)e.textContent=String(content);if(cls)e.className=cls;return e}
function makeCard(item,progress){
 const article=element('article',undefined,'card');article.append(element('span',item.kind==='season'?'Saison de 50 chapitres':item.kind==='novel'?'Saga de 50 chapitres':'Pages de manuscrit','type'));
 article.append(element('h3',item.title),element('p',item.genre));
 const desc=progress.started?(item.kind==='pdf'?'Dernière page : '+progress.position:progress.seen+' / '+item.total+' chapitres ouverts'):'Pas encore commencé';
 article.append(element('p',desc));
 if(item.total){const track=element('div',undefined,'track');track.setAttribute('role','progressbar');track.setAttribute('aria-label','Progression de '+item.title);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(item.total));track.setAttribute('aria-valuenow',String(progress.seen));const fill=element('div');fill.style.width=Math.min(100,progress.seen/item.total*100)+'%';track.append(fill);article.append(track)}
 const link=element('a',progress.started?'Reprendre la lecture':'Commencer la lecture','resume');link.href=resumeUrl(item,progress);article.append(link);
 return article;
}
function notice(message){const target=document.getElementById('notice');target.hidden=false;target.textContent=message}
function state(){return CATALOG.map(item=>({...item,progress:getProgress(item)}))}
function render(){
 const records=state(),started=records.filter(x=>x.progress.started);
 document.getElementById('started').textContent=String(started.length);
 document.getElementById('chapters').textContent=String(records.filter(x=>x.kind!=='pdf').reduce((count,x)=>count+x.progress.seen,0));
 document.getElementById('finished').textContent=String(records.filter(x=>x.kind!=='pdf'&&x.progress.finished).length);
 const box=document.getElementById('inProgress');box.replaceChildren();
 if(!started.length)box.append(element('p','Aucune lecture enregistrée sur cet appareil. Ouvre un livre pour commencer.','empty'));
 for(const item of started)box.append(makeCard(item,item.progress));
 const query=document.getElementById('search').value.trim().toLocaleLowerCase('fr'),kind=document.getElementById('kind').value;
 const catalog=document.getElementById('catalog');catalog.replaceChildren();
 let filtered=records.filter(x=>(kind==='all'||kind===x.kind)&&(x.title+' '+x.genre).toLocaleLowerCase('fr').includes(query));
 if(!filtered.length)catalog.append(element('p','Aucun livre ne correspond à la recherche.','empty'));
 else for(const item of filtered)catalog.append(makeCard(item,item.progress));
}
function renderMarks(){
 const box=document.getElementById('readerMarks');if(!box)return;box.replaceChildren();
 const marks=loadEntries().slice().reverse();
 if(!marks.length){box.append(element('p','Aucun signet, surlignage ou annotation enregistré dans ce navigateur.','empty'));return}
 for(const entry of marks){
  const book=CATALOG.find(item=>item.kind===entry.kind&&item.id===entry.book);
  if(!book)continue;
  const card=element('article',undefined,'card');
  card.append(element('span',entry.type==='bookmark'?'Signet':entry.type==='highlight'?'Surlignage':'Annotation','type'));
  card.append(element('h3',book.title));
  card.append(element('p',(entry.kind==='pdf'?'Page ':'Chapitre ')+entry.position));
  if(entry.quote)card.append(element('p','« '+entry.quote.slice(0,180)+' »'));
  if(entry.note)card.append(element('p',entry.note.slice(0,180)));
  const link=element('a','Retourner au passage','resume');link.href=bookmarkUrl(entry);card.append(link);box.append(card);
 }
 if(!box.children.length)box.append(element('p','Aucune annotation reconnue dans ce navigateur.','empty'));
}
function exportProgress(){
 const progress={schema:'warlike-ebook-progress-v1',exportedAt:new Date().toISOString(),progress:CATALOG.map(item=>({kind:item.kind,id:item.id,...getProgress(item)}))};
 const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
 const a=document.createElement('a');a.href=url;a.download='warlike-ebook-progression.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
 notice('Copie de la progression exportée. Aucun transfert vers un serveur.');
}
function clearProgress(){
 if(!window.confirm('Effacer sur cet appareil toutes les progressions WarLike Ebook connues ? Cette action est irréversible sans sauvegarde.'))return;
 const keys=[...SEASONS.map(b=>'warlike:chapters:'+b[0]),...NOVELS.map(b=>'warlike-reading-'+b[0]),...NOVELS.map(b=>'warlike:novel-chapters:'+b[0]),...PDFS.map(b=>'warlike-ebook:page:'+b[0])];
 let ok=true;for(const key of keys)if(!safeStorage.remove(key))ok=false;
 notice(ok?'Les progressions enregistrées ont été effacées de ce navigateur.':'Certaines progressions n’ont pas pu être effacées (stockage bloqué).');render();
}
if(typeof document!=='undefined'){
 document.getElementById('search')?.addEventListener('input',render);
 document.getElementById('kind')?.addEventListener('change',render);
 document.getElementById('export')?.addEventListener('click',exportProgress);
 document.getElementById('clear')?.addEventListener('click',clearProgress);
 const secureStatus=document.getElementById('secureStatus');
 const backupPassword=document.getElementById('backupPassword');
 const exportEncrypted=document.getElementById('exportEncrypted');
 exportEncrypted?.addEventListener('click',async()=>{
  if(exportEncrypted.disabled)return;exportEncrypted.disabled=true;
  try{
   const password=backupPassword.value;
   const envelope=await encryptReadingBackup(password);
   const blob=new Blob([JSON.stringify(envelope,null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob);
   const link=document.createElement('a');link.href=url;link.download='warlike-ebook-sauvegarde-chiffree.json';link.click();
   setTimeout(()=>URL.revokeObjectURL(url),3000);
   secureStatus.textContent='Sauvegarde chiffrée créée. Conserve ta phrase secrète en lieu sûr.';
  }catch(error){secureStatus.textContent='Export chiffré impossible : '+error.message}
  finally{backupPassword.value='';exportEncrypted.disabled=false}
 });
 document.getElementById('importEncrypted')?.addEventListener('change',async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
   if(file.size>1500000)throw Error('Fichier supérieur à 1,5 Mo.');
   const password=backupPassword.value;
   const document=JSON.parse(await file.text());
   if(!window.confirm('Remplacer les progressions et notes présentes par celles de cette sauvegarde chiffrée ?'))return;
   const restored=await restoreEncryptedBackup(document,password);
   secureStatus.textContent=restored+' données restaurées. Les fichiers PDF et EPUB doivent être importés séparément.';
   render();renderMarks();
  }catch(error){secureStatus.textContent='Restauration chiffrée impossible : '+error.message}
  finally{backupPassword.value='';event.target.value=''}
 });
 document.getElementById('exportBackup')?.addEventListener('click',()=>{
  try{
   const data=JSON.stringify(createBackup(),null,2);
   const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
   const a=document.createElement('a');a.href=url;a.download='warlike-ebook-sauvegarde-lecture.json';a.click();
   setTimeout(()=>URL.revokeObjectURL(url),2000);
   notice('Sauvegarde créée : progression et annotations, sans fichiers PDF ou EPUB importés.');
  }catch(error){notice('Export impossible : '+error.message)}
 });
 document.getElementById('importBackup')?.addEventListener('change',async event=>{
  const file=event.target.files?.[0];if(!file)return;
  try{
   if(file.size>650000)throw Error('Le fichier de sauvegarde dépasse 650 Ko.');
   const document=JSON.parse(await file.text());
   if(!window.confirm('Restaurer cette sauvegarde ? Les valeurs des mêmes livres seront remplacées sur cet appareil.'))return;
   const total=restoreBackup(document);
   notice(total+' entrées de progression ou d’annotations restaurées. Recharge un lecteur ouvert pour les voir.');
   render();renderMarks();
  }catch(error){notice('Restauration impossible : '+error.message)}finally{event.target.value=''}
 });
 if(document.getElementById('catalog')){render();renderMarks()}
}

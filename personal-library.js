import {savePersonalBook,listPersonalBooks,getPersonalBook,deletePersonalBook} from './personal-books.js';
const $=id=>document.getElementById(id);
const status=text=>{$('status').textContent=text};
const page=$('pdfArea'),epubArea=$('epubArea');
const PROGRESS='warlike:personal-book:';
let active=null,epubBook=null,rendition=null,blobUrl=null,lastFormat=null,pdfPage=1,epubFont=100;
function getProgress(id){try{return JSON.parse(localStorage.getItem(PROGRESS+id)||'{}')}catch{return {}}}
function setProgress(id,state){try{localStorage.setItem(PROGRESS+id,JSON.stringify(state))}catch{$('readerNotice').textContent='Position non enregistrée : stockage local indisponible.'}}
function make(tag,value,cls){const el=document.createElement(tag);if(value!==undefined)el.textContent=String(value);if(cls)el.className=cls;return el}
async function refresh(){
 const list=$('personalBooks');list.replaceChildren();
 try{
  const books=await listPersonalBooks();$('bookCount').textContent=books.length+' livre(s)';
  if(!books.length)list.append(make('p','Aucun fichier importé. Sélectionne un EPUB ou PDF pour commencer.','empty'));
  for(const book of books){
   const card=make('article',undefined,'book-card');card.append(make('span',book.format.toUpperCase()+' · '+(book.size/(1024*1024)).toFixed(1)+' Mio','eyebrow'),make('h3',book.title));
   card.append(make('p','Enregistré dans le navigateur · '+new Date(book.importedAt).toLocaleDateString('fr-FR')));
   const actions=make('div',undefined,'card-actions'),open=make('button','Ouvrir / Reprendre'),del=make('button','Supprimer','danger');
   open.type=del.type='button';open.addEventListener('click',()=>readBook(book.id));del.addEventListener('click',async()=>{if(!confirm('Supprimer « '+book.title+' » de ce navigateur ? Cette action ne touche pas au fichier original.'))return;try{if(active===book.id)closeReader();await deletePersonalBook(book.id);try{localStorage.removeItem(PROGRESS+book.id)}catch{}status('Livre supprimé de la bibliothèque locale.');await refresh()}catch(e){status('Suppression impossible : '+e.message)}});
   actions.append(open,del);card.append(actions);list.append(card);
  }
 }catch(e){status('Bibliothèque locale indisponible : '+e.message);list.append(make('p','La bibliothèque ne peut pas être ouverte sur ce navigateur.','empty'))}
}
async function signatureOK(file,format){
 const header=new Uint8Array(await file.slice(0,8).arrayBuffer());
 if(format==='pdf')return String.fromCharCode(...header.slice(0,5))==='%PDF-';
 return header[0]===0x50&&header[1]===0x4b&&[3,5,7].includes(header[2])&&[4,6,8].includes(header[3]);
}
$('importForm').addEventListener('submit',async event=>{
 event.preventDefault();const file=$('bookFile').files?.[0];if(!file)return;
 const button=event.submitter||$('importForm').querySelector('button');button.disabled=true;
 try{
  const {validateImport}=await import('./personal-books.js');const meta=validateImport(file);
  if(!await signatureOK(file,meta.format))throw Error('Signature du fichier invalide. Un renommage ne transforme pas un fichier en PDF/EPUB.');
  const item=await savePersonalBook(file);status('« '+item.title+' » importé. Le fichier reste sur cet appareil.');$('bookFile').value='';await refresh();
 }catch(e){status('Import refusé : '+e.message)}finally{button.disabled=false}
});
function closeReader(){
 if(rendition){rendition.destroy();rendition=null}if(epubBook){epubBook.destroy();epubBook=null}
 if(blobUrl){URL.revokeObjectURL(blobUrl);blobUrl=null}
 page.src='about:blank';page.hidden=true;epubArea.hidden=true;epubArea.replaceChildren();$('reader').hidden=true;
 active=null;lastFormat=null;
}
$('closeReader').addEventListener('click',closeReader);
async function readBook(id){
 try{
  const item=await getPersonalBook(id);if(!item)throw Error('Livre introuvable.');
  closeReader();active=id;lastFormat=item.format;$('readerTitle').textContent=item.title;$('reader').hidden=false;$('readerNotice').textContent='';const saved=getProgress(id);
  if(item.format==='pdf'){
   pdfPage=Number.isSafeInteger(saved.page)&&saved.page>0?saved.page:1;
   blobUrl=URL.createObjectURL(item.blob);page.hidden=false;page.src=blobUrl+'#page='+pdfPage;
   $('location').textContent='PDF · Page '+pdfPage+' (navigation PDF intégrée au navigateur)';
   $('readerNotice').textContent='Les commandes Précédent/Suivant enregistrent la page demandée. La position modifiée directement dans le lecteur PDF intégré n’est pas détectable de manière fiable.';
  }else{
   if(typeof window.ePub!=='function'||!window.JSZip)throw Error('Le moteur EPUB externe est indisponible. Vérifie la connexion et les scripts autorisés.');
   epubArea.hidden=false;
   epubBook=window.ePub(await item.blob.arrayBuffer());
   rendition=epubBook.renderTo('epubArea',{width:'100%',height:'100%',flow:'paginated',allowScriptedContent:false});
   rendition.on('relocated',location=>{
    if(active!==id)return;
    const cfi=location?.start?.cfi;
    if(cfi){setProgress(id,{cfi});$('location').textContent='EPUB · Position mémorisée'}
   });
   try{await rendition.display(typeof saved.cfi==='string'&&saved.cfi.length<3000?saved.cfi:undefined)}
   catch{await rendition.display();$('readerNotice').textContent='La position précédente n’était plus valide : ouverture au début.'}
   $('location').textContent='EPUB · Navigation et position mémorisées';setEpubFont();
  }
  $('reader').scrollIntoView({behavior:'smooth',block:'start'});
 }catch(e){$('readerNotice').textContent='Lecture indisponible : '+e.message;status('Impossible de lire ce livre : '+e.message)}
}
function setEpubFont(){if(rendition)rendition.themes.fontSize(epubFont+'%')}
function changePdf(delta){pdfPage=Math.max(1,pdfPage+delta);if(blobUrl)page.src=blobUrl+'#page='+pdfPage;setProgress(active,{page:pdfPage});$('location').textContent='PDF · Page '+pdfPage}
$('previous').addEventListener('click',async()=>{if(!active)return;if(lastFormat==='pdf')changePdf(-1);else if(rendition)try{await rendition.prev()}catch(e){$('readerNotice').textContent=e.message}});
$('next').addEventListener('click',async()=>{if(!active)return;if(lastFormat==='pdf')changePdf(1);else if(rendition)try{await rendition.next()}catch(e){$('readerNotice').textContent=e.message}});
$('increaseFont').addEventListener('click',()=>{if(lastFormat!=='epub'){$('readerNotice').textContent='La taille du texte PDF est réglée par le lecteur PDF du navigateur.';return}epubFont=Math.min(170,epubFont+10);setEpubFont()});
$('decreaseFont').addEventListener('click',()=>{if(lastFormat!=='epub'){$('readerNotice').textContent='Le zoom PDF est disponible dans le lecteur intégré.';return}epubFont=Math.max(70,epubFont-10);setEpubFont()});
window.addEventListener('pagehide',closeReader);
refresh();

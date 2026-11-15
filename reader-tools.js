// WarLike Ebook: local, source-preserving reader marks.
export const STORE_KEY='warlike:reader-tools:v1';
const LIMIT=300;
export function cleanEntry(value){
 if(!value||typeof value!=='object'||!['bookmark','highlight','note'].includes(value.type)||!['pdf','season','novel'].includes(value.kind))return null;
 if(!/^[a-z0-9-]{1,48}$/.test(String(value.book||'')))return null;
 const position=Number(value.position);
 if(!Number.isSafeInteger(position)||position<1||position>100000)return null;
 const quote=String(value.quote||'').trim().slice(0,500);
 const note=String(value.note||'').trim().slice(0,1500);
 if(value.type!=='bookmark'&&!quote)return null;
 return {type:value.type,kind:value.kind,book:value.book,position,quote,note,created:Math.max(0,Math.min(Date.now(),Number(value.created)||Date.now()))};
}
export function loadEntries(storage=globalThis.localStorage){
 try{
  const data=JSON.parse(storage.getItem(STORE_KEY)||'[]');
  return Array.isArray(data)?data.slice(0,LIMIT).map(cleanEntry).filter(Boolean):[];
 }catch{return []}
}
export function saveEntries(entries,storage=globalThis.localStorage){
 try{storage.setItem(STORE_KEY,JSON.stringify(entries.slice(-LIMIT).map(cleanEntry).filter(Boolean)));return true}catch{return false}
}
export function makeKey(item){return [item.kind,item.book,item.position].join(':')}
export function entryMatches(entry,context){return entry.kind===context.kind&&entry.book===context.book&&entry.position===context.position}
export function bookmarkUrl(entry){
 const page=entry.kind==='pdf'?'reader.html':entry.kind==='season'?'saisons.html':'nouveaux-romans.html';
 const query=new URLSearchParams({livre:entry.book,[entry.kind==='pdf'?'page':'chapitre']:String(entry.position)});
 return './'+page+'?'+query.toString();
}
function readContext(mode){
 const params=new URLSearchParams(location.search),book=params.get('livre');
 if(!book||!/^[a-z0-9-]{1,48}$/.test(book))return null;
 const attr=mode==='pdf'?'page':'chapitre',fallback=mode==='pdf'?document.getElementById('pageInput')?.value:mode==='season'?document.getElementById('readNumber')?.textContent?.match(/Chapitre\s+(\d+)/)?.[1]:document.getElementById('chapterPicker')?.value;
 let value=Number(params.get(attr));
 if(mode==='novel'&&(!Number.isSafeInteger(value)||value<1))value=Number(fallback)+1;
 if(mode==='season'&&(!Number.isSafeInteger(value)||value<1))value=Number(fallback);
 if(mode==='pdf'&&(!Number.isSafeInteger(value)||value<1))value=Number(fallback);
 if(!Number.isSafeInteger(value)||value<1)return null;
 return {kind:mode,book,position:value};
}
function make(tag,content,cls){const el=document.createElement(tag);if(content!==undefined)el.textContent=String(content);if(cls)el.className=cls;return el}
function putHighlight(container,quote){
 if(!quote||!container)return false;
 const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 // Highlights are anchored to an exact passage within a text node. Do not alter manuscripts.
 for(const node of nodes){if(node.parentElement?.closest('mark'))continue;const start=node.textContent.indexOf(quote);if(start<0)continue;
  const tail=node.splitText(start),end=tail.splitText(quote.length),mark=make('mark',quote,'warlike-mark');
  tail.replaceWith(mark);return true}
 return false;
}
export function mountReaderTools({mode,content}){
 if(!content)return;
 const panel=make('aside',undefined,'warlike-reading-tools');panel.setAttribute('aria-label','Signets et annotations');
 const title=make('h3','Mon carnet de lecture');
 const buttons=make('div',undefined,'warlike-tool-actions');
 const bookmark=make('button','☆ Signet'),highlight=make('button','Surligner la sélection'),addNote=make('button','Annoter la sélection');
 for(const b of [bookmark,highlight,addNote]){b.type='button';buttons.append(b)}
 const notes=make('div',undefined,'warlike-tool-list'),status=make('p','Sélectionne un passage dans le texte pour le surligner ou l’annoter.','warlike-tool-status');status.setAttribute('role','status');
 const noteBox=make('textarea',undefined,'warlike-note-input');noteBox.placeholder='Ta note personnelle (1500 caractères maximum)';noteBox.maxLength=1500;noteBox.rows=3;
 const saveNote=make('button','Enregistrer la note');saveNote.type='button';saveNote.hidden=true;noteBox.hidden=true;
 const heading=make('p','Texte sélectionné :','warlike-note-label');heading.hidden=true;
 panel.append(title,buttons,heading,noteBox,saveNote,status,notes);
 content.parentElement.insertBefore(panel,content);
 let entries=loadEntries(),pendingQuote='',selectedContext=null;
 const context=()=>readContext(mode);
 function getQuote(){
  const selection=window.getSelection();if(!selection||selection.isCollapsed||!selection.rangeCount)return '';
  const range=selection.getRangeAt(0);
  if(!content.contains(range.commonAncestorContainer))return '';
  const phrase=selection.toString().trim();
  return phrase.length>500?'':phrase;
 }
 function add(type,quote='',note=''){
  const c=context();if(!c){status.textContent='Ouvre une page ou un chapitre avant d’enregistrer.';return}
  const entry=cleanEntry({...c,type,quote,note,created:Date.now()});if(!entry)return;
  if(type==='bookmark'&&entries.some(e=>e.type==='bookmark'&&entryMatches(e,c))){status.textContent='Cette page possède déjà un signet.';return}
  entries=[...entries,entry].slice(-LIMIT);
  if(!saveEntries(entries)){status.textContent='Stockage indisponible : modification non enregistrée.';entries=loadEntries();return}
  status.textContent=type==='bookmark'?'Signet enregistré.':type==='highlight'?'Surlignage enregistré.':'Annotation enregistrée.';
  render();
 }
 function render(){
  const c=context();notes.replaceChildren();if(!c){bookmark.disabled=true;return}bookmark.disabled=false;
  const matches=entries.filter(e=>entryMatches(e,c));
  bookmark.textContent=matches.some(e=>e.type==='bookmark')?'★ Signet enregistré':'☆ Signet';
  for(const [i,entry] of matches.entries()){
   const card=make('div',undefined,'warlike-tool-entry');
   card.append(make('strong',entry.type==='bookmark'?'Signet':entry.type==='highlight'?'Surlignage':'Annotation'));
   if(entry.quote)card.append(make('blockquote',entry.quote.slice(0,200)));
   if(entry.note)card.append(make('p',entry.note));
   const remove=make('button','Supprimer');remove.type='button';remove.addEventListener('click',()=>{
     entries=entries.filter(x=>x!==entry);if(saveEntries(entries)){status.textContent='Élément supprimé.';render()}else status.textContent='Suppression non enregistrée.';
   });card.append(remove);notes.append(card);
  }
  if(!matches.length)notes.append(make('p','Aucun signet ni note sur cette page.','warlike-tool-empty'));
  // After a new chapter has been rendered, restore exact-quote highlights.
  for(const e of matches)if(e.type==='highlight')putHighlight(content,e.quote);
 }
 bookmark.addEventListener('click',()=>add('bookmark'));
 highlight.addEventListener('click',()=>{const quote=getQuote();if(!quote){status.textContent='Sélectionne un passage du texte (500 caractères maximum).';return}add('highlight',quote)});
 addNote.addEventListener('click',()=>{pendingQuote=getQuote();if(!pendingQuote){status.textContent='Sélectionne un passage du texte avant de l’annoter.';return}heading.hidden=false;heading.textContent='Passage : '+pendingQuote.slice(0,120);noteBox.hidden=false;saveNote.hidden=false;noteBox.focus()});
 saveNote.addEventListener('click',()=>{const text=noteBox.value.trim();if(!text){status.textContent='Renseigne une note.';return}add('note',pendingQuote,text);pendingQuote='';noteBox.value='';noteBox.hidden=true;saveNote.hidden=true;heading.hidden=true});
 document.addEventListener('warlike:reading-change',()=>{pendingQuote='';noteBox.hidden=true;saveNote.hidden=true;heading.hidden=true;render()});
 render();
}

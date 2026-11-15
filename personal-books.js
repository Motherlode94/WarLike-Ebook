// IndexedDB repository for user-owned PDF and EPUB files.
// Files remain in the current browser; the app never uploads or transmits their bytes.
export const DB_NAME='warlike-ebook-personal-v1';
export const MAX_FILE_BYTES=30*1024*1024;
export const SUPPORTED=['pdf','epub'];
export function extensionOf(filename){
 const lower=String(filename||'').toLowerCase();
 const ext=lower.split('.').pop();
 return SUPPORTED.includes(ext)?ext:null;
}
export function validateImport(file){
 if(!file||typeof file.name!=='string'||!Number.isFinite(file.size))throw Error('Fichier non valide.');
 const format=extensionOf(file.name);
 if(!format)throw Error('Seuls les fichiers PDF et EPUB sont acceptés.');
 if(file.size===0||file.size>MAX_FILE_BYTES)throw Error('Fichier vide ou supérieur à 30 Mio.');
 return {format,title:file.name.replace(/\.(pdf|epub)$/i,'').trim().slice(0,140)||'Sans titre',size:file.size};
}
function requestPromise(request){return new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error||Error('IndexedDB indisponible'))})}
export function openLibrary(){
 return new Promise((resolve,reject)=>{
  if(typeof indexedDB==='undefined')return reject(Error('IndexedDB non disponible dans ce navigateur.'));
  const request=indexedDB.open(DB_NAME,1);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('books'))db.createObjectStore('books',{keyPath:'id'})};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error||Error('Ouverture de la bibliothèque impossible.'));
  request.onblocked=()=>reject(Error('Ferme les autres onglets WarLike Ebook puis réessaie.'));
 });
}
export async function withStore(mode,action){
 const db=await openLibrary();
 try{
  return await new Promise((resolve,reject)=>{
   const tx=db.transaction('books',mode),store=tx.objectStore('books');
   let value,failed=false;
   tx.oncomplete=()=>resolve(value);
   tx.onerror=()=>{failed=true;reject(tx.error||Error('Erreur de stockage'))};
   tx.onabort=()=>{if(!failed)reject(tx.error||Error('Transaction annulée'))};
   try{const request=action(store);if(request&&typeof request==='object'){request.onsuccess=()=>{value=request.result};request.onerror=()=>reject(request.error||Error('Opération impossible'))}}catch(error){tx.abort();reject(error)}
  });
 }finally{db.close()}
}
export function listPersonalBooks(){return withStore('readonly',store=>store.getAll()).then(items=>items.map(({id,title,format,size,importedAt})=>({id,title,format,size,importedAt})).sort((a,b)=>b.importedAt-a.importedAt))}
export function getPersonalBook(id){if(!/^[a-z0-9-]{1,80}$/.test(String(id)))return Promise.resolve(null);return withStore('readonly',store=>store.get(id))}
export async function savePersonalBook(file){
 const meta=validateImport(file);
 const id=crypto.randomUUID();
 const record={...meta,id,importedAt:Date.now(),blob:file};
 await withStore('readwrite',store=>store.put(record));
 return {id,title:meta.title,format:meta.format};
}
export async function deletePersonalBook(id){if(!/^[a-z0-9-]{1,80}$/.test(String(id)))throw Error('Identifiant invalide');await withStore('readwrite',store=>store.delete(id))}

import {STORE_KEY,cleanEntry} from './reader-tools.js';
export const BACKUP_SCHEMA='warlike-ebook-reading-backup-v2';
export const PROGRESS_KEYS=[
 ...['ligne','jours','toi','dieu','ombres','heures','archives','neon'].map(id=>'warlike:chapters:'+id),
 ...['brume','valdorne','arodan','seven','abime','extinction'].map(id=>'warlike-reading-'+id),
 ...['brume','valdorne','arodan','seven','abime','extinction'].map(id=>'warlike:novel-chapters:'+id),
 ...['ombres','toi','dieu'].map(id=>'warlike-ebook:page:'+id),
 'warlike-ebook:font-size','warlike-reading-font','warlike-reading-theme','warlike:reader-tools:night',
 STORE_KEY
];
function getStore(storage){if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function')throw Error('Stockage local indisponible');return storage}
export function validateBackup(document){
 if(!document||typeof document!=='object'||document.schema!==BACKUP_SCHEMA||!document.data||typeof document.data!=='object'||Array.isArray(document.data))throw Error('Format de sauvegarde non reconnu.');
 const expected=new Set(PROGRESS_KEYS),result={};
 for(const [key,value] of Object.entries(document.data)){
  if(!expected.has(key)||typeof value!=='string'||value.length>400000)throw Error('Clé ou contenu non autorisé : '+key);
  if(key===STORE_KEY){
   let items;try{items=JSON.parse(value)}catch{throw Error('Annotations invalides')};
   if(!Array.isArray(items)||items.length>300)throw Error('Trop d’annotations');
   const safe=items.map(cleanEntry);
   if(safe.some(x=>!x))throw Error('Annotation malformée');
   result[key]=JSON.stringify(safe);
  }else if((key.startsWith('warlike:chapters:')||key.startsWith('warlike:novel-chapters:'))){
   let chapters;try{chapters=JSON.parse(value)}catch{throw Error('Progression de saison invalide')};
   if(!Array.isArray(chapters)||chapters.length>50||chapters.some(v=>!Number.isInteger(v)||v<1||v>50))throw Error('Chapitres de saison invalides');
   result[key]=JSON.stringify([...new Set(chapters)]);
  }else if(key.startsWith('warlike-reading-')&&key!=='warlike-reading-font'&&key!=='warlike-reading-theme'){
   const n=Number(value);if(!Number.isInteger(n)||n<0||n>49)throw Error('Index de chapitre invalide');result[key]=String(n);
  }else if(key.startsWith('warlike-ebook:page:')){
   const n=Number(value);if(!Number.isInteger(n)||n<1||n>100000)throw Error('Numéro de page invalide');result[key]=String(n);
  }else if(key==='warlike-reading-font'){const n=Number(value);if(!Number.isFinite(n)||n<.95||n>2)throw Error('Taille de texte invalide');result[key]=String(n)}
  else if(key==='warlike-ebook:font-size'){const n=Number(value);if(!Number.isInteger(n)||n<14||n>30)throw Error('Taille invalide');result[key]=String(n)}
  else if(!['light','dark','true','false'].includes(value))throw Error('Préférence de thème invalide');
  else result[key]=value;
 }
 return result;
}
export function createBackup(storage=globalThis.localStorage){
 storage=getStore(storage);const data={};
 for(const key of PROGRESS_KEYS){const value=storage.getItem(key);if(value!==null)data[key]=value}
 return {schema:BACKUP_SCHEMA,exportedAt:new Date().toISOString(),data};
}
export function restoreBackup(document,storage=globalThis.localStorage){
 const data=validateBackup(document);storage=getStore(storage);
 const old=new Map(Object.keys(data).map(key=>[key,storage.getItem(key)]));
 try{for(const [key,value] of Object.entries(data))storage.setItem(key,value)}
 catch(error){for(const [key,previous] of old){try{if(previous===null)storage.removeItem(key);else storage.setItem(key,previous)}catch{}}throw Error('Restauration annulée : stockage indisponible ou plein. '+error.message)}
 return Object.keys(data).length;
}

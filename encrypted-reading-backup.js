// Portable encrypted WarLike Ebook reading backup.
// Uses PBKDF2-HMAC-SHA-256 and AES-256-GCM; never stores passwords in localStorage.
import {createBackup,validateBackup,restoreBackup} from './reading-backup.js';
export const ENCRYPTED_SCHEMA='warlike-ebook-encrypted-backup-v1';
export const MIN_PASSWORD_LENGTH=12;
export const ITERATIONS=310000;
const te=new TextEncoder(),td=new TextDecoder();
const MAX_CIPHERTEXT=1024*1024;
function toBase64(bytes){
 let binary='';
 for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return btoa(binary);
}
function fromBase64(value,limit){
 if(typeof value!=='string'||value.length>Math.ceil(limit*4/3)+8||!/^[A-Za-z0-9+/]*={0,2}$/.test(value)||value.length%4!==0)throw Error('Données chiffrées invalides.');
 const bin=atob(value);if(bin.length>limit)throw Error('Sauvegarde trop volumineuse.');
 return Uint8Array.from(bin,char=>char.charCodeAt(0));
}
function requireCrypto(){
 const c=globalThis.crypto;
 if(!c?.subtle||!c.getRandomValues)throw Error('Web Crypto indisponible : utilise HTTPS ou localhost et un navigateur à jour.');
 return c;
}
async function derive(password,salt,iterations){
 const crypto=requireCrypto();
 const material=await crypto.subtle.importKey('raw',te.encode(password),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export function validateEnvelope(value){
 if(!value||typeof value!=='object'||value.schema!==ENCRYPTED_SCHEMA)throw Error('Format de sauvegarde chiffrée inconnu.');
 if(value.kdf?.name!=='PBKDF2'||value.kdf.hash!=='SHA-256'||value.kdf.iterations!==ITERATIONS)throw Error('Paramètres de dérivation non reconnus.');
 if(value.cipher?.name!=='AES-256-GCM')throw Error('Algorithme de chiffrement non reconnu.');
 const salt=fromBase64(value.kdf.salt,16),iv=fromBase64(value.cipher.iv,12),bytes=fromBase64(value.ciphertext,MAX_CIPHERTEXT);
 if(salt.length!==16||iv.length!==12||bytes.length<16)throw Error('Enveloppe de chiffrement corrompue.');
 return {salt,iv,bytes};
}
export async function encryptReadingBackup(password,storage){
 if(typeof password!=='string'||password.length<MIN_PASSWORD_LENGTH)throw Error('Choisis une phrase secrète de 12 caractères minimum.');
 const crypto=requireCrypto(),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const backup=createBackup(storage);
 const plaintext=te.encode(JSON.stringify(backup));
 if(plaintext.byteLength>MAX_CIPHERTEXT-32)throw Error('Sauvegarde trop volumineuse.');
 const key=await derive(password,salt,ITERATIONS);
 const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:te.encode(ENCRYPTED_SCHEMA),tagLength:128},key,plaintext));
 return {schema:ENCRYPTED_SCHEMA,version:1,kdf:{name:'PBKDF2',hash:'SHA-256',iterations:ITERATIONS,salt:toBase64(salt)},cipher:{name:'AES-256-GCM',iv:toBase64(iv)},ciphertext:toBase64(cipher)};
}
export async function decryptReadingBackup(envelope,password){
 if(typeof password!=='string'||!password)throw Error('Une phrase secrète est nécessaire.');
 const {salt,iv,bytes}=validateEnvelope(envelope);
 const crypto=requireCrypto(),key=await derive(password,salt,ITERATIONS);
 let decrypted;
 try{decrypted=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:te.encode(ENCRYPTED_SCHEMA),tagLength:128},key,bytes)}
 catch{throw Error('Phrase secrète incorrecte ou sauvegarde endommagée.')}
 let backup;
 try{backup=JSON.parse(td.decode(decrypted))}catch{throw Error('Contenu déchiffré invalide.')}
 validateBackup(backup);
 return backup;
}
export async function restoreEncryptedBackup(envelope,password,storage){
 const backup=await decryptReadingBackup(envelope,password);
 return restoreBackup(backup,storage);
}

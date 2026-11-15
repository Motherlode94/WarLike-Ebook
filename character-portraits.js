/* Portraits par oeuvre — WarLike Ebook */
(function(){
'use strict';
const casts={
 ligne:[['Elias Mavoko','elias.webp'],['Nora Venn','nora.webp']],
 jours:[['Adèle','adele.webp'],['Samuel','samuel.webp']],
 toi:[['Malik','malik.webp'],['Lina','lina.webp']],
 dieu:[['Kaïn','kain.webp'],['Mara','mara.webp']],
 ombres:[['La petite sœur','soeur.webp'],['Le grand frère','frere.webp']],
 heures:[['Iris Vernet',null,'#536680'],['Noé Vernet',null,'#75647b']],
 archives:[['Éva Sorel',null,'#6c6259'],['Jonas Bellanger',null,'#526b72']],
 neon:[['Naïa Voss',null,'#4b728b'],['Idris Kellan',null,'#75508d']]
};
function illustratedFace(name,color,index){
 // Portrait vectoriel provisoire, clairement identifié; aucune photographie attribuée à tort.
 const skin=['#79513e','#a16e53','#5a3c32'][index%3],hair=['#211c25','#201b21','#26232d'][index%3];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#171c29"/></linearGradient></defs><rect width="320" height="400" fill="url(#bg)"/><circle cx="255" cy="55" r="85" fill="#fff" opacity=".07"/><path d="M26 400Q36 295 123 282L200 282Q284 295 294 400" fill="#252631"/><path d="M125 252h70v72h-70z" fill="${skin}"/><ellipse cx="160" cy="164" rx="89" ry="115" fill="${hair}"/><ellipse cx="160" cy="180" rx="68" ry="91" fill="${skin}"/><path d="M94 153Q115 72 177 92Q229 106 227 160Q199 135 181 109Q153 149 94 153" fill="${hair}"/><path d="M114 180q20-12 39 0m18 0q20-12 39 0" stroke="#2d2221" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="135" cy="185" rx="5" ry="6" fill="#1b1719"/><ellipse cx="187" cy="185" rx="5" ry="6" fill="#1b1719"/><path d="M160 190l-7 33 12 3" fill="none" stroke="#5c3b34" stroke-width="3"/><path d="M139 242q22 12 44 0" fill="none" stroke="#6a343a" stroke-width="5" stroke-linecap="round"/><path d="M90 400q17-92 70-93t70 93" fill="#333a4e"/></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
}
function render(bookId,target){
 const cast=casts[bookId];if(!cast||!target)return;
 const old=target.querySelector('.warlike-cast');if(old)old.remove();
 const section=document.createElement('section');section.className='warlike-cast';section.setAttribute('aria-label','Visages des personnages du livre');
 const caption=document.createElement('div');caption.className='warlike-cast-caption';caption.textContent='Personnages de cette histoire';section.append(caption);
 const row=document.createElement('div');row.className='warlike-cast-row';
 cast.forEach(([name,file,color],i)=>{const item=document.createElement('figure');item.className='warlike-cast-person';
 const img=document.createElement('img');img.src=file?'./assets/characters/'+file:illustratedFace(name,color,i);img.alt='Portrait illustré de '+name;img.loading='lazy';img.decoding='async';
 img.onerror=()=>{img.onerror=null;img.src=illustratedFace(name,color||'#51637a',i);item.classList.add('warlike-cast-provisional')};
 const fig=document.createElement('figcaption');fig.textContent=name;item.append(img,fig);
 if(!file){item.classList.add('warlike-cast-provisional');item.title='Illustration provisoire — portrait définitif à produire'}
 row.append(item)});
 section.append(row);target.prepend(section);
}
window.WarLikeCharacterPortraits={render,casts};
})();
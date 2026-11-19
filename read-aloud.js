// Shared browser speech reader. No audio or book text is uploaded by this module.
export function speechChunks(value, limit=240){
 const text=String(value||'').replace(/\s+/g,' ').trim(), chunks=[];
 if(limit<20)throw new RangeError('Chunk limit too small');
 let rest=text;
 while(rest.length>limit){
  const part=rest.slice(0,limit+1);
  const punctuation=[...part.matchAll(/[.!?…;:]\s/g)].at(-1);
  let end=punctuation&&punctuation.index>limit/3?punctuation.index+1:part.lastIndexOf(' ');
  if(end<1)end=limit;
  chunks.push(rest.slice(0,end).trim());rest=rest.slice(end).trim();
 }
 if(rest)chunks.push(rest);return chunks;
}
export function createSpeechPlayer({synth,Utterance,onState=()=>{}}){
 let generation=0,queue=[],position=0,state='idle',options={},utterance=null;
 function report(){onState({state,position,total:queue.length})}
 function cancel(){generation++;synth.cancel();utterance=null}
 function speak(){
  if(state!=='playing')return;
  if(position>=queue.length){state='ended';report();return}
  const ticket=generation,u=new Utterance(queue[position]);utterance=u;
  u.lang=options.voice?.lang||'fr-FR';if(options.voice)u.voice=options.voice;
  u.rate=options.rate||1;
  u.onend=()=>{if(ticket!==generation||state!=='playing')return;position++;speak()};
  u.onerror=e=>{if(ticket!==generation)return;state='error';utterance=null;report()};
  // cancel() can leave the global synthesizer paused in some browsers.
  synth.resume();synth.speak(u);report();
 }
 return {
  play(text,settings={}){cancel();queue=speechChunks(text);position=0;options=settings;state=queue.length?'playing':'idle';if(queue.length)speak();else report()},
  // Cancel and restart the current short phrase on resume, including on Android.
  pause(){if(state!=='playing')return;state='paused';cancel();report()},
  resume(){if(state!=='paused')return;state='playing';speak()},
  stop(){cancel();queue=[];position=0;state='idle';report()},
  configure(settings){options=settings;if(state==='playing'){cancel();speak()}},
  get state(){return state}
 };
}
export function mountReadAloud({content,getText=()=>content?.innerText||content?.textContent||'',before=content,onComplete}={}){
 if(!content||!before)return;
 const doc=content.ownerDocument,win=doc.defaultView;
 const panel=doc.createElement('aside');panel.className='read-aloud';panel.setAttribute('aria-label','Lecture à voix haute');
 panel.innerHTML='<h3>Écouter le texte</h3><div class="read-aloud-actions"><button type="button" data-action="play">Lire à voix haute</button><button type="button" data-action="pause" disabled>Pause</button><button type="button" data-action="stop" disabled>Arrêter</button><label>Voix <select data-setting="voice" aria-label="Voix de lecture"><option value="">Voix française par défaut</option></select></label><label>Vitesse <select data-setting="rate" aria-label="Vitesse de lecture"><option value="0.75">0,75 ×</option><option value="1" selected>1 ×</option><option value="1.25">1,25 ×</option><option value="1.5">1,5 ×</option></select></label></div><p role="status" aria-live="polite">Ouvre un chapitre puis lance la lecture.</p><small>Voix du navigateur. La reprise répète la phrase interrompue. Certaines voix nécessitent Internet.</small>';
 before.parentNode.insertBefore(panel,before);
 const play=panel.querySelector('[data-action="play"]'),pause=panel.querySelector('[data-action="pause"]'),stop=panel.querySelector('[data-action="stop"]'),voice=panel.querySelector('[data-setting="voice"]'),rate=panel.querySelector('[data-setting="rate"]'),status=panel.querySelector('[role="status"]');
 if(!win.speechSynthesis||!win.SpeechSynthesisUtterance){play.disabled=true;voice.disabled=true;rate.disabled=true;status.textContent='Lecture vocale indisponible dans ce navigateur.';return {stop(){}}}
 const synth=win.speechSynthesis;let voices=[];
 const settings=()=>({voice:voices.find(v=>v.voiceURI===voice.value),rate:Number(rate.value)});
 const player=createSpeechPlayer({synth,Utterance:win.SpeechSynthesisUtterance,onState:({state,position,total})=>{
  pause.disabled=!['playing','paused'].includes(state);stop.disabled=!['playing','paused'].includes(state);
  pause.textContent=state==='paused'?'Reprendre':'Pause';play.textContent=state==='playing'?'Recommencer':'Lire à voix haute';
  status.textContent=state==='playing'?'Lecture en cours · passage '+(position+1)+' / '+total:state==='paused'?'Lecture en pause.':state==='ended'?'Lecture du texte terminée.':state==='error'?'Lecture interrompue par le navigateur. Réessaie ou choisis une autre voix.':'Prêt à lire le texte affiché.';
  if(state==='ended')onComplete?.();
 }});
 function refreshVoices(){
  const saved=voice.value;voices=synth.getVoices();voice.replaceChildren(new Option('Voix française par défaut',''));
  for(const v of voices){const option=doc.createElement('option');option.value=v.voiceURI;option.textContent=v.name+' ('+v.lang+')';voice.append(option)}
  voice.value=voices.some(v=>v.voiceURI===saved)?saved:(voices.find(v=>/^fr(?:-|$)/i.test(v.lang))?.voiceURI||'');
 }
 refreshVoices();synth.addEventListener?.('voiceschanged',refreshVoices);
 play.addEventListener('click',()=>{const text=getText().trim();if(!text){status.textContent='Aucun texte disponible. Ouvre un chapitre.';return}player.play(text,settings())});
 pause.addEventListener('click',()=>player.state==='paused'?player.resume():player.pause());stop.addEventListener('click',()=>player.stop());
 for(const control of [voice,rate])control.addEventListener('change',()=>player.configure(settings()));
 doc.addEventListener('warlike:reading-change',()=>player.stop());
 doc.addEventListener('warlike:reading-close',()=>player.stop());
 win.addEventListener('pagehide',()=>player.stop());
 return player;
}

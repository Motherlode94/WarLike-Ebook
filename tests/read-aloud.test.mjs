import test from 'node:test';
import assert from 'node:assert/strict';
import {speechChunks,createSpeechPlayer} from '../read-aloud.js';
function mock(){
 const spoken=[],states=[];let cancellations=0;
 const synth={cancel(){cancellations++},resume(){},speak(u){spoken.push(u)}};
 class Utterance{constructor(text){this.text=text}}
 const player=createSpeechPlayer({synth,Utterance,onState:s=>states.push(s)});
 return {player,spoken,states,get cancellations(){return cancellations}};
}
test('long French text is chunked without losing words, including oversized tokens',()=>{
 const text='« Bonjour ! » Une phrase avec des accents. '+ 'longmot'.repeat(90)+' Puis la fin.';
 const chunks=speechChunks(text,120);
 assert.ok(chunks.every(c=>c.length<=120));
 assert.equal(chunks.join('').replace(/\s/g,''),text.replace(/\s/g,''));
 assert.deepEqual(speechChunks('  '),[]);
});
test('speech advances sequentially and finishes exactly once',()=>{
 const {player,spoken,states}=mock();player.play('Une longue phrase. '.repeat(40));
 for(let i=0;i<spoken.length;i++)spoken[i].onend();
 assert.equal(player.state,'ended');assert.equal(states.filter(s=>s.state==='ended').length,1);
});
test('stale callbacks cannot restart canceled speech after chapter changes',()=>{
 const {player,spoken}=mock();player.play('Un texte. '.repeat(100));const old=spoken[0];
 player.stop();old.onend();assert.equal(spoken.length,1);assert.equal(player.state,'idle');
 player.play('Nouveau texte.');old.onerror({error:'canceled'});assert.equal(player.state,'playing');
});
test('pause cancels safely and resume repeats only the current phrase',()=>{
 const {player,spoken}=mock();player.play('Une phrase. '.repeat(50));
 spoken[0].onend();const current=spoken.at(-1);player.pause();current.onend();
 assert.equal(player.state,'paused');player.resume();assert.equal(spoken.at(-1).text,current.text);
});
test('rate and voice changes replace an active utterance without advancing',()=>{
 const {player,spoken}=mock();const voice={lang:'fr-BE',voiceURI:'test'};
 player.play('Texte de lecture.');const old=spoken[0];player.configure({voice,rate:1.5});
 assert.equal(spoken[1].rate,1.5);assert.equal(spoken[1].voice,voice);assert.equal(spoken[1].lang,'fr-BE');
 old.onend();assert.equal(spoken.length,2);spoken[1].onerror({error:'voice-unavailable'});assert.equal(player.state,'error');
});

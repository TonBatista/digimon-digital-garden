// Local, state-driven pet AI. Persisted temperament and seeded randomness;
// no network or language model is needed to make decisions.
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const finite=(n,d,a=0,b=1e12)=>Number.isFinite(n)?clamp(n,a,b):d;
export const TEMPERAMENTS={playful:'Brincalhão',curious:'Curioso',affectionate:'Carinhoso',calm:'Tranquilo'};
const REQUESTS={
 food:{icon:'♨',panel:'food',texts:['Minha barriga está roncando…','Vamos fazer um lanchinho?','Estou com fome!']},
 toilet:{icon:'♧',panel:'care',texts:['Preciso ir ao banheiro!','Vamos até a casinha?','Está apertado aqui!']},
 sleep:{icon:'☾',panel:'care',texts:['Que soninho… hora de descansar?','Me leva para dormir?','Estou ficando cansado…']},
 bath:{icon:'✧',panel:'care',texts:['Estou precisando de um banho!','Uma água fresquinha seria bom…','Estou me coçando… vamos tomar banho?']},
 heal:{icon:'✚',panel:'care',texts:['Não estou me sentindo bem…','Preciso de cuidados…','Você pode cuidar de mim?']},
 clean:{icon:'⌂',panel:'care',texts:['Vamos limpar o quintal?','Tem sujeirinha no nosso quintal…','Gosto do quintal limpinho!']},
 pet:{icon:'♡',panel:'care',texts:['Faz um carinho em mim?','Fica aqui comigo um pouquinho?','Quero um cafuné!']},
 play:{icon:'♫',panel:'care',texts:['Vamos brincar juntos?','Estou entediado… vamos brincar?','Estou cheio de vontade de brincar!']},
 fruit:{icon:'♨',panel:'food',texts:['Estou com vontade de uma Digi-fruta!','Tem uma frutinha para mim?','Uma Digi-fruta seria uma delícia!']}
};
export function random(b){b.seed=(Math.imul(b.seed,1664525)+1013904223)>>>0;return b.seed/4294967296;}
function range(b,a,z){return a+random(b)*(z-a);}
export function ensureBehavior(s){
 let b=s.behavior;
 if(!b||b.version!==1||!TEMPERAMENTS[b.temperament]){
  const keys=Object.keys(TEMPERAMENTS);b=s.behavior={version:1,seed:(Math.random()*4294967296)>>>0,temperament:keys[Math.floor(Math.random()*keys.length)],attention:75,boredom:12,clock:0,nextWish:10,variationAt:0,variation:1,request:null,notice:null,lastReward:-60,autoSleep:false};
 }
 // Old saves need no reset. Imported optional AI data is normalized once on load.
 return b;
}
export function normalizeBehavior(s){
 const b=ensureBehavior(s);b.seed=finite(b.seed,1,0,4294967295)>>>0;
 for(const k of ['attention','boredom'])b[k]=finite(b[k],k==='attention'?75:12,0,100);
 b.clock=finite(b.clock,0);b.nextWish=finite(b.nextWish,b.clock+10,0,b.clock+120);
 b.variationAt=finite(b.variationAt,b.clock,0,b.clock+90);b.variation=finite(b.variation,1,.8,1.25);
 b.lastReward=finite(b.lastReward,-60,-60,b.clock);b.autoSleep=b.autoSleep===true&&s.sleeping;
 if(b.request&&REQUESTS[b.request.kind]){const r=b.request;b.request={kind:r.kind,variant:finite(r.variant,0,0,2)|0,since:finite(r.since,b.clock),until:finite(r.until,b.clock+60,0,b.clock+120),urgent:r.urgent===true,whim:r.whim===true};}else b.request=null;
 b.notice=null;return b;
}
// Called in short bounded simulation steps, also during offline catch-up.
export function metabolicStep(s,seconds){
 const b=ensureBehavior(s),n=s.needs,m=seconds/60;b.clock+=seconds;
 if(b.clock>=b.variationAt){b.variation=range(b,.85,1.18);b.variationAt=b.clock+range(b,35,80);}
 const social=b.temperament==='affectionate'?1.35:.95,active=b.temperament==='playful'?1.18:b.temperament==='calm'?.83:1;
 n.hunger-=m*(s.sleeping?.65:1.7)*b.variation*active;
 n.toilet-=m*1.1*(.9+b.variation*.1);n.hygiene-=m*(.5+s.poop*.4)*b.variation;
 if(s.sleeping){n.energy+=m*14;n.health+=m*2;b.boredom=clamp(b.boredom-m*4);}
 else{n.energy-=m*1.2*active*b.variation;b.attention=clamp(b.attention-m*2.3*social);b.boredom=clamp(b.boredom+m*(b.temperament==='curious'?4.5:3));}
 n.happiness-=m*(s.poop?1:.3);if(!s.sleeping&&(b.attention<20||b.boredom>85))n.happiness-=m*.35;
 if(b.autoSleep&&n.energy>=96){s.sleeping=false;b.autoSleep=false;}
}
function candidates(s){
 const n=s.needs,b=ensureBehavior(s),c=[];
 const add=(kind,value,threshold,base)=>{if(value<threshold)c.push({kind,score:base+(threshold-value)*1.4,urgent:value<22});};
 add('heal',n.health,55,55);add('toilet',n.toilet,45,46);add('food',n.hunger,55,38);add('sleep',n.energy,40,35);add('bath',n.hygiene,45,22);
 if(s.poop)c.push({kind:'clean',score:36+s.poop*7,urgent:s.poop>=3});
 if(n.energy>=15&&n.health>=20){add('pet',b.attention,48,12);if(b.boredom>55||n.happiness<45)c.push({kind:'play',score:12+Math.max(b.boredom-55,45-n.happiness),urgent:false});}
 return c.sort((a,z)=>(Number(z.urgent)-Number(a.urgent))||z.score-a.score);
}
function satisfied(s,r){const n=s.needs,b=s.behavior;return ({food:n.hunger>=75,toilet:n.toilet>=75,sleep:n.energy>=65||s.sleeping,bath:n.hygiene>=75,heal:n.health>=75,clean:s.poop===0,pet:b.attention>=80,play:b.boredom<=20&&n.happiness>=60,fruit:n.hunger>=95})[r.kind];}
function setRequest(s,kind,urgent=false,whim=false){const b=s.behavior;b.request={kind,urgent,whim,variant:Math.floor(random(b)*3),since:b.clock,until:b.clock+90};b.nextWish=b.clock+range(b,65,110);}
export function think(s){
 const b=ensureBehavior(s);if(s.paused)return null;
 if(b.notice&&b.notice.until<=b.clock)b.notice=null;
 if(s.sleeping){b.request=null;return null;}
 if(b.request&&(satisfied(s,b.request)||(b.request.whim&&b.clock>=b.request.until))){b.request=null;b.nextWish=Math.max(b.nextWish,b.clock+35);}
 const need=candidates(s)[0];
 if(need){if(!b.request||b.request.kind!==need.kind&&(need.urgent||b.request.whim||b.clock-b.request.since>18)){setRequest(s,need.kind,need.urgent);}else if(b.request.kind===need.kind)b.request.urgent=need.urgent;}
 else if(!b.request&&b.clock>=b.nextWish){
  const options=['pet'];if(s.needs.energy>35&&s.needs.health>45)options.push('play','play');if(s.needs.hunger<85)options.push('fruit');
  if(b.temperament==='affectionate')options.push('pet','pet');if(b.temperament==='calm')options.push('pet');
  const kind=options[Math.floor(random(b)*options.length)];
  // A wish reflects an actual desire, not a random drain of physical health.
  if(kind==='pet')b.attention=Math.min(b.attention,68);if(kind==='play')b.boredom=Math.max(b.boredom,32);
  setRequest(s,kind,false,true);
 }
 if(s.needs.energy<=4){s.sleeping=true;b.autoSleep=true;b.request=null;b.notice={text:'Não aguentei… vou tirar um cochilo.',icon:'☾',until:b.clock+8};return 'sleep';}
 return null;
}
export function respond(s,action,data={}){
 const b=ensureBehavior(s),r=b.request;
 if(action==='pet'){b.attention=clamp(b.attention+34);b.boredom=clamp(b.boredom-6);}
 if(action==='play'){b.attention=clamp(b.attention+24);b.boredom=clamp(b.boredom-55);}
 if(action==='feed')b.attention=clamp(b.attention+6);
 if(action==='sleep'||action==='wake')b.autoSleep=false;
 const matched=r&&(action===r.kind||r.kind==='food'&&action==='feed'||r.kind==='fruit'&&action==='feed'&&data.food==='fruit');
 if(matched){
  if(b.clock-b.lastReward>=20){s.bond=clamp(s.bond+2);b.lastReward=b.clock;}
  b.notice={text:'Era isso que eu queria! Obrigado! ♡',icon:'♡',until:b.clock+8};b.request=null;b.nextWish=b.clock+range(b,65,110);
 }else if(r&&satisfied(s,r)){b.request=null;b.nextWish=b.clock+50;}
 return !!matched;
}
export function getThought(s){
 const b=ensureBehavior(s);if(s.paused)return null;
 if(b.notice&&b.notice.until>b.clock)return {...b.notice,key:'thanks-'+b.notice.until,panel:null};
 if(s.sleeping)return {text:b.autoSleep?'Recuperando as energias…':'Sonhando com nossa próxima aventura…',icon:'☾',key:'sleeping',panel:'care'};
 if(!b.request)return null;const r=b.request,d=REQUESTS[r.kind];return {text:d.texts[r.variant],icon:d.icon,panel:d.panel,urgent:r.urgent,key:r.kind+'-'+r.since};
}
export function mood(s){const b=ensureBehavior(s),n=s.needs;if(s.paused)return 'Esperando você';if(s.sleeping)return 'Dormindo';if(n.health<35)return 'Precisando de cuidados';if(n.toilet<25)return 'Apertado';if(n.hunger<30)return 'Faminto';if(n.energy<30)return 'Sonolento';if(b.attention<35)return 'Carente';if(b.boredom>65)return 'Entediado';return n.happiness>70?'Contente':'Tranquilo';}
export function chooseRoutine(s){
 const b=ensureBehavior(s),n=s.needs,r=()=>random(b);
 let options=['look','stretch','scratch','wander','wander'];
 if(n.energy<35)options=['yawn','sit','yawn','look'];else if(n.hygiene<45)options=['scratch','scratch','look'];
 else if(n.toilet<25)options=['fidget','fidget','look'];else if(b.boredom>55)options=['wander','hop','look'];
 else if(n.happiness>75)options.push('hop');
 if(b.temperament==='curious')options.push('look','wander');if(b.temperament==='calm')options.push('sit');
 const kind=options[Math.floor(r()*options.length)];let target=null;
 if(kind==='wander'){
  // All destinations lie on the central walkable plaza.
  const spots=[[320,288],[440,315],[360,365],[470,350],[285,320],[414,263]];
  target=spots[Math.floor(r()*spots.length)];b.boredom=clamp(b.boredom-2);
 }
 return {kind,target,duration:kind==='wander'?7000:kind==='sit'?5200:kind==='scratch'?2400:3000,next:6500+r()*6500};
}

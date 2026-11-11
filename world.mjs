import {drawSprite} from './art.mjs?v=2.0';
import {actionEffect,DURATION} from './effects.mjs?v=2.0';
const W=768,H=512;
const limit=(v,a,b)=>Math.max(a,Math.min(b,v));
export class WorldView{
 constructor(canvas,bg,pet,callbacks){this.canvas=canvas;this.c=canvas.getContext('2d');this.bg=bg;this.pet=pet;this.cb=callbacks;this.camera={x:384,y:280,zoom:1,follow:true};this.pointers=new Map();this.action=null;this.press=null;this.prevPinch=null;this.w=1;this.h=1;this.base=1;this.resize();new ResizeObserver(()=>this.resize()).observe(canvas);this.bind();}
 resize(){const r=this.canvas.getBoundingClientRect();if(r.width<1||r.height<1)return;this.w=Math.round(r.width);this.h=Math.round(r.height);this.canvas.width=this.w;this.canvas.height=this.h;this.base=Math.max(this.w/W,this.h/H);this.minZoom=Math.min(this.w/W,this.h/H)/this.base;this.camera.zoom=limit(this.camera.zoom,this.minZoom,3);this.bounds();this.zoomLabel();}
 bounds(){const k=this.base*this.camera.zoom,halfW=this.w/k/2,halfH=this.h/k/2;this.camera.x=halfW>=W/2?W/2:limit(this.camera.x,halfW,W-halfW);this.camera.y=halfH>=H/2?H/2:limit(this.camera.y,halfH,H-halfH);}
 zoomLabel(){const b=document.getElementById('zoom-level');if(b)b.textContent=Math.round(this.camera.zoom*100)+'%';const out=document.getElementById('zoom-out'),inside=document.getElementById('zoom-in');if(out)out.disabled=this.camera.zoom<=this.minZoom+.001;if(inside)inside.disabled=this.camera.zoom>=3;}
 point(x,y){const r=this.canvas.getBoundingClientRect(),k=this.base*this.camera.zoom;return {x:(x-r.left-this.w/2)/k+this.camera.x,y:(y-r.top-this.h/2)/k+this.camera.y};}
 setZoom(value,anchor){const old=anchor?this.point(anchor.x,anchor.y):null;this.camera.zoom=limit(value,this.minZoom,3);if(old){const now=this.point(anchor.x,anchor.y);this.camera.x+=old.x-now.x;this.camera.y+=old.y-now.y;}this.bounds();this.zoomLabel();}
 zoom(factor){this.setZoom(this.camera.zoom*factor);this.cb.sound('click');}
 center(){this.camera.follow=true;this.camera.x=this.pet.x;this.camera.y=this.pet.y-25;this.setZoom(1);this.cb.sound('click');}
 busy(){return !!this.action&&performance.now()-this.action.start<this.action.duration;}
 animate(kind,data={}){const destination={toilet:[404,160],bath:[535,210],sleep:[305,218],train:[160,301],explore:[610,300],forage:[440,377]}[kind];let travel=destination?650:0;this.action={kind,data,start:performance.now(),duration:(DURATION[kind]||1300)+travel,travel,from:{x:this.pet.x,y:this.pet.y},to:destination?{x:destination[0],y:destination[1]}:null};if(destination){this.pet.tx=destination[0];this.pet.ty=destination[1];}else{this.pet.tx=this.pet.x;this.pet.ty=this.pet.y;}this.camera.follow=true;}
 bind(){const el=this.canvas;
 el.addEventListener('pointerdown',e=>{if(!this.cb.state())return;e.preventDefault();el.setPointerCapture(e.pointerId);const pos={x:e.clientX,y:e.clientY};this.pointers.set(e.pointerId,pos);if(this.pointers.size===1)this.press={id:e.pointerId,start:pos,last:pos,moved:false,multi:false};else {if(this.press)this.press.multi=true;this.prevPinch=null;}this.cb.unlock();});
 el.addEventListener('pointermove',e=>{if(!this.pointers.has(e.pointerId))return;const pos={x:e.clientX,y:e.clientY};this.pointers.set(e.pointerId,pos);if(this.pointers.size>=2){const [a,b]=[...this.pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};if(this.prevPinch){this.camera.follow=false;this.setZoom(this.camera.zoom*distance/Math.max(1,this.prevPinch.distance),mid);const k=this.base*this.camera.zoom;this.camera.x-=(mid.x-this.prevPinch.mid.x)/k;this.camera.y-=(mid.y-this.prevPinch.mid.y)/k;this.bounds();}this.prevPinch={distance,mid};return;}
 if(!this.press||this.press.multi)return;const d=this.press;if(Math.hypot(pos.x-d.start.x,pos.y-d.start.y)>9)d.moved=true;if(d.moved){const k=this.base*this.camera.zoom;this.camera.follow=false;this.camera.x-=(pos.x-d.last.x)/k;this.camera.y-=(pos.y-d.last.y)/k;this.bounds();}d.last=pos;});
 const release=(e,cancel)=>{const p=this.press;this.pointers.delete(e.pointerId);if(!cancel&&p&&p.id===e.pointerId&&!p.moved&&!p.multi){const point=this.point(e.clientX,e.clientY);const state=this.cb.state();let px=state?.sleeping?305:this.pet.x,py=state?.sleeping?218:this.pet.y;const hit=point.x>px-25&&point.x<px+25&&point.y>py-70&&point.y<py+6;if(hit)this.cb.pet();else this.cb.walk(point);}if(this.pointers.size===0){this.press=null;this.prevPinch=null;}};
 el.addEventListener('pointerup',e=>release(e,false));el.addEventListener('pointercancel',e=>release(e,true));el.addEventListener('lostpointercapture',e=>{if(this.pointers.has(e.pointerId))release(e,true);});
 el.addEventListener('wheel',e=>{e.preventDefault();this.camera.follow=false;this.setZoom(this.camera.zoom*Math.exp(-e.deltaY*.0015),{x:e.clientX,y:e.clientY});},{passive:false});
 }
 draw(s,t,dt){const c=this.c,pet=this.pet;let action=this.action,elapsed=action?t-action.start:0;if(action&&elapsed>=action.duration){if(action.to){pet.x=action.to.x;pet.y=action.to.y;}this.action=null;action=null;}if(action?.to){const p=limit(elapsed/action.travel,0,1),q=p*p*(3-2*p);pet.x=action.from.x+(action.to.x-action.from.x)*q;pet.y=action.from.y+(action.to.y-action.from.y)*q;pet.flip=action.to.x<action.from.x;}
 let px=s.sleeping&&!action?305:pet.x,py=s.sleeping&&!action?218:pet.y;
 if(this.camera.follow){let k=Math.min(1,dt*4);this.camera.x+=(px-this.camera.x)*k;this.camera.y+=(py-23-this.camera.y)*k;this.bounds();}
 c.setTransform(1,0,0,1,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#182920';c.fillRect(0,0,this.w,this.h);
 // When zoomed out beyond cover, a subdued scenery backdrop keeps the viewport filled.
 const cover=Math.max(this.w/W,this.h/H);c.globalAlpha=.25;c.drawImage(this.bg,(this.w-W*cover)/2,(this.h-H*cover)/2,W*cover,H*cover);c.globalAlpha=1;
 const scale=this.base*this.camera.zoom;c.translate(this.w/2,this.h/2);c.scale(scale,scale);c.translate(-this.camera.x,-this.camera.y);c.drawImage(this.bg,0,0,W,H);
 const night=s.sleeping||Math.floor(s.age/600)%2===1;if(night){c.fillStyle='#08215466';c.fillRect(0,0,W,H);for(const [x,y]of[[91,96],[339,140],[688,219],[213,361]]){let glow=c.createRadialGradient(x,y,0,x,y,34);glow.addColorStop(0,'#ffe4a65a');glow.addColorStop(1,'#ffdf8a00');c.fillStyle=glow;c.fillRect(x-34,y-34,68,68);}}
 for(let i=0;i<12;i++){const x=135+(i*67)%520,y=180+(i*47)%230+Math.sin(t*.0008+i)*6;c.fillStyle=night?'#f2e59daa':'#fff6d160';c.fillRect(x,y,1.5,1.5);}
 for(let i=0;i<s.poop;i++){c.fillStyle='#5e3f25';c.beginPath();c.ellipse(355+i*20,330+i*9,6,3,0,0,7);c.fill();c.fillRect(352+i*20,324+i*9,6,6);}
 const moving=Math.hypot(pet.tx-pet.x,pet.ty-pet.y)>3,localElapsed=action?Math.max(0,elapsed-action.travel):0;let bounce=moving?Math.abs(Math.sin(t*.016))*1.8:Math.sin(t*.002)*.4,stretch=1,rotation=0;
 if(action&&elapsed>=action.travel){switch(action.kind){case'pet':bounce=Math.abs(Math.sin(localElapsed*.009))*3;rotation=Math.sin(localElapsed*.008)*.055;break;case'play':bounce=Math.abs(Math.sin(localElapsed*.009))*15;rotation=Math.sin(localElapsed*.006)*.12;break;case'feed':stretch=1+Math.sin(localElapsed*.014)*.035;break;case'bath':rotation=Math.sin(localElapsed*.02)*.055;break;case'train':bounce=Math.abs(Math.sin(localElapsed*.016))*9;break;case'evolve':bounce=10*Math.sin(localElapsed/3000*Math.PI);break;}}
 c.fillStyle='#162a205c';c.beginPath();c.ellipse(px,py,18,6,0,0,7);c.fill();c.save();c.translate(px,py-bounce);c.rotate(rotation);c.scale(1,stretch);if(action?.kind==='toilet'&&elapsed>action.travel+250&&elapsed<action.duration-400)c.globalAlpha=.1;if(s.sleeping){c.rotate(-.22);c.scale(1,.78);}drawSprite(c,s.form,0,0,s.sleeping?1:1.35,moving?Math.floor(t/170)%2:0,pet.flip);c.restore();
 if(s.sleeping){c.fillStyle='#fbe6ad';c.font='bold 12px monospace';c.fillText('z Z z',px+16,py-47-Math.sin(t*.002)*4);}if(action&&elapsed>=action.travel)actionEffect(c,action.kind,px,py,localElapsed,action.duration-action.travel,action.data);
 if(pet.marker&&t-pet.marker.time<800){const p=(t-pet.marker.time)/800;c.strokeStyle=`rgba(250,237,178,${1-p})`;c.lineWidth=1;c.beginPath();c.ellipse(pet.marker.x,pet.marker.y,6+p*10,3+p*5,0,0,7);c.stroke();}
 c.setTransform(1,0,0,1,0,0);
 }
}

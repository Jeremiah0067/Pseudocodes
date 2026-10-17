(function(){
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const LV=[
{n:"First steps",g:"Robots do exactly what you tell them, one line at a time. Move the robot to the gem.",h:"Each FORWARD moves one square. Count the squares to the gem.",m:[".....","S...T","....."],p:4,b:"F"},
{n:"Corners",g:"The robot can turn. Turn right to face down, then walk to the gem.",h:"Walk east, then TURN RIGHT so the robot faces south.",m:["S....","####.","####T"],p:7,b:"FLR"},
{n:"Repeat it",g:"Writing FORWARD seven times is boring. Use REPEAT to do it in 3 lines.",h:"Put one FORWARD inside REPEAT 7 TIMES.",m:["........","S......T","........"],p:3,b:"FLRP"},
{n:"Staircase",g:"Climb the stairs. Find the pattern that repeats.",h:"One step is: FORWARD, TURN RIGHT, FORWARD, TURN LEFT. Repeat it 3 times.",m:["S.##","#..#","##..","###T"],p:6,b:"FLRP"},
{n:"Until done",g:"You don’t know how far away the gem is. Keep walking WHILE you are not at the gem.",h:"Use WHILE not at gem DO, with a FORWARD inside it.",m:["##########","S........T","##########"],p:3,b:"FLRPW"},
{n:"Decisions",g:"Walk the winding path. Turn only when there is a wall ahead.",h:"Inside the WHILE, use IF wall ahead THEN TURN RIGHT, and put FORWARD in the ELSE part.",m:["S...#","###.#","T...#","#####"],p:7,b:"FLRPWI"},
{n:"Other way",g:"Same idea, but this path bends the other way.",h:"Swap TURN RIGHT for TURN LEFT in your decision.",m:["#####","T...#","###.#","S...#"],p:7,b:"FLRPWI"},
{n:"The spiral",g:"Final mission! One short program can solve a long maze.",h:"The program from mission 6 works here too. Keep turning right at walls.",m:["S....","####.","..T#.",".###.","....."],p:7,b:"FLRPWI"},
{n:"Nested loops",g:"A loop can sit inside another loop. Walk the lap to the gem.",h:"Try REPEAT 3 with another REPEAT 3 inside it: walk 3 steps, then turn right.",m:["S...","###.","###.","T..."],p:6,b:"FLRP"},
{n:"Spiral, other way",g:"Spiral the other way around. Which way should the robot turn?",h:"Use the same program as the last spiral, but turn left at walls.",m:[".....",".###.","..T#.","####.","S...."],p:7,b:"FLRPWI"},
{n:"Boss maze",g:"The big one. A long spiral, and your program can still be short.",h:"WHILE not at gem, IF wall ahead THEN TURN RIGHT, ELSE FORWARD.",m:["S......","######.",".....#.",".###.#.",".#T..#.",".#####.","......."],p:7,b:"FLRPWI"}];
const PAL=[["F","FORWARD","m"],["L","TURN LEFT","m"],["R","TURN RIGHT","m"],["P","REPEAT","l"],["W","WHILE not at gem","l"],["I","IF wall ahead","q"]];
const TX={F:"FORWARD",L:"TURN LEFT",R:"TURN RIGHT",EP:"ENDREPEAT",W:"WHILE not at gem DO",EW:"ENDWHILE",I:"IF wall ahead THEN",E:"ELSE",EI:"ENDIF"};
const DX=[1,0,-1,0],DY=[0,1,0,-1];
let L=0,lines=[],ins=0,tm=null,ang=0,C=40,sv={s:[]};
try{sv=JSON.parse(localStorage.getItem("fcl_robot"))||sv}catch(e){}
sv.s=sv.s||[];
const save=()=>{try{localStorage.setItem("fcl_robot",JSON.stringify(sv))}catch(e){}};
try{const s=+localStorage.getItem("fcl_xp");if(s>0){xp=s;q("#xt").textContent=xp+" XP";q("#lv").textContent="Level "+(Math.floor(xp/50)+1);q("#xb").style.width=(xp%50)*2+"%"}}catch(e){}
const g0=gain;gain=function(n){g0(n);try{localStorage.setItem("fcl_xp",xp)}catch(e){}};
const msg=h=>q("#rm").innerHTML=h;
const txt=x=>x.t=="P"?`REPEAT ${x.n} TIMES`:TX[x.t];

function menu(){q("#lvls").innerHTML=LV.map((l,i)=>{const lock=i>0&&!sv.s[i-1],s=sv.s[i]||0;return`<button class="lb2${i==L?" on":""}" data-l="${i}" ${lock?"disabled":""}>${lock?"🔒":i+1}<small>${s?"★".repeat(s):"&nbsp;"}</small></button>`}).join("")}
function load(i){clearInterval(tm);L=i;lines=[];ins=0;ang=0;const l=LV[i];
q("#rg").innerHTML=`<b>Mission ${i+1}: ${l.n}.</b> ${l.g}`;msg("Add blocks, then press Run.");
q("#pal").innerHTML=PAL.filter(p=>l.b.includes(p[0])).map(p=>(p[0]=="P"?`<input type="number" id="rn" min="2" max="9" value="3" aria-label="Repeat count">`:"")+`<button class="blk ${p[2]}" data-k="${p[0]}">${p[1]}</button>`).join("");
board();rl();menu()}
function board(){const l=LV[L],H=l.m.length,W=l.m[0].length,b=q("#board");
C=Math.max(26,Math.min(60,Math.floor((Math.min(innerWidth-70,500)-20-4*(W-1))/W)));
b.style.cssText=`--c:${C}px;grid-template-columns:repeat(${W},var(--c))`;b.className="";
let h="";l.m.forEach(r=>[...r].forEach(c=>h+=`<div class="cl ${c=="#"?"w":c=="S"?"s":c=="T"?"t":""}">${c=="T"?"<span>💎</span>":""}</div>`));
b.innerHTML=h+`<div class="bot" id="bot"><i>➤</i></div>`;
let sx=0,sy=0;l.m.forEach((r,y)=>{const x=r.indexOf("S");if(x>=0){sx=x;sy=y}});pos(sx,sy,true)}
function pos(x,y,now){const bt=q("#bot"),i=bt.firstChild;
if(now){bt.style.transition=i.style.transition="none"}
bt.style.transform=`translate(${10+x*(C+4)}px,${10+y*(C+4)}px)`;i.style.transform=`rotate(${ang}deg)`;
if(now){void bt.offsetWidth;bt.style.transition=i.style.transition=""}}
function rl(){let d=0,h="";const n=lines.length;
const gap=i=>`<div class="pg${ins==i?" on":""}" data-g="${i}">${ins==i?"new blocks go here":""}</div>`;
lines.forEach((x,i)=>{h+=gap(i);if(["EP","EW","EI","E"].includes(x.t))d--;
h+=`<div class="prl" data-i="${i}"><span>${"    ".repeat(Math.max(d,0))}${txt(x).replace(/\b(REPEAT|TIMES|WHILE|DO|ENDWHILE|ENDREPEAT|IF|THEN|ELSE|ENDIF|FORWARD|TURN)\b/g,"<b>$1</b>")}</span><button data-d="${i}" aria-label="Delete block">✕</button></div>`;
if(["P","W","I","E"].includes(x.t))d++});
q("#plist").innerHTML=h+gap(n);fc()}
const O=["P","W","I"],E=["EP","EW","EI"];
function range(i){const t=lines[i].t;let d=0,j;
if(O.includes(t)){for(j=i;j<lines.length;j++){if(O.includes(lines[j].t))d++;else if(E.includes(lines[j].t))d--;if(!d)return[i,j]}}
if(E.includes(t)){for(j=i;j>=0;j--){if(E.includes(lines[j].t))d++;else if(O.includes(lines[j].t))d--;if(!d)return[j,i]}}
if(t=="E"){for(j=i-1;j>=0;j--){if(E.includes(lines[j].t))d++;else if(O.includes(lines[j].t)){if(!d)return range(j);d--}}}
return[i,i]}
function add(k){if(lines.length>28){msg("That’s plenty of blocks! Try a shorter program.");return}
const n=Math.min(9,Math.max(2,+(q("#rn")||{}).value||3));
const r={F:[{t:"F"}],L:[{t:"L"}],R:[{t:"R"}],P:[{t:"P",n},{t:"EP"}],W:[{t:"W"},{t:"EW"}],I:[{t:"I"},{t:"E"},{t:"EI"}]}[k];
lines.splice(ins,0,...r);ins++;rl()}
q("#pal").onclick=e=>{const k=e.target.dataset.k;if(k)add(k)};
q("#plist").onclick=e=>{const t=e.target,d=t.dataset.d,g=t.dataset.g;
if(d!=null){const[a,b]=range(+d);lines.splice(a,b-a+1);ins=Math.min(ins,a)}else if(g!=null)ins=+g;else return;rl()};
q("#lvls").onclick=e=>{const b=e.target.closest("[data-l]");if(b&&!b.disabled)load(+b.dataset.l)};
q("#rclr").onclick=()=>load(L);
q("#rhint").onclick=()=>msg("<b>Hint:</b> "+LV[L].h);

function parse(){const root=[],st=[{c:root}];
lines.forEach((x,i)=>{const f=st[st.length-1];
if("FLR".includes(x.t))f.c.push({t:x.t,i});
else if(O.includes(x.t)){const nd={t:x.t,i,n:x.n,b:[],e:[]};f.c.push(nd);st.push({nd,c:nd.b})}
else if(x.t=="E")f.c=f.nd.e;else st.pop()});return root}
function sim(){const M=LV[L].m,H=M.length,W=M[0].length;let r={x:0,y:0,d:0},tr=[],cnt=0,crash=0;
M.forEach((s,y)=>{const x=s.indexOf("S");if(x>=0){r.x=x;r.y=y}});
const wall=(x,y)=>x<0||y<0||y>=H||x>=W||M[y][x]=="#",ahead=()=>wall(r.x+DX[r.d],r.y+DY[r.d]),at=()=>M[r.y][r.x]=="T";
const stop=()=>crash||cnt>300;
function ex(b){for(const n of b){if(stop())return;cnt++;
if(n.t=="F"){if(ahead()){crash=1;tr.push({x:r.x,y:r.y,a:0,i:n.i,bump:1})}else{r.x+=DX[r.d];r.y+=DY[r.d];tr.push({x:r.x,y:r.y,a:0,i:n.i})}}
else if(n.t=="L"||n.t=="R"){const s=n.t=="R"?1:3;r.d=(r.d+s)%4;tr.push({x:r.x,y:r.y,a:s==1?90:-90,i:n.i})}
else if(n.t=="P")for(let k=0;k<n.n;k++)ex(n.b);
else if(n.t=="W")while(!at()&&!stop()){cnt++;ex(n.b)}
else ex(ahead()?n.b:n.e)}}
ex(parse());return{tr,crash,loop:cnt>300,win:!crash&&cnt<=300&&at()}}

/* flowchart view of the learner's program */
const FW=150;
const pa=(d,m)=>`<path class="fe"${m?' marker-end="url(#fa)"':""} d="${d}"/>`;
const TT=(x,y,t,a)=>`<text class="lb" x="${x}" y="${y}" text-anchor="${a||"start"}">${t}</text>`;
const bx=(cx,y,t,c,w,h)=>{w=w||FW;h=h||34;return`<rect class="nd n-${c}" x="${cx-w/2}" y="${y}" width="${w}" height="${h}" rx="${c=="start"?h/2:8}"/><text class="nt" x="${cx}" y="${y+h/2+4.5}">${t}</text>`};
const dia=(cx,y,t)=>`<polygon class="nd n-dec" points="${cx},${y} ${cx+75},${y+28} ${cx},${y+56} ${cx-75},${y+28}"/><text class="nt d" x="${cx}" y="${y+32.5}">${t}</text>`;
function lseq(items){const A=items.map(litem),w=A.reduce((a,b)=>Math.max(a,b.w),0),h=A.reduce((a,b,i)=>a+b.h+(i?26:0),0);
return{w,h,n:A.length,d(cx,y){let s="",cy=y;A.forEach((b,i)=>{if(i)s+=pa(`M${cx},${cy-26} V${cy}`,1);s+=b.d(cx,cy);cy+=b.h+26});return s}}}
function litem(n){
if("FLR".includes(n.t))return{w:FW,h:34,d:(cx,y)=>bx(cx,y,{F:"Move forward",L:"Turn left",R:"Turn right"}[n.t],"proc")};
const B=lseq(n.b);
if(n.t=="I"){const X=lseq(n.e),wl=Math.max(B.w,90),wr=Math.max(X.w,90),W=wl+wr+30,bh=Math.max(B.h,X.h),bt=76,mg=bt+bh+(bh?24:12),h=mg+22;
return{w:Math.max(W,FW),h,d(cx,y){const lx=cx-W/2+wl/2,rx=cx+W/2-wr/2,ey=y+28;let s=dia(cx,y,"Wall ahead?");
[[B,lx,cx-75,"YES",-1],[X,rx,cx+75,"NO",1]].forEach(([S,x2,sx,lab,sg])=>{
if(S.n)s+=pa(`M${sx},${ey} H${x2} V${y+bt}`,1)+S.d(x2,y+bt)+pa(`M${x2},${y+bt+S.h} V${y+mg} H${cx}`);
else s+=pa(`M${sx},${ey} H${x2} V${y+mg} H${cx}`);
s+=TT(sx+sg*6,ey-6,lab,sg<0?"end":"start")});
return s+pa(`M${cx},${y+mg} V${y+h}`)}}}
const W=Math.max(B.w,FW)+110,h=B.h+132;
return{w:W,h,d(cx,y){const xr=cx+W/2-16,xl=cx-W/2+16,bt=86,by=y+bt+B.h,bk=by+22;
let s=dia(cx,y,n.t=="W"?"Not at gem?":"Repeats left?")+TT(cx+8,y+72,"YES");
if(n.t=="P")s+=TT(cx-82,y+18,n.n+" times","end");
if(B.n)s+=pa(`M${cx},${y+56} V${y+bt}`,1)+B.d(cx,y+bt)+pa(`M${cx},${by} V${bk} H${xl} V${y+28} H${cx-75}`,1);
else s+=pa(`M${cx},${y+56} V${bk} H${xl} V${y+28} H${cx-75}`,1);
return s+pa(`M${cx+75},${y+28} H${xr} V${y+h} H${cx}`)+TT(cx+82,y+22,"NO")}}}
function fc(){const el=q("#rfc");if(el.hidden)return;
if(!lines.length){el.innerHTML='<p class="mut" style="margin:6px">Add blocks to see your flowchart.</p>';return}
const S=lseq(parse()),W=Math.max(S.w,FW)+60,cx=W/2;let y=64,s=bx(cx,8,"Start","start",100,30);
if(S.n){s+=pa(`M${cx},38 V${y}`,1)+S.d(cx,y);y+=S.h}else y=38;
s+=pa(`M${cx},${y} V${y+26}`,1)+bx(cx,y+26,"End","start",100,30);
el.innerHTML=`<svg viewBox="0 0 ${W} ${y+70}" style="width:100%;max-width:${Math.round(Math.min(W*1.15,430))}px;display:block;margin:auto"><defs><marker id="fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8a85b8"/></marker></defs>${s}</svg>`}
q("#rfb").onclick=()=>{const el=q("#rfc");el.hidden=!el.hidden;q("#rfb").textContent=el.hidden?"Show flowchart":"Hide flowchart";fc()};
function hi(i){qa(".prl").forEach(el=>el.classList.toggle("run",+el.dataset.i==i))}
q("#rrun").onclick=()=>{clearInterval(tm);if(!lines.length){msg("Add some blocks first.");return}
const res=sim();ang=0;board();let k=0;const tr=res.loop?res.tr.slice(0,45):res.tr;msg("Running…");
tm=setInterval(()=>{if(k>=tr.length){clearInterval(tm);hi(-1);return fin(res)}
const e=tr[k++];ang+=e.a;pos(e.x,e.y);hi(e.i);
if(e.bump){const b=q("#board");b.classList.add("crash")}},300)};
function fin(res){const b=q("#board"),n=lines.length,p=LV[L].p;
if(res.crash)return msg("💥 <b>Crash!</b> The robot hit a wall. Check where it turns, then press Run again.");
if(res.loop)return msg("🔁 <b>Your loop never stops.</b> Check its condition and what is inside it.");
if(!res.win)return msg("<b>Almost!</b> The robot stopped, but it isn’t on the gem. Change your program and run it again.");
const st=n<=p?3:n<=p+2?2:1,old=sv.s[L]||0;b.classList.add("win");
if(st>old)sv.s[L]=st;if(!old)gain(15+5*st);else if(st>old)gain(5);save();menu();boom();
msg(`🎉 <b>Gem collected!</b> ${"★".repeat(st)}${"☆".repeat(3-st)} with ${n} lines. ${st<3?`Can you do it in ${p}?`:"That’s the shortest possible."} ${L<LV.length-1?'<div class="ctl" style="margin:10px 0 0"><button class="btn" id="rnx">Next mission</button></div>':"<br><b>You finished every mission!</b>"}`);
const nx=q("#rnx");if(nx)nx.onclick=()=>load(L+1)}
let s0=LV.findIndex((l,i)=>!sv.s[i]&&(i==0||sv.s[i-1]));if(s0<0)s0=0;load(s0);
})();

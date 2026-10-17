const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let xp=0;
function gain(n){xp+=n;$("#xt").textContent=xp+" XP";$("#lv").textContent="Level "+(Math.floor(xp/50)+1);$("#xb").style.width=(xp%50)*2+"%";const t=document.createElement("div");t.className="toast";t.textContent="+"+n+" XP";document.body.append(t);setTimeout(()=>t.remove(),1700)}
function boom(){const c=["#6a4cff","#ffa01c","#12a977","#ef476f","#2b86ff","#a24dff"];for(let i=0;i<46;i++){const s=document.createElement("i");s.className="cf";s.style.cssText=`left:${Math.random()*100}vw;background:${c[i%6]};animation-delay:${Math.random()*.6}s`;document.body.append(s);setTimeout(()=>s.remove(),3200)}}
$$(".tab").forEach(b=>b.onclick=()=>{$$(".tab").forEach(x=>x.classList.toggle("on",x==b));$$(".pane").forEach((p,i)=>p.classList.toggle("on",i==b.dataset.t))});

/* shapes */
const DM={start:[55,20],end:[55,20],io:[70,22],proc:[70,22],dec:[75,35]};
function shp(t,x,y){const[w,h]=DM[t];const c="nd n-"+t;
if(t=="io")return`<polygon class="${c}" points="${x-w+12},${y-h} ${x+w},${y-h} ${x+w-12},${y+h} ${x-w},${y+h}"/>`;
if(t=="dec")return`<polygon class="${c}" points="${x},${y-h} ${x+w},${y} ${x},${y+h} ${x-w},${y}"/>`;
return`<rect class="${c}" x="${x-w}" y="${y-h}" width="${2*w}" height="${2*h}" rx="${t=="proc"?8:h}"/>`}
const SY=[["start","Start / End","Every flowchart begins and ends with an oval.","START … END"],["io","Input / Output","Data going in, or results coming out.","INPUT n  OUTPUT n"],["proc","Process","Do something: a sum, or change a variable.","SET total TO total + 1"],["dec","Decision","Ask a YES / NO question. Two arrows leave it.","IF n > 5 THEN …"]];
$("#sym").innerHTML=SY.map(([t,n,d,c])=>`<div class="sc"><svg viewBox="0 0 150 80">${shp(t,75,40).replace(/class="nd/,'class="')}<text class="nt${t=="dec"?" d":""}" x="75" y="44">${n.split(" ")[0]}</text></svg><b>${n}</b><div class="mut" style="font-size:15px">${d}</div><code>${c}</code></div>`).join("");

/* tea game */
const TEA=["Boil the water","Put a teabag in the cup","Pour the water into the cup","Wait 3 minutes","Take the teabag out"];let got=[],won=false;
function tea(){const pool=$("#pool"),ans=$("#ans");pool.innerHTML="";ans.innerHTML="";$("#tm").textContent="";
got.forEach((s,i)=>{const d=document.createElement("div");d.className="st";d.textContent=(i+1)+". "+s;ans.append(d)});
[...TEA].sort((a,b)=>(a.length*7%5)-(b.length*7%5)||a.localeCompare(b)).filter(s=>!got.includes(s)).forEach(s=>{const b=document.createElement("button");b.className="st";b.textContent=s;b.onclick=()=>{got.push(s);tea();if(got.length==TEA.length)chk()};pool.append(b)})}
function chk(){if(got.every((s,i)=>s==TEA[i])){$("#tm").textContent="Perfect! That list of steps is an algorithm.";if(!won){won=true;gain(20);boom()}}else{ans.classList.add("shake");$("#tm").textContent="Not quite. Think about what has to happen first.";setTimeout(()=>{ans.classList.remove("shake");got=[];tea();$("#tm").textContent="Not quite. Think about what has to happen first."},900)}}
const ans=$("#ans");$("#rs").onclick=()=>{got=[];tea()};tea();

/* programs */
const N=(id,t,txt,x,y,l,f,c)=>({id,t,txt,x,y,l,f,c});
const P=[
{name:"Even or odd?",lab:"Input n:",min:0,max:99,def:7,vb:"-5 0 355 410",
code:["INPUT n","IF n MOD 2 = 0 THEN","    OUTPUT “Even”","ELSE","    OUTPUT “Odd”","ENDIF"],
nodes:[N("s","start","Start",170,30,-1),N("i","io","INPUT n",170,100,0,S=>S.v.n=S.in),N("d","dec","n MOD 2 = 0?",170,190,1,0,S=>S.v.n%2==0),N("y","io","OUTPUT “Even”",70,290,2,S=>S.out.push("Even")),N("o","io","OUTPUT “Odd”",270,290,4,S=>S.out.push("Odd")),N("e","end","End",170,380,-1)],
edges:[["s","i"],["i","d"],["d","y","YES","l"],["d","o","NO","r"],["y","e"],["o","e"]]},
{name:"Countdown",lab:"Start from n:",min:1,max:8,def:3,vb:"20 0 450 420",
code:["INPUT n","WHILE n > 0 DO","    OUTPUT n","    SET n TO n - 1","ENDWHILE","OUTPUT “Blast off!”"],
nodes:[N("s","start","Start",220,30,-1),N("i","io","INPUT n",220,100,0,S=>S.v.n=S.in),N("d","dec","n > 0?",220,190,1,0,S=>S.v.n>0),N("o","io","OUTPUT n",220,290,2,S=>S.out.push(S.v.n)),N("m","proc","n ← n − 1",220,370,3,S=>S.v.n--),N("b","io","OUTPUT “Blast off!”",380,280,5,S=>S.out.push("Blast off!")),N("e","end","End",380,370,-1)],
edges:[["s","i"],["i","d"],["d","o","YES"],["d","b","NO","r"],["o","m"],["m","d","","b"],["b","e"]]},
{name:"Add 1 to n",lab:"Input n:",min:1,max:10,def:4,vb:"20 0 450 540",
code:["INPUT n","SET total TO 0","SET i TO 1","WHILE i <= n DO","    SET total TO total + i","    SET i TO i + 1","ENDWHILE","OUTPUT total"],
nodes:[N("s","start","Start",220,30,-1),N("i","io","INPUT n",220,95,0,S=>S.v.n=S.in),N("t","proc","total ← 0",220,160,1,S=>S.v.total=0),N("k","proc","i ← 1",220,225,2,S=>S.v.i=1),N("d","dec","i ≤ n?",220,315,3,0,S=>S.v.i<=S.v.n),N("a","proc","total ← total + i",220,410,4,S=>S.v.total+=S.v.i),N("u","proc","i ← i + 1",220,475,5,S=>S.v.i++),N("o","io","OUTPUT total",380,315,7,S=>S.out.push(S.v.total)),N("e","end","End",380,400,-1)],
edges:[["s","i"],["i","t"],["t","k"],["k","d"],["d","a","YES"],["d","o","NO","r"],["a","u"],["u","d","","b"],["o","e"]]}];
let pi=0,S,timer=null,map,done={};
const W=a=>a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function pth(a,b,m){const[w1,h1]=DM[a.t],[w2,h2]=DM[b.t];
if(m=="l"||m=="r"){const g=m=="l"?-1:1;return`M${a.x+g*w1},${a.y} L${b.x},${a.y} L${b.x},${b.y-h2}`}
if(m=="b"){const xl=Math.min(a.x,b.x)-150;return`M${a.x-w1},${a.y} L${xl},${a.y} L${xl},${b.y} L${b.x-w2},${b.y}`}
const y1=a.y+h1,y2=b.y-h2;if(a.x==b.x)return`M${a.x},${y1} L${b.x},${y2}`;const m2=(y1+y2)/2;return`M${a.x},${y1} L${a.x},${m2} L${b.x},${m2} L${b.x},${y2}`}
function load(i){pi=i;clearInterval(timer);timer=null;$("#aut").textContent="Auto-play";const p=P[i];map={};p.nodes.forEach(n=>map[n.id]=n);
$$(".pill").forEach((b,j)=>b.classList.toggle("on",j==i));$("#inl").textContent=p.lab;const inp=$("#inp");inp.min=p.min;inp.max=p.max;inp.value=p.def;
$("#code").innerHTML=p.code.map((l,j)=>`<div class="ln" id="l${j}"><s>${j+1}</s>${W(l).replace(/\b(INPUT|OUTPUT|SET|TO|IF|THEN|ELSE|ENDIF|WHILE|DO|ENDWHILE|MOD)\b/g,"<b>$1</b>")}</div>`).join("");
const svg=$("#svg");svg.setAttribute("viewBox",p.vb);
svg.innerHTML=`<defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#8a85b8"/></marker></defs>`+
p.edges.map((e,j)=>`<path class="e" id="e${j}" pathLength="1" marker-end="url(#ar)" d="${pth(map[e[0]],map[e[1]],e[3])}"/>`).join("")+
p.edges.filter(e=>e[2]).map(e=>{const a=map[e[0]],[w,h]=DM[a.t],m=e[3];return m=="l"||m=="r"?`<text class="lb" x="${a.x+(m=="l"?-w-6:w+6)}" y="${a.y-7}" text-anchor="${m=="l"?"end":"start"}">${e[2]}</text>`:`<text class="lb" x="${a.x+9}" y="${a.y+h+16}">${e[2]}</text>`}).join("")+
p.nodes.map(n=>`<g class="g" id="n_${n.id}">${shp(n.t,n.x,n.y)}<text class="nt${n.t=="dec"?" d":""}" x="${n.x}" y="${n.y+4.5}">${n.txt}</text></g>`).join("")+`<circle class="ball" id="ball" r="8" style="transform:translate(0,0)"/>`;
S={v:{},out:[],in:+inp.value,cur:null,res:null,n:0,end:false};arrive("s",true)}
function arrive(id,first){const n=map[id],before=JSON.stringify(S.v);S.cur=id;if(n.f)n.f(S);if(n.c)S.res=n.c(S);
$$(".g").forEach(g=>g.classList.remove("on"));$("#n_"+id).classList.add("on");const[w,h]=DM[n.t];$("#ball").style.transform=`translate(${n.x+w-10}px,${n.y-h-8}px)`;
$$(".ln").forEach(l=>l.classList.remove("on"));if(n.l>=0)$("#l"+n.l).classList.add("on");
const old=JSON.parse(before);$("#vars").innerHTML=Object.keys(S.v).length?Object.entries(S.v).map(([k,x])=>`<span class="v${old[k]!==x?" pop":""}">${k} = ${x}</span>`).join(""):'<span class="mut">none yet</span>';
$("#out").innerHTML=S.out.map(W).join("<br>")||'<span style="opacity:.5">nothing shown yet</span>';
const vs=Object.entries(S.v).map(([k,x])=>k+" = "+x).join(", ");let m;
if(n.t=="start")m="Every flowchart starts at the green Start oval. Press <b>Step</b> to follow the arrow.";
else if(n.t=="end"){m="The End oval. The program has finished!";S.end=true;clearInterval(timer);timer=null;$("#aut").textContent="Auto-play";if(!done[pi]){done[pi]=1;gain(15);boom()}}
else if(n.t=="dec")m=`<b>Decision.</b> The question is <i>${n.txt}</i> The answer is <b>${S.res?"YES":"NO"}</b>, so follow the ${S.res?"YES":"NO"} arrow.`;
else if(n.t=="io"&&n.txt.startsWith("INPUT"))m=`<b>Input.</b> The program reads the number ${S.in} and stores it in n.`;
else if(n.t=="io")m=`<b>Output.</b> The computer shows <b>${W(String(S.out[S.out.length-1]))}</b> on the screen.`;
else m=`<b>Process.</b> ${n.txt}. Now ${vs}.`;
$("#msg").innerHTML=m}
function step(){if(S.end||S.n++>150)return;const es=P[pi].edges.map((e,j)=>[e,j]).filter(x=>x[0][0]==S.cur);const x=es.length>1?es.find(z=>z[0][2]==(S.res?"YES":"NO")):es[0];
const el=$("#e"+x[1]);el.classList.remove("hot");void el.getBoundingClientRect();el.classList.add("hot");arrive(x[0][1])}
$("#pills").innerHTML=P.map((p,i)=>`<button class="pill">${p.name}</button>`).join("");$$(".pill").forEach((b,i)=>b.onclick=()=>load(i));
$("#stp").onclick=step;$("#rst").onclick=()=>load(pi);
$("#inp").onchange=()=>{const p=P[pi],i=$("#inp");i.value=Math.min(p.max,Math.max(p.min,+i.value||p.min));const v=i.value;load(pi);i.value=v;S.in=+v};
$("#aut").onclick=()=>{if(timer){clearInterval(timer);timer=null;$("#aut").textContent="Auto-play"}else{if(S.end)load(pi);$("#aut").textContent="Pause";timer=setInterval(step,1100)}};
load(0);

/* quiz */
const Q=[
{q:"Which flowchart shape asks a YES / NO question?",o:["Rectangle","Diamond","Oval","Parallelogram"],a:1,w:"The diamond is the decision shape. It always has two arrows leaving it."},
{q:"Which shape do you use for INPUT and OUTPUT?",o:["Parallelogram","Diamond","Oval","Rectangle"],a:0,w:"Data going in or out lives in a parallelogram, the slanted box."},
{q:"Which pseudocode word repeats steps while a question stays YES?",o:["IF","INPUT","WHILE","SET"],a:2,w:"WHILE is a loop. In a flowchart it is a diamond with an arrow looping back up."},
{q:"What does this print?",c:"SET x TO 5\nSET x TO x + 3\nOUTPUT x",o:["5","3","8","53"],a:2,w:"x starts at 5, then x + 3 makes it 8. The OUTPUT shows 8."},
{q:"The user types 12. What is printed?",c:"INPUT age\nIF age >= 13 THEN\n    OUTPUT “Teen”\nELSE\n    OUTPUT “Child”\nENDIF",o:["Teen","Child","Nothing","Both"],a:1,w:"Is 12 >= 13? No, so follow the ELSE path and print Child."},
{q:"How many arrows leave a decision diamond?",o:["1","2","3","As many as you like"],a:1,w:"Exactly two: one labelled YES and one labelled NO."},
{q:"What does this print?",c:"SET i TO 1\nWHILE i < 4 DO\n    OUTPUT i\n    SET i TO i + 1\nENDWHILE",o:["1 2 3","1 2 3 4","4","0 1 2 3"],a:0,w:"It prints 1, 2, 3. When i becomes 4, the question i < 4 is NO and the loop stops."},
{q:"Spot the bug. What goes wrong here?",c:"SET n TO 3\nWHILE n > 0 DO\n    OUTPUT n\nENDWHILE",o:["It prints nothing","It runs forever","It prints 3 once","It prints 0"],a:1,w:"n never changes, so n > 0 is always YES. Add SET n TO n - 1 inside the loop."}];
let qi=0,sc=0;
function rq(){const z=$("#quiz");if(qi>=Q.length){const g=sc>=7?"Brilliant!":sc>=5?"Nice work!":"Good start. Watch the programs run again and retry.";z.innerHTML=`<h2>You scored ${sc} out of ${Q.length}</h2><p>${g}</p><button class="btn" id="rt">Try again</button>`;if(sc>=5)boom();$("#rt").onclick=()=>{qi=0;sc=0;rq()};return}
const q=Q[qi];z.innerHTML=`<div class="prog"><i style="width:${qi/Q.length*100}%"></i></div><div class="mut">Question ${qi+1} of ${Q.length}</div><h2>${q.q}</h2>${q.c?`<pre>${W(q.c)}</pre>`:""}<div class="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}">${o}</button>`).join("")}</div><div id="fb"></div>`;
$$(".opt").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;$$(".opt").forEach(x=>x.disabled=true);$$(".opt")[q.a].classList.add("ok");if(i==q.a){sc++;gain(10)}else b.classList.add("no");
$("#fb").innerHTML=`<div class="why"><b>${i==q.a?"Correct!":"Not this time."}</b> ${q.w}</div><div class="ctl" style="margin:12px 0 0"><button class="btn" id="nx">${qi==Q.length-1?"See my score":"Next question"}</button></div>`;$("#nx").onclick=()=>{qi++;rq()}})}
rq();

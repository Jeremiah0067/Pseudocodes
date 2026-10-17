(function(){
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const W=640,H=600,DIM={start:[55,20],end:[55,20],io:[72,22],proc:[72,22],dec:[80,36]};
const NM={io:"Input / Output box",proc:"Process box",dec:"Decision diamond"};
const PH={io:"INPUT n  or  OUTPUT n",proc:"total ← total + 1",dec:"n > 0?"};
const TIP={io:"Start with INPUT or OUTPUT.",proc:"Use ← to store a value.",dec:"Write a YES / NO question."};
const SM=(n,e)=>({n,e});
const CH=[
{n:"Say hello",g:"Every flowchart runs from Start to End. Build the flowchart for this program.",c:["OUTPUT “Hello!”"],h:"Add one Input / Output box and type OUTPUT “Hello!” in it. Then use the Arrow tool: Start, your box, End.",
T:[{i:[],o:["Hello!"]}],S:SM([["start","Start",320,40],["io","OUTPUT “Hello!”",320,290],["end","End",320,550]],[[0,1],[1,2]])},
{n:"Double it",g:"This program reads a number and shows it doubled.",c:["INPUT n","SET result TO n * 2","OUTPUT result"],h:"Three boxes in a row: Input / Output, Process, Input / Output. In the Process box write result ← n * 2.",
T:[{i:[4],o:[8]},{i:[10],o:[20]},{i:[0],o:[0]}],S:SM([["start","Start",320,40],["io","INPUT n",320,130],["proc","result ← n * 2",320,250],["io","OUTPUT result",320,370],["end","End",320,550]],[[0,1],[1,2],[2,3],[3,4]])},
{n:"Even or odd",g:"Now the flowchart needs a decision.",c:["INPUT n","IF n MOD 2 = 0 THEN","    OUTPUT “Even”","ELSE","    OUTPUT “Odd”","ENDIF"],h:"The diamond asks n MOD 2 = 0? The YES arrow goes to OUTPUT “Even”, the NO arrow to OUTPUT “Odd”. Both boxes then point to End.",
T:[{i:[4],o:["Even"]},{i:[7],o:["Odd"]},{i:[0],o:["Even"]},{i:[13],o:["Odd"]}],S:SM([["start","Start",320,40],["io","INPUT n",320,120],["dec","n MOD 2 = 0?",320,250],["io","OUTPUT “Even”",170,400],["io","OUTPUT “Odd”",470,400],["end","End",320,550]],[[0,1],[1,2],[2,3,"YES"],[2,4,"NO"],[3,5],[4,5]])},
{n:"Pass or fail",g:"Another decision. Watch the exact mark where the answer changes.",c:["INPUT mark","IF mark >= 50 THEN","    OUTPUT “Pass”","ELSE","    OUTPUT “Fail”","ENDIF"],h:"Ask mark >= 50? with YES going to Pass and NO going to Fail.",
T:[{i:[50],o:["Pass"]},{i:[49],o:["Fail"]},{i:[100],o:["Pass"]},{i:[0],o:["Fail"]}],S:SM([["start","Start",320,40],["io","INPUT mark",320,120],["dec","mark >= 50?",320,250],["io","OUTPUT “Pass”",170,400],["io","OUTPUT “Fail”",470,400],["end","End",320,550]],[[0,1],[1,2],[2,3,"YES"],[2,4,"NO"],[3,5],[4,5]])},
{n:"Countdown",g:"Loops are flowchart arrows that go back up.",c:["INPUT n","WHILE n > 0 DO","    OUTPUT n","    SET n TO n - 1","ENDWHILE","OUTPUT “Go!”"],h:"The decision n > 0? sends YES to OUTPUT n, then to n ← n - 1, and that box points back up to the decision. NO goes to OUTPUT “Go!”.",
T:[{i:[3],o:[3,2,1,"Go!"]},{i:[1],o:[1,"Go!"]},{i:[0],o:["Go!"]}],S:SM([["start","Start",320,40],["io","INPUT n",320,110],["dec","n > 0?",320,220],["io","OUTPUT n",320,330],["proc","n ← n - 1",320,420],["io","OUTPUT “Go!”",520,300],["end","End",320,550]],[[0,1],[1,2],[2,3,"YES"],[3,4],[4,2],[2,5,"NO"],[5,6]])},
{n:"Add up to n",g:"Two variables change inside the loop. Keep track of both.",c:["INPUT n","SET total TO 0","SET i TO 1","WHILE i <= n DO","    SET total TO total + i","    SET i TO i + 1","ENDWHILE","OUTPUT total"],h:"Set total ← 0 and i ← 1 first. The decision is i <= n? YES adds i to total, then adds 1 to i, then loops back. NO shows total.",
T:[{i:[4],o:[10]},{i:[1],o:[1]},{i:[10],o:[55]}],S:SM([["start","Start",320,40],["io","INPUT n",320,100],["proc","total ← 0",320,160],["proc","i ← 1",320,220],["dec","i <= n?",320,310],["proc","total ← total + i",320,395],["proc","i ← i + 1",320,455],["io","OUTPUT total",520,380],["end","End",320,550]],[[0,1],[1,2],[2,3],[3,4],[4,5,"YES"],[5,6],[6,4],[4,7,"NO"],[7,8]])},
{n:"Biggest number",g:"Read two numbers and show the bigger one.",c:["INPUT a","INPUT b","IF a > b THEN","    OUTPUT a","ELSE","    OUTPUT b","ENDIF"],h:"Two INPUT boxes, then a decision a > b?. Think about what happens when the numbers are equal.",
T:[{i:[3,8],o:[8]},{i:[9,2],o:[9]},{i:[5,5],o:[5]}],S:SM([["start","Start",320,40],["io","INPUT a",320,100],["io","INPUT b",320,165],["dec","a > b?",320,270],["io","OUTPUT a",190,400],["io","OUTPUT b",450,400],["end","End",320,550]],[[0,1],[1,2],[2,3],[3,4,"YES"],[3,5,"NO"],[4,6],[5,6]])},
{n:"Times table",g:"The final challenge: a loop that shows five answers.",c:["INPUT n","SET i TO 1","WHILE i <= 5 DO","    OUTPUT n * i","    SET i TO i + 1","ENDWHILE"],h:"Set i ← 1. The decision i <= 5? sends YES to OUTPUT n * i, then i ← i + 1, then back up. NO goes straight to End.",
T:[{i:[3],o:[3,6,9,12,15]},{i:[7],o:[7,14,21,28,35]}],S:SM([["start","Start",320,40],["io","INPUT n",320,100],["proc","i ← 1",320,165],["dec","i <= 5?",320,260],["io","OUTPUT n * i",170,350],["proc","i ← i + 1",170,430],["end","End",320,550]],[[0,1],[1,2],[2,3],[3,4,"YES"],[4,5],[5,3],[3,6,"NO"]])}];
const FREE=CH.length;
let ci=0,nodes=[],edges=[],sel=null,mode=0,src=null,nid=1,tm=null,drag=null,st=0,sv={d:{},w:{}};
try{sv=JSON.parse(localStorage.getItem("fcl_fb"))||sv}catch(e){}
sv.d=sv.d||{};sv.w=sv.w||{};
const svg=q("#fbs"),by=id=>nodes.find(n=>n.id==id);
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const esa=s=>esc(s).replace(/"/g,"&quot;");
const msg=h=>q("#fbm").innerHTML=h;
const save=()=>{sv.w[ci]={nodes,edges,nid};try{localStorage.setItem("fcl_fb",JSON.stringify(sv))}catch(e){}};
const fresh=()=>{nodes=[{id:"n1",t:"start",x:320,y:40,txt:"Start"},{id:"n2",t:"end",x:320,y:550,txt:"End"}];edges=[];nid=3};

/* ---------- reading what the learner typed ---------- */
function ev(src,v){const re=/\s*(“[^”]*”|"[^"]*"|\d+(?:\.\d+)?|[A-Za-z_]\w*|<=|>=|<>|!=|==|≤|≥|[-+*\/%()<>=−×÷])/y,s=src.trim();let js="",pos=0,m;
if(!s)throw new Error("There is nothing to work out here.");
while(pos<s.length){re.lastIndex=pos;m=re.exec(s);if(!m)throw new Error("I don’t understand “"+s.slice(pos).trim().slice(0,10)+"”.");pos=re.lastIndex;const t=m[1];
if(/^[“"]/.test(t))js+=JSON.stringify(t.slice(1,-1));
else if(/^\d/.test(t))js+=t;
else if(/^[A-Za-z_]/.test(t)){const u=t.toUpperCase();
if(u=="MOD")js+="%";else if(u=="AND")js+="&&";else if(u=="OR")js+="||";else if(u=="NOT")js+="!";
else{const k=t.toLowerCase();if(!(k in v))throw new Error("“"+t+"” has no value yet. Did you INPUT it or set it earlier?");js+="v["+JSON.stringify(k)+"]"}}
else js+={"=":"===","==":"===","<>":"!==","!=":"!==","≤":"<=","≥":">=","−":"-","×":"*","÷":"/"}[t]||t}
try{return Function("v","return("+js+")")(v)}catch(e){throw new Error("That isn’t a complete expression.")}}
function sim(inp){const tr=[],out=[],v={};let cur=nodes.find(n=>n.t=="start"),qi=0,via=null,steps=0;
const fail=(m,n)=>({err:m,id:n&&n.id,tr,out});
if(!cur)return fail("Add a Start oval first.");
while(true){
if(++steps>300)return fail("Your flowchart never reaches End. It kept looping. Check the decision that controls the loop.",cur);
let m="",res=null;const t=cur.txt.trim();
try{
if(cur.t=="io"){let r;
if(r=/^(?:input|read|enter)\b[:\s]*(.*)$/i.exec(t)){const nm=r[1].split(/[,\s]+/).filter(Boolean);if(!nm.length)throw new Error("INPUT needs a variable name, like INPUT n.");
nm.forEach(x=>{if(qi>=inp.length)throw new Error("The flowchart needs another input value. Type it in the Input values box.");v[x.toLowerCase()]=inp[qi++]});m="Input: "+nm.map(x=>x+" = "+v[x.toLowerCase()]).join(", ")}
else if(r=/^(?:output|print|display|show)\b[:\s]*(.*)$/i.exec(t)){const val=ev(r[1],v);out.push(val);m="Output: the screen shows "+val}
else throw new Error("An Input / Output box should start with INPUT or OUTPUT.")}
else if(cur.t=="proc"){const r=/^set\s+([A-Za-z_]\w*)\s+to\s+(.+)$/i.exec(t)||/^([A-Za-z_]\w*)\s*(?:←|<-|=)\s*(.+)$/.exec(t);
if(!r)throw new Error("I can’t read this Process box. Try something like total ← total + 1.");
const val=ev(r[2],v);v[r[1].toLowerCase()]=val;m=r[1]+" is now "+val}
else if(cur.t=="dec"){res=!!ev(t.replace(/\?+\s*$/,""),v);m=t+" The answer is "+(res?"YES":"NO")}
else m=cur.t=="start"?"Start: the flowchart begins here.":"End: the flowchart finishes."
}catch(x){return fail("“"+t+"”: "+x.message,cur)}
tr.push({id:cur.id,v:{...v},o:out.length,via,m});
if(cur.t=="end")return{out,tr};
const os=edges.filter(e=>e.a==cur.id);let nx;
if(cur.t=="dec"){const l=res?"YES":"NO";nx=os.find(e=>e.l==l);if(!nx)return fail("The decision “"+t+"” needs a "+l+" arrow.",cur)}
else{if(!os.length)return fail("There is no arrow leaving “"+cur.txt+"”.",cur);if(os.length>1)return fail("More than one arrow leaves “"+cur.txt+"”. Only a decision can split in two.",cur);nx=os[0]}
via=nx.id;cur=by(nx.b)}}
const inputs=()=>q("#fbi").value.split(/[,;\s]+/).filter(Boolean).map(x=>isNaN(+x)?x:+x);

/* ---------- drawing ---------- */
function bd(n,dx,dy){const[w,h]=DIM[n.t],ax=Math.abs(dx)||1e-6,ay=Math.abs(dy)||1e-6,k=n.t=="dec"?1/(ax/w+ay/h):Math.min(w/ax,h/ay);return[dx*k,dy*k]}
function geo(e){const a=by(e.a),b=by(e.b),dx=b.x-a.x,dy=b.y-a.y,rev=edges.some(o=>o.a==e.b&&o.b==e.a);let c=null;
if(dy<-4||rev){const L=Math.hypot(dx,dy)||1,off=dy<-4?190:46;let px=-dy/L*off,py=dx/L*off;if(px>0||(px==0&&py>0)){px=-px;py=-py}c=[(a.x+b.x)/2+px,(a.y+b.y)/2+py]}
const s=bd(a,(c?c[0]:b.x)-a.x,(c?c[1]:b.y)-a.y),t=bd(b,(c?c[0]:a.x)-b.x,(c?c[1]:a.y)-b.y),sx=a.x+s[0],sy=a.y+s[1],ex=b.x+t[0],ey=b.y+t[1];
let lx,ly;
if(c){const u=.35;lx=(1-u)*(1-u)*sx+2*u*(1-u)*c[0]+u*u*ex;ly=(1-u)*(1-u)*sy+2*u*(1-u)*c[1]+u*u*ey}else{lx=sx+(ex-sx)*.3;ly=sy+(ey-sy)*.3}
return{d:c?`M${sx},${sy} Q${c[0]},${c[1]} ${ex},${ey}`:`M${sx},${sy} L${ex},${ey}`,lx,ly}}
function shape(n){const[w,h]=DIM[n.t],x=n.x,y=n.y,c="nd n-"+n.t;
if(n.t=="io")return`<polygon class="${c}" points="${x-w+12},${y-h} ${x+w},${y-h} ${x+w-12},${y+h} ${x-w},${y+h}"/>`;
if(n.t=="dec")return`<polygon class="${c}" points="${x},${y-h} ${x+w},${y} ${x},${y+h} ${x-w},${y}"/>`;
return`<rect class="${c}" x="${x-w}" y="${y-h}" width="${2*w}" height="${2*h}" rx="${n.t=="proc"?8:h}"/>`}
function draw(){let s=`<defs><marker id="fba" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8a85b8"/></marker></defs>`;
edges.forEach(e=>{const g=geo(e),on=sel&&sel.k=="e"&&sel.id==e.id;
s+=`<path class="e${on?" sel":""}" id="fe_${e.id}" pathLength="1" marker-end="url(#fba)" d="${g.d}"/><path class="eh" data-e="${e.id}" d="${g.d}"/>`+(e.l?`<text class="lb" x="${g.lx+7}" y="${g.ly-5}">${e.l}</text>`:"")});
nodes.forEach(n=>{const mx=n.t=="dec"?15:21,t=n.txt.length>mx?n.txt.slice(0,mx-1)+"…":n.txt,on=sel&&sel.k=="n"&&sel.id==n.id;
s+=`<g class="g${on?" sel":""}${src==n.id?" src":""}" data-n="${n.id}">${shape(n)}<text class="nt${n.t=="dec"?" d":""}" x="${n.x}" y="${n.y+4.5}">${esc(t)}</text></g>`});
svg.innerHTML=s}
function ed(){const el=q("#fbe"),n=sel&&sel.k=="n"&&by(sel.id),e=sel&&sel.k=="e"&&edges.find(x=>x.id==sel.id);
if(n)el.innerHTML=(n.t=="start"||n.t=="end")?`<b>${n.t=="start"?"Start":"End"} oval.</b> Every flowchart begins at Start and finishes at End.`:`<label for="fbt"><b>Text inside this ${NM[n.t]}</b></label><br><input class="txt" id="fbt" value="${esa(n.txt)}" placeholder="${PH[n.t]}"> <span class="mut">${TIP[n.t]}</span>`;
else if(e){const a=by(e.a),b=by(e.b);el.innerHTML=`<b>Arrow</b> from “${esc(a.txt)}” to “${esc(b.txt)}”. `+(a.t=="dec"?`This arrow means: <button class="btn g sm" data-l="YES">YES</button> <button class="btn g sm" data-l="NO">NO</button>`:"")}
else el.innerHTML=mode?"<b>Arrow tool is on.</b> Click a shape, then click the shape the arrow should point to.":"<b>Tip:</b> drag shapes from the palette onto the canvas. Tap a shape to edit its text. Turn on the Arrow tool to join shapes."}
const pt=ev=>{const r=svg.getBoundingClientRect();return{x:(ev.clientX-r.left)*W/(r.width||W),y:(ev.clientY-r.top)*H/(r.height||H)}};
const cl=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- editing ---------- */
function stop(){clearInterval(tm);tm=null;q("#fbrun").textContent="Run";clr()}
function clr(){qa("#fbs .g").forEach(g=>g.classList.remove("on","bad"));qa("#fbs .e").forEach(e=>e.classList.remove("hot"))}
function addNode(t,ev){if(t=="start"&&nodes.some(n=>n.t=="start")){msg("A flowchart has only one Start oval.");return}
stop();const k=nodes.length,n={id:"n"+nid++,t,x:140+(k*37)%360,y:120+(k*53)%330,txt:DEF[t]};nodes.push(n);sel={k:"n",id:n.id};mode=0;src=null;qa("#fbar").forEach(b=>b.textContent="Arrow tool: off");
drag={n,dx:0,dy:0,pal:1};ed();draw();msg("Shape added. Drag it into place, then type its text below the canvas.")}
const DEF={start:"Start",end:"End",io:"INPUT n",proc:"x ← 0",dec:"x > 0?"};
function delSel(){if(!sel)return;stop();if(sel.k=="n"){edges=edges.filter(e=>e.a!=sel.id&&e.b!=sel.id);nodes=nodes.filter(n=>n.id!=sel.id)}else edges=edges.filter(e=>e.id!=sel.id);sel=null;src=null;ed();draw();save()}
function arrowClick(id){stop();
if(!src){src=id;sel={k:"n",id};msg("Now click the shape this arrow should point to.");draw();return}
const a=by(src),b=by(id);src=null;
if(a.id==b.id){draw();return}
if(a.t=="end")msg("Nothing can leave the End oval.");
else if(b.t=="start")msg("Arrows can’t point into Start.");
else if(edges.some(e=>e.a==a.id&&e.b==b.id))msg("That arrow already exists.");
else{const used=edges.filter(e=>e.a==a.id).map(e=>e.l);let l="";
if(a.t=="dec"){if(used.length>=2){msg("A decision has only two arrows: YES and NO.");draw();return}l=used.includes("YES")?"NO":"YES"}
else if(used.length){msg("Only a decision diamond can have two arrows leaving it.");draw();return}
edges.push({id:"e"+nid++,a:a.id,b:b.id,l});sel={k:"e",id:"e"+(nid-1)};msg("Arrow added."+(l?" Tap it to switch between YES and NO.":""));ed();save()}
draw()}
svg.addEventListener("pointerdown",ev=>{const ne=ev.target.closest("[data-n]"),ee=ev.target.closest("[data-e]");
if(mode){if(ne)arrowClick(ne.dataset.n);else{src=null;if(ee)sel={k:"e",id:ee.dataset.e};ed();draw()}return}
if(ne){const n=by(ne.dataset.n),p=pt(ev);sel={k:"n",id:n.id};drag={n,dx:n.x-p.x,dy:n.y-p.y};ed();draw();ev.preventDefault()}
else{sel=ee?{k:"e",id:ee.dataset.e}:null;ed();draw()}});
window.addEventListener("pointermove",ev=>{if(!drag)return;const p=pt(ev);drag.n.x=cl(p.x+drag.dx,60,W-60);drag.n.y=cl(p.y+drag.dy,26,H-26);draw()});
window.addEventListener("pointerup",()=>{if(!drag)return;const d=drag;drag=null;save();if(d.pal){const i=q("#fbt");if(i){i.focus();i.select()}}});
q("#fbp").addEventListener("pointerdown",ev=>{const b=ev.target.closest("[data-a]");if(b){ev.preventDefault();addNode(b.dataset.a,ev)}});
q("#fbp").addEventListener("click",ev=>{const b=ev.target.closest("[data-a]");if(b&&ev.detail===0)addNode(b.dataset.a,ev)});
q("#fbe").addEventListener("input",ev=>{if(ev.target.id=="fbt"&&sel){stop();by(sel.id).txt=ev.target.value;draw();clearTimeout(st);st=setTimeout(save,400)}});
q("#fbe").addEventListener("click",ev=>{const l=ev.target.dataset.l;if(!l||!sel)return;const e=edges.find(x=>x.id==sel.id),o=edges.find(x=>x.a==e.a&&x.id!=e.id&&x.l==l);if(o)o.l=l=="YES"?"NO":"YES";e.l=l;draw();save()});
document.addEventListener("keydown",ev=>{if(!q("#p4").classList.contains("on")||/INPUT|TEXTAREA/.test(ev.target.tagName))return;if(ev.key=="Delete"||ev.key=="Backspace"){delSel();ev.preventDefault()}});
q("#fbar").onclick=()=>{mode^=1;src=null;stop();q("#fbar").textContent="Arrow tool: "+(mode?"on":"off");q("#fbar").classList.toggle("on",!!mode);ed();draw()};
q("#fbdel").onclick=delSel;
q("#fbclr").onclick=()=>{stop();fresh();sel=null;src=null;showV({},[]);ed();draw();save();msg("Fresh start. Add shapes and join them with arrows.")};

/* ---------- running and checking ---------- */
const showV=(v,o)=>{q("#fbv").innerHTML=Object.keys(v).length?Object.entries(v).map(([k,x])=>`<span class="v">${esc(k)} = ${esc(x)}</span>`).join(""):'<span class="mut">none yet</span>';q("#fbo").innerHTML=o.length?o.map(esc).join("<br>"):'<span style="opacity:.5">nothing shown yet</span>'};
q("#fbrun").onclick=()=>{if(tm){stop();return}
const r=sim(inputs()),tr=r.tr.slice(0,r.err?60:400);let k=0;clr();q("#fbrun").textContent="Stop";showV({},[]);
tm=setInterval(()=>{if(k>=tr.length){clearInterval(tm);tm=null;q("#fbrun").textContent="Run";
if(r.err){msg("❌ "+esc(r.err));const g=r.id&&q(`#fbs [data-n="${r.id}"]`);if(g)g.classList.add("bad")}
else msg("✅ The flowchart reached End. "+(r.out.length?"It showed: <b>"+r.out.map(esc).join(", ")+"</b>":"It showed nothing."));return}
const s=tr[k++];clr();const g=q(`#fbs [data-n="${s.id}"]`);if(g)g.classList.add("on");
if(s.via){const e=q("#fe_"+s.via);if(e){e.classList.remove("hot");void e.getBoundingClientRect();e.classList.add("hot")}}
showV(s.v,r.out.slice(0,s.o));msg(esc(s.m))},650)};
q("#fbchk").onclick=()=>{stop();const c=CH[ci];
if(!c){msg("Free build has no answer to check. Press Run to test your flowchart with your own input values.");return}
for(const t of c.T){const r=sim(t.i.slice()),inp=t.i.length?t.i.join(", "):"no input";
if(r.err){msg("❌ With "+inp+": "+esc(r.err));const g=r.id&&q(`#fbs [data-n="${r.id}"]`);if(g)g.classList.add("bad");return}
const got=r.out.map(String).join(", ")||"nothing",exp=t.o.map(String).join(", ");
if(got!==exp){msg("❌ With "+inp+" your flowchart showed <b>"+esc(got)+"</b> but it should show <b>"+esc(exp)+"</b>. Run it with those values to see where it goes wrong.");return}}
const first=!sv.d[ci];sv.d[ci]=1;save();if(first)gain(25);pills();boom();
msg("🎉 <b>Perfect!</b> Your flowchart passed all "+c.T.length+" tests."+(ci<CH.length-1?'<div class="ctl" style="margin:10px 0 0"><button class="btn" id="fbnx">Next challenge</button></div>':"<br><b>You finished every challenge!</b>"));
const nx=q("#fbnx");if(nx)nx.onclick=()=>load(ci+1)};
q("#fbhint").onclick=()=>msg("<b>Hint:</b> "+(CH[ci]?CH[ci].h:"Try a password check, a times table or a number guesser. Write the pseudocode first, then draw it."));
q("#fbsol").onclick=()=>{const c=CH[ci];if(!c){msg("Free build has no solution. Make up your own!");return}
stop();nid=1;nodes=c.S.n.map(([t,txt,x,y])=>({id:"n"+nid++,t,x,y,txt}));edges=c.S.e.map(([a,b,l])=>({id:"e"+nid++,a:"n"+(a+1),b:"n"+(b+1),l:l||""}));sel=null;ed();draw();
msg("This is one way to do it. Press Run to watch it work, then try building it yourself with Start over.")};

/* ---------- challenges ---------- */
function pills(){q("#fbl").innerHTML=CH.map((c,i)=>`<button class="lb2${i==ci?" on":""}" data-c="${i}">${i+1}<small>${sv.d[i]?"✓":"&nbsp;"}</small></button>`).join("")+`<button class="lb2${ci==FREE?" on":""}" data-c="${FREE}">Free<small>build</small></button>`}
function load(i){stop();ci=i;const w=sv.w[i];if(w&&w.nodes){nodes=w.nodes;edges=w.edges;nid=w.nid}else fresh();sel=null;src=null;mode=0;q("#fbar").textContent="Arrow tool: off";q("#fbar").classList.remove("on");
const c=CH[i];
q("#fbg").innerHTML=c?`<b>Challenge ${i+1}: ${c.n}.</b> ${c.g}`:"<b>Free build.</b> Make any flowchart you like, then press Run. Type input values in the box if your flowchart uses INPUT.";
q("#fbc").innerHTML=c?c.c.map((l,j)=>`<div class="ln"><s>${j+1}</s>${esc(l).replace(/\b(INPUT|OUTPUT|SET|TO|IF|THEN|ELSE|ENDIF|WHILE|DO|ENDWHILE|MOD)\b/g,"<b>$1</b>")}</div>`).join(""):'<div class="ln"><s>·</s>Your idea goes here</div>';
q("#fbi").value=c?c.T[0].i.join(", "):"";showV({},[]);msg("Add shapes, join them with arrows, then press Run to watch it work.");pills();ed();draw()}
q("#fbl").onclick=e=>{const b=e.target.closest("[data-c]");if(b)load(+b.dataset.c)};
load(0);
})();

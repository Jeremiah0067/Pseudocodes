(function(){
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
document.getElementById("psb").onclick=()=>{
const xp=+g("fcl_xp")||0,qb=g("fcl_quiz");let s=[];try{s=(JSON.parse(g("fcl_robot")||"{}").s)||[]}catch(e){}
const n=Math.max(11,s.length),done=s.filter(Boolean).length,stars=s.reduce((a,b)=>a+(b||0),0);
let cells="";for(let i=0;i<n;i++){const k=s[i]||0;cells+=`<span>Mission ${i+1}: ${k?"★".repeat(k)+"☆".repeat(3-k):"not done yet"}</span>`}
const skills=["Names the four flowchart shapes","Writes INPUT, OUTPUT and SET correctly","Traces an IF / ELSE program","Traces a WHILE loop and tracks variables","Turns pseudocode into a flowchart","Spots and fixes a bug"];
document.getElementById("sheet").innerHTML=`<h1>Flow &amp; Code Lab: progress sheet</h1>
<p>Student: ______________________ &nbsp; Date: ${new Date().toLocaleDateString()}</p>
<h2>This device</h2>
<p>Level ${Math.floor(xp/50)+1} with ${xp} XP. Quiz best score: ${qb!==null?qb+" out of 10":"not taken yet"}.</p>
<h2>Robot missions: ${done} of ${n} complete, ${stars} stars</h2><div class="sg">${cells}</div>
<h2>Skills check (tutor ticks)</h2><ul class="sk">${skills.map(x=>`<li>☐ ${x}</li>`).join("")}</ul>
<h2>Notes</h2><div class="nl"></div><div class="nl"></div><div class="nl"></div><div class="nl"></div>`;
window.print()};
})();

const factions=[
{name:"Anga",capital:"Champa",x:650,y:315,base:95,traits:"River trade"},
{name:"Magadha",capital:"Rajagriha",x:590,y:345,base:130,traits:"Iron & fertile land"},
{name:"Kashi",capital:"Varanasi",x:535,y:285,base:105,traits:"Trade & textiles"},
{name:"Kosala",capital:"Shravasti",x:475,y:225,base:115,traits:"Fertile plains"},
{name:"Vajji",capital:"Vaishali",x:560,y:225,base:100,traits:"Confederacy"},
{name:"Malla",capital:"Kusinara",x:510,y:180,base:75,traits:"Republic"},
{name:"Chedi",capital:"Suktimati",x:405,y:355,base:90,traits:"Central position"},
{name:"Vatsa",capital:"Kausambi",x:455,y:305,base:105,traits:"Yamuna trade"},
{name:"Kuru",capital:"Indraprastha",x:350,y:185,base:105,traits:"Warrior tradition"},
{name:"Panchala",capital:"Ahichchhatra",x:420,y:225,base:100,traits:"Infantry"},
{name:"Matsya",capital:"Viratanagara",x:275,y:315,base:85,traits:"Horse country"},
{name:"Surasena",capital:"Mathura",x:335,y:285,base:100,traits:"Trade crossroads"},
{name:"Assaka",capital:"Potana",x:475,y:500,base:90,traits:"Southern trade"},
{name:"Avanti",capital:"Ujjayini",x:265,y:400,base:120,traits:"Trade & metals"},
{name:"Gandhara",capital:"Taxila",x:135,y:115,base:105,traits:"Western trade"},
{name:"Kamboja",capital:"Rajapura",x:180,y:55,base:80,traits:"Mountain horses"}
];

const state={year:-800,player:1,selected:1,kingdoms:{},relations:{},log:[]};
function init(){
  factions.forEach((f,i)=>state.kingdoms[f.name]={...f,owner:i,pop:f.base,food:100+f.base,gold:100,army:35+Math.floor(f.base/6),fort:25,stability:70,alive:true});
  factions.forEach(a=>factions.forEach(b=>{if(a.name!==b.name)state.relations[a.name+"|"+b.name]=0}));
  log("The campaign begins in 800 BCE. Build your realm and control the capitals.");
  render();
}
function player(){return factions[state.player]}
function selected(){return factions[state.selected]}
function rel(a,b){return state.relations[a+"|"+b]||0}
function setRel(a,b,v){state.relations[a+"|"+b]=v;state.relations[b+"|"+a]=v}
function money(n){return Math.floor(n)}
function log(t){state.log.unshift(`[${Math.abs(state.year)} BCE] ${t}`);state.log=state.log.slice(0,35)}
function render(){
  document.getElementById("year").textContent=Math.abs(state.year)+" BCE";
  const fs=document.getElementById("factionSelect"); fs.innerHTML=factions.map((f,i)=>`<option value="${i}" ${i===state.player?"selected":""}>${f.name} — ${f.capital}</option>`).join("");
  fs.onchange=()=>{state.player=+fs.value;state.selected=state.player;render()};
  renderMap(); renderStats(); renderSelected(); renderDiplomacy(); renderLog();
}
function renderMap(){
 const svg=document.getElementById("map");
 const rivers=`<path d="M40 220 Q250 180 410 250 T760 350" fill="none" stroke="#4e7890" stroke-width="9" opacity=".45"/><path d="M300 30 Q330 150 355 300 T470 560" fill="none" stroke="#4e7890" stroke-width="6" opacity=".4"/><path d="M520 50 Q510 180 555 310 T610 560" fill="none" stroke="#4e7890" stroke-width="5" opacity=".35"/>`;
 svg.innerHTML=`<rect width="900" height="600" fill="#26352e"/><path d="M175 45 L215 60 250 50 285 65 320 55 360 70 395 60 425 80 455 75 480 95 505 90 530 110 555 105 580 130 600 160 615 195 605 225 625 255 615 285 630 315 618 345 632 375 615 400 598 430 582 455 565 480 548 500 558 525 538 545 515 560 495 545 480 565 460 550 445 575 428 555 415 575 398 550 405 520 385 500 392 470 370 450 378 420 358 400 365 375 345 355 352 330 332 310 340 285 320 265 328 240 308 220 298 195 282 175 265 155 250 135 232 118 215 100 198 80 180 65Z" fill="#304235" stroke="#8a805f" stroke-width="2"/>${rivers}<text x="700" y="565" fill="#aeb7a4" font-size="15">Indian Subcontinent</text>`;
 factions.forEach((f,i)=>{
   const k=state.kingdoms[f.name], isPlayer=i===state.player, isSel=i===state.selected;
   const color=isPlayer?"#e2c66c":(k.owner===state.player?"#6da77a":"#b86b63");
   const r=isSel?12:9;
   svg.innerHTML+=`<g class="capital" data-i="${i}" style="cursor:pointer"><circle cx="${f.x}" cy="${f.y}" r="${r+4}" fill="none" stroke="${isSel?"#fff":"transparent"}" stroke-width="2"/><circle cx="${f.x}" cy="${f.y}" r="${r}" fill="${color}" stroke="#171a1f" stroke-width="3"/><text x="${f.x+13}" y="${f.y+4}" fill="#eee" font-size="12">${f.capital}</text></g>`;
 });
 svg.querySelectorAll(".capital").forEach(g=>g.onclick=()=>{state.selected=+g.dataset.i;render()});
}
function renderStats(){
 const k=player(), el=document.getElementById("kingdomStats");
 el.innerHTML=`<div class="statgrid">
 <div class="stat"><b>CAPITAL</b><span>${k.capital}</span></div><div class="stat"><b>POPULATION</b><span>${money(k.pop)}</span></div>
 <div class="stat"><b>FOOD</b><span>${money(k.food)}</span></div><div class="stat"><b>TREASURY</b><span>${money(k.gold)}</span></div>
 <div class="stat"><b>ARMY</b><span>${money(k.army)}</span></div><div class="stat"><b>FORT</b><span>${money(k.fort)}</span></div>
 <div class="stat"><b>STABILITY</b><span>${money(k.stability)}%</span></div><div class="stat"><b>TRAIT</b><span>${k.traits}</span></div>
 </div>`;
}
function renderSelected(){
 const f=selected(), k=state.kingdoms[f.name], owner=factions[k.owner];
 document.getElementById("selectedInfo").innerHTML=`<div class="info"><b>${f.name}</b><br>Capital: ${f.capital}<br>Owner: ${owner.name}<br>Population: ${money(k.pop)}<br>Army: ${money(k.army)}<br>Fortification: ${money(k.fort)}<br>Relation with you: ${rel(player().name,f.name)}</div>`;
 const a=document.getElementById("actions");
 if(f.name===player().name){a.innerHTML=`<div class="actiongrid">
 <button onclick="farm()">Expand farms<br>−20 gold</button><button onclick="recruit()">Recruit army<br>−25 gold</button>
 <button onclick="fortify()">Fortify capital<br>−20 gold</button><button onclick="festival()">Hold festival<br>−15 gold</button></div>`;return}
 if(k.owner===state.player){a.innerHTML=`<div class="actiongrid"><button onclick="moveArmy()">Move army here</button></div>`;return}
 a.innerHTML=`<div class="actiongrid"><button class="good" onclick="diplomacy(15)">Offer friendship</button><button onclick="trade()">Trade pact</button><button class="danger" onclick="declareWar()">Declare war</button><button onclick="attack()">Attack capital</button></div>`;
}
function renderDiplomacy(){
 const el=document.getElementById("diplomacy");
 el.innerHTML=factions.filter((f,i)=>i!==state.player).map(f=>{
  const k=state.kingdoms[f.name]; const r=rel(player().name,f.name);
  return `<div class="diplomacyRow"><span>${f.name} <small>(${r})</small></span><button onclick="selectFaction(${factions.indexOf(f)})">View</button></div>`
 }).join("");
}
function renderLog(){document.getElementById("log").innerHTML=state.log.map(x=>`<div>${x}</div>`).join("")}
function selectFaction(i){state.selected=i;render()}
function spend(k,n){if(k.gold<n){log("Not enough gold.");return false}k.gold-=n;return true}
function farm(){const k=player();if(spend(k,20)){k.food+=45;k.pop+=3;log(`Farm expansion increased food and population in ${k.capital}.`);render()}}
function recruit(){const k=player();if(k.food<8){log("Not enough food to recruit.");return}if(spend(k,25)){k.army+=18;k.food-=8;log(`18 troops recruited in ${k.capital}.`);render()}}
function fortify(){const k=player();if(spend(k,20)){k.fort=Math.min(100,k.fort+18);log(`${k.capital} was fortified.`);render()}}
function festival(){const k=player();if(spend(k,15)){k.stability=Math.min(100,k.stability+12);log(`A festival improved stability.`);render()}}
function diplomacy(v){const f=selected();if(f.name===player().name)return;setRel(player().name,f.name,Math.min(100,rel(player().name,f.name)+v));log(`${f.name} relations improved.`);render()}
function trade(){const f=selected();const k=player();if(spend(k,10)){setRel(player().name,f.name,Math.min(100,rel(player().name,f.name)+8));k.gold+=20;log(`Trade with ${f.name} brought 20 gold.`);render()}}
function declareWar(){const f=selected();setRel(player().name,f.name,-100);log(`War declared on ${f.name}.`);render()}
function attack(){
 const target=selected(), tk=state.kingdoms[target.name], pk=player();
 if(target.name===pk.name||tk.owner===state.player){log("That capital is already yours.");return}
 if(rel(pk.name,target.name)>-20){log("Relations are not hostile enough. Declare war first.");return}
 if(pk.army<10){log("Your army is too small.");return}
 const attackPower=pk.army*(0.65+Math.random()*0.55);
 const defensePower=tk.army*(0.55+Math.random()*0.45)+tk.fort*.8;
 const loss=Math.max(5,Math.floor(pk.army*(0.15+Math.random()*.18)));
 pk.army=Math.max(0,pk.army-loss);
 if(attackPower>defensePower){
   tk.owner=state.player; tk.fort=Math.max(8,Math.floor(tk.fort*.35)); tk.stability=Math.max(40,Math.floor(tk.stability*0.5));
   pk.army=Math.max(5,pk.army+Math.floor(tk.army*.25));
   log(`Victory! ${target.capital} has fallen to ${pk.name}.`);
 }else{tk.army=Math.max(5,Math.floor(tk.army-loss*.7));log(`Battle failed at ${target.capital}. Your army lost ${loss} troops.`)}
 checkVictory();render();
}
function moveArmy(){
 const f=selected(), tk=state.kingdoms[f.name], pk=player();
 if(f.name===pk.name){log("Select another capital you own to move troops there.");return}
 if(tk.owner!==state.player){log("You can only move troops between your own capitals.");return}
 if(pk.army<10){log("Not enough troops in the capital to spare a detachment.");return}
 const moved=Math.min(5,pk.army-5);
 if(moved<=0){log("Not enough troops to move without leaving the capital undefended.");return}
 pk.army-=moved; tk.army+=moved;
 log(`${moved} troops moved from ${pk.capital} to ${f.capital}.`);
 render();
}
function aiTurn(){
 factions.forEach((f,i)=>{
   if(i===state.player)return;
   const k=state.kingdoms[f.name]; if(k.owner!==i)return;
   k.food+=12+Math.floor(k.pop*.08);k.gold+=10+Math.floor(k.pop*.05);
   k.army+=Math.random()<.5?4:2;
   if(Math.random()<.22)k.fort=Math.min(100,k.fort+4);
   // AI opportunistically attacks a neighboring-ish capital
   if(Math.random()<.20){
     const candidates=factions.filter((x,j)=>j!==i && state.kingdoms[x.name].owner!==i && Math.abs(x.x-f.x)+Math.abs(x.y-f.y)<260);
     if(candidates.length){
       const t=candidates[Math.floor(Math.random()*candidates.length)], tk=state.kingdoms[t.name];
       const ap=k.army*(.55+Math.random()*.5), dp=tk.army*.6+tk.fort*.7;
       if(ap>dp){tk.owner=i;tk.army=Math.max(8,Math.floor(tk.army*.45));k.army=Math.max(8,Math.floor(k.army*.75));log(`${f.name} captured ${t.capital}.`)}
     }
   }
 });
}
function endTurn(){
 const pk=player(); pk.food-=Math.max(10,Math.floor(pk.pop*.09));
 if(pk.food<0){pk.food=0;pk.stability-=8;pk.pop=Math.max(20,pk.pop-4);log("Food shortage reduced population and stability.")}
 pk.gold+=12+Math.floor(pk.pop*.06);
 pk.food+=18+Math.floor(pk.pop*.12);
 pk.pop+=Math.max(1,Math.floor(pk.stability/35));
 aiTurn();state.year--;log("A new year begins.");checkVictory();render();
}
function checkVictory(){
 const owned=factions.filter(f=>state.kingdoms[f.name].owner===state.player).length;
 if(owned>=12){log("VICTORY: your kingdom controls 12 capitals.");alert("Victory! You control 12 capitals.");}
 if(owned===16){log("GRAND VICTORY: all 16 capitals are united.");alert("Grand Victory! All 16 capitals are united.");}
}
document.getElementById("endTurn").onclick=endTurn;
init();

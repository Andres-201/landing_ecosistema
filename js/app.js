/* =====================================================================
   Ecosistema Digital Solidario Cafetero — lógica de la página
   Lee el contenido de js/contenido.js (window.SITE) y el mapa de
   js/mapa-datos.js (window.GEO). Normalmente no hace falta editar aquí.
   ===================================================================== */
const SITE = window.SITE;
SITE.lots.forEach(l=>{const a=SITE.asociaciones[l.ai];l.aso=a.corto;l.mun=a.mun;l.zona=a.mun+", Tolima"});
/* ===================== Utilidades ===================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const fmt = n => n.toLocaleString("es-CO");
const ICONS = {
  layers:'<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 13 9 5 9-5"/>',
  route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14a6.5 6.5 0 0 1 3 6"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>'
};
const ico = k => `<div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]||""}</svg></div>`;
const ph = s => /por confirmar|por definir|por designar|por incorporar/i.test(s) ? `<span class="ph">${s}</span>` : s;

/* Rama de café (ilustración firma) */
function branchSVG(){
  const leaf = (x,y,r,s,c) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path class="${c}" d="M0 0C28-26 92-28 128 0C92 28 28 26 0 0Z"/><path class="br-vein" d="M6 0H118"/></g>`;
  const cherry = (x,y,r,c) => `<circle class="${c}" cx="${x}" cy="${y}" r="${r}"/><circle class="br-shine" cx="${x-r*.35}" cy="${y-r*.35}" r="${r*.28}"/>`;
  return `<svg viewBox="0 0 340 340" role="img" aria-label="Rama de café con cerezas">
    <path class="br-stem" d="M40 30C120 70 170 140 200 210S250 300 300 320"/>
    ${leaf(70,48,-25,.9,"br-leaf")}${leaf(110,80,40,1,"br-leaf2")}${leaf(150,130,-35,1.05,"br-leaf")}
    ${leaf(185,185,30,.95,"br-leaf2")}${leaf(212,240,-28,.85,"br-leaf")}${leaf(250,290,35,.7,"br-leaf2")}
    ${cherry(128,112,15,"br-cherry")}${cherry(150,104,14,"br-cherry2")}${cherry(140,132,13,"br-cherry")}
    ${cherry(196,198,15,"br-cherry2")}${cherry(178,214,14,"br-cherry")}${cherry(206,224,13,"br-green")}
    ${cherry(234,268,12,"br-cherry")}${cherry(252,258,11,"br-green")}
  </svg>`;
}
$$("[data-branch]").forEach(el => el.innerHTML = branchSVG());

/* QR decorativo determinista */
function qrSVG(seed){
  let h=0; for(const c of seed) h=(h*31+c.charCodeAt(0))>>>0;
  const n=21; let cells="";
  const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h/4294967296};
  const finder=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x+1}" y="${y+1}" width="5" height="5" style="fill:var(--band-ink)"/><rect x="${x+2}" y="${y+2}" width="3" height="3"/>`;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const inF=(x<8&&y<8)||(x>12&&y<8)||(x<8&&y>12); if(inF) continue;
    if(rnd()>.52) cells+=`<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg class="qr" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" aria-label="Código QR de ejemplo">${finder(0,0)}${finder(14,0)}${finder(0,14)}${cells}</svg>`;
}

/* ===================== Inicio ===================== */
$("#stats").innerHTML = SITE.stats.map(s=>`<div class="stat"><b>${s.n}</b><span>${s.t}</span></div>`).join("");

let stepIdx=0;
function renderJourney(){
  $("#steps").innerHTML = SITE.journey.map((s,i)=>`<button class="step-btn" role="tab" aria-selected="${i===stepIdx}" data-i="${i}"><span class="n">${i+1}</span><span><b>${s.t}</b><small>${s.s}</small></span></button>`).join("");
  const s=SITE.journey[stepIdx];
  $("#stepPanel").innerHTML = `<div class="meta"><span class="tag cherry">Paso ${stepIdx+1} de ${SITE.journey.length}</span><span class="tag">Responde: ${s.who}</span></div>
    <h3>${s.t}</h3><p style="font-size:1.05rem">${s.d}</p>
    <div style="display:grid;gap:8px"><b style="font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)">Reglas que se cumplen</b>
    <ul class="rules">${s.rules.map(r=>`<li><span class="mono">${r[0]}</span><span>${r[1]}</span></li>`).join("")}</ul></div>
    <div class="panel-nav"><button data-mv="-1" ${stepIdx===0?"disabled":""}>← Anterior</button><button data-mv="1" ${stepIdx===SITE.journey.length-1?"disabled":""}>Siguiente →</button></div>`;
}
$("#steps").addEventListener("click",e=>{const b=e.target.closest(".step-btn");if(b){stepIdx=+b.dataset.i;renderJourney()}});
$("#stepPanel").addEventListener("click",e=>{const b=e.target.closest("[data-mv]");if(b&&!b.disabled){stepIdx+=+b.dataset.mv;renderJourney()}});
renderJourney();

const L0 = SITE.lots[0];
$("#miniLot").innerHTML = `<div class="lotcard"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div style="display:grid;gap:6px"><span class="tag parch" style="justify-self:start">Ejemplo</span><span class="code">${L0.id}</span><b style="font-family:var(--f-display);font-size:1.3rem">${L0.var} · ${L0.proc}</b></div>${qrSVG(L0.id)}</div>
<dl><dt>Asociación</dt><dd>${L0.aso}</dd><dt>Variedad</dt><dd>${L0.var}</dd><dt>Origen</dt><dd>${L0.zona}</dd><dt>Cosecha</dt><dd>${L0.cos}</dd><dt>Trilla</dt><dd>${fmt(L0.cps)} kg CPS → ${fmt(L0.verde)} kg verde</dd></dl></div>`;

const CAT = {doc:"Documento", ses:"Sesión de trabajo", not:"Noticia", rec:"Recurso"};
const postCard = p => {
  const icon = p.cat==="rec"
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="color:var(--leaf)"><path d="M4 19V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z"/><path d="M8 13l3-3 2 2 3-4"/><path d="M8 17h8"/></svg>'
    : p.cat==="doc"
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="color:var(--leaf)"><path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" style="color:var(--cherry)"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
  const num = (p.t.match(/^Sesión (\d+)/)||[])[1];
  const thumb = p.img
    ? `<div class="thumb photo"><img src="${p.img}" alt="${p.alt||""}" loading="lazy" style="object-position:${p.pos||"center"}">${p.label?`<span class="tlabel2">${p.label}</span>`:""}</div>`
    : p.cat==="doc"
    ? `<div class="thumb gen gdoc"><img src="img/logos/emblema.webp" alt=""><div><small>Documento Maestro</small><b>Versión 2.0</b></div></div>`
    : num
    ? `<div class="thumb gen gses"><b>${num}</b><div><small>Sesión de trabajo</small><span>${p.t.split("·")[1]||""}</span></div><img src="img/logos/emblema.webp" alt=""></div>`
    : `<div class="thumb ${p.cat==="rec"?"doc":"ev"}">${icon}</div>`;
  return `<article class="post">${thumb}<div class="pb"><div class="pmeta"><span class="tag ${p.cat==="ses"?"cherry":p.cat==="not"?"warn":""}">${CAT[p.cat]}</span><span>${ph(p.date)}</span></div><h3>${p.t}</h3><p>${p.d}</p>
    ${p.url?`<div class="psrc"><small>Fuente: ${p.fuente}</small><a href="${p.url}" target="_blank" rel="noopener">${p.cat==="rec"?"Ver el recurso":"Leer la noticia completa"} →</a></div>`:""}</div></article>`;
};
$("#homePosts").innerHTML = SITE.posts.slice(0,3).map(postCard).join("");
/* Asociaciones */
const AS=SITE.asociaciones;
let asoMun="Todos", asoSel=null;
const telTxt=a=>a.tel.join(" · ");
function renderAso(){
  const muns=["Todos",...[...new Set(AS.map(a=>a.mun))].sort((x,y)=>x.localeCompare(y,"es"))];
  $("#asoFilters").innerHTML=muns.map(m=>`<button class="chip" data-am="${m}" aria-pressed="${m===asoMun}">${m}${m==="Todos"?"":` · ${AS.filter(a=>a.mun===m).length}`}</button>`).join("");
  $("#members").innerHTML=AS.map((a,i)=>({a,i})).filter(x=>asoMun==="Todos"||x.a.mun===asoMun).map(({a,i})=>`<button class="aso" data-aso="${i}" aria-pressed="${i===asoSel}">
    <span class="mono2">${a.sig}<i class="nb">${i+1}</i></span><span class="an">${a.corto}</span><span class="am">${a.mun} · ${a.asoc} asociados</span></button>`).join("");
  const d=$("#asoDetail");
  if(asoSel===null){d.hidden=true;return}
  const a=AS[asoSel]; d.hidden=false;
  d.innerHTML=`<div class="adh"><span class="mono2 big">${a.sig}</span><div><span class="tag">${a.mun}, Tolima</span><h3>${a.n}</h3></div><button class="x" id="asoClose" aria-label="Cerrar">×</button></div>
   <div class="adg">
    <div><small>Asociados</small><b class="num">${a.asoc}</b></div>
    <div><small>Producto</small><p>${a.prod}</p></div>
    <div><small>Variedades</small><p class="chipsx">${a.var.map(v=>`<span class="tag parch">${v}</span>`).join("")}</p></div>
    <div><small>Procesos</small><p class="chipsx">${a.proc.map(v=>`<span class="tag">${v}</span>`).join("")}</p></div>
   </div>
   <div class="adc"><span><b>Representante legal:</b> ${ph(a.rep)}</span><span><b>Ubicación:</b> ${a.dir}, ${a.mun}</span><span><b>Celular:</b> ${telTxt(a)}</span><span><b>Correo:</b> ${a.mail}</span></div>`;
}
$("#asoFilters").addEventListener("click",e=>{const b=e.target.closest("[data-am]");if(b){asoMun=b.dataset.am;asoSel=null;renderAso()}});
$("#members").addEventListener("click",e=>{const b=e.target.closest("[data-aso]");if(b){const i=+b.dataset.aso;asoSel=asoSel===i?null:i;renderAso();if(asoSel!==null)$("#asoDetail").scrollIntoView({behavior:"smooth",block:"nearest"})}});
$("#asoDetail").addEventListener("click",e=>{if(e.target.closest("#asoClose")){asoSel=null;renderAso()}});
function openAso(i){asoMun="Todos";asoSel=i;renderAso();$("#asoDetail").scrollIntoView({behavior:"smooth",block:"center"})}
renderAso();


/* ===================== Mapa del Tolima ===================== */
const GEO = window.GEO;
(function(){
  const AS=SITE.asociaciones, byMun=new Map();
  AS.forEach(a=>{if(!byMun.has(a.mun))byMun.set(a.mun,[]);byMun.get(a.mun).push(a)});
  const T={asociaciones:AS.length, asociados:AS.reduce((t,a)=>t+a.asoc,0),
    municipios:[...byMun.keys()].sort((x,y)=>x.localeCompare(y,"es")).map(n=>({n,list:byMun.get(n)}))};
  const on=new Map(T.municipios.map(m=>[m.n,m]));
  const svg=$("#tolMap"), NS="http://www.w3.org/2000/svg";
  let h='<g>'+GEO.dep.map(d=>`<path class="dep${d.id==="73"?" tol":""}" d="${d.d}" data-dep="${d.n}"></path>`).join("")+'</g><g>';
  for(const m of GEO.m){const a=on.has(m.n);
    h+=`<path class="mun${a?" on":""}" d="${m.d}" data-n="${m.n}" tabindex="${a?0:-1}" role="button" aria-label="${m.n}${a?", municipio con asociaciones":""}"></path>`;}
  h+='</g>'+`<path class="tolout" d="${GEO.dep.find(d=>d.id==="73").d}"></path><g>`;
  for(const d of GEO.dep){ if(d.id==="11") continue; h+=`<text class="dlabel${d.id==="73"?" tlabel":""}${["17","63","66"].includes(d.id)?" small":""}" x="${d.cx}" y="${d.cy}" ${d.id==="73"?'dx="2.8em"':""}>${d.n}</text>`;}
  h+='</g><g>';
  for(const m of GEO.m){ if(!on.has(m.n)) continue;
    const list=on.get(m.n).list;
    list.forEach((a,k)=>{const i=AS.indexOf(a);
      h+=`<g class="pin" style="--k:${k}" data-aso="${i}" tabindex="0" role="button" aria-label="${i+1}. ${a.corto}, ${m.n}"><circle cx="${m.cx}" cy="${m.cy}"></circle><text x="${m.cx}" y="${m.cy}" dy="0.35em">${i+1}</text></g>`;});
    h+=`<g class="pinlab" style="--n:${list.length}"><text class="mlabel" x="${m.cx}" y="${m.cy}" dy="0.35em">${m.n}</text></g>`;}
  svg.innerHTML=h+'</g>';
  $("#insetSvg").setAttribute("viewBox",GEO.col.join(" "));
  $("#insetSvg").innerHTML=GEO.dep.map(d=>`<path class="idep${d.id==="73"?" tol":""}" d="${d.d}"></path>`).join("");

  /* Vistas: encaja un rectángulo en la proporción 4:5 del mapa */
  function fit(r,pad){const [x,y,w,hh]=r;let W=w*(1+pad*2),H=hh*(1+pad*2);
    if(W/H<0.8) W=H*0.8; else H=W/0.8; return [x+w/2-W/2,y+hh/2-H/2,W,H];}
  const VIEWS={tol:fit(GEO.tol,.22), col:fit(GEO.col,.02)};
  let cur=VIEWS.tol.slice(), view="tol", anim=null;
  { const [x,y,w,hh]=VIEWS.tol, mx=w*.12, my=hh*.05;
    $$("#tolMap .dlabel").forEach(t=>{const tx=+t.getAttribute("x"), ty=+t.getAttribute("y");
      if(tx<x+mx||tx>x+w-mx||ty<y+my||ty>y+hh-my) t.classList.add("far")}); }
  function apply(v){svg.setAttribute("viewBox",v.map(n=>n.toFixed(1)).join(" "));
    svg.style.setProperty("--u",(v[2]/Math.max(svg.clientWidth,1)).toFixed(4));}
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function go(name){view=name;svg.classList.toggle("vcol",name==="col");$("#vTol").setAttribute("aria-pressed",name==="tol");$("#vCol").setAttribute("aria-pressed",name==="col");
    $("#mapInset").hidden=name==="col";
    const from=cur.slice(), to=VIEWS[name]; cancelAnimationFrame(anim);
    if(reduce){cur=to.slice();apply(cur);return}
    const t0=performance.now(), D=700;
    const step=t=>{const k=Math.min(1,(t-t0)/D), e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
      cur=from.map((f,i)=>f+(to[i]-f)*e);apply(cur); if(k<1) anim=requestAnimationFrame(step)};
    anim=requestAnimationFrame(step);}
  apply(cur); new ResizeObserver(()=>apply(cur)).observe(svg);
  $("#vTol").addEventListener("click",()=>go("tol"));
  $("#vCol").addEventListener("click",()=>go("col"));
  $("#mapInset").addEventListener("click",()=>go("col"));

  const tip=$("#mapTip"), box=svg.parentElement;
  let sel=null;
  function card(){
    const card=$("#mapCard");
    if(!sel){card.innerHTML=`<span class="tag" style="justify-self:start">Tolima, Colombia</span><h3>${T.municipios.length} municipios cafeteros</h3>
      <div class="kv"><div><small>Asociaciones</small><b>${T.asociaciones}</b></div><div><small>Familias</small><b>${SITE.territorio.familias}</b></div><div><small>Asociados</small><b>${T.asociados}</b></div></div>
      <p>Toca cualquier municipio del Tolima en el mapa o elige uno abajo.</p>`;return}
    const m=GEO.m.find(x=>x.n===sel), d=on.get(sel);
    card.innerHTML = d
      ? `<span class="tag" style="justify-self:start">Municipio con asociaciones</span><h3>${m.n}</h3>
         <div class="kv"><div><small>Asociaciones</small><b>${d.list.length}</b></div><div><small>Asociados</small><b>${d.list.reduce((t,a)=>t+a.asoc,0)}</b></div><div><small>Área del municipio</small><b>${fmt(m.km2)} km²</b></div></div>
         <ul class="munaso">${d.list.map(a=>`<li><button data-aso="${AS.indexOf(a)}"><em class="nb2">${AS.indexOf(a)+1}</em>${a.corto}<span>${a.asoc} asociados</span></button></li>`).join("")}</ul>`
      : `<span class="tag cherry" style="justify-self:start">Sin asociaciones vinculadas</span><h3>${m.n}</h3>
         <div class="kv"><div><small>Área del municipio</small><b>${fmt(m.km2)} km²</b></div></div>
         <p>Este municipio aún no tiene asociaciones en el ecosistema.</p>`;
  }
  function chips(){$("#munChips").innerHTML=T.municipios.map(m=>`<button class="chip" data-mun="${m.n}" aria-pressed="${m.n===sel}">${m.n}</button>`).join("")}
  function pick(n,toggle=true){sel=(toggle&&sel===n)?null:n;$$("#tolMap .mun").forEach(p=>p.classList.toggle("sel",p.dataset.n===sel));card();chips()}
  svg.addEventListener("click",e=>{const g=e.target.closest(".pin");if(g){openAso(+g.dataset.aso);return}
    const p=e.target.closest(".mun");
    if(p){ if(view==="col"){go("tol");pick(p.dataset.n,false)} else pick(p.dataset.n); }});
  svg.addEventListener("keydown",e=>{const g=e.target.closest(".pin");if(g&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openAso(+g.dataset.aso);return}
    const p=e.target.closest(".mun");if(p&&(e.key==="Enter"||e.key===" ")){e.preventDefault();if(view==="col")go("tol");pick(p.dataset.n)}});
  svg.addEventListener("pointermove",e=>{const g=e.target.closest(".pin");if(g){const a=AS[+g.dataset.aso],r=box.getBoundingClientRect();tip.textContent=`${+g.dataset.aso+1}. ${a.corto}`;tip.style.left=(e.clientX-r.left)+"px";tip.style.top=(e.clientY-r.top)+"px";tip.hidden=false;return}
    const p=e.target.closest(".mun,.dep");if(!p){tip.hidden=true;return}
    const r=box.getBoundingClientRect();tip.textContent=p.dataset.n?p.dataset.n+" · Tolima":p.dataset.dep;
    tip.style.left=(e.clientX-r.left)+"px";tip.style.top=(e.clientY-r.top)+"px";tip.hidden=false});
  svg.addEventListener("pointerleave",()=>tip.hidden=true);
  $("#mapCard").addEventListener("click",e=>{const b=e.target.closest("[data-aso]");if(b)openAso(+b.dataset.aso)});
  $("#munChips").addEventListener("click",e=>{const b=e.target.closest("[data-mun]");if(b){if(view==="col")go("tol");pick(b.dataset.mun)}});
  card();chips();
})();

/* ===================== Ecosistema ===================== */
$("#objectives").innerHTML = SITE.objectives.map((o,k)=>`<div class="card obj"><div class="objtop">${ico(o.i)}<span class="tag cherry">Objetivo ${k+1}</span></div><h3>${o.t}</h3><p>${o.d}</p>
  <div class="metas"><small>Meta inicial</small><div>${o.meta.map(m=>`<div class="meta"><b>${m[0]}</b><span>${m[1]}</span></div>`).join("")}</div></div>
  <div class="plazo"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Plazo: primeros 36 meses</div></div>`).join("");
const AG = {all:"Todos", org:"Organizaciones", prod:"Productores", ext:"Externos"};
let actorG="all";
function renderActors(){
  $("#actorFilters").innerHTML = Object.entries(AG).map(([k,v])=>`<button class="chip" data-g="${k}" aria-pressed="${k===actorG}">${v}</button>`).join("");
  $("#actors").innerHTML = SITE.actors.filter(a=>actorG==="all"||a.g===actorG).map(a=>`<div class="actor"><h4>${a.t}</h4><p style="color:var(--muted)">${a.r}</p><div class="lim"><b>Límite:</b> ${a.l}</div></div>`).join("");
}
$("#actorFilters").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(b){actorG=b.dataset.g;renderActors()}});
renderActors();
$("#organs").innerHTML = SITE.organs.map(o=>`<div class="card"><span class="tag warn" style="justify-self:start">${o.s}</span><h3>${o.t}</h3><p>${o.d}</p></div>`).join("");
$("#deadlock").innerHTML = SITE.deadlock.map(s=>`<li><span>${s}</span></li>`).join("");
let agrAll=false;
function renderAgr(){
  const list = agrAll ? SITE.agreements : SITE.agreements.slice(0,5);
  $("#agreements").innerHTML = list.map(a=>`<details class="acc"><summary><span><span class="mono" style="color:var(--cherry);margin-right:10px">${a[0]}</span>${a[1].split(/[;:]/)[0].slice(0,70)}${a[1].length>70?"…":""}</span></summary><div class="in"><p>${a[1]}</p><span class="tag" style="justify-self:start">Acordado</span></div></details>`).join("");
  $("#moreAgr").textContent = agrAll ? "Ver menos" : "Ver los 18 acuerdos";
}
$("#moreAgr").addEventListener("click",()=>{agrAll=!agrAll;renderAgr()});
renderAgr();
$("#road").innerHTML = SITE.road.map(r=>`<div class="ph-col ${r.now?"now":""}"><span class="tag ${r.now?"cherry":""}" style="justify-self:start">${r.now?"Primera etapa":"Después"}</span><h4>${r.t}</h4><ul>${r.items.map(i=>`<li>${i}</li>`).join("")}</ul></div>`).join("");
$("#inScope").innerHTML = SITE.inScope.map(i=>`<li>${i}</li>`).join("");
$("#outScope").innerHTML = SITE.outScope.map(i=>`<li>${i}</li>`).join("");
$("#glossary").innerHTML = SITE.glossary.map(g=>`<details class="acc"><summary>${g[0]}</summary><div class="in"><p>${g[1]}</p></div></details>`).join("");

/* ===================== Café ===================== */
$("#products").innerHTML = SITE.products.map(p=>`<div class="card" style="padding:28px"><h3 style="font-size:1.5rem">${p.t}</h3><p>${p.d}</p><div style="display:flex;gap:8px;flex-wrap:wrap">${p.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div></div>`).join("");

let lotF="Todos";
const LF=["Todos","Café verde","CPS"];
const VARS=["Castillo","Caturra","Borbón rosado","Borbón rojo","Geisha"], PROCS=["Lavado","Honey","Natural"];
$("#fVar").innerHTML='<option value="">Todas</option>'+VARS.map(v=>`<option>${v}</option>`).join("");
$("#fProc").innerHTML='<option value="">Todos</option>'+PROCS.map(v=>`<option>${v}</option>`).join("");
$("#fAso").innerHTML='<option value="">Todas</option>'+SITE.asociaciones.map((a,i)=>`<option value="${i}">${a.corto}</option>`).join("");
["#fVar","#fProc","#fAso"].forEach(id=>$(id).addEventListener("change",()=>renderLots()));
const PCLS={Lavado:"",Honey:"warn",Natural:"cherry"};
function renderLots(){
  $("#lotFilters").innerHTML = LF.map(f=>`<button class="chip" data-f="${f}" aria-pressed="${f===lotF}">${f}</button>`).join("");
  const fv=$("#fVar").value, fp=$("#fProc").value, fa=$("#fAso").value;
  const list = SITE.lots.filter(l=>(lotF==="Todos"||l.pres===lotF)&&(!fv||l.var===fv)&&(!fp||l.proc===fp)&&(fa===""||l.ai===+fa));
  $("#lotCount").textContent = `${list.length} ${list.length===1?"lote":"lotes"} · ${fmt(list.reduce((t,l)=>t+l.kg,0))} kg disponibles`;
  $("#lots").innerHTML = list.length ? list.map(l=>`<article class="lot"><div class="head"><span class="mono" style="font-weight:600">${l.id}</span><span class="tag">${l.mun}</span></div>
   <div class="body"><h3 style="font-size:1.25rem">${l.var}</h3>
   <div class="chipsx"><span class="tag parch">${l.pres}</span><span class="tag ${PCLS[l.proc]}">${l.proc}</span></div>
   <dl><dt>Asociación</dt><dd>${l.aso}</dd><dt>Cosecha</dt><dd>${l.cos}</dd><dt>Humedad</dt><dd>${l.hum}</dd><dt>Disponible</dt><dd>${fmt(l.kg)} kg</dd></dl>
   <div class="price"><span>Precio por cotización</span><span class="tag parch">Ejemplo</span></div>
   <div class="acts"><button data-trace="${l.id}">Trazabilidad</button><button class="fill" data-quote="${l.id}">Cotizar</button></div></div></article>`).join("")
   : `<div class="empty" style="grid-column:1/-1"><b>No hay lotes con esa combinación.</b><br>Prueba con otra variedad o proceso, o solicita una cotización por necesidad.</div>`;
}
$("#lotFilters").addEventListener("click",e=>{const b=e.target.closest("[data-f]");if(b){lotF=b.dataset.f;renderLots()}});
$("#lots").addEventListener("click",e=>{
  const t=e.target.closest("[data-trace]"); if(t){showTrace(t.dataset.trace);$("#trace").scrollIntoView({behavior:"smooth"});return}
  const q=e.target.closest("[data-quote]"); if(q){preselect=q.dataset.quote;location.hash="cotizar"}
});
renderLots();

let traceId=SITE.lots[0].id;
function events(l){
  const ev=[
    {d:"Productor y finca registrados", s:`${l.aso} · ${l.zona} (ubicación exacta privada)`},
    {d:"Cosecha y beneficio", s:`Variedad ${l.var} · proceso ${l.proc.toLowerCase()} · cosecha ${l.cos}`},
    {d:"Recepción en bodega de la asociación", s: l.cps?`${fmt(l.cps)} kg de CPS · humedad registrada`:`${fmt(l.kg)} kg de CPS · humedad ${l.hum}`},
    {d:"Control de calidad", s:"Evaluación registrada por el responsable técnico"}
  ];
  if(l.cps){
    ev.push({d:"Orden de trilla · custodia temporal", s:"El café sale de bodega y deja de contar como disponible", c:true});
    ev.push({d:"Trilla y balance de masa", s:`Entrada ${fmt(l.cps)} kg CPS = ${fmt(l.verde)} kg verde + ${fmt(l.sub)} kg subproductos + ${fmt(l.merma)} kg merma`, bal:true});
    ev.push({d:"Lote verde validado y de regreso a bodega", s:`Humedad ${l.hum} · vinculado a su lote de CPS de origen`});
  }
  ev.push({d:"Publicado en el Marketplace", s:`${fmt(l.kg)} kg autorizados por ${l.aso}`, c:true});
  return ev;
}
function showTrace(id){
  traceId=id; const l=SITE.lots.find(x=>x.id===id);
  $("#lotSel").innerHTML = SITE.lots.map(x=>`<button aria-pressed="${x.id===id}" data-id="${x.id}">${x.id}</button>`).join("");
  const ev=events(l);
  $("#traceView").innerHTML = `<div class="lotcard"><div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div style="display:grid;gap:6px"><span class="tag parch" style="justify-self:start">Ejemplo</span><span class="code">${l.id}</span></div>${qrSVG(l.id)}</div>
    <b style="font-family:var(--f-display);font-size:1.4rem">${l.var} · ${l.proc}</b>
    <dl><dt>Asociación</dt><dd>${l.aso}</dd><dt>Variedad</dt><dd>${l.var}</dd><dt>Proceso</dt><dd>${l.proc}</dd><dt>Origen</dt><dd>${l.zona}</dd><dt>Cosecha</dt><dd>${l.cos}</dd><dt>Humedad</dt><dd>${l.hum}</dd><dt>Disponible</dt><dd>${fmt(l.kg)} kg</dd></dl>
    <p style="font-size:.82rem;color:var(--band-muted)">El QR muestra los registros autorizados del lote. No garantiza por sí solo la autenticidad física del empaque.</p></div>
    <div class="card" style="min-width:0"><ol class="timeline">${ev.map((e,i)=>`<li><span class="dot ${e.c?"c":""}">${i+1}</span><div><b>${e.d}</b><small>${e.s}</small>${e.bal?`<div class="balance" role="img" aria-label="Balance de masa"><span style="width:${l.verde/l.cps*100}%"></span><span style="width:${l.sub/l.cps*100}%"></span><span style="width:${l.merma/l.cps*100}%"></span></div><div class="legend"><span><i style="background:var(--leaf)"></i>Café verde ${Math.round(l.verde/l.cps*100)} %</span><span><i style="background:var(--parch)"></i>Subproductos ${Math.round(l.sub/l.cps*100)} %</span><span><i style="background:var(--cherry)"></i>Merma ${Math.round(l.merma/l.cps*100)} %</span></div>`:""}</div></li>`).join("")}</ol></div>`;
}
$("#lotSel").addEventListener("click",e=>{const b=e.target.closest("[data-id]");if(b)showTrace(b.dataset.id)});
showTrace(traceId);

let proc="nac";
const PL={nac:"Venta nacional",int:"Venta internacional",mue:"Muestras",cam:"Campañas"};
function renderProc(){
  $("#procTabs").innerHTML = Object.entries(PL).map(([k,v])=>`<button class="chip" data-p="${k}" aria-pressed="${k===proc}">${v}</button>`).join("");
  const p=SITE.processes[proc];
  $("#procSteps").innerHTML = p.steps.map(s=>`<li><span>${s}</span></li>`).join("");
  $("#procNote").innerHTML = `<span class="tag cherry" style="justify-self:start">Para tener en cuenta</span><h3 style="font-size:1.4rem">${p.t}</h3><p style="font-size:1.02rem">${p.note}</p>`;
}
$("#procTabs").addEventListener("click",e=>{const b=e.target.closest("[data-p]");if(b){proc=b.dataset.p;renderProc()}});
renderProc();

/* ===================== Cotizar ===================== */
let qMode="lote", qMkt="nac", preselect=null;
function renderLotChecks(){
  $("#lotChecks").innerHTML = SITE.lots.map(l=>`<label><input type="checkbox" value="${l.id}" ${preselect===l.id?"checked":""}><span class="mono">${l.id}</span><span style="flex:1;min-width:0">${l.var} · ${l.proc} · ${l.pres} · ${l.aso} <span style="color:var(--muted)">(${fmt(l.kg)} kg)</span></span><input type="number" min="1" max="${l.kg}" placeholder="kg" aria-label="Kilos de ${l.id}" style="width:90px" data-kg="${l.id}"></label>`).join("");
}
renderLotChecks();
$("#quoteForm").addEventListener("click",e=>{
  const m=e.target.closest("[data-mode]"), k=e.target.closest("[data-mkt]");
  if(m){qMode=m.dataset.mode;$$("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",b===m));$("#modeLote").hidden=qMode!=="lote";$("#modeNec").hidden=qMode!=="necesidad"}
  if(k){qMkt=k.dataset.mkt;$$("[data-mkt]").forEach(b=>b.setAttribute("aria-pressed",b===k));$("#intl").hidden=qMkt!=="int"}
});
$("#afterQuote").innerHTML = SITE.afterQuote.map(s=>`<li><span>${s}</span></li>`).join("");
$("#quoteForm").addEventListener("submit",e=>{
  e.preventDefault(); const err=$("#qErr"); err.hidden=true;
  const emp=$("#q-emp").value.trim(), mail=$("#q-mail").value.trim();
  let lines=[];
  if(!emp||!/^\S+@\S+\.\S+$/.test(mail)){err.textContent="Escribe el nombre de la empresa y un correo válido.";err.hidden=false;return}
  if(qMode==="lote"){
    const sel=$$("#lotChecks input[type=checkbox]:checked");
    if(!sel.length){err.textContent="Marca al menos un lote de interés.";err.hidden=false;return}
    for(const c of sel){const l=SITE.lots.find(x=>x.id===c.value);const kg=+document.querySelector(`[data-kg="${c.value}"]`).value||0;
      if(kg>l.kg){err.textContent=`El lote ${l.id} tiene ${fmt(l.kg)} kg publicados. Ajusta la cantidad.`;err.hidden=false;return}
      lines.push(`<li><span class="mono">${l.id}</span> · ${kg?fmt(kg)+" kg":"cantidad por definir"} · ${l.var} ${l.proc.toLowerCase()} · ${l.aso}</li>`)}
  } else {
    const kg=+$("#n-kg").value; if(!kg){err.textContent="Indica la cantidad en kilos que necesitas.";err.hidden=false;return}
    lines.push(`<li>${$("#n-tipo").value} · ${fmt(kg)} kg · proceso ${$("#n-proc").value.toLowerCase()}</li>`);
  }
  if(!$("#q-terms").checked){err.textContent="Para continuar, acepta los términos comerciales.";err.hidden=false;return}
  const code="SOL-26-"+String(Math.floor(1000+Math.random()*9000));
  const asos=new Set(qMode==="lote"?$$("#lotChecks input[type=checkbox]:checked").map(c=>SITE.lots.find(x=>x.id===c.value).aso):[]);
  $("#qResult").innerHTML = `<div class="result"><span class="tag parch" style="justify-self:start">Demostración · no enviada</span><h4>Solicitud ${code} preparada</h4>
   <ul style="margin:0;padding-left:18px">${lines.join("")}</ul>
   <p>${qMkt==="int"?`Venta internacional · ${$("#i-mon").value} · Incoterm: ${$("#i-inc").value}${$("#i-pais").value?" · "+$("#i-pais").value:""}`:"Venta nacional"}${asos.size>1?` · Oferta conjunta de ${asos.size} asociaciones`:""}</p>
   <p style="color:var(--muted);font-size:.9rem">Esta solicitud no reserva inventario. La reserva ocurre cuando aceptas una oferta privada vigente.</p></div>`;
});

/* ===================== Productores ===================== */
$("#benefits").innerHTML = SITE.benefits.map(b=>`<div class="card">${ico(b.i)}<h3>${b.t}</h3><p>${b.d}</p></div>`).join("");
let pIdx=0;
function renderPortal(){
  const p=SITE.portal[pIdx];
  $("#portal").innerHTML = `<nav role="tablist" aria-label="Secciones del portal">${SITE.portal.map((x,i)=>`<button role="tab" aria-selected="${i===pIdx}" data-pi="${i}">${x.t}</button>`).join("")}</nav>
   <div class="pv"><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="tag parch">Vista de ejemplo</span><span class="tag">${p.t}</span></div><h4>${p.h}</h4><p style="color:var(--muted)">${p.p}</p>
   <div class="kv">${p.kv.map(k=>`<div><small>${k[0]}</small><b>${ph(k[1])}</b></div>`).join("")}</div></div>`;
}
$("#portal").addEventListener("click",e=>{const b=e.target.closest("[data-pi]");if(b){pIdx=+b.dataset.pi;renderPortal()}});
renderPortal();
$("#school").innerHTML = SITE.school.map(s=>`<li><span>${s}</span></li>`).join("");
$("#join").innerHTML = SITE.join.map(s=>`<li><span>${s}</span></li>`).join("");
$("#directory").innerHTML = AS.map(a=>`<div class="card dir"><span class="tag" style="justify-self:start">${a.mun}</span><h3>${a.corto}</h3><p class="dn">${a.n}</p>
  <p><b>Representante:</b> ${ph(a.rep)}</p><p><b>Celular:</b> ${telTxt(a)}</p><p><b>Correo:</b> <span class="sel">${a.mail}</span></p><p><b>Ubicación:</b> ${a.dir}</p></div>`).join("")
  + SITE.directory.map(d=>`<div class="card dir"><span class="tag cherry" style="justify-self:start">Compradores</span><h3>${d.n}</h3><p><b>Responsable:</b> ${ph(d.r)}</p><p><b>Correo:</b> ${ph(d.c)}</p><p><b>Atención:</b> ${d.m}</p></div>`).join("");
$("#c-aso").innerHTML=AS.map(a=>`<option>${a.corto} (${a.mun})</option>`).join("")+"<option>Aún no pertenezco</option>";
$("#contactForm").addEventListener("submit",e=>{e.preventDefault();
  if(!$("#c-name").value.trim()||!$("#c-mail").value.trim()||!$("#c-msg").value.trim()){$("#cResult").innerHTML='<p style="color:var(--cherry);font-weight:600">Completa tu nombre, un medio de contacto y el mensaje.</p>';return}
  $("#cResult").innerHTML='<div class="result"><span class="tag parch" style="justify-self:start">Demostración · no enviado</span><p>Tu mensaje está listo. Cuando el formulario se conecte, llegará a la asociación seleccionada.</p></div>'});

/* ===================== Publicaciones ===================== */
let postF="all";
const PF={all:"Todas",not:"Noticias",rec:"Recursos",doc:"Documentos",ses:"Sesiones de trabajo"};
function renderPosts(){
  $("#postFilters").innerHTML = Object.entries(PF).map(([k,v])=>`<button class="chip" data-pf="${k}" aria-pressed="${k===postF}">${v}</button>`).join("");
  const list=SITE.posts.filter(p=>postF==="all"||p.cat===postF);
  $("#posts").innerHTML = list.length ? list.map(postCard).join("") : `<div class="empty" style="grid-column:1/-1"><b>Aún no hay noticias publicadas.</b><br>Aquí aparecerán eventos, ferias y logros de las asociaciones.</div>`;
}
$("#postFilters").addEventListener("click",e=>{const b=e.target.closest("[data-pf]");if(b){postF=b.dataset.pf;renderPosts()}});
renderPosts();

$("#newsForm").addEventListener("submit",e=>{e.preventDefault();const v=$("#news-mail").value.trim();
  e.target.innerHTML = /^\S+@\S+\.\S+$/.test(v) ? '<span class="ok">Listo. La suscripción se activará cuando conectemos el boletín (demostración).</span>' : e.target.innerHTML;
  if(!/^\S+@\S+\.\S+$/.test(v)) $("#news-mail").placeholder="Escribe un correo válido";});

/* ===================== Router ===================== */
const PAGES=["inicio","ecosistema","cafe","cotizar","productores","publicaciones"];
function route(){
  let h=(location.hash||"#inicio").slice(1); let anchor=null;
  if(h==="trace"){h="cafe";anchor="trace"}
  if(!PAGES.includes(h)) h="inicio";
  $$(".page").forEach(p=>p.hidden=p.dataset.page!==h);
  $$(".nav a").forEach(a=>a.classList.toggle("active",a.dataset.r===h&&h!=="cotizar"));
  $("#nav").classList.remove("open"); $("#burger").setAttribute("aria-expanded","false");
  if(h==="cotizar"){renderLotChecks()}
  if(anchor){requestAnimationFrame(()=>$("#"+anchor).scrollIntoView())} else window.scrollTo(0,0);
}
document.addEventListener("click",e=>{const sc=e.target.closest("[data-scroll]");if(sc){e.preventDefault();$("#"+sc.dataset.scroll).scrollIntoView({behavior:"smooth"});return}
  const a=e.target.closest("[data-goto]");if(a){e.preventDefault();location.hash=a.dataset.goto}});
window.addEventListener("hashchange",route);
$("#burger").addEventListener("click",()=>{const o=$("#nav").classList.toggle("open");$("#burger").setAttribute("aria-expanded",o)});
route();

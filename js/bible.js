import{go}from"../js/router.js";
import{versions,books,chapter,chapterInfo,saveChapterInfo,notes,note,deleteNote,highlights,highlight,clearHighlight,searchVerses,studies,addVerseToStudy}from"../js/bible.js";
import{shell,nav,esc,toast}from"../js/ui.js";
const COLORS=[{id:"yellow",name:"Amarillo",hex:"#fde68a"},{id:"green",name:"Verde",hex:"#bbf7d0"},{id:"blue",name:"Azul",hex:"#bfdbfe"},{id:"orange",name:"Naranja",hex:"#fed7aa"},{id:"pink",name:"Rosa",hex:"#fbcfe8"},{id:"purple",name:"Morado",hex:"#ddd6fe"}];
let currentBookCache=[];
export async function bible(){
  shell("Biblia de Estudio","bible");
  const v=document.getElementById("view"),vs=await versions(),bs=await books();
  if(!vs.length){v.innerHTML=`<div class="notice">No hay una Biblia instalada. Importa una versión autorizada desde Ajustes.</div>`;nav(go);return}
  const ver=vs[0],bb=bs.filter(x=>x.versionId===ver.id).sort((a,b)=>a.order-b.order);currentBookCache=bb;
  v.innerHTML=`<div class="card"><div class="title">${esc(ver.name)}</div><div class="muted">Busca cualquier versículo por texto o referencia.</div><div class="search" style="margin-top:12px"><span>⌕</span><input id="verse-search" placeholder="Buscar versículo..."></div><div class="actions" style="margin-top:10px"><button class="btn" id="studies">📖 Mis temas y predicaciones</button></div></div><h2 class="section-title">Libros</h2><section class="grid">${bb.map(b=>`<button class="card click" data-b="${esc(b.id.split(":").slice(1).join(":"))}"><div class="iconbox">${b.order}</div><div class="grow"><div class="title">${esc(b.name)}</div><div class="muted">${b.chapters.length} capítulos</div></div>›</button>`).join("")}</section><section id="search-results"></section>`;
  document.querySelectorAll("[data-b]").forEach(x=>x.onclick=()=>pick(ver.id,x.dataset.b,bb.find(b=>b.id===ver.id+":"+x.dataset.b)));
  document.getElementById("studies").onclick=()=>go("studies");
  let timer;const input=document.getElementById("verse-search");input.oninput=async e=>{clearTimeout(timer);const q=e.target.value;timer=setTimeout(async()=>{const r=document.getElementById("search-results");if(!q.trim()){r.innerHTML="";return}const hits=await searchVerses(q);r.innerHTML=`<h2 class="section-title">Resultados</h2>`+(hits.length?`<section class="grid">${hits.map((x,i)=>`<button class="card click" data-hit="${i}"><div class="iconbox">${x.number}</div><div class="grow"><div class="title">${esc(x.bookName)} ${x.chapter}:${x.number}</div><div class="muted">${esc(x.text)}</div></div>›</button>`).join("")}</section>`:`<div class="empty">No encontré versículos.</div>`);r.querySelectorAll("[data-hit]").forEach(b=>b.onclick=()=>{const x=hits[+b.dataset.hit],book=bb.find(k=>k.id===x.versionId+":"+x.bookId);if(book)read(x.versionId,x.bookId,x.chapter,book,x.number)})},250)};
  nav(go);
}
async function pick(v,b,book){
  const view=document.getElementById("view");if(!book)return;
  view.innerHTML=`<button class="btn" id="back">← Libros</button><h2>${esc(book.name)}</h2><div class="chapter-grid">${book.chapters.map(c=>`<button class="chapter" data-c="${c.number}">${c.number}</button>`).join("")}</div>`;
  document.getElementById("back").onclick=bible;
  document.querySelectorAll("[data-c]").forEach(x=>x.onclick=()=>read(v,b,+x.dataset.c,book));
}
async function read(v,b,c,book,focusVerse=null){
  const view=document.getElementById("view"),a=await chapter(v,b,c),ref=`${v}:${b}:${c}`,ns=await notes(ref),hs=await highlights(ref),ci=await chapterInfo(v,b,c),map=new Map(hs.map(x=>[x.verse,x])),notesMap=new Map(ns.map(x=>[x.verse,x]));
  document.querySelector(".app")?.classList.add("reader-mode");
  view.innerHTML=`<div class="bible-reader"><div class="reader-toolbar"><button class="reader-icon" id="back" aria-label="Volver">‹</button><button class="version-pill" id="version-pill">${esc(v)}</button><div class="reader-toolbar-right"><button class="reader-icon" id="reader-search" aria-label="Buscar">⌕</button><button class="reader-icon" id="reader-more" aria-label="Más opciones">•••</button></div></div><div class="reader-book">${esc(book.name).toUpperCase()}</div><div class="reader-rule"></div><div class="reader-topic"><span>${esc(ci.topic||"Sin tema definido")}</span><button class="topic-edit" id="edit-topic">Editar</button></div><div class="reader-actions"><span>Capítulo ${c}</span><span>Mantén presionado un versículo para marcarlo</span></div><div class="scripture">${a.map(x=>{const h=map.get(x.number),n=notesMap.get(x.number);return`<div id="verse-${x.number}" class="verse-row ${h?"is-highlighted":""}" style="${h?`--highlight:${COLORS.find(z=>z.id===h.color)?.hex||"#fde68a"}`:""}" data-verse-row="${x.number}"><span class="verse-num">${x.number}</span> <span class="verse-text">${esc(x.text)}</span><div class="verse-tools"><button class="comment" data-note="${x.number}">${n?"✎ Editar comentario":"＋ Comentario"}</button></div>${n?`<div class="verse-note"><strong>Comentario:</strong> ${esc(n.text)} <button class="note-delete" data-note-delete="${n.id}">Eliminar</button></div>`:""}</div>`}).join("")}</div><div class="chapter-pager"><button class="pager-btn" id="prev-chapter" aria-label="Capítulo anterior">‹</button><div><small>${esc(book.name)}</small><strong>${c}</strong></div><button class="pager-btn" id="next-chapter" aria-label="Capítulo siguiente">›</button></div></div>`;
  document.getElementById("back").onclick=()=>pick(v,b,book);
  document.getElementById("reader-search").onclick=()=>{const q=prompt("Buscar en la Biblia","");if(q?.trim()){go("bible").then(()=>{const input=document.getElementById("verse-search");if(input){input.value=q.trim();input.dispatchEvent(new Event("input"))}})}};
  document.getElementById("reader-more").onclick=()=>openVerseMenu({v,b,c,book,verse:a.find(x=>x.number===focusVerse)||a[0],current:map.get(focusVerse||a[0]?.number)});
  const idx=book.chapters.findIndex(x=>x.number===c);
  document.getElementById("prev-chapter").onclick=()=>idx>0&&read(v,b,book.chapters[idx-1].number,book);
  document.getElementById("next-chapter").onclick=()=>idx<book.chapters.length-1&&read(v,b,book.chapters[idx+1].number,book);
  document.getElementById("edit-topic").onclick=async()=>{const t=prompt("Tema de este capítulo",ci.topic||"");if(t===null)return;ci.topic=t.trim();await saveChapterInfo(ci);document.querySelector(".reader-topic span").textContent=ci.topic||"Sin tema definido";toast("Tema guardado")};
  document.querySelectorAll("[data-note]").forEach(btn=>btn.onclick=async()=>{const num=+btn.dataset.note,old=notesMap.get(num);const t=prompt("Comentario para este versículo",old?.text||"");if(t===null)return;if(t.trim()){await note({id:old?.id||crypto.randomUUID(),ref,text:t.trim(),verse:num});toast("Comentario guardado");read(v,b,c,book,focusVerse||num)}else if(old){await deleteNote(old.id);toast("Comentario eliminado");read(v,b,c,book,focusVerse||num)}});
  document.querySelectorAll("[data-note-delete]").forEach(btn=>btn.onclick=async()=>{await deleteNote(btn.dataset.noteDelete);toast("Comentario eliminado");read(v,b,c,book,focusVerse)});
  document.querySelectorAll("[data-verse-row]").forEach(row=>installLongPress(row,async()=>openVerseMenu({v,b,c,book,verse:a.find(x=>x.number===+row.dataset.verseRow),current:map.get(+row.dataset.verseRow)})));
  if(focusVerse){requestAnimationFrame(()=>document.getElementById(`verse-${focusVerse}`)?.scrollIntoView({block:"center"}))}
}
function installLongPress(el,fn){
  let timer=0,startX=0,startY=0,triggered=false;
  const target=e=>e.target.closest(".verse-tools,.verse-menu");
  const start=(x,y)=>{clearTimeout(timer);startX=x;startY=y;triggered=false;timer=setTimeout(()=>{triggered=true;fn()},600)};
  const move=(x,y)=>{if(Math.hypot(x-startX,y-startY)>12){clearTimeout(timer)}};
  const end=()=>{clearTimeout(timer)};
  el.addEventListener("pointerdown",e=>{if(target(e))return;start(e.clientX,e.clientY)},{passive:true});
  el.addEventListener("pointermove",e=>move(e.clientX,e.clientY),{passive:true});
  el.addEventListener("pointerup",end,{passive:true});
  el.addEventListener("pointercancel",end,{passive:true});
  el.addEventListener("contextmenu",e=>{if(target(e))return;e.preventDefault();clearTimeout(timer);if(!triggered)fn()});
}
async function openVerseMenu({v,b,c,book,verse,current}){
  document.querySelector(".verse-menu")?.remove();
  const wrap=document.createElement("div");wrap.className="verse-menu";wrap.innerHTML=`<div class="verse-menu-card"><div class="title">${esc(book.name)} ${c}:${verse.number}</div><div class="muted menu-text">${esc(verse.text)}</div><div class="menu-title">Resaltar con color</div><div class="menu-colors">${COLORS.map(x=>`<button class="menu-color ${current?.color===x.id?"active":""}" style="background:${x.hex}" data-menu-color="${x.id}" title="${x.name}"></button>`).join("")}</div><div class="actions menu-actions"><button class="btn" id="menu-study">＋ Agregar a tema/predicación</button>${current?`<button class="btn" id="menu-clear">Quitar resaltado</button>`:""}<button class="btn" id="menu-close">Cerrar</button></div></div>`;document.body.append(wrap);wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};wrap.querySelector("#menu-close").onclick=()=>wrap.remove();wrap.querySelectorAll("[data-menu-color]").forEach(btn=>btn.onclick=async()=>{const color=btn.dataset.menuColor;if(current?.color===color)await clearHighlight(`${v}:${b}:${c}`,verse.number);else await highlight(`${v}:${b}:${c}`,verse.number,color);wrap.remove();read(v,b,c,book,verse.number)});wrap.querySelector("#menu-study").onclick=async()=>{wrap.remove();await addToStudyFlow(v,verse,book,c)};const clear=wrap.querySelector("#menu-clear");if(clear)clear.onclick=async()=>{await clearHighlight(`${v}:${b}:${c}`,verse.number);wrap.remove();read(v,b,c,book,verse.number)}}
async function addToStudyFlow(v,verse,book,c){
  const a=await studies();let s=null;if(a.length){const choice=prompt(`Escribe el número del tema/predicación:\n${a.map((x,i)=>`${i+1}. ${x.title}`).join("\n")}\n\nDeja vacío para crear uno nuevo.`);if(choice?.trim()){const i=Number(choice)-1;if(a[i])s=a[i]}}
  if(!s){const title=prompt("Nombre del tema o predicación");if(!title?.trim())return;const type=prompt("Tipo: Tema o Predicación","Predicación")||"Tema";s={id:crypto.randomUUID(),title:title.trim(),type:type.trim(),verses:[]};const {saveStudy}=await import("../js/bible.js");await saveStudy(s)}
  await addVerseToStudy(s.id,{versionId:v,bookId:book.id.split(":").slice(1).join(":"),bookName:book.name,chapter:c,number:verse.number,text:verse.text});toast("Versículo agregado");
}

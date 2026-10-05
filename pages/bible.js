import{go}from"../js/router.js";
import{versions,books,chapter,chapterInfo,saveChapterInfo,notes,note,deleteNote,highlights,highlight,clearHighlight,searchVerses,studies,addVerseToStudy,HIGHLIGHT_COLORS,highlightedVerses,getReadingPosition,saveReadingPosition}from"../js/bible.js?v=1.6.9";
import{shell,nav,esc,toast,appPrompt}from"../js/ui.js";
const COLORS=HIGHLIGHT_COLORS;
let currentBookCache=[];
export async function bible(){
  shell("Biblia de Estudio","bible");
  const v=document.getElementById("view"),vs=await versions(),bs=await books();
  if(!vs.length){v.innerHTML=`<div class="notice">No hay una Biblia instalada. Importa una versión autorizada desde Ajustes.</div>`;nav(go);return}
  const ver=vs[0],bb=bs.filter(x=>x.versionId===ver.id).sort((a,b)=>a.order-b.order);currentBookCache=bb;
  v.innerHTML=`<div class="card"><div class="title">${esc(ver.name)}</div><div class="muted">Busca cualquier versículo por texto o referencia.</div><div class="search" style="margin-top:12px"><span>⌕</span><input id="verse-search" placeholder="Buscar versículo..."></div><div class="actions" style="margin-top:10px"><button class="btn" id="studies">📖 Mis temas y predicaciones</button><button class="btn" id="saved-verses">⭐ Mis versículos marcados</button></div></div><div id="continue-reading"></div><h2 class="section-title">Libros</h2><section class="grid">${bb.map(b=>`<button class="card click" data-b="${esc(b.id.split(":").slice(1).join(":"))}"><div class="iconbox">${b.order}</div><div class="grow"><div class="title">${esc(b.name)}</div><div class="muted">${b.chapters.length} capítulos</div></div>›</button>`).join("")}</section><section id="search-results"></section>`;
  const last=await getReadingPosition();
  const continueBox=document.getElementById("continue-reading");
  if(last&&last.versionId===ver.id){
    const lastBook=bb.find(x=>x.id===`${ver.id}:${last.bookId}`);
    if(lastBook){
      continueBox.innerHTML=`<button class="card click" id="continue-reading-btn"><div class="iconbox">▶</div><div class="grow"><div class="title">Continuar leyendo</div><div class="muted">${esc(lastBook.name)} · Capítulo ${last.chapter}</div></div>›</button>`;
      document.getElementById("continue-reading-btn").onclick=()=>read(ver.id,last.bookId,last.chapter,lastBook,last.verse||1);
    }
  }

  document.querySelectorAll("[data-b]").forEach(x=>x.onclick=()=>pick(ver.id,x.dataset.b,bb.find(b=>b.id===ver.id+":"+x.dataset.b)));
  document.getElementById("studies").onclick=()=>go("studies");
  document.getElementById("saved-verses").onclick=()=>showSavedVerses(ver,bb);
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
  await saveReadingPosition(v,b,c,focusVerse||a[0]?.number||1);
  document.querySelector(".app")?.classList.add("reader-mode");
  const topicsByVerse=new Map();
  (ci.topics||[]).forEach(t=>{
    const verse=Number(t.verse ?? t.from);
    if(!Number.isFinite(verse))return;
    if(!topicsByVerse.has(verse))topicsByVerse.set(verse,[]);
    topicsByVerse.get(verse).push(t);
  });
  const topicFallback=(!ci.topics?.length&&ci.topic)?[{title:ci.topic,verse:1}]:[];
  if(topicFallback.length)topicsByVerse.set(1,topicFallback);
  const renderTopic=(t)=>`<div class="verse-topic" style="margin:22px 0 8px;padding:10px 14px;border-left:4px solid #23406A;background:#eef3f9;border-radius:8px;font-weight:700;color:#23406A"><span>${esc(t.title)}</span></div>`;
  view.innerHTML=`<div class="bible-reader"><div class="reader-toolbar"><button class="reader-icon" id="back" aria-label="Volver">‹</button><button class="version-pill" id="version-pill">${esc(v)}</button><div class="reader-toolbar-right"><button class="reader-icon" id="reader-search" aria-label="Buscar">⌕</button><button class="reader-icon" id="reader-more" aria-label="Más opciones">•••</button></div></div><div class="reader-book">${esc(book.name).toUpperCase()}</div><div class="reader-rule"></div><div class="reader-actions"><span>Capítulo ${c}</span><span>Mantén presionado un versículo para marcarlo</span></div><div class="scripture">${a.map(x=>{const h=map.get(x.number),n=notesMap.get(x.number),topics=topicsByVerse.get(x.number)||[];return`${topics.map(renderTopic).join("")}<div id="verse-${x.number}" class="verse-row ${h?"is-highlighted":""}" style="${h?`--highlight:${COLORS.find(z=>z.id===h.color)?.hex||"#fde68a"}`:""}" data-verse-row="${x.number}"><span class="verse-num">${x.number}</span> <span class="verse-text">${esc(x.text)}</span><div class="verse-tools"><button class="comment" data-note="${x.number}">${n?"✎ Editar comentario":"＋ Comentario"}</button></div>${n?`<div class="verse-note"><strong>Comentario:</strong> ${esc(n.text)} <button class="note-delete" data-note-delete="${n.id}">Eliminar</button></div>`:""}</div>`}).join("")}</div><div class="chapter-pager"><button class="pager-btn" id="prev-chapter" aria-label="Capítulo anterior">‹</button><div><small>${esc(book.name)}</small><strong>${c}</strong></div><button class="pager-btn" id="next-chapter" aria-label="Capítulo siguiente">›</button></div></div>`;
  document.getElementById("back").onclick=()=>pick(v,b,book);
  document.getElementById("reader-search").onclick=()=>{const q=await appPrompt("Buscar en la Biblia","Escribe el texto o referencia que quieres buscar.");if(q?.trim()){go("bible").then(()=>{const input=document.getElementById("verse-search");if(input){input.value=q.trim();input.dispatchEvent(new Event("input"))}})}};
  document.getElementById("reader-more").onclick=()=>openVerseMenu({v,b,c,book,verse:a.find(x=>x.number===focusVerse)||a[0],current:map.get(focusVerse||a[0]?.number)});
  const idx=book.chapters.findIndex(x=>x.number===c);
  document.getElementById("prev-chapter").onclick=()=>{
    if(idx>0){
      read(v,b,book.chapters[idx-1].number,book);
      return;
    }
    const bi=currentBookCache.findIndex(x=>x.id===book.id);
    if(bi>0){
      const prevBook=currentBookCache[bi-1];
      const first=prevBook.chapters[prevBook.chapters.length-1];
      read(v,prevBook.id.split(":").slice(1).join(":"),first.number,prevBook);
    }
  };
  document.getElementById("next-chapter").onclick=()=>{
    if(idx<book.chapters.length-1){
      read(v,b,book.chapters[idx+1].number,book);
      return;
    }
    const bi=currentBookCache.findIndex(x=>x.id===book.id);
    if(bi>=0&&bi<currentBookCache.length-1){
      const nextBook=currentBookCache[bi+1];
      const first=nextBook.chapters[0];
      read(v,nextBook.id.split(":").slice(1).join(":"),first.number,nextBook);
    }
  };
  document.querySelectorAll("[data-note]").forEach(btn=>btn.onclick=async()=>{const num=+btn.dataset.note,old=notesMap.get(num);const t=await appPrompt("Comentario para este versículo","Escribe tu comentario. Déjalo vacío para eliminar el comentario actual.",old?.text||"",{multiline:true});if(t===null)return;if(t.trim()){await note({id:old?.id||crypto.randomUUID(),ref,text:t.trim(),verse:num});toast("Comentario guardado");read(v,b,c,book,focusVerse||num)}else if(old){await deleteNote(old.id);toast("Comentario eliminado");read(v,b,c,book,focusVerse||num)}});
  document.querySelectorAll("[data-note-delete]").forEach(btn=>btn.onclick=async()=>{await deleteNote(btn.dataset.noteDelete);toast("Comentario eliminado");read(v,b,c,book,focusVerse)});
  document.querySelectorAll("[data-verse-row]").forEach(row=>installLongPress(row,async()=>openVerseMenu({v,b,c,book,verse:a.find(x=>x.number===+row.dataset.verseRow),current:map.get(+row.dataset.verseRow)})));
  if(focusVerse){requestAnimationFrame(()=>document.getElementById(`verse-${focusVerse}`)?.scrollIntoView({block:"center"}))}
}
function installLongPress(el,fn){let timer=0,startX=0,startY=0,pressed=false;const cancel=()=>{clearTimeout(timer);timer=0;pressed=false;el.classList.remove("pressing")};el.style.touchAction="pan-y";el.addEventListener("pointerdown",e=>{if(e.button!==undefined&&e.button!==0)return;if(e.target.closest(".verse-tools"))return;startX=e.clientX;startY=e.clientY;pressed=true;el.classList.add("pressing");clearTimeout(timer);timer=setTimeout(()=>{if(!pressed)return;pressed=false;el.classList.remove("pressing");fn()},350)},{passive:true});el.addEventListener("pointermove",e=>{if(!pressed)return;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.hypot(dx,dy)>18)cancel()},{passive:true});["pointerup","pointercancel","pointerleave"].forEach(type=>el.addEventListener(type,cancel,{passive:true}));el.addEventListener("contextmenu",e=>e.preventDefault())}
async function openVerseMenu({v,b,c,book,verse,current}){
  document.querySelector(".verse-menu")?.remove();
  const wrap=document.createElement("div");wrap.className="verse-menu";wrap.innerHTML=`<div class="verse-menu-card"><div class="title">${esc(book.name)} ${c}:${verse.number}</div><div class="muted menu-text">${esc(verse.text)}</div><div class="menu-title">¿Qué significa este versículo para mi estudio?</div><div class="menu-colors">${COLORS.map(x=>`<button class="menu-color ${current?.color===x.id?"active":""}" style="background:${x.hex}" data-menu-color="${x.id}" title="${x.name}: ${x.meaning}" aria-label="${x.name}"><span>${x.name}</span></button>`).join("")}</div><div class="actions menu-actions"><button class="btn" id="menu-study">＋ Agregar a tema/predicación</button>${current?`<button class="btn" id="menu-clear">Quitar resaltado</button>`:""}<button class="btn" id="menu-close">Cerrar</button></div></div>`;document.body.append(wrap);wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};wrap.querySelector("#menu-close").onclick=()=>wrap.remove();wrap.querySelectorAll("[data-menu-color]").forEach(btn=>btn.onclick=async()=>{const color=btn.dataset.menuColor;if(current?.color===color)await clearHighlight(`${v}:${b}:${c}`,verse.number);else await highlight(`${v}:${b}:${c}`,verse.number,color);wrap.remove();read(v,b,c,book,verse.number)});wrap.querySelector("#menu-study").onclick=async()=>{wrap.remove();await addToStudyFlow(v,verse,book,c)};const clear=wrap.querySelector("#menu-clear");if(clear)clear.onclick=async()=>{await clearHighlight(`${v}:${b}:${c}`,verse.number);wrap.remove();read(v,b,c,book,verse.number)}}
async function showSavedVerses(ver,bb){
  const list=await highlightedVerses();
  document.querySelector(".verse-menu")?.remove();
  const wrap=document.createElement("div");wrap.className="verse-menu saved-verses-modal";
  const groups=COLORS.map(c=>({c,items:list.filter(x=>x.color===c.id)})).filter(g=>g.items.length);
  wrap.innerHTML=`<div class="verse-menu-card saved-card"><div class="title">⭐ Mis versículos marcados</div><div class="muted menu-text">Cada color tiene un significado para tu estudio bíblico.</div>${groups.length?groups.map(g=>`<div class="saved-group"><div class="saved-group-title"><span class="saved-dot" style="background:${g.c.hex}"></span><strong>${esc(g.c.name)}</strong><small>${esc(g.c.meaning)}</small></div>${g.items.map((x,i)=>`<button class="saved-verse" data-saved="${list.indexOf(x)}"><strong>${esc(x.bookName)} ${x.chapter}:${x.number}</strong><span>${esc(x.text)}</span></button>`).join("")}</div>`).join(""):`<div class="empty">Todavía no has marcado versículos.</div>`}<button class="btn" id="saved-close">Cerrar</button></div>`;
  document.body.append(wrap);
  wrap.onclick=e=>{if(e.target===wrap)wrap.remove()};
  wrap.querySelector("#saved-close").onclick=()=>wrap.remove();
  wrap.querySelectorAll("[data-saved]").forEach(btn=>btn.onclick=()=>{const x=list[+btn.dataset.saved],book=bb.find(k=>k.id===x.versionId+":"+x.bookId);wrap.remove();if(book)read(x.versionId,x.bookId,x.chapter,book,x.number)});
}

async function addToStudyFlow(v,verse,book,c){
  const a=await studies();let s=null;if(a.length){const choice=await appPrompt("Agregar a tema o predicación",`Escribe el número correspondiente.\n\n${a.map((x,i)=>`${i+1}. ${x.title}`).join("\n")}\n\nDéjalo vacío para crear uno nuevo.`);if(choice?.trim()){const i=Number(choice)-1;if(a[i])s=a[i]}}
  if(!s){const title=await appPrompt("Nuevo tema o predicación","Escribe un nombre para guardarlo.");if(!title?.trim())return;const type=await appPrompt("Tipo","Escribe Tema o Predicación.","Predicación")||"Tema";s={id:crypto.randomUUID(),title:title.trim(),type:type.trim(),verses:[]};const {saveStudy}=await import("../js/bible.js?v=1.6.9");await saveStudy(s)}
  await addVerseToStudy(s.id,{versionId:v,bookId:book.id.split(":").slice(1).join(":"),bookName:book.name,chapter:c,number:verse.number,text:verse.text});toast("Versículo agregado");
}

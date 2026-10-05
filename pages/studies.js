import{go}from"../js/router.js";
import{studies,saveStudy,deleteStudy,updateStudyVerseNote,reorderStudyVerses}from"../js/bible.js";
import{shell,nav,esc,toast,appPrompt,appConfirm}from"../js/ui.js";

const studyCss=`
.study-help{margin-top:6px;font-size:13px;color:#6b7280}
.study-list{display:grid;gap:14px}
.study-verse-item{position:relative}
.study-verse-card{cursor:grab;user-select:none;touch-action:none}
.study-verse-card:active{cursor:grabbing}
.study-dragbar{display:flex;align-items:center;gap:10px;margin-bottom:8px;color:#6b7280;font-size:13px}
.study-drag-handle{font-size:20px;line-height:1;letter-spacing:-3px;color:#8a96a6}
.study-order{font-weight:800;color:#23406A}
.study-note{margin:0 10px 7px;padding:10px 12px;border-left:3px solid #23406A;background:#eef3f9;border-radius:8px;color:#4b5563;font-size:14px;line-height:1.5}
.study-note strong{display:block;color:#23406A;font-size:12px;margin-bottom:3px}
.study-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
.study-actions .btn{min-width:0}
.study-move{font-size:13px;padding:7px 10px}
.study-drop-line{height:4px;border-radius:4px;background:#23406A;margin:4px 8px;opacity:.85}
`;
function ensureStyles(){if(document.getElementById("hco-study-styles"))return;const s=document.createElement("style");s.id="hco-study-styles";s.textContent=studyCss;document.head.append(s)}

export async function studiesPage(){
  shell("Temas y predicaciones","bible");ensureStyles();
  const v=document.getElementById("view"),a=await studies();
  v.innerHTML=`<button class="btn" id="back">← Biblia</button><div class="card"><h2>Temas y predicaciones</h2><p class="muted">Guarda versículos para preparar estudios o predicaciones. Todo queda offline.</p><p class="study-help">Dentro de cada tema puedes agregar una nota sobre cada versículo y arrastrar los versículos para ordenar tu predicación.</p><button class="btn primary" id="new">+ Nuevo tema</button></div><section class="grid" id="studies-list"></section>`;
  document.getElementById("back").onclick=()=>go("bible");
  const render=()=>{
    document.getElementById("studies-list").innerHTML=(a.length?a.map(s=>`<div class="card"><div class="title">${esc(s.title)}</div><div class="muted">${esc(s.type||"Tema")} · ${(s.verses||[]).length} versículo(s)</div><div class="actions" style="margin-top:10px"><button class="btn" data-open="${s.id}">Ver</button><button class="btn danger" data-del="${s.id}">Eliminar</button></div></div>`).join(""):"<div class='empty'>Aún no tienes temas o predicaciones.</div>");
    document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{if(await appConfirm("Eliminar tema","¿Seguro que quieres eliminar este tema?")){await deleteStudy(b.dataset.del);const i=a.findIndex(x=>x.id===b.dataset.del);if(i>=0)a.splice(i,1);render()}});
    document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>viewStudy(a.find(x=>x.id===b.dataset.open)));
  };
  render();
  document.getElementById("new").onclick=async()=>{const title=await appPrompt("Nuevo tema o predicación","Escribe un nombre para guardarlo.");if(!title?.trim())return;const type=await appPrompt("Tipo","Escribe Tema o Predicación.","Predicación")||"Tema";const s={id:crypto.randomUUID(),title:title.trim(),type:type.trim(),verses:[]};await saveStudy(s);a.unshift(s);render();toast("Tema creado")};
  nav(go)
}

function verseId(x,index){return x.studyVerseId||`legacy-${index}-${x.versionId}:${x.bookId}:${x.chapter}:${x.number}`}
function verseRef(x){return `${x.bookName||x.bookId} ${x.chapter}:${x.number}`}

async function viewStudy(s){
  const v=document.getElementById("view");ensureStyles();
  const verses=s.verses||[];
  v.innerHTML=`<button class="btn" id="back">← Temas</button><div class="card"><h2>${esc(s.title)}</h2><div class="muted">${esc(s.type||"Tema")}</div><p class="study-help">Arrastra cada versículo desde el icono ⋮⋮ para cambiar el orden. La nota queda arriba de su versículo.</p></div><section class="study-list" id="study-verses"></section>`;
  document.getElementById("back").onclick=studiesPage;
  const list=document.getElementById("study-verses");
  const render=()=>{
    const current=s.verses||[];
    list.innerHTML=current.length?current.map((x,i)=>{
      const id=verseId(x,i),note=x.note||"";
      return `<div class="study-verse-item" data-index="${i}" data-item="${esc(id)}">
        <div class="study-verse-card card" draggable="true" data-drag="${i}">
          <div class="study-dragbar"><span class="study-drag-handle" aria-hidden="true">⋮⋮</span><span class="study-order">Punto ${i+1}</span><span class="muted">Arrastra para ordenar</span></div>
          ${note?`<div class="study-note"><strong>Nota de apoyo</strong>${esc(note)}</div>`:""}
          <div class="verse-label">${esc(verseRef(x))}</div>
          <p>${esc(x.text)}</p>
          <div class="study-actions">
            <button class="btn" data-note="${esc(id)}">${note?"✎ Editar nota":"＋ Agregar nota"}</button>
            <button class="btn study-move" data-up="${i}" ${i===0?"disabled":""}>↑</button>
            <button class="btn study-move" data-down="${i}" ${i===current.length-1?"disabled":""}>↓</button>
          </div>
        </div>
      </div>`
    }).join(""):"<div class='empty'>Agrega versículos desde la Biblia.</div>";
    bindActions();
  };
  const bindActions=()=>{
    list.querySelectorAll("[data-note]").forEach(btn=>btn.onclick=async()=>{
      const i=[...list.querySelectorAll("[data-note]")].indexOf(btn);const item=(s.verses||[])[i];if(!item)return;
      const text=await appPrompt("Nota para este versículo",`Escribe una idea, explicación, aplicación o punto de apoyo para ${verseRef(item)}.`,item.note||"",{multiline:true,confirmText:"Guardar"});
      if(text===null)return;
      await updateStudyVerseNote(s.id,verseId(item,i),text);s.verses=(await studies()).find(x=>x.id===s.id)?.verses||s.verses;render();toast(text.trim()?"Nota guardada":"Nota eliminada");
    });
    list.querySelectorAll("[data-up]").forEach(btn=>btn.onclick=async()=>{const i=+btn.dataset.up;if(i<=0)return;s=await reorderStudyVerses(s.id,i,i-1);render();});
    list.querySelectorAll("[data-down]").forEach(btn=>btn.onclick=async()=>{const i=+btn.dataset.down;if(i>=((s.verses||[]).length-1))return;s=await reorderStudyVerses(s.id,i,i+1);render();});
    let dragging=null;
    list.querySelectorAll("[data-drag]").forEach(card=>{
      card.addEventListener("dragstart",e=>{dragging=+card.dataset.drag;e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",String(dragging));card.style.opacity=".55"});
      card.addEventListener("dragend",()=>{dragging=null;card.style.opacity="";list.querySelectorAll(".study-drop-line").forEach(x=>x.remove())});
      card.addEventListener("dragover",e=>{e.preventDefault();if(dragging===null||dragging===+card.dataset.drag)return;list.querySelectorAll(".study-drop-line").forEach(x=>x.remove());const line=document.createElement("div");line.className="study-drop-line";card.parentElement.insertBefore(line,e.offsetY<card.offsetHeight/2?card:card.nextSibling)});
      card.addEventListener("drop",async e=>{e.preventDefault();const from=dragging??+e.dataTransfer.getData("text/plain");let to=+card.dataset.drag;if(from===to)return;const rect=card.getBoundingClientRect();if(e.clientY>rect.top+rect.height/2)to+=1;if(from<to)to-=1;to=Math.max(0,Math.min((s.verses||[]).length-1,to));s=await reorderStudyVerses(s.id,from,to);list.querySelectorAll(".study-drop-line").forEach(x=>x.remove());render();toast("Orden actualizado")});
    });
  };
  render();
}

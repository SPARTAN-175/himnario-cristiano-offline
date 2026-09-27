import{go}from"../js/router.js";
import{hymns,bible}from"../js/importers.js";
import{list}from"../js/hymns.js";
import{shell,nav,toast}from"../js/ui.js";
export async function settings(){
  shell("Ajustes","settings");
  const v=document.getElementById("view");
  v.innerHTML=`<div class="grid">
    <div class="card"><h2>Himnos</h2><p class="muted">Importa un .hco, .json o uno/muchos bloques de texto.</p><button class="btn primary" id="ih">Importar</button><button class="btn" id="eh">Exportar .hco</button><input id="hf" type="file" accept=".hco,.json,.txt" hidden></div>
    <div class="card"><h2>📖 Biblia</h2><p class="muted"><strong>RVR1960 viene integrada.</strong> No necesitas importarla para usar el Himnario. Aquí puedes agregar otras versiones en JSON compatibles.</p><button class="btn primary" id="ib">Importar otra versión</button><input id="bf" type="file" accept=".json" hidden></div>
  </div>`;
  document.getElementById("ih").onclick=()=>document.getElementById("hf").click();
  document.getElementById("hf").onchange=async e=>{try{const n=await hymns(e.target.files[0]);toast(n+" himnos importados");settings()}catch(err){toast(err.message)}};
  document.getElementById("eh").onclick=async()=>{const a=await list();const blob=new Blob([JSON.stringify({format:"HCO",version:"1.0",hymns:a},null,2)],{type:"application/json"}),u=URL.createObjectURL(blob),ael=document.createElement("a");ael.href=u;ael.download="himnario.hco";ael.click();setTimeout(()=>URL.revokeObjectURL(u),500)};
  document.getElementById("ib").onclick=()=>document.getElementById("bf").click();
  document.getElementById("bf").onchange=async e=>{try{const n=await bible(e.target.files[0]);toast("Biblia importada: "+n);go("bible")}catch(err){toast(err.message)}};
  nav(go)
}

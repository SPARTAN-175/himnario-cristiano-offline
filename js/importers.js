import{replace}from"./hymns.js";import{importBible}from"./bible.js";
const read=f=>new Promise((a,b)=>{const r=new FileReader;r.onload=()=>a(r.result);r.onerror=()=>b(Error("No se pudo leer el archivo"));r.readAsText(f)});
const clean=s=>String(s??"").trim();

function parseTxt(t){
  const lines=t.replace(/^\uFEFF/,"").replace(/\r/g,"").split("\n");
  const starts=[];
  lines.forEach((line,i)=>{
    const s=clean(line);
    // Formato principal: # Título, # 125 - Título, # 125. Título
    let m=s.match(/^#\s*(?:(\d+)\s*[-.)]\s*)?(.+)$/);
    if(m)starts.push({i,n:m[1]?+m[1]:null,title:m[2].trim()});
  });

  // También conserva compatibilidad con el formato antiguo: 125 - Título
  if(!starts.length) lines.forEach((line,i)=>{
    const m=clean(line).match(/^(\d+)\s*[-.)]\s*(.+)$/);
    if(m)starts.push({i,n:+m[1],title:m[2].trim()});
  });

  const chunks=starts.length
    ? starts.map((s,i)=>({head:s,lines:lines.slice(s.i,i+1<starts.length?starts[i+1].i:lines.length)}))
    : [{head:null,lines}];

  return chunks.filter(c=>c.lines.some(x=>clean(x))).map((c,i)=>{
    const body=c.head?c.lines.slice(1):c.lines.slice();
    let title=c.head?c.head.title:clean(body.shift()||"Sin título");
    let author="",theme="",key="",meter="";
    const sections=[];
    let current={label:"",lines:[]};
    const flush=()=>{if(current.lines.length)sections.push(current);current={label:"",lines:[]}};

    body.forEach(line=>{
      const s=clean(line);
      if(!s){return} // Los blancos NO crean otro himno ni otra sección.

      const meta=s.match(/^(Autor|Tema|Tono|Compás)\s*:\s*(.+)$/i);
      if(meta){
        const k=meta[1].toLowerCase();
        if(k==="autor")author=meta[2].trim();
        else if(k==="tema")theme=meta[2].trim();
        else if(k==="tono")key=meta[2].trim();
        else meter=meta[2].trim();
        return;
      }

      // Reconoce partes del himno. Verso 1/2/3 se conserva como etiqueta.
      if(/^(verso|estrofa)(?:\s*\d+)?\s*:??$/i.test(s) ||
         /^(coro|estribillo|puente|intro|interludio|final)(?:\s*\d+)?\s*:??$/i.test(s)){
        flush();
        current.label=s.replace(/:\s*$/,"" ).trim();
        return;
      }
      current.lines.push(s);
    });
    flush();

    // Si no hubo etiquetas, todo sigue siendo un único bloque del himno.
    if(!sections.length && body.some(x=>clean(x))) sections.push({label:"",lines:body.filter(x=>clean(x))});

    return {
      number:c.head?.n ?? i+1,
      title,
      theme,author,key,meter,
      favorite:false,
      sections,
      verses:sections.map(s=>s.lines)
    };
  });
}

export async function hymns(f){
  if(!f)throw Error("Selecciona un archivo");
  let x;const t=await read(f);
  try{x=JSON.parse(t)}catch{x=parseTxt(t)}
  if(x?.format==="HCO")x=x.hymns;
  if(!Array.isArray(x))throw Error("Formato de himnos inválido");
  x=x.map((h,i)=>{
    const sections=Array.isArray(h.sections)
      ? h.sections.map(s=>({label:String(s.label||""),lines:(s.lines||[]).map(String)}))
      : null;
    const verses=(h.verses??(h.letra?[h.letra]:[])).map(v=>Array.isArray(v)?v.map(String):[String(v)]);
    return {
      id:String(h.id||"h"+Date.now()+i),
      number:+(h.number??h.numero??i+1),
      title:String(h.title??h.titulo??"Sin título"),
      theme:String(h.theme??h.tema??""),
      author:String(h.author??h.autor??""),
      key:String(h.key??h.tono??""),
      meter:String(h.meter??h.compas??""),
      favorite:!!(h.favorite??h.favorito),
      sections:sections||verses.map(lines=>({label:"",lines})),
      verses
    };
  });
  await replace(x);return x.length;
}

export async function bible(f){const x=JSON.parse(await read(f));await importBible(x);return x.version.name}

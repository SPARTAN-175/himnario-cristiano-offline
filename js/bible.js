import{all,put,bulk,remove}from"./db.js";
const cleanText=s=>String(s??"").replace(/\\n/g,"\n").replace(/\/n/g,"").replace(/\n{3,}/g,"\n\n").trim();
export {cleanText};
export const versions=()=>all("bibleVersions");
export const books=()=>all("bibleBooks");
export async function importBible(x){
  if(!x?.version?.id||!Array.isArray(x.books))throw Error("Biblia inválida");
  await put("bibleVersions",x.version);
  const bs=[],vs=[],cs=[];
  for(const b of x.books){
    bs.push({id:x.version.id+":"+b.id,versionId:x.version.id,name:b.name,order:b.order,chapters:b.chapters||[]});
    for(const c of b.chapters||[]){
      cs.push({id:`${x.version.id}:${b.id}:${c.number}`,versionId:x.version.id,bookId:b.id,chapter:c.number,topic:c.topic||""});
      for(const v of c.verses||[])vs.push({id:`${x.version.id}:${b.id}:${c.number}:${v.number}`,versionId:x.version.id,bookId:b.id,chapter:c.number,number:v.number,text:cleanText(v.text)});
    }
  }
  await bulk("bibleBooks",bs);await bulk("bibleChapters",cs);await bulk("bibleVerses",vs);
}

export async function seedBundledBible(){
  const existing=await all("bibleVersions");
  const current=existing.find(x=>x.id==="rvr1960");
  const chapters=await all("bibleChapters");
  const rvrChapters=chapters.filter(x=>x.versionId==="rvr1960");
  const topics=rvrChapters.filter(x=>String(x.topic||"").trim()).length;
  if(current && rvrChapters.length>=1189 && topics>=1103)return false;
  const res=await fetch("./data/bible-rvr1960.json",{cache:"no-store"});
  if(!res.ok)throw Error("No se pudo cargar la Biblia integrada");
  const data=await res.json();
  await importBible(data);
  return true;
}

export async function chapter(v,b,c){return(await all("bibleVerses")).filter(x=>x.versionId===v&&x.bookId===b&&x.chapter===c).sort((a,b)=>a.number-b.number).map(x=>({...x,text:cleanText(x.text)}))}
export async function chapterInfo(v,b,c){return (await all("bibleChapters")).find(x=>x.id===`${v}:${b}:${c}`)||{id:`${v}:${b}:${c}`,versionId:v,bookId:b,chapter:c,topic:""}}
export const saveChapterInfo=x=>put("bibleChapters",x);
export const notes=r=>all("notes").then(a=>a.filter(x=>x.ref===r));
export const note=n=>put("notes",n);
export const deleteNote=id=>remove("notes",id);
export const highlights=r=>all("highlights").then(a=>a.filter(x=>x.ref===r));
export const highlight=(ref,verse,color)=>put("highlights",{id:`${ref}:${verse}`,ref,verse,color});
export const clearHighlight=(ref,verse)=>remove("highlights",`${ref}:${verse}`);
export async function searchVerses(q){
  const s=q.trim().toLowerCase();if(!s)return[];
  const [vs,bs,ver] = await Promise.all([all("bibleVerses"),all("bibleBooks"),all("bibleVersions")]);
  const bookMap=new Map(bs.map(b=>[`${b.versionId}:${b.id.split(":").slice(1).join(":")}`,b]));
  const versionMap=new Map(ver.map(v=>[v.id,v]));
  const ref=s.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
  const refBook=ref?.[1]?.trim().toLowerCase(),refChapter=ref?.[2]?+ref[2]:null,refVerse=ref?.[3]?+ref[3]:null;
  return vs.filter(x=>{
    const b=bookMap.get(`${x.versionId}:${x.bookId}`);
    const name=(b?.name||x.bookId).toLowerCase();
    const byRef=refBook&&name===refBook&&refChapter===x.chapter&&(refVerse==null||refVerse===x.number);
    return byRef||cleanText(x.text).toLowerCase().includes(s)||(`${x.chapter}:${x.number}`===s);
  }).slice(0,80).map(x=>{
    const b=bookMap.get(`${x.versionId}:${x.bookId}`);return{...x,text:cleanText(x.text),bookName:b?.name||x.bookId,versionName:versionMap.get(x.versionId)?.name||x.versionId}
  });
}

export const HIGHLIGHT_COLORS=[
  {id:"yellow",name:"Promesas",meaning:"Promesas, pactos y bendiciones de Dios",hex:"#fde68a"},
  {id:"blue",name:"Dios",meaning:"Dios, su carácter, atributos y voluntad",hex:"#bfdbfe"},
  {id:"green",name:"Vida y crecimiento",meaning:"Fe, obediencia, crecimiento y vida cristiana",hex:"#bbf7d0"},
  {id:"red",name:"Jesús y salvación",meaning:"Jesucristo, cruz, gracia, perdón y salvación",hex:"#fecaca"},
  {id:"purple",name:"Oración y adoración",meaning:"Oración, alabanza, adoración y comunión con Dios",hex:"#ddd6fe"},
  {id:"orange",name:"Advertencia y enseñanza",meaning:"Mandamientos, advertencias, pecado, consecuencias y enseñanza",hex:"#fed7aa"}
];
export async function highlightedVerses(){
  const hs=await all("highlights"), vs=await all("bibleVerses"), bs=await all("bibleBooks"), vers=await all("bibleVersions");
  const vm=new Map(vs.map(x=>[x.id,x]));
  const bm=new Map(bs.map(x=>[x.id,x]));
  const rm=new Map(vers.map(x=>[x.id,x]));
  return hs.map(h=>{
    const v=vm.get(`${h.ref}:${h.verse}`) || vs.find(x=>`${x.versionId}:${x.bookId}:${x.chapter}:${x.number}`===h.id);
    if(!v)return null;
    const b=bm.get(`${v.versionId}:${v.bookId}`);
    const color=HIGHLIGHT_COLORS.find(c=>c.id===h.color)||HIGHLIGHT_COLORS[0];
    return {...h,...v,bookName:b?.name||v.bookId,versionName:rm.get(v.versionId)?.name||v.versionId,colorName:color.name,colorMeaning:color.meaning};
  }).filter(Boolean).sort((a,b)=>a.bookName.localeCompare(b.bookName,"es")||a.chapter-b.chapter||a.number-b.number);
}

export const studies=()=>all("studies");
export const saveStudy=s=>put("studies",s);
export const deleteStudy=id=>remove("studies",id);
export async function addVerseToStudy(id,verse){const s=(await all("studies")).find(x=>x.id===id);if(!s)throw Error("Tema no encontrado");s.verses=s.verses||[];const key=`${verse.versionId}:${verse.bookId}:${verse.chapter}:${verse.number}`;if(!s.verses.some(x=>`${x.versionId}:${x.bookId}:${x.chapter}:${x.number}`===key))s.verses.push(verse);await put("studies",s);return s}

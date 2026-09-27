import{all,put,bulk,remove}from"./db.js";
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
      for(const v of c.verses||[])vs.push({id:`${x.version.id}:${b.id}:${c.number}:${v.number}`,versionId:x.version.id,bookId:b.id,chapter:c.number,number:v.number,text:v.text});
    }
  }
  await bulk("bibleBooks",bs);await bulk("bibleChapters",cs);await bulk("bibleVerses",vs);
}
export async function chapter(v,b,c){return(await all("bibleVerses")).filter(x=>x.versionId===v&&x.bookId===b&&x.chapter===c).sort((a,b)=>a.number-b.number)}
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
    return byRef||x.text.toLowerCase().includes(s)||(`${x.chapter}:${x.number}`===s);
  }).slice(0,80).map(x=>{
    const b=bookMap.get(`${x.versionId}:${x.bookId}`);return{...x,bookName:b?.name||x.bookId,versionName:versionMap.get(x.versionId)?.name||x.versionId}
  });
}
export const studies=()=>all("studies");
export const saveStudy=s=>put("studies",s);
export const deleteStudy=id=>remove("studies",id);
export async function addVerseToStudy(id,verse){const s=(await all("studies")).find(x=>x.id===id);if(!s)throw Error("Tema no encontrado");s.verses=s.verses||[];const key=`${verse.versionId}:${verse.bookId}:${verse.chapter}:${verse.number}`;if(!s.verses.some(x=>`${x.versionId}:${x.bookId}:${x.chapter}:${x.number}`===key))s.verses.push(verse);await put("studies",s);return s}

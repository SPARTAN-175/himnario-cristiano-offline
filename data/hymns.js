import{all,get,put,bulk,clear,remove}from"./db.js";
const BUNDLED_HYMNS_VERSION="official-366-271A-2026-09-28";
export async function seed(){
  const existing=await all("hymns");
  const marker=localStorage.getItem("hco-bundled-hymns-version");
  if(existing.length&&marker===BUNDLED_HYMNS_VERSION)return;
  const d=await fetch("./data/himnos.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("No se pudo cargar el himnario oficial");return r.json()});
  if(!Array.isArray(d)||d.length<300)throw Error("El himnario oficial está incompleto");
  await clear("hymns");
  await bulk("hymns",d);
  localStorage.setItem("hco-bundled-hymns-version",BUNDLED_HYMNS_VERSION);
}
export async function list(){
  const hymns=await all("hymns");
  return hymns.sort((a,b)=>Number(a.number)-Number(b.number));
}
export const one=id=>get("hymns",id);
export const save=h=>put("hymns",h);
export const del=id=>remove("hymns",id);
export async function fav(id){const h=await one(id);h.favorite=!h.favorite;return put("hymns",h)}
export async function replace(a){await clear("hymns");await bulk("hymns",a)}

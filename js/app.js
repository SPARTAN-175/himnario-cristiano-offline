import{openDB}from"./db.js";
import{seed}from"./hymns.js";
import{seedBundledBible}from"./bible.js";
import{go}from"./router.js";

async function boot(){
  const app=document.getElementById("app");
  try{
    app.innerHTML=`<div class="splash"><div><h1>Himnario Cristiano</h1><p>Cargando contenido…</p></div></div>`;
    await openDB();
    await seed();
    await seedBundledBible();
    await go("home");
    if("serviceWorker"in navigator){
      try{await navigator.serviceWorker.register("./service-worker.js")}catch(swError){console.warn("Service Worker:",swError)}
    }
  }catch(e){
    console.error(e);
    app.innerHTML=`<div class="splash"><div><h1>Himnario Cristiano</h1><p>Error al iniciar</p><small>${String(e?.message||e)}</small></div></div>`;
  }
}
boot();

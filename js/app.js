import{openDB}from"./db.js";
import{seed}from"./hymns.js";
import{seedBundledBible}from"./bible.js";
import{go}from"./router.js";
async function boot(){
  try{
    await openDB();
    await seed();
    await seedBundledBible();
    if("serviceWorker"in navigator)await navigator.serviceWorker.register("./service-worker.js");
    await go("home");
  }catch(e){
    document.getElementById("app").innerHTML=`<div class="splash"><div><h1>Error al iniciar</h1><p>${e.message||e}</p></div></div>`
  }
}
boot();

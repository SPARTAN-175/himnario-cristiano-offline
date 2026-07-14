/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : app.js
Versión  : v0.3.0
Build    : 013
Autor    : Carlos & ChatGPT
======================================
*/

import { iniciarRouter } from "./router.js";
import { abrirBaseDatos } from "./database.js";

async function iniciarAplicacion() {

    console.log("📖 Himnario iniciado");

    await abrirBaseDatos();

    iniciarRouter();

    if ("serviceWorker" in navigator) {

        await navigator.serviceWorker.register("./service-worker.js");

        console.log("✅ Service Worker registrado");

    }

}

iniciarAplicacion();

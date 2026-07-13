/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : app.js
Versión  : v0.3.0
Build    : 001
Autor    : Carlos & ChatGPT
======================================
*/

import { iniciarRouter } from "./router.js";

async function iniciarAplicacion() {

    console.log("📖 Himnario iniciado");

    iniciarRouter();

    if ("serviceWorker" in navigator) {

        await navigator.serviceWorker.register("../service-worker.js");

        console.log("✅ Service Worker registrado");

    }

}

iniciarAplicacion();

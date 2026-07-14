/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : app.js
Versión  : v0.3.0
Build    : 015
Autor    : Carlos & ChatGPT
======================================
*/

import { iniciarRouter } from "./router.js";

import { abrirBaseDatos } from "./database.js";

import {

    contarHimnos,

    guardarHimnos

} from "./database-hymns.js";

async function iniciarAplicacion() {

    console.log("📖 Himnario iniciado");

    await abrirBaseDatos();

    const cantidad = await contarHimnos();

    if (cantidad === 0) {

        console.log("📥 Primera ejecución...");

        const respuesta = await fetch("./data/himnos.json");

        const himnos = await respuesta.json();

        await guardarHimnos(himnos);

        console.log("✅ Himnos cargados en IndexedDB");

    }

    iniciarRouter();

    if ("serviceWorker" in navigator) {

        await navigator.serviceWorker.register("./service-worker.js");

    }

}

iniciarAplicacion();

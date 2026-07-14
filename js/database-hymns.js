/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : database-hymns.js
Versión  : v0.3.0
Build    : 014
Autor    : Carlos & ChatGPT
======================================
*/

import { abrirBaseDatos } from "./database.js";

export async function contarHimnos() {

    const db = await abrirBaseDatos();

    return new Promise((resolve, reject) => {

        const tx = db.transaction("himnos", "readonly");

        const store = tx.objectStore("himnos");

        const request = store.count();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });

}

export async function guardarHimnos(lista) {

    const db = await abrirBaseDatos();

    return new Promise((resolve, reject) => {

        const tx = db.transaction("himnos", "readwrite");

        const store = tx.objectStore("himnos");

        lista.forEach(himno => {

            store.put(himno);

        });

        tx.oncomplete = () => resolve();

        tx.onerror = () => reject(tx.error);

    });

}

export async function obtenerTodosLosHimnos() {

    const db = await abrirBaseDatos();

    return new Promise((resolve, reject) => {

        const tx = db.transaction("himnos", "readonly");

        const store = tx.objectStore("himnos");

        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);

        request.onerror = () => reject(request.error);

    });

}

/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : storage.js
Versión  : v0.2.0
Build    : 001
Autor    : Carlos & ChatGPT
======================================
*/

let cacheHimnos = [];

export async function obtenerHimnos() {

    if (cacheHimnos.length > 0) {
        return cacheHimnos;
    }

    const respuesta = await fetch("./data/himnos.json");

    cacheHimnos = await respuesta.json();

    return cacheHimnos;

}

export async function obtenerHimno(id){

    const himnos = await obtenerHimnos();

    return himnos.find(h => h.id === id);

}

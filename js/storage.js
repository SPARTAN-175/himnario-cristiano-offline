/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : storage.js
Versión  : v0.3.0
Build    : 010
Autor    : Carlos & ChatGPT
======================================
*/

const CLAVE_HIMNOS = "hc_himnos";
const CLAVE_FAVORITOS = "hc_favoritos";

let cache = null;

// ===============================
// HIMNOS
// ===============================

export async function obtenerHimnos() {

    if (cache) {

        return cache;

    }

    const guardados = localStorage.getItem(CLAVE_HIMNOS);

    if (guardados) {

        cache = JSON.parse(guardados);

        return cache;

    }

    const respuesta = await fetch("./data/himnos.json");

    cache = await respuesta.json();

    localStorage.setItem(

        CLAVE_HIMNOS,

        JSON.stringify(cache)

    );

    return cache;

}

export async function obtenerHimno(id) {

    const himnos = await obtenerHimnos();

    return himnos.find(h => h.id === id);

}

// ===============================
// FAVORITOS
// ===============================

export function obtenerFavoritos() {

    return JSON.parse(

        localStorage.getItem(CLAVE_FAVORITOS)

    ) || [];

}

export function esFavorito(id) {

    return obtenerFavoritos().includes(id);

}

export function cambiarFavorito(id) {

    let favoritos = obtenerFavoritos();

    if (favoritos.includes(id)) {

        favoritos = favoritos.filter(f => f !== id);

    } else {

        favoritos.push(id);

    }

    localStorage.setItem(

        CLAVE_FAVORITOS,

        JSON.stringify(favoritos)

    );

}

// ===============================
// IMPORTAR HIMNARIO
// ===============================

export function importarHimnario(himnos){

    cache = himnos;

    localStorage.setItem(

        CLAVE_HIMNOS,

        JSON.stringify(himnos)

    );

}

// ===============================
// EXPORTAR HIMNARIO
// ===============================

export async function exportarHimnario(){

    return await obtenerHimnos();

}

// ===============================
// RESTABLECER
// ===============================

export function borrarHimnario(){

    cache = null;

    localStorage.removeItem(CLAVE_HIMNOS);

}

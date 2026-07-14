/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : storage.js
Versión  : v0.3.0
Build    : 016
Autor    : Carlos & ChatGPT
======================================
*/

import {
    obtenerTodosLosHimnos
} from "./database-hymns.js";

let cache = null;

//============================
// HIMNOS
//============================

export async function obtenerHimnos(){

    if(cache){

        return cache;

    }

    cache = await obtenerTodosLosHimnos();

    return cache;

}

export async function obtenerHimno(id){

    const himnos = await obtenerHimnos();

    return himnos.find(h=>h.id===id);

}

//============================
// CACHE
//============================

export function limpiarCache(){

    cache = null;

}

//============================
// FAVORITOS
//============================

const CLAVE = "hc_favoritos";

export function obtenerFavoritos(){

    return JSON.parse(

        localStorage.getItem(CLAVE)

    ) || [];

}

export function esFavorito(id){

    return obtenerFavoritos().includes(id);

}

export function cambiarFavorito(id){

    let favoritos = obtenerFavoritos();

    if(favoritos.includes(id)){

        favoritos = favoritos.filter(f=>f!==id);

    }else{

        favoritos.push(id);

    }

    localStorage.setItem(

        CLAVE,

        JSON.stringify(favoritos)

    );

}

/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : storage.js
Versión  : v0.2.0
Build    : 004
Autor    : Carlos & ChatGPT
======================================
*/

let cacheHimnos = [];

const CLAVE_FAVORITOS = "hc_favoritos";

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

export function obtenerFavoritos(){

    const datos = localStorage.getItem(CLAVE_FAVORITOS);

    return datos ? JSON.parse(datos) : [];

}

export function esFavorito(id){

    return obtenerFavoritos().includes(id);

}

export function cambiarFavorito(id){

    let favoritos = obtenerFavoritos();

    if(favoritos.includes(id)){

        favoritos = favoritos.filter(item => item !== id);

    }else{

        favoritos.push(id);

    }

    localStorage.setItem(

        CLAVE_FAVORITOS,

        JSON.stringify(favoritos)

    );

}


/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : storage.js
Versión  : v0.1.0
Build    : 017
Autor    : Carlos & ChatGPT
======================================
*/

export async function obtenerHimnos() {

    try {

        const respuesta = await fetch("./data/himnos.json");

        const himnos = await respuesta.json();

        return himnos;

    } catch (error) {

        console.error("Error cargando himnos:", error);

        return [];

    }

}

// Fin del archivo

/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : router.js
Versión  : v0.1.0
Build    : 019
Autor    : Carlos & ChatGPT
======================================
*/

import { mostrarInicio } from "../pages/home.js";
import { mostrarHimnos } from "../pages/hymns.js";

export function navegar(pantalla) {

    switch (pantalla) {

        case "inicio":
            mostrarInicio();
            break;

        case "himnos":
            mostrarHimnos();
            break;

        default:
            mostrarInicio();

    }

}

export function iniciarRouter() {

    navegar("inicio");

}

// Fin del archivo

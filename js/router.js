/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : router.js
Versión  : v0.1.0
Build    : 023
Autor    : Carlos & ChatGPT
======================================
*/

import { mostrarInicio } from "../pages/home.js";
import { mostrarHimnos } from "../pages/hymns.js";
import { mostrarHimno } from "../pages/hymn.js";

export function navegar(pantalla, id = null) {

    switch (pantalla) {

        case "inicio":
            mostrarInicio();
            break;

        case "himnos":
            mostrarHimnos();
            break;

        case "himno":
            mostrarHimno(id);
            break;

        default:
            mostrarInicio();

    }

}

export function iniciarRouter() {

    navegar("inicio");

}

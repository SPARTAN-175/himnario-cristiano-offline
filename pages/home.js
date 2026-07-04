/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : home.js
Versión  : v0.1.0
Build    : 007
Autor    : Carlos & ChatGPT
======================================
*/

import { crearHeader } from "../components/header.js";

export function mostrarInicio() {

    const app = document.getElementById("app");

    app.innerHTML = `
        ${crearHeader("📖 Himnario Cristiano")}

        <main class="home">

            <p>Versión 0.1.0</p>

            <button>Buscar Himno</button>

            <button>Todos los Himnos</button>

            <button>Favoritos</button>

            <button>Configuración</button>

        </main>
    `;

}

// Fin del archivo home.js

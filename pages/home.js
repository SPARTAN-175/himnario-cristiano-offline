/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : home.js
Versión  : v0.1.0
Build    : 008
Autor    : Carlos & ChatGPT
======================================
*/

import { crearHeader } from "../components/header.js";
import { crearBoton } from "../components/button.js";

export function mostrarInicio() {

    const app = document.getElementById("app");

    app.innerHTML = `
        ${crearHeader("📖 Himnario Cristiano")}

        <main class="home">

            <p>Versión 0.1.0</p>

            ${crearBoton("🔍 Buscar Himno", "btnBuscar")}

            ${crearBoton("📚 Todos los Himnos", "btnHimnos")}

            ${crearBoton("⭐ Favoritos", "btnFavoritos")}

            ${crearBoton("⚙ Configuración", "btnConfiguracion")}

        </main>
    `;

}

// Fin del archivo home.js

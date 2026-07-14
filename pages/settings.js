/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : settings.js
Versión  : v0.3.0
Build    : 011
Autor    : Carlos & ChatGPT
======================================
*/

import { navegar } from "../js/router.js";

export function mostrarConfiguracion(){

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="home-page">

        <header class="hero">

            <button id="btnInicio">

                ← Inicio

            </button>

            <div class="hero-logo">

                HC

            </div>

            <h1>

                Configuración

            </h1>

        </header>

        <section class="cards">

            <button class="card">

                Importar Himnario

            </button>

            <button class="card">

                Exportar Himnario

            </button>

            <button class="card">

                Información

            </button>

        </section>

    </div>

    `;

    document

        .getElementById("btnInicio")

        .onclick = () => navegar("inicio");

}

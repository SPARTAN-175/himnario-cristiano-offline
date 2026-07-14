/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : settings.js
Versión  : v0.3.0
Build    : 017
Autor    : Carlos & ChatGPT
======================================
*/

import { navegar } from "../js/router.js";

export function mostrarConfiguracion(){

    const app = document.getElementById("app");

    app.innerHTML = `

    <main class="home-page">

        <header class="hero">

            <button id="btnVolver">

                ← Inicio

            </button>

            <div class="hero-logo">

                HC

            </div>

            <h1>

                Configuración

            </h1>

            <p>

                Himnario Cristiano Offline

            </p>

        </header>

        <section class="cards">

            <button id="btnImportar" class="card">

                📥 Importar Himnario

            </button>

            <button id="btnExportar" class="card">

                📤 Exportar Himnario

            </button>

            <button id="btnActualizar" class="card">

                🔄 Restaurar Himnario Original

            </button>

            <button class="card">

                ℹ Versión 0.3.0 Alpha

            </button>

        </section>

    </main>

    `;

    document
        .getElementById("btnVolver")
        .onclick = ()=>{

            navegar("inicio");

        };

    document
        .getElementById("btnImportar")
        .onclick = ()=>{

            alert("Próximo Build");

        };

    document
        .getElementById("btnExportar")
        .onclick = ()=>{

            alert("Próximo Build");

        };

    document
        .getElementById("btnActualizar")
        .onclick = ()=>{

            alert("Próximo Build");

        };

}

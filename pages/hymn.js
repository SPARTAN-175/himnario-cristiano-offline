/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymn.js
Versión  : v0.1.0
Build    : 023
Autor    : Carlos & ChatGPT
======================================
*/

import { obtenerHimnos } from "../js/storage.js";
import { navegar } from "../js/router.js";

export async function mostrarHimno(id) {

    const app = document.getElementById("app");

    const himnos = await obtenerHimnos();

    const himno = himnos.find(h => h.id === id);

    if (!himno) {

        app.innerHTML = "<h2>Himno no encontrado</h2>";

        return;

    }

    const letra = himno.letra.length
        ? himno.letra.map(linea => `<p>${linea}</p>`).join("")
        : "<p>Este himno aún no tiene letra.</p>";

    app.innerHTML = `

    <div class="home-page">

        <header class="hero">

            <button id="btnVolver">

                ← Volver

            </button>

            <h1>

                ${himno.numero}. ${himno.titulo}

            </h1>

            <p>

                ${himno.tema}

            </p>

        </header>

        <section class="cards">

            ${letra}

        </section>

    </div>

    `;

    document
        .getElementById("btnVolver")
        .addEventListener("click", () => {

            navegar("himnos");

        });

}

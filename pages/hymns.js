/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymns.js
Versión  : v0.1.0
Build    : 018
Autor    : Carlos & ChatGPT
======================================
*/

import { obtenerHimnos } from "../js/storage.js";

export async function mostrarHimnos() {

    const app = document.getElementById("app");

    const himnos = await obtenerHimnos();

    let lista = "";

    himnos.forEach(himno => {

        lista += `
            <article class="card">

                <div class="card-icon">

                    ${himno.numero}

                </div>

                <div class="card-content">

                    <h2>${himno.titulo}</h2>

                    <p>${himno.tema}</p>

                </div>

            </article>
        `;

    });

    app.innerHTML = `

        <div class="home-page">

            <header class="hero">

                <h1>Todos los Himnos</h1>

            </header>

            <section class="cards">

                ${lista}

            </section>

        </div>

    `;

}

// Fin del archivo

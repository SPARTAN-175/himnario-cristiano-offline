/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymns.js
Versión  : v0.1.0
Build    : 023
Autor    : Carlos & ChatGPT
======================================
*/

import { obtenerHimnos } from "../js/storage.js";
import { navegar } from "../js/router.js";

export async function mostrarHimnos() {

    const app = document.getElementById("app");

    const himnos = await obtenerHimnos();

    let lista = "";

    himnos.forEach(himno => {

        lista += `

        <article class="card himno-item" data-id="${himno.id}">

            <div class="card-icon">

                ${himno.numero}

            </div>

            <div class="card-content">

                <h2>${himno.titulo}</h2>

                <p>${himno.tema}</p>

            </div>

            <div class="card-arrow">

                >

            </div>

        </article>

        `;

    });

    app.innerHTML = `

        <div class="home-page">

            <header class="hero">

                <div class="hero-logo">

                    HC

                </div>

                <h1 class="hero-title">

                    Todos los Himnos

                </h1>

            </header>

            <section class="cards">

                ${lista}

            </section>

        </div>

    `;

    document
        .querySelectorAll(".himno-item")
        .forEach(card => {

            card.addEventListener("click", () => {

                navegar("himno", Number(card.dataset.id));

            });

        });

}

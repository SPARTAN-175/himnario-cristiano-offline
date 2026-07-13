/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : favorites.js
Versión  : v0.2.0
Build    : 005
Autor    : Carlos & ChatGPT
======================================
*/

import { obtenerHimnos, obtenerFavoritos } from "../js/storage.js";
import { navegar } from "../js/router.js";

export async function mostrarFavoritos() {

    const app = document.getElementById("app");

    const himnos = await obtenerHimnos();

    const favoritos = obtenerFavoritos();

    const lista = himnos.filter(h => favoritos.includes(h.id));

    let html = "";

    if (lista.length === 0) {

        html = `
            <div class="card">
                <div class="card-content">
                    <h2>No tienes favoritos</h2>
                    <p>Marca un himno con la estrella para verlo aquí.</p>
                </div>
            </div>
        `;

    } else {

        lista.forEach(himno => {

            html += `

            <article class="card favorito-item" data-id="${himno.id}">

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

    }

    app.innerHTML = `

    <div class="home-page">

        <header class="hero">

            <button id="btnInicio" class="back-button">

                ← Inicio

            </button>

            <div class="hero-logo">

                HC

            </div>

            <h1 class="hero-title">

                Favoritos

            </h1>

        </header>

        <section class="cards">

            ${html}

        </section>

    </div>

    `;

    document
        .getElementById("btnInicio")
        .onclick = () => navegar("inicio");

    document
        .querySelectorAll(".favorito-item")
        .forEach(item => {

            item.onclick = () => {

                navegar("himno", Number(item.dataset.id));

            };

        });

}

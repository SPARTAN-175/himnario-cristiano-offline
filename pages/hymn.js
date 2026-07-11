/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymn.js
Versión  : v0.2.0
Build    : 004
Autor    : Carlos & ChatGPT
======================================
*/

import {
    obtenerHimno,
    esFavorito,
    cambiarFavorito
} from "../js/storage.js";

import { navegar } from "../js/router.js";

export async function mostrarHimno(id){

    const app = document.getElementById("app");

    const himno = await obtenerHimno(id);

    const favorito = esFavorito(id);

    const letra = himno.letra
        .map(linea => `<p>${linea}</p>`)
        .join("");

    app.innerHTML = `

    <div class="home-page">

        <header class="hero">

            <button id="btnVolver">

                ← Regresar

            </button>

            <div class="hero-logo">

                HC

            </div>

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

        <section class="cards">

            <button
                id="btnFavorito"
                class="card">

                ${favorito ? "💛 Quitar de Favoritos" : "🤍 Agregar a Favoritos"}

            </button>

        </section>

    </div>

    `;

    document
        .getElementById("btnVolver")
        .onclick = () => navegar("himnos");

    document
        .getElementById("btnFavorito")
        .onclick = () => {

            cambiarFavorito(id);

            mostrarHimno(id);

        };

}

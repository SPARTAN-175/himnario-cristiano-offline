/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymns.js
Versión  : v0.1.0
Build    : 024
Autor    : Carlos & ChatGPT
======================================
*/

import { obtenerHimnos } from "../js/storage.js";
import { navegar } from "../js/router.js";

export async function mostrarHimnos() {

    const app = document.getElementById("app");

    const himnos = await obtenerHimnos();

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

        <section class="search-section">

            <div class="search-box">

                <span class="search-icon">🔍</span>

                <input
                    id="buscarHimno"
                    type="text"
                    placeholder="Buscar por número o título..."
                >

            </div>

        </section>

        <section
            class="cards"
            id="listaHimnos">

        </section>

    </div>

    `;

    const lista = document.getElementById("listaHimnos");

    function renderizar(filtro = "") {

        lista.innerHTML = "";

        const texto = filtro.toLowerCase();

        const resultados = himnos.filter(himno => {

            return (

                himno.numero.toString().includes(texto)

                ||

                himno.titulo.toLowerCase().includes(texto)

            );

        });

        resultados.forEach(himno => {

            lista.innerHTML += `

            <article
                class="card himno-item"
                data-id="${himno.id}">

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

        document
            .querySelectorAll(".himno-item")
            .forEach(card => {

                card.onclick = () => {

                    navegar("himno", Number(card.dataset.id));

                };

            });

    }

    renderizar();

    document
        .getElementById("buscarHimno")
        .addEventListener("input", e => {

            renderizar(e.target.value);

        });

}

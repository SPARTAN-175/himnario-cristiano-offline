/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymns.js
Versión  : v0.2.0
Build    : 002
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

            <button id="btnInicio" class="back-button">

                ← Inicio

            </button>

            <div class="hero-logo">
                HC
            </div>

            <h1 class="hero-title">

                Todos los Himnos

            </h1>

            <p class="hero-subtitle">

                ${himnos.length} himnos disponibles

            </p>

        </header>

        <section class="search-section">

            <div class="search-box">

                <input
                    id="txtBuscar"
                    type="text"
                    placeholder="Buscar por número o título..."
                >

            </div>

        </section>

        <section
            id="listaHimnos"
            class="cards">

        </section>

    </div>

    `;

    const lista = document.getElementById("listaHimnos");

    function pintarLista(texto = "") {

        lista.innerHTML = "";

        const filtro = texto.toLowerCase();

        const resultado = himnos.filter(h => {

            return h.numero.toString().includes(filtro)

            ||

            h.titulo.toLowerCase().includes(filtro);

        });

        resultado.forEach(himno => {

            lista.innerHTML += `

                <article
                    class="card item-himno"
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
            .querySelectorAll(".item-himno")
            .forEach(item => {

                item.onclick = () => {

                    navegar("himno", Number(item.dataset.id));

                };

            });

    }

    pintarLista();

    document
        .getElementById("txtBuscar")
        .addEventListener("input", e => {

            pintarLista(e.target.value);

        });

    document
        .getElementById("btnInicio")
        .onclick = () => {

            navegar("inicio");

        };

}

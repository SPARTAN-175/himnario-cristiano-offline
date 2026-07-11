/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : hymn.js
Versión  : v0.2.0
Build    : 003
Autor    : Carlos & ChatGPT
======================================
*/

import { obtenerHimno } from "../js/storage.js";
import { navegar } from "../js/router.js";

export async function mostrarHimno(id){

    const app=document.getElementById("app");

    const himno=await obtenerHimno(id);

    let letra="";

    himno.letra.forEach(linea=>{

        letra+=`<p>${linea}</p>`;

    });

    app.innerHTML=`

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

                ⭐ Agregar a Favoritos

            </button>

        </section>

    </div>

    `;

    document
        .getElementById("btnVolver")
        .onclick=()=>{

            navegar("himnos");

        };

    document
        .getElementById("btnFavorito")
        .onclick=()=>{

            alert("Próximamente podrás guardar este himno en favoritos.");

        };

}

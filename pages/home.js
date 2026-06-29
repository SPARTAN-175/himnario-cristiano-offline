/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : home.js
Versión  : v0.1.0
Build    : 005
Autor    : Carlos & ChatGPT
======================================
*/

export function mostrarInicio() {

    const app = document.getElementById("app");

    app.innerHTML = `
    
        <main class="home">

            <h1>📖 Himnario Cristiano</h1>

            <p>Versión 0.1.0</p>

            <button>Buscar Himno</button>

            <button>Todos los Himnos</button>

            <button>Favoritos</button>

            <button>Configuración</button>

        </main>

    `;

}

// Fin del archivo home.js

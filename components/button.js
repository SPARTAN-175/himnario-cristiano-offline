/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : button.js
Versión  : v0.1.0
Build    : 008
Autor    : Carlos & ChatGPT
======================================
*/

export function crearBoton(texto, id = "") {

    return `
        <button class="app-button" id="${id}">
            ${texto}
        </button>
    `;

}

// Fin del archivo button.js

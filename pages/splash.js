/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : splash.js
Versión  : v0.3.0
Build    : 007
Autor    : Carlos & ChatGPT
======================================
*/

import { navegar } from "../js/router.js";

export function mostrarSplash(){

    const app=document.getElementById("app");

    app.innerHTML=`

    <main class="splash">

        <img

            src="assets/icons/icon-192.png"

            class="logo"

        >

        <h1>

            Himnario Cristiano

        </h1>

        <p>

            Offline

        </p>

        <small>

            Versión 0.3.0 Alpha

        </small>

    </main>

    `;

    setTimeout(()=>{

        navegar("inicio");

    },1800);

}

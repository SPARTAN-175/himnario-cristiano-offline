/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : home.js
Versión  : v0.1.0
Build    : 014
Autor    : Carlos & ChatGPT
======================================
*/

export function mostrarInicio() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="home-page">

        <!-- ========================= -->
        <!-- HERO -->
        <!-- ========================= -->

        <header class="hero">

            <div class="hero-logo">
                HC
            </div>

            <h1 class="hero-title">
                Himnario Cristiano
            </h1>

            <p class="hero-subtitle">
                Todo lo que respira alabe a Jehová
            </p>

        </header>

        <!-- ========================= -->
        <!-- BUSCADOR -->
        <!-- ========================= -->

        <section class="search-section">

            <div class="search-box">

                <span class="search-icon">🔍</span>

                <input
                    type="text"
                    placeholder="Buscar un himno..."
                >

            </div>

        </section>

        <!-- ========================= -->
        <!-- ACCESOS -->
        <!-- ========================= -->

        <section class="cards">

            <article class="card">

                <div class="card-icon">
                    📖
                </div>

                <div class="card-content">

                    <h2>Todos los Himnos</h2>

                    <p>
                        Explora todo el himnario.
                    </p>

                </div>

                <div class="card-arrow">
                    ›
                </div>

            </article>

            <article class="card">

                <div class="card-icon">
                    ⭐
                </div>

                <div class="card-content">

                    <h2>Favoritos</h2>

                    <p>
                        Tus himnos guardados.
                    </p>

                </div>

                <div class="card-arrow">
                    ›
                </div>

            </article>

            <article class="card">

                <div class="card-icon">
                    🕘
                </div>

                <div class="card-content">

                    <h2>Recientes</h2>

                    <p>
                        Continúa donde te quedaste.
                    </p>

                </div>

                <div class="card-arrow">
                    ›
                </div>

            </article>

            <article class="card">

                <div class="card-icon">
                    ⚙
                </div>

                <div class="card-content">

                    <h2>Ajustes</h2>

                    <p>
                        Personaliza la aplicación.
                    </p>

                </div>

                <div class="card-arrow">
                    ›
                </div>

            </article>

        </section>

        <!-- ========================= -->
        <!-- NAVEGACIÓN -->
        <!-- ========================= -->

        <nav class="bottom-nav">

            <button class="nav-item active">

                🏠

                <span>Inicio</span>

            </button>

            <button class="nav-item">

                📚

                <span>Himnos</span>

            </button>

            <button class="nav-item">

                ⭐

                <span>Favoritos</span>

            </button>

            <button class="nav-item">

                ⚙

                <span>Ajustes</span>

            </button>

        </nav>

    </div>

    `;

}

// Fin del archivo

/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : home.js
Versión  : v0.1.0
Build    : 012
Autor    : Carlos & ChatGPT
======================================
*/

export function mostrarInicio() {

    const app = document.getElementById("app");

    app.innerHTML = `

    <div class="home-page">

        <!-- ========================= -->
        <!-- HEADER                    -->
        <!-- ========================= -->

        <header class="hero">

            <div class="hero-logo">

                📖

            </div>

            <h1>

                Himnario Cristiano

            </h1>

            <p>

                "Todo lo que respira alabe a Jehová"

            </p>

        </header>


        <!-- ========================= -->
        <!-- BUSCADOR                  -->
        <!-- ========================= -->

        <section class="search-box">

            <input
                type="text"
                placeholder="Buscar un himno..."
            >

        </section>


        <!-- ========================= -->
        <!-- ACCESOS RÁPIDOS           -->
        <!-- ========================= -->

        <section class="quick-actions">

            <button>

                📚

                <span>

                    Todos los Himnos

                </span>

            </button>


            <button>

                ⭐

                <span>

                    Favoritos

                </span>

            </button>


            <button>

                🕘

                <span>

                    Recientes

                </span>

            </button>


            <button>

                ⚙

                <span>

                    Ajustes

                </span>

            </button>

        </section>


        <!-- ========================= -->
        <!-- FOOTER                    -->
        <!-- ========================= -->

        <footer>

            Versión 0.1.0

        </footer>

    </div>

    `;

}

// Fin del archivo

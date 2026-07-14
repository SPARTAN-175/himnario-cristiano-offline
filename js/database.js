/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : database.js
Versión  : v0.3.0
Build    : 012
Autor    : Carlos & ChatGPT
======================================
*/

const DB_NAME = "HimnarioCristianoDB";
const DB_VERSION = 1;

let db = null;

export function abrirBaseDatos() {

    return new Promise((resolve, reject) => {

        if (db) {

            resolve(db);
            return;

        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {

            reject("No fue posible abrir la base de datos.");

        };

        request.onsuccess = () => {

            db = request.result;

            resolve(db);

        };

        request.onupgradeneeded = (event) => {

            db = event.target.result;

            if (!db.objectStoreNames.contains("himnos")) {

                db.createObjectStore("himnos", {
                    keyPath: "id"
                });

            }

            if (!db.objectStoreNames.contains("favoritos")) {

                db.createObjectStore("favoritos", {
                    keyPath: "id"
                });

            }

            if (!db.objectStoreNames.contains("configuracion")) {

                db.createObjectStore("configuracion", {
                    keyPath: "clave"
                });

            }

            if (!db.objectStoreNames.contains("recientes")) {

                db.createObjectStore("recientes", {
                    keyPath: "id"
                });

            }

        };

    });

}

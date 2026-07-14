/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : importer.js
Versión  : v0.3.0
Build    : 018
Autor    : Carlos & ChatGPT
======================================
*/

export function leerArchivo(file){

    return new Promise((resolve,reject)=>{

        const reader=new FileReader();

        reader.onload=()=>{

            try{

                const datos=JSON.parse(reader.result);

                resolve(datos);

            }catch(e){

                reject("Archivo inválido.");

            }

        };

        reader.onerror=()=>{

            reject("No fue posible leer el archivo.");

        };

        reader.readAsText(file);

    });

}

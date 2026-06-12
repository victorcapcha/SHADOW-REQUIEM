// CONFIGURACIÓN CENTRALIZADA DE ENLACES DE SHADOW REQUIEM
const ENLACES_GUILD = {
    discord: "https://discord.gg",
    whatsapp: "https://whatsapp.com",
    facebook: "https://facebook.com"
};

document.addEventListener("DOMContentLoaded", () => {
    // Inyectar enlaces sociales automáticos en las páginas
    document.querySelectorAll('a[href="TU_LINK_DE_DISCORD"]').forEach(el => el.href = ENLACES_GUILD.discord);
    document.querySelectorAll('a[href="TU_LINK_DE_WHATSAPP"]').forEach(el => el.href = ENLACES_GUILD.whatsapp);
    document.querySelectorAll('a[href="TU_LINK_DE_FACEBOOK"]').forEach(el => el.href = ENLACES_GUILD.facebook);

    // ELEMENTOS DEL MOTOR EPGP
    const btnImportar = document.getElementById("btn-importar");
    const jsonInput = document.getElementById("json-input");
    const tablaCuerpo = document.getElementById("tabla-cuerpo-epgp");

    // Función independiente para procesar y dibujar los datos en la tabla
    function procesarYDibujarTabla(datosRoster) {
        if (!tablaCuerpo) return;

        // Formatear y calcular la prioridad (PR = EP / GP) de cada raider
        let listaJugadores = datosRoster.map(raider => {
            const nombre = raider[0];
            const claseOriginal = raider[1] || "Guerrero";
            const ep = parseInt(raider[2]);
            const gp = parseInt(raider[3]);
            const pr = gp > 0 ? (ep / gp).toFixed(2) : (ep / 1).toFixed(2);

            // Normalizar el nombre de la clase para enlazarlo con tu CSS
            let claseCss = claseOriginal.toLowerCase().replace(/ /g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (claseCss === "guerrero") claseCss = "warrior";
            if (claseCss === "picaros" || claseCss === "picaro") claseCss = "picaro";

            return { nombre, claseOriginal, claseCss, ep, gp, pr: parseFloat(pr) };
        });

        // Ordenar la lista de mayor a menor Prioridad (PR)
        listaJugadores.sort((a, b) => b.pr - a.pr);

        // Limpiar la tabla antes de inyectar las filas reales
        tablaCuerpo.innerHTML = "";

        // Dibujar cada fila en el HTML
        listaJugadores.forEach(j => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="nombre-raider">${j.nombre}</td>
                <td><span class="clase-tag ${j.claseCss}">${j.claseOriginal}</span></td>
                <td>${j.ep}</td>
                <td>${j.gp}</td>
                <td class="${j.pr >= 2.0 ? 'prioridad-alta' : 'prioridad-baja'}">${j.pr.toFixed(2)}</td>
            `;
            tablaCuerpo.appendChild(fila);
        });
    }

    // [PASO AUTOMÁTICO AL CARGAR LA PÁGINA]
    // Comprobar si ya existen puntos guardados en la memoria del navegador
    const datosGuardados = localStorage.getItem("shadow_requiem_epgp");
    if (datosGuardados) {
        const datosParseados = JSON.parse(datosGuardados);
        procesarYDibujarTabla(datosParseados);
    }

    // LÓGICA DEL BOTÓN AL PEGAR UN NUEVO JSON
    if (btnImportar && jsonInput) {
        btnImportar.addEventListener("click", () => {
            try {
                const data = JSON.parse(jsonInput.value);
                
                if (!data.roster || !Array.isArray(data.roster)) {
                    throw new Error("El formato del JSON no contiene un roster válido.");
                }

                // Guardar los datos de forma permanente en la memoria local
                localStorage.setItem("shadow_requiem_epgp", JSON.stringify(data.roster));

                // Dibujar la tabla inmediatamente
                procesarYDibujarTabla(data.roster);

                alert("¡Tabla de EPGP guardada permanentemente con éxito!");
                jsonInput.value = ""; // Limpiar el cuadro de texto para prolijidad

            } catch (error) {
                alert("Error al procesar el código del Addon. Asegúrate de copiar el JSON completo y correcto.");
                console.error(error);
            }
        });
    }
});
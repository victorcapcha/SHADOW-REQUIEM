// CONFIGURACIÓN CENTRALIZADA DE ENLACES DE SHADOW REQUIEM
const ENLACES_GUILD = {
    discord: "https://discord.gg", // <-- Coloca tu invitación real aquí cuando la tengas
    whatsapp: "https://whatsapp.com",
    facebook: "https://facebook.com"
};

document.addEventListener("DOMContentLoaded", () => {
    // Inyectar enlaces sociales de forma segura en las páginas
    document.querySelectorAll('a[href="TU_LINK_DE_DISCORD"]').forEach(el => el.href = ENLACES_GUILD.discord);
    document.querySelectorAll('a[href="TU_LINK_DE_WHATSAPP"]').forEach(el => el.href = ENLACES_GUILD.whatsapp);
    document.querySelectorAll('a[href="TU_LINK_DE_FACEBOOK"]').forEach(el => el.href = ENLACES_GUILD.facebook);

    // LÓGICA PARA ABRIR Y CERRAR EL MENÚ HAMBURGUESA
    const btnHamburguesa = document.getElementById("btn-hamburguesa");
    const menuEnlaces = document.getElementById("menu-enlaces");

    if (btnHamburguesa && menuEnlaces) {
        btnHamburguesa.addEventListener("click", (e) => {
            e.stopPropagation(); // Evita interferencias con otros clics
            menuEnlaces.classList.toggle("mostrar");
        });

        // Truco extra: Si el menú está abierto y el usuario hace clic afuera, se cierra solo
        document.addEventListener("click", (e) => {
            if (!menuEnlaces.contains(e.target) && !btnHamburguesa.contains(e.target)) {
                menuEnlaces.classList.remove("mostrar");
            }
        });
    }

    // LÓGICA DEL MOTOR IMPORTADOR DE EPGP PURO (Se ejecuta solo en la página epgp.html)
    const btnImportar = document.getElementById("btn-importar");
    const jsonInput = document.getElementById("json-input");
    const tablaCuerpo = document.getElementById("tabla-cuerpo-epgp");

    function procesarYDibujarTabla(datosRoster) {
        if (!tablaCuerpo) return;
        let listaJugadores = datosRoster.map(raider => {
            const nombre = raider[0];
            const claseOriginal = raider[1] || "Guerrero";
            const ep = parseInt(raider[2]);
            const gp = parseInt(raider[3]);
            const pr = gp > 0 ? (ep / gp).toFixed(2) : (ep / 1).toFixed(2);

            let claseCss = claseOriginal.toLowerCase().replace(/ /g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (claseCss === "guerrero") claseCss = "warrior";
            if (claseCss === "picaros" || claseCss === "picaro") claseCss = "picaro";

            return { nombre, claseOriginal, claseCss, ep, gp, pr: parseFloat(pr) };
        });

        listaJugadores.sort((a, b) => b.pr - a.pr);
        tablaCuerpo.innerHTML = "";

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

    // Auto-cargar tabla si hay datos guardados previamente
    const datosGuardados = localStorage.getItem("shadow_requiem_epgp");
    if (datosGuardados && tablaCuerpo) {
        procesarYDibujarTabla(JSON.parse(datosGuardados));
    }

    if (btnImportar && jsonInput) {
        btnImportar.addEventListener("click", () => {
            try {
                const data = JSON.parse(jsonInput.value);
                if (!data.roster || !Array.isArray(data.roster)) throw new Error();
                localStorage.setItem("shadow_requiem_epgp", JSON.stringify(data.roster));
                procesarYDibujarTabla(data.roster);
                alert("¡Tabla de EPGP guardada permanentemente con éxito!");
                jsonInput.value = "";
            } catch (error) {
                alert("Error al procesar el código del Addon. Asegúrate de copiar el JSON completo y correcto.");
            }
        });
    }
});
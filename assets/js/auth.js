// IMPORTAR LIBRERÍAS OFICIALES DE GOOGLE FIREBASE desde internet
import { initializeApp } from "https://gstatic.com";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://gstatic.com";

// 🔑 CONFIGURACIÓN CON TUS LLAVES REALES DE FIREBASE
// REEMPLAZA este objeto por el bloque exacto que guardaste en tu bloc de notas
const firebaseConfig = {
  apiKey: "AIzaSyBFwMA3B2NrXaMzuwmzmIZ7k6U4neB7prw",
  authDomain: "shadow-requiem-wow.firebaseapp.com",
  projectId: "shadow-requiem-wow",
  storageBucket: "shadow-requiem-wow.firebasestorage.app",
  messagingSenderId: "939051403261",
  appId: "1:939051403261:web:c833497afadbdd9a4dfb94"
};

// Inicializar la conexión
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// CORREO DEL ADMINISTRADOR GENERAL (Coloca tu correo aquí)
const CORREO_ADMIN = "galdoss19@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const btnHamburguesa = document.getElementById("btn-hamburguesa");
    const menuEnlaces = document.getElementById("menu-enlaces");

    // 1. CONTROL DE SEGURIDAD EN TIEMPO REAL
    onAuthStateChanged(auth, (user) => {
        const paginaActual = window.location.pathname.split("/").pop();

        if (user) {
            // Si el usuario está logueado e intenta entrar a login.html, mándalo al inicio
            if (paginaActual === "login.html" || paginaActual === "") {
                window.location.href = "index.html";
            }

            // AGREGAR BOTÓN DE LOGOUT AUTOMÁTICAMENTE EN EL MENÚ SI EXISTE
            if (menuEnlaces && !document.getElementById("btn-logout")) {
                const logoutLink = document.createElement("a");
                logoutLink.href = "#";
                logoutLink.id = "btn-logout";
                logoutLink.textContent = "Salir";
                logoutLink.style.color = "#ef4444"; // Color rojo para el botón salir
                logoutLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    signOut(auth);
                });
                menuEnlaces.appendChild(logoutLink);
            }

            // GESTIÓN DEL ROL DE ADMINISTRADOR (Para el panel de EPGP)
            const panelAdmin = document.getElementById("panel-administrador");
            if (panelAdmin) {
                if (user.email === CORREO_ADMIN) {
                    panelAdmin.style.display = "block"; // Eres el admin: el panel se muestra solo para ti
                } else {
                    panelAdmin.style.display = "none";  // Eres un raider normal: el panel se destruye
                }
            }

        } else {
            // Si el usuario NO está logueado y no está en login.html, expulsarlo inmediatamente
            if (paginaActual !== "login.html") {
                window.location.href = "login.html";
            }
        }
    });

    // 2. PROCESAR EL INICIO DE SESIÓN
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    alert("Error de acceso: Credenciales inválidas o usuario no registrado.");
                    console.error(error);
                });
        });
    }
});
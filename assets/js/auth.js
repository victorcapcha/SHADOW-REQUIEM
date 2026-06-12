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

    // 1. ESCUDO DE SEGURIDAD ABSOLUTO EN TIEMPO REAL
    onAuthStateChanged(auth, (user) => {
        // Detecta el nombre de la página de forma inteligente sin importar el servidor
        const rutaCompleta = window.location.pathname;
        const esPaginaLogin = rutaCompleta.includes("login.html");

        if (user) {
            // Si el usuario ya inició sesión e intenta ir al login, lo mandamos al Inicio
            if (esPaginaLogin) {
                window.location.href = "index.html";
            }

            // INYECTAR BOTÓN DE SALIR (LOGOUT)
            if (menuEnlaces && !document.getElementById("btn-logout")) {
                const logoutLink = document.createElement("a");
                logoutLink.href = "#";
                logoutLink.id = "btn-logout";
                logoutLink.textContent = "Salir";
                logoutLink.style.color = "#ef4444"; 
                logoutLink.style.fontWeight = "bold";
                logoutLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    signOut(auth);
                });
                menuEnlaces.appendChild(logoutLink);
            }

            // COMPROBACIÓN DE ROL DE ADMINISTRADOR
            const panelAdmin = document.getElementById("panel-administrador");
            if (panelAdmin) {
                // Compara en minúsculas para evitar errores de tipeo
                if (user.email.toLowerCase() === CORREO_ADMIN.toLowerCase()) {
                    panelAdmin.style.style.setProperty("display", "block", "important"); // Fuerza la vista al admin
                } else {
                    panelAdmin.remove(); // Si es un raider común, destruye el panel por completo para que no exista en su pantalla
                }
            }

        } else {
            // SI NO ESTÁ LOGUEADO: Lo expulsamos inmediatamente a menos que ya esté en el login
            if (!esPaginaLogin) {
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
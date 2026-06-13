// IMPORTACIÓN LOCAL SEGURA (ELIMINA ERRORES DE CORS AL 100%)
import { initializeApp } from "./firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "./firebase-auth.js";

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

       // 1. ESCUDO DE SEGURIDAD ABSOLUTO EN TIEMPO REAL (OPTIMIZADO PARA NETLIFY)
    onAuthStateChanged(auth, (user) => {
        const rutaCompleta = window.location.pathname.toLowerCase();
        
        // Detecta de forma inteligente si el usuario ya está parado en el login
        const esPaginaLogin = rutaCompleta.includes("login");

        if (user) {
            // Si ya inició sesión e intenta ir al login, lo mandamos al Inicio
            if (esPaginaLogin) {
                window.location.href = "index.html";
            }

            // INYECTAR BOTÓN DE SALIR (LOGOUT) EN EL MENÚ
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

            // GESTIÓN DEL PANEL DE ADMINISTRACIÓN
            const panelAdmin = document.getElementById("panel-administrador");
            if (panelAdmin) {
                if (user.email && user.email.toLowerCase() === CORREO_ADMIN.toLowerCase()) {
                    panelAdmin.style.display = "block"; // Eres tú: se muestra el cuadro
                } else {
                    panelAdmin.remove(); // Es un raider común: se destruye por completo el cuadro
                }
            }

        } else {
            // SI NO ESTÁ LOGUEADO: Lo expulsamos inmediatamente al login.html
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
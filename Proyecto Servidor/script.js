'use strict';

/* =========================================================
   URBAN STYLE - app.js
   ========================================================= */

/* =========================================================
   1. INICIO DE SESIÓN Y ENTORNO
   ========================================================= */

// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);

const usuario = params.get('usuario') || 'Invitado';
const rol = params.get('rol') || 'Cliente';

// Información del navegador
const idioma = navigator.language || 'es-ES';
const tieneConexion = navigator.onLine;

// Identificador único y seguro para la sesión
const idSesion = crypto.randomUUID();

// Fecha actual en formato extendido español
const fechaActual = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'medium'
}).format(new Date());


/* =========================================================
   2. SANITIZACIÓN DEL PERFIL
   ========================================================= */
// Correo recibido mediante URL
const correoOriginal = params.get('correo') || '';

// Limpiar espacios y convertir a minúsculas
const correo = correoOriginal.trim().toLowerCase();

// Separar usuario y dominio
const posicionArroba = correo.indexOf('@');
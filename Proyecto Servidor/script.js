'use strict';

/* 
   1.2 INICIO DE SESIÓN Y ENTORNO
*/

// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);

const usuario = params.get('usuario') || 'Invitado';
const rol = params.get('rol') || 'Cliente';

// Información del navegador
const idioma = navigator.language || 'es-ES';
const onLine = navigator.onLine;

// Identificador unico y seguro para la sesion
const idSesion = crypto.randomUUID();

// Fecha actual en formato extendido español
const fechaActual = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'full',
    timeStyle: 'medium'
}).format(new Date());


/* 
   1.3 SANITIZACIÓN DEL PERFIL
*/
// Correo recibido mediante URL
const correoOriginal = params.get('correo') || '';

// Limpia espacio y lo convierte a minusculas
const correo = correoOriginal.trim().toLowerCase();

// Separar usuario y dominio
const posicionArroba = correo.indexOf('@');
const nombreCorreo = posicionArroba != -1 ? correo.slice(0, posicionArroba) : correo;
const dominio = posicionArroba != -1 ? correo.slice(posicionArroba + 1) : '';

//el id tiene que estar simpre con 6 digitos
const idCliente 
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
const idClienteOriginal = params.get('id') || 7;
const idCliente = String(idClienteOriginal).padStart(6, '0');
 
 
/*
    1.4 ASIGNACIONES POR DEFECTO
*/
let apodo = params.get('apodo') || '';
let membresia = params.get('membresia');
let prendasRegalo = params.has('regalo') ? Number(params.get('regalo')) : null;
 
// || porque un texto vacío ("") también cuenta como "sin apodo"
apodo = apodo || 'Cliente VIP';
 
// ??= solo asigna si el valor es null o undefined
membresia ??= 'Básica';
 
// Con ??= un 0 real NO se sobreescribe
prendasRegalo ??= 2;
 

document.getElementById('info-sesion').textContent =
    `Usuario: ${usuario} | Rol: ${rol} | Idioma: ${idioma} | ` +
    `Online: ${onLine ? 'Sí' : 'No'} | Sesión: ${idSesion} | ${fechaActual}`;
 
document.getElementById('info-perfil').textContent =
    `Cliente nº ${idCliente} | ${apodo} | ${nombreCorreo}@${dominio} | ` +
    `Membresía: ${membresia} | Prendas de regalo: ${prendasRegalo}`;
 
 
/*
    2. CATÁLOGO Y OPERACIONES FINANCIERAS
*/
const precioChaqueta = '59.90€';   
const precioCamiseta = '19.99€';   
const cuponTexto = '10';           
const IVA = 0.21;
let numeroPedido = 1000;
 
//  aqui ignora el símbolo €
const subtotal = parseFloat(precioChaqueta) + parseFloat(precioCamiseta);
 
// Formato de moneda en euros para España
const formatoEuro = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
});
 
const desglose = document.getElementById('desglose-carrito');
 
// 2.2 Validar el subtotal antes de operar
if (Number.isFinite(subtotal)) {
    const descuento = parseFloat(cuponTexto) || 0;
    const baseImponible = subtotal - descuento;
    const iva = baseImponible * IVA;
    const total = baseImponible + iva;
    numeroPedido++;
 
    const lineas = [
        'Subtotal: ' + formatoEuro.format(subtotal),
        'Descuento: ' + formatoEuro.format(descuento),
        'IVA (21%): ' + formatoEuro.format(iva),
        'Total a Pagar: ' + formatoEuro.format(total),
        'Pedido nº ' + numeroPedido
    ];
 
    for (const linea of lineas) {
        const p = document.createElement('p');
        p.textContent = linea;
        desglose.appendChild(p);
    }
} else {
    desglose.textContent = 'Error: el subtotal no es un número válido.';
}
 
 
/*
    3. OFERTA RELÁMPAGO
*/
let ofertaActiva = false;   // control para evitar temporizadores duplicados
 
const botonOferta = document.getElementById('btn-oferta');
const contador = document.getElementById('contador-oferta');
const mensajeOferta = document.getElementById('mensaje-oferta');
 
botonOferta.addEventListener('click', function () {
    // Si ya está en marcha, ignoramos los clics
    if (ofertaActiva) return;
    ofertaActiva = true;
 
    let segundos = 15;
    contador.textContent = segundos;
    mensajeOferta.textContent = '¡Oferta Relámpago activa!';
 
    const temporizador = setInterval(function () {
        segundos--;
        contador.textContent = segundos;
 
        // 3.3 Al llegar a 0: parar, resetear el control y avisar
        if (segundos <= 0) {
            clearInterval(temporizador);
            ofertaActiva = false;
            mensajeOferta.textContent = 'La oferta ha expirado.';
        }
    }, 1000);
});
 
 
/*
    4. RESEÑAS, SEGURIDAD Y PERSISTENCIA
*/
let resenas = [];
 
// 4.3 Leer del almacenamiento (protegido con try/catch)
try {
    resenas = JSON.parse(localStorage.getItem('resenas')) || [];
} catch (error) {
    console.error('Error al leer las reseñas:', error);
    resenas = [];
}
 
// 4.4 Pintar reseñas con textContent (el HTML/scripts se ven como texto plano)
function mostrarResenas() {
    const lista = document.getElementById('lista-resenas');
    lista.textContent = '';
 
    for (const r of resenas) {
        const li = document.createElement('li');
        li.textContent = `${r.usuario} (${r.hora}): ${r.comentario}`;
        lista.appendChild(li);
    }
}
 
// 4.1 y 4.2 Enviar una reseña nueva
document.getElementById('form-resena').addEventListener('submit', function (evento) {
    evento.preventDefault();
 
    const campo = document.getElementById('texto-resena');
    const comentario = campo.value.trim();
    if (comentario === '') return;
 
    resenas.push({
        id: Date.now(),
        usuario: usuario,
        hora: new Date().toLocaleTimeString('es-ES'),
        comentario: comentario
    });
 
    // Guardar (protegido con try/catch)
    try {
        localStorage.setItem('resenas', JSON.stringify(resenas));
    } catch (error) {
        console.error('Error al guardar las reseñas:', error);
    }
 
    mostrarResenas();
    campo.value = '';
});
 
mostrarResenas();
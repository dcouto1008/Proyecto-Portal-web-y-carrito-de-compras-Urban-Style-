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
 
// si es falso le pone Cliente VIP
apodo = apodo || 'Cliente VIP';
 
// si es null o indefinido pone Basica
membresia ??= 'Basica';
 
//solo reemplaza si es null o indefinido
prendasRegalo ??= 2;
 
//aqui busca elementos html y con .textContent introduce informacion
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
if (Number.isFinite(subtotal)) {//calcula el total del pedido 
    const descuento = parseFloat(cuponTexto) || 0;
    const baseImponible = subtotal - descuento;
    const iva = baseImponible * IVA;
    const total = baseImponible + iva;
    numeroPedido++;
    // creo las lineas que van a salir
    const lineas = [
        'Subtotal: ' + formatoEuro.format(subtotal),
        'Descuento: ' + formatoEuro.format(descuento),
        'IVA (21%): ' + formatoEuro.format(iva),
        'Total a Pagar: ' + formatoEuro.format(total),
        'Pedido nº ' + numeroPedido
    ];
    //creo <p> para el desglose para cada linea
    for (const linea of lineas) {
        const p = document.createElement('p');
        p.textContent = linea;
        desglose.appendChild(p);
    }
} else {
    desglose.textContent = 'Error: el subtotal no es un número valido.';
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
    //hace la cuenta atras
    let segundos = 15;
    contador.textContent = segundos;
    mensajeOferta.textContent = '¡Oferta Relámpago activa!';
 
    const temporizador = setInterval(function () {
        segundos--;//van bajando lo segundos de 1 en 1
        contador.textContent = segundos;
 
        //cuando llega a 0: para, resetea el control y avisa
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
let resenas = [];//creamos un array para poner las reseñas 
try {
    resenas = JSON.parse(localStorage.getItem('resenas')) || [];
} catch (error) {
    console.error('Error al leer las reseñas:', error);
    resenas = [];
}
 
function mostrarResenas() {
    const lista = document.getElementById('lista-resenas');
    lista.textContent = '';//muestra las reseñas
 
    for (const r of resenas) {//para cada reseña crea un <li> 
        const li = document.createElement('li');
        li.textContent = `${r.usuario} (${r.hora}): ${r.comentario}`;//introduce los datos
        lista.appendChild(li);//lo añade
    }
}
 
// 4.1 y 4.2 Enviar una reseña nueva
document.getElementById('form-resena').addEventListener('submit', function (evento) {
    evento.preventDefault();//añade un sumit y esto hace que evita recargar la pagina
    const campo = document.getElementById('texto-resena');
    const comentario = campo.value.trim();
    if (comentario === '') return;//comprueba que no esta vacio y si lo esta termina la funcion  
    resenas.push({ //añade al arrray reseñas con fecha, usuario, identificador y comentario
        id: Date.now(),
        usuario: usuario,
        hora: new Date().toLocaleTimeString('es-ES'),
        comentario: comentario
    });
 
    try {//convierte el array de reseñas a JSON y lo guarda en localStorage, lo hago con el try para los errores
        localStorage.setItem('resenas', JSON.stringify(resenas));
    } catch (error) {
        console.error('Error al guardar las reseñas:', error);
    }
 
    mostrarResenas();
    campo.value = '';
});
 
mostrarResenas();//muestra las reseñas
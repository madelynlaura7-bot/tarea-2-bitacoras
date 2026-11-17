/* ===== Referencias al DOM ===== */
const liveContainer = document.getElementById('liveContainer');
const videoArea     = document.getElementById('videoArea');
const offers        = document.getElementById('offers');
const chatInput     = document.getElementById('chatInput');
const logOutput     = document.getElementById('logOutput');
const likeCount     = document.getElementById('likeCount');
const cartCount     = document.getElementById('cartCount');

const variantSelect = document.getElementById('variantSelect');
const orderForm     = document.getElementById('orderForm');
const userTikTok    = document.getElementById('userTikTok');
const logDia2       = document.getElementById('logDia2');

let likes = 0;
let carrito = 0;
let contadorOfertas = 3;

/* ===== Función genérica de bitácora ===== */
// Usa textContent (no innerHTML) para que lo escrito por el usuario no inyecte HTML.
function escribirLog(contenedor, tipo, mensaje) {
  const hora = new Date().toLocaleTimeString();
  const item = document.createElement('div');
  item.textContent = `[${hora}] ${tipo}: ${mensaje}`;
  contenedor.prepend(item);
}
const logEvent = (tipo, msg) => escribirLog(logOutput, tipo, msg);
const addLog   = (tipo, msg) => escribirLog(logDia2, tipo, msg);

/* ===== DÍA 1 ===== */

// Corazón flotante al enviar un like
function enviarLike(x, y) {
  likes++;
  likeCount.textContent = `❤️ ${likes}`;
  const heart = document.createElement('span');
  heart.className = 'heart-float';
  heart.textContent = '❤️';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  videoArea.appendChild(heart);
  heart.addEventListener('animationend', () => heart.remove());
}

// 1. Delegación de eventos (click) en el contenedor del stream
liveContainer.addEventListener('click', (e) => {
  const boton = e.target.closest('button');
  if (!boton) return;

  if (boton.dataset.prod) {
    carrito++;
    cartCount.textContent = carrito;
    logEvent('OFERTA_CLICK', `Producto seleccionado: ${boton.dataset.prod}`);
  } else if (boton.dataset.action === 'like') {
    const r = videoArea.getBoundingClientRect();
    enviarLike(r.width / 2, r.height / 2);
    logEvent('LIKE_STREAM', '¡El usuario envió un ❤️ al Live!');
  } else if (boton.dataset.action === 'nueva-oferta') {
    inyectarOferta();
  }
});

// 2. Doble clic sobre el video = enviar corazones
videoArea.addEventListener('dblclick', (e) => {
  const r = videoArea.getBoundingClientRect();
  enviarLike(e.clientX - r.left, e.clientY - r.top);
  logEvent('DBLCLICK_LIKE', `Doble clic: corazón #${likes} enviado al Live`);
});

// 3. Punto extra: oferta inyectada al DOM. Funciona sin agregar listeners nuevos.
function inyectarOferta() {
  contadorOfertas++;
  const nombre = `Oferta relámpago #${contadorOfertas}`;
  const card = document.createElement('article');
  card.className = 'offer';
  card.innerHTML = `
    <h3>${nombre}</h3>
    <p class="price">${20 + contadorOfertas} BOB</p>
    <button class="btn-oferta" data-prod="${nombre}">Comprar oferta</button>`;
  offers.appendChild(card);
  logEvent('OFERTA_NUEVA', `Se inyectó al DOM: ${nombre} (sin nuevos listeners)`);
}

// 4. Teclado: keyup en el chat
chatInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && e.target.value.trim() !== '') {
    logEvent('CHAT_ENVIADO', `Mensaje enviado: "${e.target.value.trim()}"`);
    e.target.value = '';
  } else if (e.key !== 'Enter') {
    logEvent('CHAT_INPUT', `Tecleando mensaje: "${e.target.value}"`);
  }
});

/* ===== DÍA 2 ===== */

// 1. change en el select de variantes
variantSelect.addEventListener('change', (e) => {
  addLog('CAMBIO_VARIANTE', `El cliente seleccionó: ${e.target.value}`);
});

// 2. submit del formulario de compra
orderForm.addEventListener('submit', (e) => {
  e.preventDefault(); // evita recargar la página
  const variante = variantSelect.value;
  const usuario = userTikTok.value.trim();
  if (usuario === '') {
    addLog('ERROR', 'Escribe tu usuario de TikTok');
    return;
  }
  addLog('COMPRA_EXITOSA', `Pedido confirmado para ${usuario} (${variante}) 🎉`);
  orderForm.reset();
});

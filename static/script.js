// Ejemplos por idioma
const ejemplos = {
  es: ["Hola", "Gracias", "¿Dónde está el baño?"],
  en: ["Hello", "Thank you", "Where is the bathroom?"],
  fr: ["Bonjour", "Merci", "Où sont les toilettes ?"],
  de: ["Hallo", "Danke", "Wo ist die Toilette?"]
};

// Elementos
const textoOrigen = document.getElementById('textoOrigen');
const textoDestino = document.getElementById('textoDestino');
const counterOrigen = document.getElementById('counterOrigen');
const langSource = document.getElementById('langSource');
const langDest = document.getElementById('langDest');

// Contador de caracteres
textoOrigen.addEventListener('input', () => {
  counterOrigen.textContent = `${textoOrigen.value.length}/500`;
  textoOrigen.classList.add('typing');
  setTimeout(() => textoOrigen.classList.remove('typing'), 200);
});

// Swap idiomas
document.getElementById('swapBtn').addEventListener('click', () => {
  const tempLang = langSource.value;
  langSource.value = langDest.value;
  langDest.value = tempLang;

  const tempText = textoOrigen.value;
  textoOrigen.value = textoDestino.value;
  textoDestino.value = tempText;

  counterOrigen.textContent = `${textoOrigen.value.length}/500`;

  // Animación al intercambiar
  textoOrigen.classList.add('swap');
  textoDestino.classList.add('swap');
  setTimeout(() => {
    textoOrigen.classList.remove('swap');
    textoDestino.classList.remove('swap');
  }, 300);
});

// Modo oscuro
document.getElementById('toggleTheme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Cambiar placeholder según idioma
langSource.addEventListener('change', () => {
  const lang = langSource.value;
  const placeholder = ejemplos[lang] ? ejemplos[lang][0] : "Escribe aquí...";
  textoOrigen.placeholder = placeholder;
});

// Traducir
document.getElementById('translateBtn').addEventListener('click', async () => {
  let texto = textoOrigen.value;
  const destino = langDest.value;
  const origen = langSource.value;

  // Si está vacío, usar frase de ejemplo
  if (!texto) {
    texto = ejemplos[origen] ? ejemplos[origen][0] : "Hello";
    textoOrigen.value = texto;
    counterOrigen.textContent = `${texto.length}/500`;
  }

  // Feedback animado
  textoDestino.classList.add('loading');
  textoDestino.value = '';
  
  try {
    const res = await fetch('/api/traducir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto, destino })
    });
    const data = await res.json();
    textoDestino.value = data.texto_traducido;
    textoDestino.classList.remove('loading');
    textoDestino.classList.add('translated');
    setTimeout(() => textoDestino.classList.remove('translated'), 400);

    // Guardar en historial
    const li = document.createElement('li');
    li.textContent = `${texto} → ${data.texto_traducido}`;
    document.getElementById('historyList').prepend(li);

  } catch (err) {
    console.error(err);
    textoDestino.value = "Error al traducir. Intenta nuevamente.";
    textoDestino.classList.remove('loading');
  }
});

// Borrar
document.getElementById('clearBtn').addEventListener('click', () => {
  textoOrigen.value = '';
  textoDestino.value = '';
  counterOrigen.textContent = '0/500';
});

// Copiar traducción
document.getElementById('copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(textoDestino.value);
});

// Escuchar audio
document.getElementById('ttsBtn').addEventListener('click', () => {
  if (!textoDestino.value) return;
  const utterance = new SpeechSynthesisUtterance(textoDestino.value);
  speechSynthesis.speak(utterance);
});

// Sugerencias rápidas
document.querySelectorAll('.suggestion').forEach(btn => {
  btn.addEventListener('click', () => {
    textoOrigen.value = btn.textContent;
    counterOrigen.textContent = `${textoOrigen.value.length}/500`;
    document.getElementById('translateBtn').click();
  });
});

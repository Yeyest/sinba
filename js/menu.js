// MENÚ RESPONSIVO
// Escritorio: menú horizontal con el desplegable "Resolver".
// Celular (600 px o menos): botón "Menú" que abre una lista vertical.
// Si este archivo no carga, el menú sigue visible y usable (no se oculta nada).

function iniciarMenu() {
  // PASO 1. DOM: localizar los elementos del HTML usando sus identificadores.
  const botonMenu = document.querySelector('#boton-menu');
  const navegacion = document.querySelector('#navegacion');
  const textoMenu = document.querySelector('#texto-menu');
  const submenu = document.querySelector('#resolver');

  // Si falta alguna pieza en la página, salimos sin romper nada.
  if (!botonMenu || !navegacion || !textoMenu || !submenu) return;

  // PASO 2. Usar exactamente el mismo límite que la media query del CSS.
  const pantallaMovil = window.matchMedia('(max-width: 600px)');

  // El botón nace oculto en el HTML; lo mostramos porque el JS sí cargó.
  // El CSS se encarga de que solo se vea en celular.
  botonMenu.hidden = false;

  // PASO 3. Una función concentra los cambios para abrir o cerrar el menú.
  function cambiarMenu(abrir) {
    // En escritorio, la navegación siempre está visible.
    navegacion.hidden = pantallaMovil.matches && !abrir;
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
    textoMenu.textContent = abrir ? 'Cerrar' : 'Menú';

    // Si cerramos el menú principal, cerramos también Resolver.
    if (!abrir) {
      submenu.open = false;
    }
  }

  function menuMovilAbierto() {
    return pantallaMovil.matches && !navegacion.hidden;
  }

  // Quita "index.html" para que "/web_site/" y "/web_site/index.html" cuenten igual.
  function rutaLimpia(ruta) {
    return ruta.replace(/index\.html$/, '');
  }

  // PASO 4. Evento clic: invertir el estado del botón.
  // Un button nativo también produce clic al usar Enter o barra espaciadora.
  botonMenu.addEventListener('click', function () {
    const estaAbierto = botonMenu.getAttribute('aria-expanded') === 'true';
    cambiarMenu(!estaAbierto);
  });

  // PASO 5. Cerrar el menú al seleccionar cualquiera de sus enlaces.
  navegacion.addEventListener('click', function (evento) {
    const enlace = evento.target.closest('a');
    if (!enlace) return;

    cambiarMenu(false);

    // Si el enlace apunta a una sección de ESTA misma página (index.html#nosotros
    // estando en index.html), llevamos el foco al destino para el teclado.
    const url = new URL(enlace.href);
    const mismaPagina = rutaLimpia(url.pathname) === rutaLimpia(location.pathname);
    if (!mismaPagina || !url.hash) return;

    const destino = document.querySelector(url.hash);
    if (destino) {
      // Una sección solo recibe foco si tiene tabindex="-1".
      if (!destino.hasAttribute('tabindex')) destino.setAttribute('tabindex', '-1');
      destino.focus({ preventScroll: true });
    }
  });

  // PASO 6. Clic o toque fuera del menú: cerrar lo que esté abierto.
  document.addEventListener('click', function (evento) {
    const dentroDeNavegacion = navegacion.contains(evento.target);
    const enBoton = botonMenu.contains(evento.target);

    if (submenu.open && !submenu.contains(evento.target)) {
      submenu.open = false;
    }
    if (menuMovilAbierto() && !dentroDeNavegacion && !enBoton) {
      cambiarMenu(false);
    }
  });

  // PASO 7. Escape cierra el desplegable o el menú móvil y devuelve el foco.
  document.addEventListener('keydown', function (evento) {
    if (evento.key !== 'Escape') return;

    if (submenu.open) {
      // Primero se cierra el desplegable Resolver.
      submenu.open = false;
      submenu.querySelector('summary').focus();
    } else if (menuMovilAbierto()) {
      cambiarMenu(false);
      botonMenu.focus();
    }
  });

  // PASO 8. Si el foco sale del desplegable con Tab, se cierra solo.
  // relatedTarget es el elemento que recibe el foco; si es null (clic con mouse
  // en Safari, por ejemplo) no cerramos aquí: de eso se ocupa el PASO 6.
  submenu.addEventListener('focusout', function (evento) {
    if (evento.relatedTarget && !submenu.contains(evento.relatedTarget)) {
      submenu.open = false;
    }
  });

  // PASO 9. Evitar estados incorrectos al pasar de celular a escritorio (y al revés).
  function ajustarPantalla() {
    const focoEstabaEnNavegacion = navegacion.contains(document.activeElement);
    const focoEstabaEnBoton = document.activeElement === botonMenu;
    cambiarMenu(false);

    if (pantallaMovil.matches && focoEstabaEnNavegacion) {
      botonMenu.focus();
    } else if (!pantallaMovil.matches && focoEstabaEnBoton) {
      navegacion.querySelector('a').focus();
    }
  }
  pantallaMovil.addEventListener('change', ajustarPantalla);

  // PASO 10. Estado inicial: cerrado en celular y visible en escritorio.
  ajustarPantalla();
}

iniciarMenu();

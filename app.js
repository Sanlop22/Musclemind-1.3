explorer .js// MuscleMind - script principal

document.addEventListener('DOMContentLoaded', () => {
  animateProgressBars();
  setupButtonActions();
});

// Anima las barras de progreso desde 0 hasta su valor final
function animateProgressBars() {
  let bars = document.querySelectorAll('.progress-bar-fill');

  bars.forEach((bar) => {
    let targetWidth = bar.style.width;
    bar.style.width = '0%';

    // Pequeño retraso para permitir la transición CSS
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 200);
  });
}

// Maneja los clics de los botones principales (placeholder)
function setupButtonActions() {
  let loginBtn = document.querySelector('.hero-actions .btn-primary');
  let registerBtn = document.querySelector('.hero-actions .btn-outline');
  let navCta = document.querySelector('.nav-cta');
  let ctaFinalBtn = document.querySelector('.cta-final .btn-primary');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      console.log('Iniciar sesión: aquí se redirigiría al formulario de login');
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      console.log('Crear cuenta: aquí se redirigiría al formulario de registro');
    });
  }

  if (navCta) {
    navCta.addEventListener('click', () => {
      console.log('Empezar ahora: aquí se redirigiría al registro/login');
    });
  }

  if (ctaFinalBtn) {
    ctaFinalBtn.addEventListener('click', () => {
      console.log('Crear cuenta gratis: aquí se redirigiría al registro');
    });
  }
}
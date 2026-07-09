// index.js

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const appContainer = document.getElementById('app-container');
  const stepCards = document.querySelectorAll('.step-card');
  const helpBtn = document.getElementById('help-btn');

  // Handle Let's Get Started button click with premium page transition
  if (startBtn && appContainer) {
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const href = startBtn.getAttribute('href');
      
      // Add fade-out transition class
      appContainer.classList.remove('fade-in');
      appContainer.classList.add('fade-out');
      
      // Navigate after transition completes
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  }

  // Interactivity for step cards
  stepCards.forEach((card, index) => {
    // Add slide-in visual entrance sequence
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 150 * (index + 1));

    // Active/click feedback
    card.addEventListener('click', () => {
      // Create ripple effect
      createRipple(event, card);
      
      // Accentuate card temporary selection
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 100);
    });
  });

  // Help button placeholder notification
  if (helpBtn) {
    helpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('OpsAgent Help Center:\n\nFor assistance during onboarding, please contact support@opsagent.ai or call +1-800-OPS-AI-SUPPORT.');
    });
  }

  // Ripple effect creator helper
  function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.background = 'rgba(79, 70, 229, 0.08)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = `${x - 50}px`;
    ripple.style.top = `${y - 50}px`;
    ripple.style.transform = 'scale(0)';
    ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    ripple.style.opacity = '1';

    element.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(2.5)';
      ripple.style.opacity = '0';
    });

    setTimeout(() => {
      ripple.remove();
    }, 500);
  }
});

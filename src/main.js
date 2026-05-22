import './index.css';

/**
 * Elio Portfolio - Main Script (Pure Vanilla JavaScript)
 * Strictly zero TypeScript/React dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStatsCounter();
  initToolboxFilters();
  initCostCalculator();
  initBlogModal();
  initContactForm();
  initThemeDetails();
});

// Update current UTC time and details dynamically
function initThemeDetails() {
  const timeSpan = document.getElementById('utc-time');
  if (timeSpan) {
    const updateTime = () => {
      const now = new Date();
      timeSpan.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
}

// 1. Scroll-reveal Animations using Intersection Observer
function initScrollAnimations() {
  const observers = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observers.unobserve(entry.target); // animated once
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    observers.observe(el);
  });
}

// 2. Stats count-up animation on scroll
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.counter-val');
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out function
      const easeValue = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeValue * target);
      
      el.textContent = `+${current}`;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `+${target}`;
      }
    };
    
    requestAnimationFrame(update);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsElements.forEach((el) => obs.observe(el));
}

// 3. Simple filter for ToolBox cards
function initToolboxFilters() {
  const buttons = document.querySelectorAll('.toolbox-filter-btn');
  const cards = document.querySelectorAll('.toolbox-card');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category') || 'all';

      // Toggle buttons
      buttons.forEach((b) => b.classList.remove('active', 'bg-neutral-900', 'text-white'));
      buttons.forEach((b) => b.classList.add('bg-neutral-100', 'text-neutral-700'));
      btn.classList.add('active', 'bg-neutral-900', 'text-white');
      btn.classList.remove('bg-neutral-100', 'text-neutral-700');

      // Filter cards with animations
      cards.forEach((card) => {
        const itemCategory = card.getAttribute('data-category') || '';
        if (category === 'all' || itemCategory === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.transform = 'scale(0.95)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

// 4. Interactive Services Cost Calculator
function initCostCalculator() {
  const checkBoxes = document.querySelectorAll('.calc-option');
  const totalDisplay = document.getElementById('calc-total');
  const durationDisplay = document.getElementById('calc-duration');
  
  const calculate = () => {
    let total = 0;
    let weeks = 0;
    let selectedCount = 0;

    checkBoxes.forEach((cb) => {
      if (cb.checked) {
        total += parseInt(cb.getAttribute('data-price') || '0', 10);
        weeks += parseFloat(cb.getAttribute('data-time') || '0');
        selectedCount++;
      }
    });

    // Discount if multiple services are bundled
    if (selectedCount >= 3) {
      total = Math.round(total * 0.9); // 10% bundle discount
    }

    if (totalDisplay) {
      totalDisplay.textContent = total > 0 ? `$${total.toLocaleString()}` : '$0';
    }
    if (durationDisplay) {
      // Dynamic duration formatting
      if (weeks === 0) {
        durationDisplay.textContent = '0 weeks';
      } else {
        const roundedWeeks = Math.max(1, Math.round(weeks * 10) / 10);
        durationDisplay.textContent = `~ ${roundedWeeks} ${roundedWeeks === 1 ? 'week' : 'weeks'}` + (selectedCount >= 3 ? ' (Bundled)' : '');
      }
    }
  };

  checkBoxes.forEach((cb) => {
    cb.addEventListener('change', calculate);
  });

  // Run initial setup
  calculate();
}

// 5. Read Blog Post Modal Overlay
function initBlogModal() {
  const blogCards = document.querySelectorAll('.blog-article-card');
  const modal = document.getElementById('blog-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalContent = document.getElementById('modal-text');
  const closeModalBtn = document.getElementById('close-modal');

  // Blog content datasets for seamless viewing without separate pages
  const blogDatabase = {
    '1': {
      title: 'The Anti-Trends of Web Design',
      date: 'May 15, 2026',
      text: `
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">In a world obsessed with shiny glassmorphism, dynamic animations, and over-the-top styling solutions, sometimes the loudest voice is the quietest one.</p>
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">Monochrome and heavy negative space web design isn't just an aesthetic whim; it is a tactical stance. By striping away unnecessary gradients and distracting visual widgets, we bring the user’s absolute eye focus back to content hierarchy and intentional typography.</p>
        <blockquote class="my-6 border-l-4 border-black pl-4 italic text-neutral-800 font-serif">
          "Simplicity is not the absence of clutter, but the presence of clarity." — J. Ive
        </blockquote>
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">When you limit your interface to stark blacks, cool grays, elegant typography, and carefully positioned lines, every visual action becomes high-impact. A single subtle red indicator or standard arrow is instantly parsed by the brain as absolute priority.</p>
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">Let us embrace anti-trends. Let us design spaces that breathe, websites that load instantly, and user experiences that treat attention as a sacred, finite resource.</p>
      `
    },
    '2': {
      title: 'Slaying with Contrast: Monochromatic Palettes',
      date: 'April 28, 2026',
      text: `
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">Many designers shy away from monochromic designs, fearing they look sterile. However, when done with attention to visual density and micro-interactions, black-and-white layouts feel highly luxurious and tactile.</p>
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">The secret lies in the <strong>rhythm of spacing and typography pairing</strong>. Combine a high-contrast sans-serif font for structure with a subtle monospaced secondary line for system data and technical metadata. This creates a technical-meets-artisan feel that commands authority.</p>
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">Furthermore, subtle hover animations (like filling a border, fading a background from pure white to ivory gray, or smoothly sliding an arrow) maintain the interactive warmth of the site. Contrast is not just color; it is the interplay of mass and hollow, scale and stillness.</p>
      `
    },
    '3': {
      title: 'My Webflow Workflow: 200+ Projects Later',
      date: 'March 12, 2026',
      text: `
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">Building 200+ design projects has taught me that code and design must be co-developed. You cannot design in a complete vacuum without respecting the responsive boundaries of CSS box model.</p>
        <p class="mb-4 text-neutral-700 leading-relaxed text-lg">Here is a brief outline of the workflow that keeps my quality pristine and timelines reliable:</p>
        <ol class="list-decimal pl-6 mb-4 space-y-2 text-neutral-700 text-lg">
          <li><strong>Typography First:</strong> Set the global rem bases, line heights, and margins. Ensure absolute fluid scale.</li>
          <li><strong>Component Isolation:</strong> Treat headers, bento boxes, calculators, and modals as completely independent units.</li>
          <li><strong>The 8px Grid Rule:</strong> All paddings and margins are strictly multiples of 8. This guarantees alignment and psychological rhythm.</li>
          <li><strong>Micro-Transitions:</strong> Never let hover changes happen instantly. Apply a cubic-bezier transition of 300ms on scaling, colors, and shadows.</li>
        </ol>
        <p class="text-neutral-700 leading-relaxed text-lg">By designing with native-standard classes, migrating ideas into clean responsive containers becomes a fluid, natural conversation rather than a fight against code frameworks.</p>
      `
    }
  };

  blogCards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id') || '1';
      const data = blogDatabase[id];
      if (data && modal && modalTitle && modalDate && modalContent) {
        modalTitle.textContent = data.title;
        modalDate.textContent = data.date;
        modalContent.innerHTML = data.text;
        
        // Show modal with animation
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
        setTimeout(() => {
          modal.classList.remove('opacity-0');
          const inner = modal.querySelector('.modal-box');
          if (inner) inner.classList.remove('scale-95', 'translate-y-4');
        }, 10);
      }
    });
  });

  const closeModal = () => {
    if (modal) {
      modal.classList.add('opacity-0');
      const inner = modal.querySelector('.modal-box');
      if (inner) inner.classList.add('scale-95', 'translate-y-4');
      setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = ''; // restore scroll
      }, 300);
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Handle escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// 6. Interactive Contact Form with visual Toast feedback
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast-success');
  const toastMessage = document.getElementById('toast-message');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple visual check
      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      if (!nameInput || !emailInput) return;
      
      const nameVal = nameInput.value;
      const emailVal = emailInput.value;
      if (!nameVal || !emailVal) return;

      // Simulate sending
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        TRANSMITTING...
      `;

      setTimeout(() => {
        // Success state
        if (toast && toastMessage) {
          toastMessage.textContent = `Wizard connection requested is sent! Thank you, ${nameVal}.`;
          toast.classList.remove('hidden');
          setTimeout(() => {
            toast.classList.remove('translate-y-12', 'opacity-0');
          }, 10);

          // Hide toast after 5 seconds
          setTimeout(() => {
            toast.classList.add('translate-y-12', 'opacity-0');
            setTimeout(() => {
              toast.classList.add('hidden');
            }, 300);
          }, 5000);
        }

        // Reset form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });
  }
}

/**
 * CASA GREENS — BOTANICAL ATELIER
 * Master Client-Side Application Controller
 * Vanilla JavaScript (ES6+)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCinematicHero();
  initBeforeAfterSlider();
  initPortfolioFilter();
  initServiceCardLinks();
  initConsultationForm();
  initScrollReveal();
  initCopyrightYear();
});

/* ==========================================================================
   1. Navigation & Header Controller
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  if (!header) return;

  // Header scroll appearance
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      menuToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('open');
        mainNav.classList.remove('open');
        menuToggle.focus();
      }
    });
  }

  // Active section indicator via IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }
}

/* ==========================================================================
   2. Section 1: Cinematic Hero (Scroll-driven Lerp Interpolation)
   ========================================================================== */
function initCinematicHero() {
  const heroSection = document.getElementById('hero');
  const heroVideo = document.getElementById('heroVideo');
  const progressBar = document.getElementById('heroScrollProgress');
  const phaseLabel = document.getElementById('heroPhaseLabel');

  // Fallback visual layers
  const layerPlanters = document.getElementById('layerPlanters');
  const layerBranches = document.getElementById('layerBranches');
  const layerGreenery = document.getElementById('layerGreenery');

  if (!heroSection) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const limitedDevice = Boolean((connection && connection.saveData) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2));
  heroSection.classList.toggle('hero-low-motion', limitedDevice);

  let targetProgress = 0;
  let currentProgress = 0;
  let isVideoReady = false;
  let rafId = null;
  let lastPhase = null;

  const phases = [
    { threshold: 0.00, num: '01', title: 'Empty Luxury Interior' },
    { threshold: 0.18, num: '02', title: 'Decorative Planters Enter' },
    { threshold: 0.36, num: '03', title: 'Artificial Greenery Assembles' },
    { threshold: 0.54, num: '04', title: 'Vertical Garden Emerges' },
    { threshold: 0.72, num: '05', title: 'Indoor Garden Transformation' },
    { threshold: 0.90, num: '06', title: 'Casa Greens Reveal' }
  ];

  function calculateScrollProgress() {
    const totalScrollable = heroSection.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return 0;
    return Math.max(0, Math.min(1, -heroSection.getBoundingClientRect().top / totalScrollable));
  }

  function scheduleUpdate() {
    if (rafId === null && !document.hidden) {
      rafId = requestAnimationFrame(updateHeroTimeline);
    }
  }

  function updateHeroTimeline() {
    rafId = null;
    const staticScene = reducedMotion.matches;
    const difference = targetProgress - currentProgress;
    currentProgress = staticScene || limitedDevice || Math.abs(difference) < 0.001
      ? targetProgress : currentProgress + difference * 0.08;

    if (progressBar) progressBar.style.width = `${(currentProgress * 100).toFixed(1)}%`;
    const currentPhase = phases.slice().reverse().find(phase => currentProgress >= phase.threshold);
    if (phaseLabel && currentPhase !== lastPhase) {
      const numEl = phaseLabel.querySelector('.phase-number');
      const titleEl = phaseLabel.querySelector('.phase-title');
      if (numEl) numEl.textContent = currentPhase.num;
      if (titleEl) titleEl.textContent = currentPhase.title;
      lastPhase = currentPhase;
    }

    // Reduced motion keeps a complete, static garden without scrubbing media.
    const visualProgress = staticScene ? 1 : currentProgress;
    if (layerPlanters) layerPlanters.classList.toggle('phase-active', visualProgress >= 0.18);
    if (layerBranches) layerBranches.classList.toggle('phase-active', visualProgress >= 0.36);
    if (layerGreenery) layerGreenery.classList.toggle('phase-active', visualProgress >= 0.36);
    heroSection.classList.toggle('vertical-garden-active', visualProgress >= 0.54);

    // Seek only after valid metadata; seeked resumes updates if decoding was busy.
    if (!staticScene && isVideoReady && !heroVideo.seeking) {
      const targetTime = currentProgress * heroVideo.duration;
      if (Math.abs(heroVideo.currentTime - targetTime) > 0.04) {
        heroVideo.currentTime = targetTime;
      }
    }
    if (currentProgress !== targetProgress) scheduleUpdate();
  }

  function syncProgress() {
    targetProgress = calculateScrollProgress();
    scheduleUpdate();
  }

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    function syncVideoReadiness() {
      isVideoReady = heroVideo.readyState >= 1 &&
        Number.isFinite(heroVideo.duration) && heroVideo.duration > 0;
      // Keep the fallback visible until an actual decoded frame can be rendered.
      heroVideo.classList.toggle('video-ready', isVideoReady && heroVideo.readyState >= 2);
      scheduleUpdate();
    }
    heroVideo.addEventListener('loadedmetadata', syncVideoReadiness);
    heroVideo.addEventListener('loadeddata', syncVideoReadiness);
    // Preloaded media may already be ready before DOMContentLoaded initializes us.
    syncVideoReadiness();
    heroVideo.addEventListener('seeked', scheduleUpdate);
    heroVideo.addEventListener('error', () => {
      isVideoReady = false;
      heroVideo.classList.remove('video-ready');
    });
  }

  window.addEventListener('scroll', syncProgress, { passive: true });
  window.addEventListener('resize', syncProgress, { passive: true });
  reducedMotion.addEventListener('change', syncProgress);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden) syncProgress();
  });
  targetProgress = calculateScrollProgress();
  currentProgress = targetProgress;
  scheduleUpdate();
}

/* ==========================================================================
   3. Section 4: Before & After Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('comparisonSlider');
  const afterView = document.getElementById('comparisonAfterView');
  const handle = document.getElementById('comparisonHandle');

  if (!container || !afterView || !handle) return;

  let isDragging = false;
  let currentPercentage = 50;

  function setSliderPosition(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    currentPercentage = clamped;

    afterView.style.width = `${clamped}%`;
    handle.style.left = `${clamped}%`;
    handle.setAttribute('aria-valuenow', Math.round(clamped));
  }

  function handleMove(clientX) {
    const rect = container.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = (position / rect.width) * 100;
    setSliderPosition(percentage);
  }

  // Mouse interaction
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleMove(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) isDragging = false;
  });

  // Touch interaction
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (isDragging) isDragging = false;
  });

  // Keyboard accessibility on handle
  handle.addEventListener('keydown', (e) => {
    const step = 5;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPosition(currentPercentage - step);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPosition(currentPercentage + step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  });

  // Initialize at 50%
  setSliderPosition(50);
}

/* ==========================================================================
   4. Section 5: Portfolio Filtering
   ========================================================================== */
function initPortfolioFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active tab style
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('is-hidden');
          // Re-trigger visual reveal
          card.classList.add('is-revealed');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Service Card Links
   ========================================================================== */
function initServiceCardLinks() {
  const serviceLinks = document.querySelectorAll('[data-service-select]');
  const projectTypeSelect = document.getElementById('projectType');
  const contactSection = document.getElementById('contact');

  if (!serviceLinks.length || !projectTypeSelect) return;

  const mapping = {
    'Indoor Artificial Garden Design': 'Custom Sculptural Tree / Botanical Feature',
    'Artificial Vertical Gardens': 'Commercial & Retail Space',
    'Artificial Green Walls': 'Corporate Office & Headquarters',
    'Residential Green Interiors': 'Residential Home / Penthouse',
    'Corporate & Commercial Greenery': 'Corporate Office & Headquarters',
    'Customized Artificial Plant Installations': 'Custom Sculptural Tree / Botanical Feature'
  };

  serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const serviceName = link.getAttribute('data-service-select');
      const targetCategory = mapping[serviceName];

      if (targetCategory) {
        for (let i = 0; i < projectTypeSelect.options.length; i++) {
          if (projectTypeSelect.options[i].value === targetCategory) {
            projectTypeSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });
}

/* ==========================================================================
   6. Section 8: Consultation Form Validation & Intake
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  const statusEl = document.getElementById('formGlobalStatus');
  const confirmationDialog = document.getElementById('confirmationDialog');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalClientName = document.getElementById('modalClientName');
  const modalSummary = document.getElementById('modalSummary');

  if (!form) return;

  // Validation rules
  const validators = {
    fullName: (val) => {
      if (!val.trim()) return 'Please enter your full name.';
      if (val.trim().length < 2) return 'Full name must contain at least 2 characters.';
      return '';
    },
    phoneNumber: (val) => {
      if (!val.trim()) return 'Please enter your contact phone number.';
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
      if (!phoneRegex.test(val.trim())) return 'Please enter a valid phone number (e.g. +1 555-234-5678).';
      return '';
    },
    emailAddress: (val) => {
      if (!val.trim()) return 'Please enter your email address.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) return 'Please provide a valid email address.';
      return '';
    },
    projectType: (val) => {
      if (!val) return 'Please choose a project classification category.';
      return '';
    },
    projectLocation: (val) => {
      if (!val.trim()) return 'Please specify your project location or city.';
      return '';
    },
    projectDescription: (val) => {
      if (!val.trim()) return 'Please provide a brief description of your project scope.';
      if (val.trim().length < 15) return 'Please provide at least 15 characters describing your space.';
      return '';
    }
  };

  // Real-time error clearance on input
  Object.keys(validators).forEach(fieldName => {
    const field = form.elements[fieldName];
    const errorEl = document.getElementById(`${fieldName}Error`);
    if (field && errorEl) {
      field.addEventListener('input', () => {
        field.classList.remove('field-invalid');
        errorEl.textContent = '';
      });
      field.addEventListener('blur', () => {
        const error = validators[fieldName](field.value);
        if (error) {
          field.classList.add('field-invalid');
          errorEl.textContent = error;
        }
      });
    }
  });

  function restoreSubmitButton() {
    if (submitBtn) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  function handleSubmissionError() {
    restoreSubmitButton();
    if (statusEl) {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Unable to complete your request. Please try again.';
    }
  }

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;
    let firstErrorField = null;

    Object.keys(validators).forEach(fieldName => {
      const field = form.elements[fieldName];
      const errorEl = document.getElementById(`${fieldName}Error`);
      const error = validators[fieldName](field ? field.value : '');

      if (error) {
        hasErrors = true;
        if (field) field.classList.add('field-invalid');
        if (errorEl) errorEl.textContent = error;
        if (!firstErrorField && field) firstErrorField = field;
      } else {
        if (field) field.classList.remove('field-invalid');
        if (errorEl) errorEl.textContent = '';
      }
    });

    if (hasErrors) {
      if (firstErrorField) firstErrorField.focus();
      if (statusEl) {
        statusEl.className = 'form-status error';
        statusEl.textContent = 'Please review the highlighted fields before submitting.';
      }
      return;
    }

    try {
      // Submission loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      if (statusEl) {
        statusEl.className = 'form-status';
        statusEl.textContent = 'Validating and queuing consultation request...';
      }

      // Capture values
      const submissionData = {
        name: form.elements['fullName'].value.trim(),
        phone: form.elements['phoneNumber'].value.trim(),
        email: form.elements['emailAddress'].value.trim(),
        type: form.elements['projectType'].value,
        location: form.elements['projectLocation'].value.trim(),
        description: form.elements['projectDescription'].value.trim(),
        timestamp: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
      };

      // Simulate reliable frontend response (600ms latency)
      setTimeout(() => {
        try {
          restoreSubmitButton();

          if (statusEl) {
            statusEl.className = 'form-status success';
            statusEl.textContent = 'Consultation request successfully processed.';
          }

          // Populate confirmation dialog
          if (modalClientName) {
            modalClientName.textContent = submissionData.name;
          }

          if (modalSummary) {
            modalSummary.innerHTML = `
              <div class="modal-summary-item">
                <span class="modal-summary-label">Project Type:</span>
                <span class="modal-summary-value">${escapeHtml(submissionData.type)}</span>
              </div>
              <div class="modal-summary-item">
                <span class="modal-summary-label">Location:</span>
                <span class="modal-summary-value">${escapeHtml(submissionData.location)}</span>
              </div>
              <div class="modal-summary-item">
                <span class="modal-summary-label">Contact:</span>
                <span class="modal-summary-value">${escapeHtml(submissionData.email)} • ${escapeHtml(submissionData.phone)}</span>
              </div>
            `;
          }

          // Show accessible dialog
          if (confirmationDialog && typeof confirmationDialog.showModal === 'function') {
            confirmationDialog.showModal();
          }

          // Reset form fields
          form.reset();
        } catch (error) {
          handleSubmissionError();
        } finally {
          restoreSubmitButton();
        }
      }, 600);
    } catch (error) {
      handleSubmissionError();
    }
  });

  // Modal close handlers
  if (confirmationDialog && modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      confirmationDialog.close();
      if (statusEl) statusEl.textContent = '';
    });

    confirmationDialog.addEventListener('click', (e) => {
      const rect = confirmationDialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        confirmationDialog.close();
        if (statusEl) statusEl.textContent = '';
      }
    });
  }
}

// Basic HTML sanitization for safe summary rendering
function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

/* ==========================================================================
   7. Scroll Reveal Controller (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const delay = target.getAttribute('data-delay');
        if (delay) {
          setTimeout(() => {
            target.classList.add('is-revealed');
          }, parseInt(delay, 10));
        } else {
          target.classList.add('is-revealed');
        }
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   8. Footer Auto Year
   ========================================================================== */
function initCopyrightYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

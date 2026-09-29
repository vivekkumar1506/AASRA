/**
 * Aasra Adoption Platform - Main Application Controller
 */

(function() {
  'use strict';

  function init() {
    setupThemeToggle();
    setupMobileNav();
    setupModals();
    setupCounselingForm();
    setupFAQAccordion();
    setupScrollSpy();
  }

  // ==========================================
  // 1. THEME TOGGLE
  // ==========================================
  function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem('aasra_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('aasra_theme', nextTheme);
      updateToggleIcon(nextTheme);
      showToast(`Switched to ${nextTheme === 'dark' ? 'Serene Twilight' : 'Warm Dawn'} theme`, 'info');
    });
  }

  function updateToggleIcon(theme) {
    const iconContainer = document.getElementById('theme-toggle-icon');
    if (!iconContainer) return;
    if (theme === 'dark') {
      // Sun icon
      iconContainer.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      // Moon icon
      iconContainer.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  }

  // ==========================================
  // 2. MOBILE NAVIGATION
  // ==========================================
  function setupMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close mobile menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 3. MODAL MANAGEMENT
  // ==========================================
  function setupModals() {
    const counselingModal = document.getElementById('counseling-modal');
    const careModal = document.getElementById('care-guide-modal');

    // Close modals on clicking overlay background
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          window.closeModals();
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeModals();
      }
    });

    window.closeModals = function() {
      document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('open');
      });
      document.body.style.overflow = '';
    };

    window.openCounselingModal = function(defaultTopic = '') {
      if (!counselingModal) return;
      const topicInput = document.getElementById('counseling-topic-input');
      if (topicInput && defaultTopic) {
        topicInput.value = defaultTopic;
      }
      counselingModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
  }

  // ==========================================
  // 4. COUNSELING FORM SUBMISSION
  // ==========================================
  function setupCounselingForm() {
    const form = document.getElementById('counseling-booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('counseling-name')?.value || 'Friend';
      const phone = document.getElementById('counseling-phone')?.value;
      const mode = document.getElementById('counseling-mode')?.value;

      if (!phone || phone.length < 10) {
        showToast('Please provide a valid 10-digit phone number.', 'warning');
        return;
      }

      window.closeModals();
      form.reset();

      showToast(`Thank you, ${name}! Your confidential counseling session (${mode}) has been booked. A verified counselor will call you within 24 hours.`, 'success');
    });
  }

  // ==========================================
  // 5. FAQ ACCORDION
  // ==========================================
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      if (header) {
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          faqItems.forEach(i => i.classList.remove('open'));
          if (!isOpen) {
            item.classList.add('open');
          }
        });
      }
    });
  }

  // ==========================================
  // 6. SCROLLSPY
  // ==========================================
  function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { passive: true });
  }

  // ==========================================
  // 7. TOAST NOTIFICATIONS
  // ==========================================
  window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'warning' ? 'toast-warning' : ''}`;
    
    let iconSvg = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-terracotta)" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;

    if (type === 'success') {
      iconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--eucalyptus-teal)" stroke-width="2.2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (type === 'warning') {
      iconSvg = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" stroke-width="2.2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-message">${message}</div>
    `;

    container.appendChild(toast);

    // Trigger animate-in
    setTimeout(() => toast.classList.add('show'), 10);

    // Dismiss after 4s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 4200);
  };

  document.addEventListener('DOMContentLoaded', init);
})();

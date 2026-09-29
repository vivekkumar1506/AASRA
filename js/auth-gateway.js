/**
 * Aasra Adoption Platform - Onboarding & Auth Gateway
 * Manages parent sign-in, guest exploration, profile badges, and cross-form pre-filling.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'aasra_user_session';

  function init() {
    setupAuthListeners();
    renderNavbarUser();
    checkInitialGateway();
  }

  // Get current user session
  window.getAasraUser = function () {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  // Save user session
  window.setAasraUser = function (userData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    renderNavbarUser();
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('aasraUserUpdated', { detail: userData }));
  };

  // Check if gateway should pop up on page load
  function checkInitialGateway() {
    const session = window.getAasraUser();
    // If not logged in and not explicitly skipped in this session
    if (!session) {
      setTimeout(() => {
        window.openAuthGateway();
      }, 450);
    }
  }

  // Open Auth Gateway Modal
  window.openAuthGateway = function () {
    const modal = document.getElementById('auth-gateway-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Auth Gateway Modal
  window.closeAuthGateway = function () {
    const modal = document.getElementById('auth-gateway-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  function setupAuthListeners() {
    const form = document.getElementById('auth-gateway-form');
    const skipBtn = document.getElementById('auth-skip-btn');
    const guestLink = document.getElementById('auth-guest-link');

    // Handle Sign In / Register Form Submission
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('auth-name')?.value.trim();
        const phone = document.getElementById('auth-phone')?.value.trim();
        const email = document.getElementById('auth-email')?.value.trim();
        const city = document.getElementById('auth-city')?.value.trim();
        const role = document.getElementById('auth-role')?.value || 'Prospective Adoptive Parent';

        if (!name) {
          window.showToast('Please enter your full name.', 'warning');
          return;
        }

        const user = {
          name: name,
          phone: phone || '',
          email: email || '',
          city: city || 'New Delhi',
          role: role,
          isGuest: false,
          loggedInAt: new Date().toISOString()
        };

        window.setAasraUser(user);
        window.closeAuthGateway();
        window.showToast(`Welcome to Aasra, ${name}! Your personalized adoption guidance session is active.`, 'success');
      });
    }

    // Handle "Skip & Browse as Guest"
    function handleSkip() {
      const guestUser = {
        name: 'Guest Parent',
        phone: '',
        email: '',
        city: 'All India',
        role: 'Guest Explorer',
        isGuest: true,
        loggedInAt: new Date().toISOString()
      };
      window.setAasraUser(guestUser);
      window.closeAuthGateway();
      window.showToast('Browsing as Guest. You have full access to eligibility tools, roadmaps, and agency directory.', 'info');
    }

    if (skipBtn) skipBtn.addEventListener('click', handleSkip);
    if (guestLink) guestLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleSkip();
    });

    // Close on overlay click if user clicked outside
    const modal = document.getElementById('auth-gateway-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          handleSkip();
        }
      });
    }
  }

  // Update Navbar User Status Button
  function renderNavbarUser() {
    const userContainer = document.getElementById('nav-user-container');
    if (!userContainer) return;

    const user = window.getAasraUser();

    if (!user || user.isGuest) {
      userContainer.innerHTML = `
        <button class="nav-user-btn nav-user-guest" onclick="window.openAuthGateway()" title="Sign in for personalized guidance & auto-saved applications">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Sign In / Profile</span>
        </button>
      `;
    } else {
      const firstName = user.name.split(' ')[0] || user.name;
      userContainer.innerHTML = `
        <div class="nav-user-dropdown-wrap">
          <button class="nav-user-btn nav-user-logged" id="nav-user-profile-btn" onclick="window.toggleUserMenu(event)">
            <span class="user-avatar-circle">${firstName.charAt(0).toUpperCase()}</span>
            <span class="user-display-name">${firstName}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="user-dropdown-menu" id="user-dropdown-menu">
            <div class="dropdown-header">
              <strong>${user.name}</strong>
              <small>${user.role}</small>
              <div class="dropdown-city">📍 ${user.city}</div>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item" onclick="window.openTrackerModal(); window.closeUserMenu();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="6" x2="12" y2="12"></line>
                <line x1="12" y1="12" x2="16" y2="14"></line>
              </svg>
              My Appointments & Applications
            </button>
            <button class="dropdown-item" onclick="window.openAuthGateway(); window.closeUserMenu();">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile Details
            </button>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item text-danger" onclick="window.logoutAasraUser()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Switch Account / Sign Out
            </button>
          </div>
        </div>
      `;
    }
  }

  window.toggleUserMenu = function (e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.toggle('show');
  };

  window.closeUserMenu = function () {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.remove('show');
  };

  window.logoutAasraUser = function () {
    localStorage.removeItem(STORAGE_KEY);
    window.closeUserMenu();
    renderNavbarUser();
    window.showToast('You have signed out. Browsing as Guest.', 'info');
  };

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const dropdownWrap = document.querySelector('.nav-user-dropdown-wrap');
    if (dropdownWrap && !dropdownWrap.contains(e.target)) {
      window.closeUserMenu();
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();

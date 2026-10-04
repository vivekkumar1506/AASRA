/**
 * Aasra Adoption Platform - Authentication & User Identification Gateway
 * Connects directly to FastAPI backend & Database via AasraAPI.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'aasra_user_session';

  window.getAasraUser = function () {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) { return null; }
  };

  window.setAasraUser = function (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    renderNavbarUser();
  };

  window.openAuthGateway = function () {
    var modal = document.getElementById('auth-gateway-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      var existing = window.getAasraUser();
      if (existing && !existing.isGuest) {
        var nameInput = document.getElementById('auth-name');
        var phoneInput = document.getElementById('auth-phone');
        var emailInput = document.getElementById('auth-email');
        var cityInput = document.getElementById('auth-city');
        var roleInput = document.getElementById('auth-role');
        if (nameInput) nameInput.value = existing.name || '';
        if (phoneInput) phoneInput.value = existing.phone || '';
        if (emailInput) emailInput.value = existing.email || '';
        if (cityInput) cityInput.value = existing.city || 'New Delhi';
        if (roleInput) roleInput.value = existing.role || 'Prospective Adoptive Parent';
      }
    }
  };

  window.closeAuthGateway = function () {
    var modal = document.getElementById('auth-gateway-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  function init() {
    renderNavbarUser();
    setupAuthListeners();
  }

  function setupAuthListeners() {
    var form = document.getElementById('auth-gateway-form');
    var skipBtn = document.getElementById('auth-skip-btn');
    var guestLink = document.getElementById('auth-guest-link');

    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        var submitBtn = document.getElementById('auth-submit-btn');
        var originalBtnText = submitBtn ? submitBtn.innerText : 'Confirm & Begin';
        if (submitBtn) { submitBtn.innerText = 'Connecting...'; submitBtn.disabled = true; }

        var name = (document.getElementById('auth-name') || {}).value ? document.getElementById('auth-name').value.trim() : '';
        var phone = (document.getElementById('auth-phone') || {}).value ? document.getElementById('auth-phone').value.trim() : '';
        var email = (document.getElementById('auth-email') || {}).value ? document.getElementById('auth-email').value.trim() : '';
        var city = (document.getElementById('auth-city') || {}).value ? document.getElementById('auth-city').value.trim() : '';
        var roleEl = document.getElementById('auth-role');
        var role = roleEl ? roleEl.value : 'Prospective Adoptive Parent';
        var passwordField = document.getElementById('auth-password');
        var password = passwordField ? passwordField.value : (phone || 'aasra123');

        if (!name || !email) {
          window.showToast('Please enter your full name and email.', 'warning');
          if (submitBtn) { submitBtn.innerText = originalBtnText; submitBtn.disabled = false; }
          return;
        }

        try {
          var user = null;

          if (window.AasraAPI) {
            var regRes = await window.AasraAPI.register({ name: name, email: email, phone: phone, city: city, role: role, password: password });

            if (regRes.ok && regRes.data && regRes.data.user) {
              var u = regRes.data.user;
              user = {
                id: u.id,
                name: u.name || u.full_name || name,
                phone: u.phone || phone,
                email: u.email || email,
                city: u.city || city || 'New Delhi',
                role: u.role || role,
                isGuest: false,
                loggedInAt: new Date().toISOString()
              };
              window.showToast('Welcome to Aasra, ' + (user.name.split(' ')[0]) + '! Account registered.', 'success');
            } else {
              var loginRes = await window.AasraAPI.login({ email: email, password: password });

              if (loginRes.ok && loginRes.data && loginRes.data.user) {
                var u2 = loginRes.data.user;
                user = {
                  id: u2.id,
                  name: u2.name || u2.full_name || name,
                  phone: u2.phone || phone,
                  email: u2.email || email,
                  city: u2.city || city || 'New Delhi',
                  role: u2.role || role,
                  isGuest: false,
                  loggedInAt: new Date().toISOString()
                };
                window.showToast('Welcome back, ' + (user.name.split(' ')[0]) + '! Session authenticated.', 'success');
              } else {
                var errDetail = (loginRes.data && loginRes.data.detail) || (regRes.data && regRes.data.detail) || 'Authentication failed. Please check credentials.';
                window.showToast(errDetail, 'warning');
              }
            }
          }

          if (!user) {
            user = {
              id: Date.now(),
              name: name,
              phone: phone || '',
              email: email,
              city: city || 'New Delhi',
              role: role,
              isGuest: false,
              loggedInAt: new Date().toISOString()
            };
            window.showToast('Welcome, ' + (user.name.split(' ')[0]) + '! Session active.', 'info');
          }

          window.setAasraUser(user);
          window.closeAuthGateway();
        } catch (error) {
          console.error('Auth error:', error);
          window.showToast('Server communication error. Stored locally.', 'warning');
          var fallbackUser = {
            id: Date.now(),
            name: name,
            phone: phone || '',
            email: email,
            city: city || 'New Delhi',
            role: role,
            isGuest: false,
            loggedInAt: new Date().toISOString()
          };
          window.setAasraUser(fallbackUser);
          window.closeAuthGateway();
        } finally {
          if (submitBtn) { submitBtn.innerText = originalBtnText; submitBtn.disabled = false; }
        }
      });
    }

    function handleSkip() {
      var guestUser = {
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
      window.showToast('Browsing as Guest. Full access to eligibility tools, roadmaps, and agency directory.', 'info');
    }

    if (skipBtn) skipBtn.addEventListener('click', handleSkip);
    if (guestLink) guestLink.addEventListener('click', function(e) { e.preventDefault(); handleSkip(); });

    var modal = document.getElementById('auth-gateway-modal');
    if (modal) {
      modal.addEventListener('click', function(e) { if (e.target === modal) { handleSkip(); } });
    }
  }

  function renderNavbarUser() {
    var userContainer = document.getElementById('nav-user-container');
    if (!userContainer) return;

    var user = window.getAasraUser();

    if (!user || user.isGuest) {
      userContainer.innerHTML =
        '<button class="nav-user-btn nav-user-guest" onclick="window.openAuthGateway()" title="Sign in for personalized guidance">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>' +
        '<circle cx="12" cy="7" r="4"></circle>' +
        '</svg>' +
        '<span>Sign In / Profile</span>' +
        '</button>';
    } else {
      var firstName = user.name.split(' ')[0] || user.name;
      var initials = user.name.split(' ').map(function(w){ return w[0]; }).join('').substring(0, 2).toUpperCase();
      userContainer.innerHTML =
        '<div class="nav-user-dropdown-wrap">' +
        '<button class="nav-user-btn nav-user-logged" id="nav-user-profile-btn" onclick="window.toggleUserMenu(event)">' +
        '<span class="user-avatar-circle">' + initials + '</span>' +
        '<span class="user-display-name">' + firstName + '</span>' +
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
        '</button>' +
        '<div class="user-dropdown-menu" id="user-dropdown-menu">' +
        '<div class="dropdown-header">' +
        '<strong>' + user.name + '</strong>' +
        '<small>' + (user.email || '') + '</small>' +
        '<div class="dropdown-city">&#128205; ' + (user.city || '') + '</div>' +
        '</div>' +
        '<div class="dropdown-divider"></div>' +
        '<button class="dropdown-item" onclick="window.openTrackerModal(); window.closeUserMenu();">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="12"></line><line x1="12" y1="12" x2="16" y2="14"></line></svg>' +
        ' My Appointments &amp; Applications' +
        '</button>' +
        '<button class="dropdown-item" onclick="window.openAuthGateway(); window.closeUserMenu();">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>' +
        ' Edit Profile Details' +
        '</button>' +
        '<div class="dropdown-divider"></div>' +
        '<button class="dropdown-item text-danger" onclick="window.logoutAasraUser()">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>' +
        ' Switch Account / Sign Out' +
        '</button>' +
        '</div>' +
        '</div>';
    }
  }

  window.toggleUserMenu = function (e) {
    if (e) e.stopPropagation();
    var menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.toggle('show');
  };

  window.closeUserMenu = function () {
    var menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.remove('show');
  };

  window.logoutAasraUser = function () {
    localStorage.removeItem(STORAGE_KEY);
    if (window.AasraAPI) window.AasraAPI.setToken(null);
    renderNavbarUser();
    window.closeUserMenu();
    window.showToast('You have been signed out. See you again!', 'info');
  };

  document.addEventListener('click', function(e) {
    var menu = document.getElementById('user-dropdown-menu');
    var btn = document.getElementById('nav-user-profile-btn');
    if (menu && menu.classList.contains('show') && !menu.contains(e.target) && e.target !== btn) {
      window.closeUserMenu();
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    init();
    var existing = window.getAasraUser();
    if (!existing) {
      setTimeout(function() { window.openAuthGateway(); }, 1800);
    }
  });
})();
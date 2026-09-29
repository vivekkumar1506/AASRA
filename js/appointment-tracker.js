/**
 * Aasra Adoption Platform - Agency Appointment Booking & Live Application Tracker
 * Manages appointment scheduling, Tracking ID generation, localStorage persistence,
 * and live 5-stage status tracking.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'aasra_applications';

  function init() {
    setupBookingModal();
    setupTrackerModal();
    setupSeedApplications(); // Provide realistic demo application if none exist
  }

  // Get all saved applications
  window.getSavedApplications = function () {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  // Save applications array
  function saveApplications(apps) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }

  // Add sample demo application on first run for instant testing
  function setupSeedApplications() {
    const existing = window.getSavedApplications();
    if (existing.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 3);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const demoApp = {
        trackingId: 'AASRA-DL-78241',
        agencyId: 'saa-delhi-palna',
        agencyName: 'Palna — Delhi Council for Child Welfare',
        agencyLocation: 'Civil Lines, Delhi',
        agencyPhone: '+91 11 2396 8907',
        agencyAddress: 'Qudsia Bagh, Shamnath Marg, Civil Lines, Delhi 110054',
        parentName: 'Priya & Rahul Sharma',
        coApplicantName: 'Rahul Sharma',
        phone: '9811234567',
        email: 'priya.sharma@example.com',
        city: 'New Delhi',
        maritalStatus: 'Married (>2 Years)',
        purpose: 'Initial Adoption Guidance & Eligibility Briefing',
        date: dateStr,
        timeSlot: 'Morning (10:30 AM – 12:30 PM)',
        notes: 'Looking to understand process for infant girl adoption under CARA guidelines.',
        status: 'Confirmed & Scheduled',
        currentStage: 3,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        history: [
          { title: 'Application Logged', time: 'Yesterday 10:15 AM', done: true, desc: 'Online appointment request recorded on Aasra portal.' },
          { title: 'SAA Officer Assigned', time: 'Yesterday 02:30 PM', done: true, desc: 'Coordinator Ms. Sunita Verma assigned to case.' },
          { title: 'In-Person Slot Confirmed', time: `${dateStr} • 10:30 AM`, done: true, current: true, desc: 'Appointment verified. Please report at reception.' },
          { title: 'Document Physical Verification', time: 'Day of Visit', done: false, desc: 'Physical check of KYC, marriage, and income credentials.' },
          { title: 'CARINGS Official Registration', time: 'Post Consultation', done: false, desc: 'Assistance with formal upload on cara.wcd.gov.in.' }
        ]
      };
      saveApplications([demoApp]);
    }
  }

  // ==========================================
  // 1. AGENCY APPOINTMENT BOOKING MODAL
  // ==========================================
  window.openAgencyBookingModal = function (preferredAgencyId = null) {
    const modal = document.getElementById('agency-appointment-modal');
    if (!modal) return;

    // Reset view if previously showing confirmation
    const formView = document.getElementById('booking-form-view');
    const successView = document.getElementById('booking-success-view');
    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';

    // Populate agencies dropdown
    populateAgenciesDropdown(preferredAgencyId);

    // Pre-fill user details if logged in
    const user = window.getAasraUser ? window.getAasraUser() : null;
    if (user && !user.isGuest) {
      const nameInput = document.getElementById('book-parent-name');
      const phoneInput = document.getElementById('book-phone');
      const emailInput = document.getElementById('book-email');
      const cityInput = document.getElementById('book-city');

      if (nameInput && !nameInput.value) nameInput.value = user.name || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = user.phone || '';
      if (emailInput && !emailInput.value) emailInput.value = user.email || '';
      if (cityInput && !cityInput.value) cityInput.value = user.city || '';
    }

    // Set default date to tomorrow
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      if (!dateInput.value) {
        dateInput.value = tomorrow.toISOString().split('T')[0];
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function populateAgenciesDropdown(selectedId) {
    const select = document.getElementById('book-agency-select');
    const infoCard = document.getElementById('selected-agency-preview');
    if (!select) return;

    const agencies = window.getAgenciesData ? window.getAgenciesData() : [];

    select.innerHTML = agencies.map(agency => `
      <option value="${agency.id}" ${agency.id === selectedId ? 'selected' : ''}>
        ${agency.name} — [${agency.district}, ${agency.state}]
      </option>
    `).join('');

    function updateAgencyPreview() {
      const curId = select.value;
      const agency = agencies.find(a => a.id === curId);
      if (agency && infoCard) {
        infoCard.innerHTML = `
          <div class="selected-agency-box">
            <div style="font-weight:700; color:var(--trust-navy); font-size:0.95rem;">${agency.name}</div>
            <div style="font-size:0.82rem; color:var(--slate-medium); margin-top:3px;">
              📍 ${agency.address} • 📞 ${agency.phone}
            </div>
            <div style="font-size:0.78rem; color:var(--primary-terracotta); font-weight:600; margin-top:2px;">
              CARA License: ${agency.license}
            </div>
          </div>
        `;
      }
    }

    select.onchange = updateAgencyPreview;
    updateAgencyPreview();
  }

  function setupBookingModal() {
    const form = document.getElementById('agency-booking-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const agencySelect = document.getElementById('book-agency-select');
      const agencyId = agencySelect?.value;
      const agencies = window.getAgenciesData ? window.getAgenciesData() : [];
      const agency = agencies.find(a => a.id === agencyId) || agencies[0];

      const parentName = document.getElementById('book-parent-name')?.value.trim();
      const coApplicant = document.getElementById('book-co-name')?.value.trim() || '';
      const phone = document.getElementById('book-phone')?.value.trim();
      const email = document.getElementById('book-email')?.value.trim();
      const city = document.getElementById('book-city')?.value.trim();
      const maritalStatus = document.getElementById('book-marital-status')?.value;
      const purpose = document.getElementById('book-purpose')?.value;
      const date = document.getElementById('book-date')?.value;
      const timeSlot = document.getElementById('book-slot')?.value;
      const notes = document.getElementById('book-notes')?.value.trim() || 'No additional notes provided.';

      if (!parentName || !phone || !date || !timeSlot) {
        window.showToast('Please fill out all required appointment fields.', 'warning');
        return;
      }

      if (phone.length < 10) {
        window.showToast('Please enter a valid 10-digit mobile number.', 'warning');
        return;
      }

      // Generate unique Tracking ID: AASRA-STATECODE-RANDOM5
      const stateCode = (agency?.state || 'IN').substring(0, 2).toUpperCase();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const trackingId = `AASRA-${stateCode}-${randomNum}`;

      // Build complete application object
      const newApp = {
        trackingId: trackingId,
        agencyId: agency.id,
        agencyName: agency.name,
        agencyLocation: `${agency.district}, ${agency.state}`,
        agencyPhone: agency.phone,
        agencyAddress: agency.address,
        parentName: parentName,
        coApplicantName: coApplicant,
        phone: phone,
        email: email,
        city: city,
        maritalStatus: maritalStatus,
        purpose: purpose,
        date: date,
        timeSlot: timeSlot,
        notes: notes,
        status: 'Confirmed & Scheduled',
        currentStage: 3,
        createdAt: new Date().toISOString(),
        history: [
          { title: 'Application Logged', time: 'Just now', done: true, desc: 'Online appointment request recorded on Aasra portal.' },
          { title: 'SAA Officer Assigned', time: 'Automated Desk', done: true, desc: 'Assigned to Adoption Helpdesk Officer.' },
          { title: 'In-Person Slot Confirmed', time: `${date} • ${timeSlot}`, done: true, current: true, desc: `Confirmed venue: ${agency.address}` },
          { title: 'Document Physical Verification', time: 'Day of Visit', done: false, desc: 'Bring original identity proofs, address verification, and marriage deed.' },
          { title: 'CARINGS Official Registration', time: 'Post Consultation', done: false, desc: 'Assistance with formal upload on cara.wcd.gov.in.' }
        ]
      };

      // Save to localStorage
      const apps = window.getSavedApplications();
      apps.unshift(newApp);
      saveApplications(apps);

      // Show success screen
      renderBookingSuccess(newApp);
      window.showToast(`🎉 Appointment booked! Tracking ID: ${trackingId}`, 'success');
    });
  }

  function renderBookingSuccess(app) {
    const formView = document.getElementById('booking-form-view');
    const successView = document.getElementById('booking-success-view');

    if (formView) formView.style.display = 'none';
    if (!successView) return;

    successView.style.display = 'block';
    successView.innerHTML = `
      <div class="booking-success-card">
        <div class="success-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--eucalyptus-teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h3 style="font-family:var(--font-serif); color:var(--trust-navy); margin-bottom:0.5rem; font-size:1.6rem;">
          Appointment Confirmed!
        </h3>
        <p style="color:var(--slate-medium); font-size:0.95rem; margin-bottom:1.5rem;">
          Your appointment request has been submitted to <strong>${app.agencyName}</strong>.
        </p>

        <!-- Tracking ID Highlight Box -->
        <div class="tracking-id-highlight-box">
          <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:1px; color:var(--slate-medium); font-weight:700;">
            Your Official Tracking ID
          </div>
          <div class="tracking-id-number" id="success-tracking-id-text">${app.trackingId}</div>
          <button class="btn btn-secondary btn-sm copy-btn" onclick="window.copyTrackingId('${app.trackingId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy ID</span>
          </button>
        </div>

        <!-- Appointment Key Details Table -->
        <div class="appointment-summary-table">
          <div class="summary-row">
            <span>Agency</span>
            <strong>${app.agencyName}</strong>
          </div>
          <div class="summary-row">
            <span>Date & Slot</span>
            <strong>📅 ${app.date} • ${app.timeSlot}</strong>
          </div>
          <div class="summary-row">
            <span>Applicant</span>
            <strong>${app.parentName} ${app.coApplicantName ? `& ${app.coApplicantName}` : ''}</strong>
          </div>
          <div class="summary-row">
            <span>Purpose</span>
            <strong>${app.purpose}</strong>
          </div>
          <div class="summary-row">
            <span>Venue Address</span>
            <span style="font-size:0.85rem; color:var(--slate-medium);">${app.agencyAddress}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1.5rem;">
          <button class="btn btn-primary" style="width:100%;" onclick="window.closeModals(); window.openTrackerModal('${app.trackingId}');">
            🔍 Track Application Status Live
          </button>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
            <button class="btn btn-secondary" onclick="window.printAppointmentSlip('${app.trackingId}')">
              🖨️ Print Pass
            </button>
            <button class="btn btn-secondary" onclick="window.closeModals()">
              Done / Return
            </button>
          </div>
        </div>
      </div>
    `;
  }

  window.copyTrackingId = function (id) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id).then(() => {
        window.showToast(`Copied ${id} to clipboard!`, 'success');
      });
    } else {
      window.showToast(`Tracking ID: ${id}`, 'info');
    }
  };

  // ==========================================
  // 2. LIVE APPLICATION TRACKER MODAL
  // ==========================================
  window.openTrackerModal = function (lookupId = '') {
    const modal = document.getElementById('application-tracker-modal');
    if (!modal) return;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    renderRecentApplicationChips();

    const searchInput = document.getElementById('tracker-search-input');
    if (lookupId) {
      if (searchInput) searchInput.value = lookupId;
      executeTrackingLookup(lookupId);
    } else {
      // Auto-load most recent application if available
      const apps = window.getSavedApplications();
      if (apps.length > 0) {
        if (searchInput) searchInput.value = apps[0].trackingId;
        executeTrackingLookup(apps[0].trackingId);
      } else {
        renderEmptyTrackerState();
      }
    }
  };

  function setupTrackerModal() {
    const searchForm = document.getElementById('tracker-search-form');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('tracker-search-input');
      const query = input?.value.trim();
      if (!query) {
        window.showToast('Please enter an Application Tracking ID or phone number.', 'warning');
        return;
      }
      executeTrackingLookup(query);
    });
  }

  function renderRecentApplicationChips() {
    const container = document.getElementById('tracker-recent-chips');
    if (!container) return;

    const apps = window.getSavedApplications();
    if (apps.length === 0) {
      container.innerHTML = `<span style="font-size:0.8rem; color:var(--slate-medium);">No recent applications on this device yet.</span>`;
      return;
    }

    container.innerHTML = `
      <div style="font-size:0.8rem; color:var(--slate-medium); margin-bottom:6px; font-weight:600;">
        Recent Submissions on this Device:
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${apps.map(app => `
          <button class="recent-id-chip" onclick="document.getElementById('tracker-search-input').value='${app.trackingId}'; window.executeTrackingLookup('${app.trackingId}')">
            <strong>${app.trackingId}</strong>
            <span style="font-size:0.75rem; color:var(--slate-medium);">(${app.agencyLocation.split(',')[0]})</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  window.executeTrackingLookup = function (query) {
    const apps = window.getSavedApplications();
    const cleanQuery = query.toLowerCase().trim();

    const match = apps.find(a =>
      a.trackingId.toLowerCase() === cleanQuery ||
      a.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '') ||
      a.parentName.toLowerCase().includes(cleanQuery)
    );

    const resultContainer = document.getElementById('tracker-result-container');
    if (!resultContainer) return;

    if (!match) {
      resultContainer.innerHTML = `
        <div class="tracker-not-found">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔍</div>
          <h4 style="color:var(--trust-navy); margin-bottom:0.5rem;">No Application Found</h4>
          <p style="color:var(--slate-medium); font-size:0.9rem; max-width:400px; margin:0 auto 1.25rem;">
            We couldn't find an application matching "<strong>${query}</strong>". Please verify your Tracking ID (format: AASRA-XX-XXXXX) or booked phone number.
          </p>
          <button class="btn btn-secondary btn-sm" onclick="window.openAgencyBookingModal()">
            📅 Book a New Agency Appointment
          </button>
        </div>
      `;
      return;
    }

    renderTrackerDashboard(match);
  };

  function renderTrackerDashboard(app) {
    const resultContainer = document.getElementById('tracker-result-container');
    if (!resultContainer) return;

    resultContainer.innerHTML = `
      <div class="tracker-dashboard-card">
        <!-- Top Status Bar -->
        <div class="tracker-top-banner">
          <div>
            <span class="tracker-ref-pill">Tracking ID: <strong>${app.trackingId}</strong></span>
            <h3 style="font-family:var(--font-serif); font-size:1.35rem; color:var(--trust-navy); margin-top:0.4rem;">
              ${app.agencyName}
            </h3>
            <div style="font-size:0.85rem; color:var(--slate-medium);">
              📍 ${app.agencyAddress}
            </div>
          </div>
          <div class="tracker-status-tag status-confirmed">
            <span class="status-indicator-dot"></span>
            ${app.status || 'Active & Scheduled'}
          </div>
        </div>

        <!-- 5-Stage Stepper Progress Bar -->
        <div class="tracker-timeline-section">
          <h4 style="font-size:0.95rem; font-weight:700; color:var(--trust-navy); margin-bottom:1rem; text-transform:uppercase; letter-spacing:0.5px;">
            Application Lifecycle & Milestone Tracker
          </h4>

          <div class="tracker-steps-list">
            ${app.history.map((step, idx) => `
              <div class="tracker-step-item ${step.done ? 'step-done' : ''} ${step.current ? 'step-current' : ''}">
                <div class="step-marker">
                  ${step.done ? `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ` : `<span>${idx + 1}</span>`}
                </div>
                <div class="step-content-box">
                  <div class="step-title-row">
                    <strong>${step.title}</strong>
                    <span class="step-time-tag">${step.time}</span>
                  </div>
                  <p class="step-description">${step.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Details Grid -->
        <div class="tracker-details-grid">
          <div class="detail-box">
            <div class="detail-label">Primary Applicant</div>
            <div class="detail-value">${app.parentName}</div>
            ${app.coApplicantName ? `<div style="font-size:0.8rem; color:var(--slate-medium);">Co-Applicant: ${app.coApplicantName}</div>` : ''}
          </div>

          <div class="detail-box">
            <div class="detail-label">Confirmed Appointment Slot</div>
            <div class="detail-value" style="color:var(--primary-terracotta);">
              📅 ${app.date} • ${app.timeSlot}
            </div>
          </div>

          <div class="detail-box">
            <div class="detail-label">Purpose of Consultation</div>
            <div class="detail-value">${app.purpose}</div>
          </div>

          <div class="detail-box">
            <div class="detail-label">Agency Officer Contact</div>
            <div class="detail-value">
              <a href="tel:${app.agencyPhone}" style="color:var(--eucalyptus-teal); font-weight:600;">${app.agencyPhone}</a>
            </div>
          </div>
        </div>

        <!-- What to Bring Checklist -->
        <div class="bring-checklist-box">
          <div style="font-weight:700; color:var(--trust-navy); font-size:0.88rem; margin-bottom:6px;">
            💼 Recommended Documents to Carry for Verification:
          </div>
          <ul style="font-size:0.82rem; color:var(--slate-medium); margin-left:1.2rem; line-height:1.5;">
            <li>Original Govt Photo IDs (Aadhaar & PAN cards of both parents)</li>
            <li>Proof of Residence & Marriage Certificate (if married)</li>
            <li>Latest 3 months salary slips / ITR acknowledgment for financial readiness</li>
            <li>Digital copy of this appointment slip</li>
          </ul>
        </div>

        <!-- Action Row -->
        <div class="tracker-actions-row">
          <button class="btn btn-secondary btn-sm" onclick="window.printAppointmentSlip('${app.trackingId}')">
            🖨️ Print / Save Appointment Pass
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.downloadCalendarInvite('${app.trackingId}')">
            📅 Add to Calendar (.ics)
          </button>
          <button class="btn btn-sm text-danger" style="border:1px solid rgba(220,53,69,0.2);" onclick="window.cancelApplication('${app.trackingId}')">
            Cancel Slot
          </button>
        </div>
      </div>
    `;
  }

  function renderEmptyTrackerState() {
    const resultContainer = document.getElementById('tracker-result-container');
    if (!resultContainer) return;

    resultContainer.innerHTML = `
      <div style="text-align:center; padding:2rem 1rem; color:var(--slate-medium);">
        <p>Enter your <strong>Application Tracking ID</strong> or <strong>Phone Number</strong> above to view appointment status and milestones.</p>
      </div>
    `;
  }

  // Print Pass Action
  window.printAppointmentSlip = function (trackingId) {
    const apps = window.getSavedApplications();
    const app = apps.find(a => a.trackingId === trackingId);
    if (!app) return;

    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) {
      window.showToast('Please allow popups to print your appointment slip.', 'warning');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Aasra Appointment Pass - ${app.trackingId}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2rem; color: #162533; line-height: 1.5; }
          .pass-box { border: 2px solid #D96B43; border-radius: 12px; padding: 2rem; max-width: 650px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .logo { font-size: 1.5rem; font-weight: bold; color: #D96B43; }
          .tracking-id { font-size: 1.3rem; font-weight: 700; color: #162533; background: #FEF7ED; padding: 4px 12px; border-radius: 6px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.95rem; }
          .label { color: #666; font-weight: 500; }
          .val { font-weight: 600; text-align: right; }
          .footer { margin-top: 2rem; border-top: 1px dashed #ccc; padding-top: 1rem; font-size: 0.8rem; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <div class="pass-box">
          <div class="header">
            <div>
              <div class="logo">Aasra • Adoption Guidance</div>
              <small>Specialized Adoption Agency Official Visit Pass</small>
            </div>
            <div class="tracking-id">${app.trackingId}</div>
          </div>
          <div class="row"><span class="label">Agency</span><span class="val">${app.agencyName}</span></div>
          <div class="row"><span class="label">Venue Address</span><span class="val">${app.agencyAddress}</span></div>
          <div class="row"><span class="label">Date & Slot</span><span class="val">${app.date} • ${app.timeSlot}</span></div>
          <div class="row"><span class="label">Primary Applicant</span><span class="val">${app.parentName}</span></div>
          ${app.coApplicantName ? `<div class="row"><span class="label">Co-Applicant</span><span class="val">${app.coApplicantName}</span></div>` : ''}
          <div class="row"><span class="label">Contact Phone</span><span class="val">${app.phone}</span></div>
          <div class="row"><span class="label">Purpose of Visit</span><span class="val">${app.purpose}</span></div>
          <div class="row"><span class="label">Agency Helpdesk</span><span class="val">${app.agencyPhone}</span></div>
          <div class="footer">
            Please present this printed pass along with original photo ID proofs at the agency reception desk.<br>
            Aasra Child Care Platform • CARA Statutory Guidelines Compliant
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Add to Calendar (.ics file generator)
  window.downloadCalendarInvite = function (trackingId) {
    const apps = window.getSavedApplications();
    const app = apps.find(a => a.trackingId === trackingId);
    if (!app) return;

    const startDate = app.date.replace(/-/g, '') + 'T100000Z';
    const endDate = app.date.replace(/-/g, '') + 'T120000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aasra Adoption Guidance//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${app.trackingId}@aasra-adoption.org`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:Adoption Guidance Visit: ${app.agencyName}`,
      `DESCRIPTION:Appointment Reference: ${app.trackingId}\\nPurpose: ${app.purpose}\\nPhone: ${app.agencyPhone}`,
      `LOCATION:${app.agencyAddress}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Aasra_Appointment_${app.trackingId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast('Calendar invite (.ics) downloaded!', 'success');
  };

  // Cancel Application Slot
  window.cancelApplication = function (trackingId) {
    if (!confirm(`Are you sure you want to cancel appointment ${trackingId}? This slot will be released.`)) {
      return;
    }

    let apps = window.getSavedApplications();
    apps = apps.filter(a => a.trackingId !== trackingId);
    saveApplications(apps);

    window.showToast(`Appointment ${trackingId} has been cancelled.`, 'info');
    renderRecentApplicationChips();
    renderEmptyTrackerState();
  };

  document.addEventListener('DOMContentLoaded', init);
})();

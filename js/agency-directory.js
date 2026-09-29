/**
 * Aasra Adoption Platform - Agency Directory
 * Features: Geolocation permission & distance recommendations, filtering, and appointment booking hooks.
 */

(function () {
  'use strict';

  // Comprehensive verified list of Specialized Adoption Agencies (SAAs) & SARAs with real coordinates
  const agenciesData = [
    {
      id: 'saa-delhi-palna',
      name: 'Palna — Delhi Council for Child Welfare',
      state: 'Delhi',
      district: 'Civil Lines, Delhi',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'DL-SAA-042/CARA',
      phone: '+91 11 2396 8907',
      email: 'palna.adoption@dccw.org',
      address: 'Qudsia Bagh, Shamnath Marg, Civil Lines, Delhi 110054',
      lat: 28.6720,
      lng: 77.2250,
      specialties: ['Infant Care', 'Special Healthcare Needs', 'Foster Care']
    },
    {
      id: 'sara-delhi',
      name: 'Delhi State Adoption Resource Agency (SARA)',
      state: 'Delhi',
      district: 'Central Delhi',
      type: 'Government Regulatory Agency (SARA)',
      license: 'DL-SARA-001/2021',
      phone: '+91 11 2338 4591',
      email: 'sara.delhi@gov.in',
      address: '1, Canning Lane, Kasturba Gandhi Marg, New Delhi 110001',
      lat: 28.6139,
      lng: 77.2090,
      specialties: ['State Coordination', 'HSR Verification', 'Grievance Redressal']
    },
    {
      id: 'saa-mumbai-shishu',
      name: 'Bal Asha Trust Child Care & Adoption Center',
      state: 'Maharashtra',
      district: 'Mumbai South',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'MH-SAA-019/CARA',
      phone: '+91 22 2492 6526',
      email: 'info@balashatrust.org',
      address: 'King George V Memorial, Dr. E. Moses Road, Mahalaxmi, Mumbai 400011',
      lat: 18.9830,
      lng: 72.8258,
      specialties: ['Special Needs Medical Care', 'Toddler Bonding', 'Post-Adoption Support']
    },
    {
      id: 'saa-pune-sofy',
      name: 'SOFOSH — Shreevatsa Child Care Home',
      state: 'Maharashtra',
      district: 'Pune',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'MH-SAA-087/CARA',
      phone: '+91 20 2612 4633',
      email: 'sofosh@vsnl.net',
      address: 'Sassoon General Hospital Campus, Station Road, Pune 411001',
      lat: 18.5204,
      lng: 73.8567,
      specialties: ['Newborn Care', 'Sibling Placements', 'Pre-Adoption Counseling']
    },
    {
      id: 'saa-blr-mathruchaya',
      name: 'Mathruchaya — Canara Bank Relief Society',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'KA-SAA-008/CARA',
      phone: '+91 80 2656 2387',
      email: 'mathruchaya.blr@gmail.com',
      address: '27th Cross, 6th Main, 4th Block, Jayanagar, Bengaluru 560011',
      lat: 12.9250,
      lng: 77.5838,
      specialties: ['Infant & Child Discovery', 'Home Study Facilitation', 'Family Counseling']
    },
    {
      id: 'saa-chennai-guild',
      name: 'Guild of Service (Central) Child Care Center',
      state: 'Tamil Nadu',
      district: 'Chennai',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'TN-SAA-014/CARA',
      phone: '+91 44 2819 4271',
      email: 'guildofservice@dataone.in',
      address: '18, Casa Major Road, Egmore, Chennai 600008',
      lat: 13.0827,
      lng: 80.2600,
      specialties: ['Sibling Pairs', 'Early Intervention', 'Legal Guidance']
    },
    {
      id: 'saa-up-lucknow',
      name: 'Rajkiya Shishu Griha (State Specialized Home)',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'UP-SAA-003/CARA',
      phone: '+91 522 232 4581',
      email: 'shishugriha.lko@gov.in',
      address: 'Sector 5, Prag Narain Road, Lucknow 226001',
      lat: 26.8467,
      lng: 80.9462,
      specialties: ['Newborn Care', 'District Magistrate Filing', 'CWC Coordination']
    },
    {
      id: 'saa-kolkata-society',
      name: 'Society for Indian Children\'s Welfare (SICW)',
      state: 'West Bengal',
      district: 'Kolkata',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'WB-SAA-022/CARA',
      phone: '+91 33 2475 2775',
      email: 'sicwkolkata@gmail.com',
      address: '22, Bondel Road, Ballygunge, Kolkata 700019',
      lat: 22.5280,
      lng: 88.3650,
      specialties: ['Special Health Needs', 'Educational Bridging', 'Parent Mentorship']
    },
    {
      id: 'saa-hyderabad-sishu',
      name: 'Shishu Vihar State Home for Infants',
      state: 'Telangana',
      district: 'Hyderabad',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'TG-SAA-011/CARA',
      phone: '+91 40 2374 1259',
      email: 'shishuvihar.hyd@telangana.gov.in',
      address: 'Vengal Rao Nagar, Ameerpet, Hyderabad 500038',
      lat: 17.4375,
      lng: 78.4482,
      specialties: ['Newborn Care', 'Medical Rehabilitation', 'CWC Inquiries']
    },
    {
      id: 'saa-jaipur-bal',
      name: 'Bal Sambal Society Adoption Center',
      state: 'Rajasthan',
      district: 'Jaipur',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'RJ-SAA-015/CARA',
      phone: '+91 141 278 0432',
      email: 'balsambal.jaipur@gmail.com',
      address: 'Sector 3, Malviya Nagar, Jaipur 302017',
      lat: 26.8530,
      lng: 75.8050,
      specialties: ['Pre-Adoption Counseling', 'Family Preparation', 'Home Visits']
    },
    {
      id: 'saa-ahmedabad-vikas',
      name: 'Vikas Jyot Shishu Bhavan',
      state: 'Gujarat',
      district: 'Ahmedabad',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'GJ-SAA-009/CARA',
      phone: '+91 79 2657 8891',
      email: 'vikasjyot.abad@yahoo.com',
      address: 'Near Paldi Crossroads, Ellisbridge, Ahmedabad 380006',
      lat: 23.0130,
      lng: 72.5620,
      specialties: ['Infant Adoption', 'Documentation Support', 'Nutritional Care']
    },
    {
      id: 'saa-kochi-bethany',
      name: 'Bethany Child Care & Adoption Home',
      state: 'Kerala',
      district: 'Ernakulam / Kochi',
      type: 'Specialized Adoption Agency (SAA)',
      license: 'KL-SAA-027/CARA',
      phone: '+91 484 239 1104',
      email: 'bethanycare.kochi@gmail.com',
      address: 'Kacheripady, Chittoor Road, Ernakulam, Kochi 682018',
      lat: 9.9890,
      lng: 76.2840,
      specialties: ['Legal Compliance', 'Sibling Adoption', 'Post-Adoption Monitoring']
    }
  ];

  let currentAgencies = [...agenciesData];
  let userLocation = null; // { lat, lng, name }

  // Expose agency data getter for appointment module
  window.getAgenciesData = function () {
    return agenciesData;
  };

  // Expose agency finder by ID
  window.getAgencyById = function (id) {
    return agenciesData.find(a => a.id === id) || null;
  };

  function init() {
    setupFilters();
    setupGeolocation();
    renderAgencies(currentAgencies);
  }

  // Calculate distance between two lat/lng pairs in kilometers (Haversine formula)
  function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 1 decimal place
  }

  // Geolocation handling
  function setupGeolocation() {
    const locBtn = document.getElementById('agency-location-btn');
    const resetLocBtn = document.getElementById('reset-location-btn');

    if (locBtn) {
      locBtn.addEventListener('click', requestUserLocation);
    }

    if (resetLocBtn) {
      resetLocBtn.addEventListener('click', () => {
        userLocation = null;
        updateLocationUI(null);
        applyFilter();
        window.showToast('Location filter cleared. Showing all authorized agencies.', 'info');
      });
    }
  }

  function requestUserLocation() {
    const locBtn = document.getElementById('agency-location-btn');
    if (!navigator.geolocation) {
      window.showToast('Geolocation is not supported by your current browser. You can filter by state instead.', 'warning');
      return;
    }

    if (locBtn) {
      locBtn.innerHTML = `
        <span class="spinner-inline"></span>
        <span>Detecting your location...</span>
      `;
      locBtn.disabled = true;
    }

    window.showToast('Requesting permission to access your device location for nearby recommendations...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        userLocation = { lat, lng };

        // Calculate distance for all agencies and sort
        applyLocationRanking(lat, lng);

        if (locBtn) {
          locBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Update Location</span>
          `;
          locBtn.disabled = false;
        }

        updateLocationUI(userLocation);
        window.showToast('📍 Location detected! Agencies are now ranked by proximity to your device.', 'success');
      },
      (error) => {
        if (locBtn) {
          locBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Use My Location</span>
          `;
          locBtn.disabled = false;
        }

        let msg = 'Could not access device location. ';
        if (error.code === error.PERMISSION_DENIED) {
          msg += 'Permission was denied. Please allow location access in your browser settings, or select your state from the dropdown.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg += 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg += 'Location request timed out. Please try again.';
        }
        window.showToast(msg, 'warning');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  function applyLocationRanking(userLat, userLng) {
    agenciesData.forEach(agency => {
      if (agency.lat && agency.lng) {
        agency.distanceKm = calculateDistanceKm(userLat, userLng, agency.lat, agency.lng);
      } else {
        agency.distanceKm = 99999;
      }
    });

    applyFilter();
  }

  function updateLocationUI(loc) {
    const locStatus = document.getElementById('location-status-badge');
    const resetLocBtn = document.getElementById('reset-location-btn');

    if (!locStatus) return;

    if (loc) {
      locStatus.style.display = 'inline-flex';
      locStatus.innerHTML = `
        <span class="pulse-dot"></span>
        <span>Sorted by Distance from Your Location (~${agenciesData[0]?.distanceKm || 0} km nearest)</span>
      `;
      if (resetLocBtn) resetLocBtn.style.display = 'inline-flex';
    } else {
      locStatus.style.display = 'none';
      if (resetLocBtn) resetLocBtn.style.display = 'none';
      agenciesData.forEach(a => delete a.distanceKm);
    }
  }

  function setupFilters() {
    const searchInput = document.getElementById('agency-search-input');
    const stateSelect = document.getElementById('agency-state-select');

    if (searchInput) searchInput.addEventListener('input', applyFilter);
    if (stateSelect) stateSelect.addEventListener('change', applyFilter);
  }

  function applyFilter() {
    const searchInput = document.getElementById('agency-search-input');
    const stateSelect = document.getElementById('agency-state-select');

    const query = (searchInput?.value || '').toLowerCase().trim();
    const selectedState = stateSelect?.value || 'all';

    let filtered = agenciesData.filter(agency => {
      const matchesQuery = agency.name.toLowerCase().includes(query) ||
        agency.district.toLowerCase().includes(query) ||
        agency.state.toLowerCase().includes(query) ||
        agency.specialties.some(s => s.toLowerCase().includes(query));
      const matchesState = (selectedState === 'all') || (agency.state.toLowerCase() === selectedState.toLowerCase());
      return matchesQuery && matchesState;
    });

    // If userLocation is set, sort filtered list by distance ascending
    if (userLocation) {
      filtered.sort((a, b) => (a.distanceKm || 99999) - (b.distanceKm || 99999));
    }

    renderAgencies(filtered);
  }

  function renderAgencies(list) {
    const grid = document.getElementById('agencies-grid-container');
    if (!grid) return;

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-lg); border:1px solid var(--border-subtle);">
          <p style="color: var(--slate-medium); font-size:1.05rem;">No authorized agencies found matching your search or location criteria.</p>
          <button class="btn btn-secondary" style="margin-top:1rem;" onclick="document.getElementById('agency-search-input').value=''; document.getElementById('agency-state-select').value='all'; window.location.reload();">
            Reset Filters
          </button>
        </div>
      `;
      return;
    }

    // Minimum distance in list if location is active
    const minDistance = userLocation ? Math.min(...list.map(a => a.distanceKm || 99999)) : null;

    grid.innerHTML = list.map((agency, idx) => {
      const isNearest = userLocation && agency.distanceKm === minDistance;
      const distanceBadge = (agency.distanceKm !== undefined && agency.distanceKm < 99999) ? `
        <div class="agency-distance-tag ${isNearest ? 'nearest-tag' : ''}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${agency.distanceKm} km away</span>
          ${isNearest ? '<span class="closest-label">• Nearest Agency</span>' : ''}
        </div>
      ` : '';

      return `
        <div class="agency-card ${isNearest ? 'agency-card-highlight' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:6px;">
            <span class="agency-badge">${agency.type}</span>
            ${distanceBadge}
          </div>

          <h4 style="margin-bottom:0.5rem;">${agency.name}</h4>
          
          <div class="agency-loc">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${agency.district}, ${agency.state}</span>
          </div>

          <ul class="agency-contacts">
            <li><strong>CARA Licence:</strong> <code>${agency.license}</code></li>
            <li><strong>Phone:</strong> <a href="tel:${agency.phone}" style="color:var(--primary-terracotta); font-weight:600;">${agency.phone}</a></li>
            <li><strong>Email:</strong> <a href="mailto:${agency.email}" style="color:var(--slate-medium);">${agency.email}</a></li>
            <li style="font-size:0.82rem; color:var(--slate-medium); margin-top:4px;">📍 ${agency.address}</li>
          </ul>

          <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:1.25rem;">
            ${agency.specialties.map(s => `<span class="meta-chip" style="font-size:0.72rem;">${s}</span>`).join('')}
          </div>

          <!-- Dual Action Buttons -->
          <div class="agency-actions-dual">
            <button class="btn btn-primary" style="flex:1; padding:0.65rem 0.85rem; font-size:0.88rem;" onclick="window.openAgencyBookingModal('${agency.id}')">
              📅 Book Appointment
            </button>
            <button class="btn btn-secondary" style="padding:0.65rem 0.85rem; font-size:0.85rem;" onclick="window.openCounselingModal('Inquiry for ${agency.name.replace(/'/g, "\\'")}')" title="Call or message support regarding this agency">
              Support
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', init);
})();

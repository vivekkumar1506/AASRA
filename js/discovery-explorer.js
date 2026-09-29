/**
 * Aasra Adoption Platform - Child Care & Discovery Explorer
 */

(function() {
  'use strict';

  const discoveryCategories = [
    {
      id: 'cat-infant',
      title: 'Infants & Early Babes',
      ageBracket: '0 – 2 Years',
      tag: 'infant',
      icon: '👶',
      shortDesc: 'Early formative phase characterized by rapid sensory and emotional attachment development. High demand in prospective parent queues.',
      developmentalNeeds: 'Close physical holding, responsive feeding routines, sleep cycle regulation, and regular pediatric immunizations.',
      parentalReadiness: 'High time commitment, parental leave readiness, pediatric emergency network setup, babyproofing living spaces.',
      bondingAdvice: 'Skin-to-skin contact, gentle humming, and predictable feeding cycles foster immediate primal security and emotional safety.',
      specialNotice: 'Infant adoptions typically have a 2.5 to 3.5 year queue nationwide due to high domestic demand.'
    },
    {
      id: 'cat-toddler',
      title: 'Toddlers & Active Explorers',
      ageBracket: '2 – 4 Years',
      tag: 'toddler',
      icon: '🧸',
      shortDesc: 'Curious, energetic toddlers mastering language, autonomy, and gross motor skills. Transitioning from institutional or foster care.',
      developmentalNeeds: 'Structured daily rhythms, language exposure, sensory play, emotional co-regulation during tantrums and adjustments.',
      parentalReadiness: 'Childproofing against active climbers, patience with food preferences, understanding separation anxiety.',
      bondingAdvice: 'Engage through interactive play, reading tactile storybooks together, and allowing the child to carry a comfort toy or blanket from the agency.',
      specialNotice: 'Queue duration is moderately faster (approx 1.5 to 2.5 years).'
    },
    {
      id: 'cat-child',
      title: 'Young School-Age Children',
      ageBracket: '4 – 8 Years',
      tag: 'child',
      icon: '🎨',
      shortDesc: 'Children with emerging individual personalities, memories, and established communication skills seeking permanent family roots.',
      developmentalNeeds: 'School transition support, reassurance regarding permanence, social peer play, emotional validation.',
      parentalReadiness: 'Openness to life-story exploration, school enrollment readiness, non-punitive gentle discipline methods.',
      bondingAdvice: 'Cook together, establish bedtime reading rituals, and create a shared family photo album celebrating their entry into the home.',
      specialNotice: 'Referrals in this age bracket occur within 6 to 18 months, offering faster placement.'
    },
    {
      id: 'cat-older',
      title: 'Older Children & Pre-Teens',
      ageBracket: '8+ Years',
      tag: 'older',
      icon: '🎒',
      shortDesc: 'Thoughtful young people who actively participate in their adoption consent. High capability for profound mutual loyalty and loving companionship.',
      developmentalNeeds: 'Autonomy respect, emotional trust repair, educational bridging, hobby encouragement, active listening.',
      parentalReadiness: 'Patience with protective emotional walls, respecting past memories, mentorship-oriented parenting style.',
      bondingAdvice: 'Never rush attachment; respect their pace. Focus on joint hobbies, music, sports, and unconditional emotional consistency.',
      specialNotice: 'Immediate priority matching available. Children aged 8+ give their personal consent during adoption hearings.'
    },
    {
      id: 'cat-siblings',
      title: 'Sibling Duos & Trios',
      ageBracket: 'Mixed Ages',
      tag: 'siblings',
      icon: '👭',
      shortDesc: 'Brothers and sisters who share an irreplaceable lifetime bond. Priority is legally given to keep biological siblings together in one loving home.',
      developmentalNeeds: 'Preserving brother-sister emotional safety, shared yet individualized attention, distinct personal spaces.',
      parentalReadiness: 'Larger home capacity, financial stability for multiple children, conflict-resolution empathy.',
      bondingAdvice: 'Celebrate their existing sibling bond rather than competing with it. Schedule both joint family rituals and special 1-on-1 moments with each child.',
      specialNotice: 'Sibling placements receive expedited CARINGS priority to prevent traumatic family separation.'
    },
    {
      id: 'cat-special-needs',
      title: 'Special Healthcare & Developmental Needs',
      ageBracket: 'All Ages',
      tag: 'special',
      icon: '💙',
      shortDesc: 'Remarkable children with correctable or manageable medical conditions (e.g. cleft palate, clubfoot, congenital cardiac, hearing or vision needs, developmental delays).',
      developmentalNeeds: 'Specialized healthcare access, speech or occupational therapy, pediatric specialist appointments, assistive care.',
      parentalReadiness: 'Comprehensive health insurance, proximity to tertiary hospitals, emotional resilience and advocacy.',
      bondingAdvice: 'Focus on celebrating every small developmental milestone. Connect with specialized parent support groups and medical allies.',
      specialNotice: 'Immediate referral portal access (Immediate Placement / Special Needs category) with dedicated fast-track processing.'
    }
  ];

  let currentFilter = 'all';

  function init() {
    setupFilterPills();
    renderCards(discoveryCategories);
    setupCareModalTrigger();
  }

  function setupFilterPills() {
    const filterBtns = document.querySelectorAll('.filter-pill');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');

        if (currentFilter === 'all') {
          renderCards(discoveryCategories);
        } else {
          const filtered = discoveryCategories.filter(c => c.tag === currentFilter);
          renderCards(filtered);
        }
      });
    });
  }

  function renderCards(categories) {
    const grid = document.getElementById('discovery-profiles-grid');
    if (!grid) return;

    if (categories.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--bg-surface); border-radius: var(--radius-lg);">
          <p style="color: var(--slate-medium);">No profiles found matching this category filter.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = categories.map(cat => `
      <div class="profile-card" data-cat-id="${cat.id}">
        <div>
          <div class="profile-card-top">
            <div class="category-icon-box">${cat.icon}</div>
            <span class="age-bracket-tag">${cat.ageBracket}</span>
          </div>
          <h4>${cat.title}</h4>
          <p>${cat.shortDesc}</p>
          
          <div class="profile-meta-chips">
            <span class="meta-chip">Needs: ${cat.developmentalNeeds.slice(0, 32)}...</span>
            <span class="meta-chip">Bonding: ${cat.bondingAdvice.slice(0, 28)}...</span>
          </div>
        </div>

        <div class="profile-card-actions">
          <button class="btn btn-secondary" style="flex:1; padding:0.6rem 1rem; font-size:0.88rem;" onclick="window.openCareModal('${cat.id}')">
            Explore Care & Readiness Guide
          </button>
          <button class="btn btn-primary" style="padding:0.6rem 1rem; font-size:0.88rem;" onclick="window.openCounselingModal('Inquiring about ${cat.title}')">
            Counseling
          </button>
        </div>
      </div>
    `).join('');
  }

  function setupCareModalTrigger() {
    window.openCareModal = function(catId) {
      const cat = discoveryCategories.find(c => c.id === catId);
      if (!cat) return;

      const modal = document.getElementById('care-guide-modal');
      const titleEl = document.getElementById('care-modal-title');
      const bodyEl = document.getElementById('care-modal-body');

      if (titleEl) titleEl.innerHTML = `${cat.icon} ${cat.title} (${cat.ageBracket})`;

      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="margin-bottom: 1.5rem;">
            <p style="font-size: 1rem; color: var(--slate-dark); line-height: 1.6;">${cat.shortDesc}</p>
          </div>

          <div style="background: var(--primary-soft); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem; border-left: 4px solid var(--primary-terracotta);">
            <strong style="color: var(--primary-terracotta); display: block; margin-bottom: 0.25rem;">CARINGS Waiting Period & Priority:</strong>
            <p style="font-size: 0.9rem; color: var(--slate-dark);">${cat.specialNotice}</p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h5 style="font-size: 1rem; color: var(--trust-navy); margin-bottom: 0.4rem; font-weight: 700;">Developmental & Emotional Needs:</h5>
            <p style="font-size: 0.92rem; color: var(--slate-medium); line-height: 1.5;">${cat.developmentalNeeds}</p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <h5 style="font-size: 1rem; color: var(--trust-navy); margin-bottom: 0.4rem; font-weight: 700;">Parental & Home Preparation:</h5>
            <p style="font-size: 0.92rem; color: var(--slate-medium); line-height: 1.5;">${cat.parentalReadiness}</p>
          </div>

          <div style="margin-bottom: 1.75rem;">
            <h5 style="font-size: 1rem; color: var(--trust-navy); margin-bottom: 0.4rem; font-weight: 700;">Empathetic Bonding & Attachment Advice:</h5>
            <p style="font-size: 0.92rem; color: var(--slate-medium); line-height: 1.5;">${cat.bondingAdvice}</p>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
            <button class="btn btn-secondary" onclick="window.closeModals()">Close Guide</button>
            <button class="btn btn-primary" onclick="window.closeModals(); window.openCounselingModal('Adopting ${cat.title}')">
              Speak with Adoption Counselor
            </button>
          </div>
        `;
      }

      if (modal) {
        modal.classList.add('open');
      }
    };
  }

  document.addEventListener('DOMContentLoaded', init);
})();

/**
 * Aasra Adoption Platform - Eligibility Checker Wizard
 */

(function() {
  'use strict';

  // State
  const wizardState = {
    currentStep: 1,
    parentType: 'couple', // 'couple', 'single_female', 'single_male'
    primaryAge: 32,
    spouseAge: 34,
    childAgePreference: '0-2', // '0-2', '2-4', '4-8', '8+'
    marriageYears: 4,
    healthStatus: true,
    financialStability: true,
    cleanRecord: true,
    homeEnvironment: true
  };

  function init() {
    setupStepNavigation();
    setupOptionCards();
    setupAgeSliders();
    setupCheckboxes();
    setupCalculation();
  }

  function setupStepNavigation() {
    const nextBtns = document.querySelectorAll('[data-wizard-next]');
    const prevBtns = document.querySelectorAll('[data-wizard-prev]');
    const restartBtn = document.getElementById('restart-wizard-btn');

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep(wizardState.currentStep)) {
          goToStep(wizardState.currentStep + 1);
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(wizardState.currentStep - 1);
      });
    });

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        goToStep(1);
      });
    }
  }

  function goToStep(stepNum) {
    if (stepNum < 1 || stepNum > 4) return;
    
    // Update step state
    wizardState.currentStep = stepNum;

    // Update wizard steps header
    const stepItems = document.querySelectorAll('.wizard-stepper .step-item');
    stepItems.forEach((item, index) => {
      const step = index + 1;
      item.classList.remove('active', 'completed');
      if (step === stepNum) {
        item.classList.add('active');
      } else if (step < stepNum) {
        item.classList.add('completed');
      }
    });

    // Update wizard pages
    const pages = document.querySelectorAll('.wizard-step-content');
    pages.forEach((page, index) => {
      page.classList.toggle('active', (index + 1) === stepNum);
    });

    if (stepNum === 4) {
      calculateAndRenderResults();
    }
  }

  function validateStep(step) {
    if (step === 1) {
      if (!wizardState.parentType) {
        window.showToast('Please select your prospective parent status.', 'warning');
        return false;
      }
    }
    return true;
  }

  function setupOptionCards() {
    const parentCards = document.querySelectorAll('.parent-option-card');
    const spouseAgeGroup = document.getElementById('spouse-age-group');
    const marriageYearsGroup = document.getElementById('marriage-years-group');
    const compositeAgeBox = document.getElementById('composite-age-box');

    parentCards.forEach(card => {
      card.addEventListener('click', () => {
        parentCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const selectedType = card.getAttribute('data-value');
        wizardState.parentType = selectedType;

        // Toggle spouse inputs visibility
        if (selectedType === 'couple') {
          if (spouseAgeGroup) spouseAgeGroup.style.display = 'block';
          if (marriageYearsGroup) marriageYearsGroup.style.display = 'block';
          if (compositeAgeBox) compositeAgeBox.style.display = 'flex';
        } else {
          if (spouseAgeGroup) spouseAgeGroup.style.display = 'none';
          if (marriageYearsGroup) marriageYearsGroup.style.display = 'none';
          if (compositeAgeBox) compositeAgeBox.style.display = 'none';
        }

        updateCompositeAge();
      });
    });
  }

  function setupAgeSliders() {
    const primaryInput = document.getElementById('primary-age-slider');
    const primaryBadge = document.getElementById('primary-age-val');
    const spouseInput = document.getElementById('spouse-age-slider');
    const spouseBadge = document.getElementById('spouse-age-val');
    const marriageInput = document.getElementById('marriage-slider');
    const marriageBadge = document.getElementById('marriage-val');
    const childAgeSelect = document.getElementById('child-age-select');

    if (primaryInput && primaryBadge) {
      primaryInput.addEventListener('input', (e) => {
        wizardState.primaryAge = parseInt(e.target.value, 10);
        primaryBadge.textContent = `${wizardState.primaryAge} yrs`;
        updateCompositeAge();
      });
    }

    if (spouseInput && spouseBadge) {
      spouseInput.addEventListener('input', (e) => {
        wizardState.spouseAge = parseInt(e.target.value, 10);
        spouseBadge.textContent = `${wizardState.spouseAge} yrs`;
        updateCompositeAge();
      });
    }

    if (marriageInput && marriageBadge) {
      marriageInput.addEventListener('input', (e) => {
        wizardState.marriageYears = parseInt(e.target.value, 10);
        marriageBadge.textContent = `${wizardState.marriageYears} yrs`;
      });
    }

    if (childAgeSelect) {
      childAgeSelect.addEventListener('change', (e) => {
        wizardState.childAgePreference = e.target.value;
        updateCompositeAge();
      });
    }
  }

  function updateCompositeAge() {
    const compositeVal = document.getElementById('composite-age-val');
    const compositeBadge = document.getElementById('composite-status-badge');
    if (!compositeVal) return;

    if (wizardState.parentType === 'couple') {
      const total = wizardState.primaryAge + wizardState.spouseAge;
      compositeVal.textContent = `${total} yrs`;

      // Legal caps (CARA Regulations):
      // Child up to 2 yrs: Max composite age 85
      // Child 2-4 yrs: Max composite age 90
      // Child 4-8 yrs: Max composite age 100
      // Child 8-18 yrs: Max composite age 110
      let maxAllowed = 85;
      if (wizardState.childAgePreference === '2-4') maxAllowed = 90;
      else if (wizardState.childAgePreference === '4-8') maxAllowed = 100;
      else if (wizardState.childAgePreference === '8+') maxAllowed = 110;

      if (total <= maxAllowed) {
        compositeBadge.textContent = `Within limit (Max ${maxAllowed} yrs)`;
        compositeBadge.className = 'option-badge';
        compositeBadge.style.background = 'var(--eucalyptus-light)';
        compositeBadge.style.color = 'var(--eucalyptus-teal)';
      } else {
        compositeBadge.textContent = `Exceeds max of ${maxAllowed} yrs for this category`;
        compositeBadge.className = 'option-badge';
        compositeBadge.style.background = 'var(--primary-soft)';
        compositeBadge.style.color = 'var(--primary-terracotta)';
      }
    }
  }

  function setupCheckboxes() {
    const healthCb = document.getElementById('check-health');
    const finCb = document.getElementById('check-finance');
    const recordCb = document.getElementById('check-record');
    const homeCb = document.getElementById('check-home');

    if (healthCb) {
      healthCb.addEventListener('change', (e) => wizardState.healthStatus = e.target.checked);
    }
    if (finCb) {
      finCb.addEventListener('change', (e) => wizardState.financialStability = e.target.checked);
    }
    if (recordCb) {
      recordCb.addEventListener('change', (e) => wizardState.cleanRecord = e.target.checked);
    }
    if (homeCb) {
      homeCb.addEventListener('change', (e) => wizardState.homeEnvironment = e.target.checked);
    }
  }

  function setupCalculation() {
    const printBtn = document.getElementById('print-eligibility-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function calculateAndRenderResults() {
    let score = 100;
    const recommendations = [];
    let isLegallyEligible = true;

    // 1. Marital & Age Checks
    if (wizardState.parentType === 'couple') {
      if (wizardState.marriageYears < 2) {
        score -= 20;
        recommendations.push({
          type: 'warning',
          title: 'Marital Stability Requirement',
          text: 'Under CARA guidelines, married couples must have at least 2 years of stable marital relationship to be eligible.'
        });
      }

      const compositeAge = wizardState.primaryAge + wizardState.spouseAge;
      let maxComp = 85;
      if (wizardState.childAgePreference === '2-4') maxComp = 90;
      else if (wizardState.childAgePreference === '4-8') maxComp = 100;
      else if (wizardState.childAgePreference === '8+') maxComp = 110;

      if (compositeAge > maxComp) {
        score -= 25;
        recommendations.push({
          type: 'warning',
          title: 'Composite Age Exceeded for Chosen Age Category',
          text: `Your combined age is ${compositeAge} years. The maximum composite age for adopting a child in the '${wizardState.childAgePreference}' age bracket is ${maxComp} years. Consider choosing an older child category.`
        });
      } else {
        recommendations.push({
          type: 'success',
          title: 'Composite Age Approved',
          text: `Your combined age (${compositeAge} yrs) is well within the statutory limit (${maxComp} yrs).`
        });
      }

      // Individual parent age limits (neither should exceed 55)
      if (wizardState.primaryAge > 55 || wizardState.spouseAge > 55) {
        score -= 30;
        isLegallyEligible = false;
        recommendations.push({
          type: 'alert',
          title: 'Individual Age Exceeded',
          text: 'Neither spouse should exceed 55 years of age at the time of adoption application.'
        });
      }
    } else {
      // Single Parent Rules
      if (wizardState.primaryAge < 25) {
        score -= 40;
        isLegallyEligible = false;
        recommendations.push({
          type: 'alert',
          title: 'Minimum Age Requirement',
          text: 'Single prospective adoptive parents must be at least 25 years of age.'
        });
      }

      let maxSingle = 40;
      if (wizardState.childAgePreference === '2-4') maxSingle = 45;
      else if (wizardState.childAgePreference === '4-8') maxSingle = 50;
      else if (wizardState.childAgePreference === '8+') maxSingle = 55;

      if (wizardState.primaryAge > maxSingle) {
        score -= 20;
        recommendations.push({
          type: 'warning',
          title: 'Single Parent Age Bracket Check',
          text: `At age ${wizardState.primaryAge}, you may explore children aged ${wizardState.primaryAge > 50 ? '8+ years' : '4+ years'} according to CARA criteria.`
        });
      }

      if (wizardState.parentType === 'single_male') {
        recommendations.push({
          type: 'info',
          title: 'Statutory Gender Guideline (Section 5(2))',
          text: 'Under Indian CARA Adoption Regulations, an eligible single male is legally permitted to adopt only a male child.'
        });
      }
    }

    // 2. Health & Readiness Checks
    if (!wizardState.healthStatus) {
      score -= 25;
      recommendations.push({
        type: 'warning',
        title: 'Medical Fitness Certificate Pending',
        text: 'A certified Medical Practitioner report verifying absence of any chronic life-threatening or fatal illness is mandatory.'
      });
    }
    if (!wizardState.financialStability) {
      score -= 20;
      recommendations.push({
        type: 'warning',
        title: 'Financial Readiness Verification',
        text: 'You will need 3 years of Income Tax Returns (ITR) or documented steady income supporting child healthcare and upbringing.'
      });
    }
    if (!wizardState.cleanRecord) {
      score -= 35;
      isLegallyEligible = false;
      recommendations.push({
        type: 'alert',
        title: 'Police Clearance Requirement',
        text: 'Prospective parents must have a verified clean criminal record to protect child welfare.'
      });
    }
    if (!wizardState.homeEnvironment) {
      score -= 10;
      recommendations.push({
        type: 'info',
        title: 'Home Study Preparation',
        text: 'Prepare your home living environment before the social worker conducts the Home Study Report (HSR).'
      });
    }

    // Cap score
    score = Math.max(15, Math.min(score, 98));

    renderScoreUI(score, isLegallyEligible, recommendations);
  }

  function renderScoreUI(score, isEligible, recommendations) {
    const scoreValEl = document.getElementById('results-score-value');
    const badgeEl = document.getElementById('results-status-badge');
    const recListEl = document.getElementById('results-recommendations-container');
    const gaugePath = document.getElementById('gauge-progress-circle');

    if (scoreValEl) scoreValEl.textContent = `${score}%`;

    // SVG dashoffset calculation (circle circumference ~ 377)
    if (gaugePath) {
      const offset = 377 - (377 * (score / 100));
      gaugePath.style.strokeDashoffset = offset;
      if (score >= 80) {
        gaugePath.style.stroke = 'var(--eucalyptus-teal)';
      } else if (score >= 60) {
        gaugePath.style.stroke = 'var(--accent-amber)';
      } else {
        gaugePath.style.stroke = 'var(--primary-terracotta)';
      }
    }

    if (badgeEl) {
      if (score >= 85 && isEligible) {
        badgeEl.textContent = 'Ready for CARA Registration';
        badgeEl.className = 'eligibility-status-badge status-eligible';
      } else if (score >= 60 && isEligible) {
        badgeEl.textContent = 'Conditionally Eligible — Documentation Needed';
        badgeEl.className = 'eligibility-status-badge status-conditional';
      } else {
        badgeEl.textContent = 'Action Required Prior to Application';
        badgeEl.className = 'eligibility-status-badge';
        badgeEl.style.background = 'var(--primary-soft)';
        badgeEl.style.color = 'var(--primary-terracotta)';
      }
    }

    if (recListEl) {
      recListEl.innerHTML = '';
      recommendations.forEach(rec => {
        const item = document.createElement('div');
        item.className = 'rec-item';
        
        let iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        if (rec.type === 'warning') {
          iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (rec.type === 'alert') {
          iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-terracotta)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
        } else if (rec.type === 'info') {
          iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--trust-navy)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        }

        item.innerHTML = `
          ${iconSvg}
          <div>
            <strong>${rec.title}</strong>
            <p style="font-size:0.85rem; color:var(--slate-medium); margin-top:2px;">${rec.text}</p>
          </div>
        `;
        recListEl.appendChild(item);
      });
    }
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);
})();

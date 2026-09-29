/**
 * Aasra Adoption Platform - Legal Process Roadmap & Timeline
 */

(function() {
  'use strict';

  const roadmapStages = [
    {
      id: 1,
      title: 'Portal Registration & Online Dossier',
      duration: '1 – 2 Weeks',
      badge: 'Stage 01: Inception',
      desc: 'Prospective Adoptive Parents (PAPs) register on the national adoption portal (CARINGS). Upload KYC, photograph, birth certificates, and choose state preferences.',
      milestones: [
        {
          title: 'Account Creation & Verification',
          text: 'Fill out Schedule VI with basic demographic details and get your registration ID.'
        },
        {
          title: 'Dossier Upload',
          text: 'Upload scanned copies of PAN, Aadhaar/Passport, Marriage Certificate, and 3-year ITRs within 30 days.'
        },
        {
          title: 'Seniority Queue Generation',
          text: 'Once verified by the State Adoption Resource Agency (SARA), your registration date determines your seniority queue position.'
        }
      ],
      mandatoryDocs: [
        'Form Schedule VI (Application Dossier)',
        'Proof of Residence & Identity (Aadhaar / Passport)',
        'Marriage Certificate (or Single Status Affidavit)',
        'Latest 3 Years ITR / Form 16'
      ],
      proTip: 'Ensure file scans are clean, uncropped, and under the 2MB portal cap. Incomplete document dossiers get paused until re-uploaded.'
    },
    {
      id: 2,
      title: 'Home Study Report (HSR)',
      duration: '1 – 2 Months',
      badge: 'Stage 02: Verification',
      desc: 'A certified social worker from a Specialized Adoption Agency (SAA) visits your home to assess domestic safety, emotional preparedness, and family harmony.',
      milestones: [
        {
          title: 'Agency Assignment',
          text: 'CARINGS assigns an authorized SAA located within your state/district for conducting the Home Study.'
        },
        {
          title: 'Home Visit & Family Interview',
          text: 'The social worker assesses living quarters, neighborhood security, emotional readiness, and interviews both partners and extended family members.'
        },
        {
          title: 'HSR Upload & 3-Year Validity',
          text: 'The social worker completes and uploads Schedule VII. Once approved, the Home Study remains valid for 3 years.'
        }
      ],
      mandatoryDocs: [
        'Schedule VII (Official HSR Report)',
        'Medical Fitness Certificate from CMO',
        '2 Letters of Reference from non-relatives',
        'Police Character Verification Certificate'
      ],
      proTip: 'The home study is not an examination of luxury, but of warmth, security, and child-safe environment. Be candid and genuine regarding your parenting philosophy.'
    },
    {
      id: 3,
      title: 'Child Referral & Matching Phase',
      duration: 'Variable (Queue Based)',
      badge: 'Stage 03: Matching',
      desc: 'Based on seniority and preferences, CARINGS matches a legally free child. Parents receive the Child Study Report (CSR) and Medical Examination Report (MER).',
      milestones: [
        {
          title: 'Referral Notification',
          text: 'You receive an automated SMS/email alert with a 48-hour window to review the child profile.'
        },
        {
          title: 'Pediatrician Consultation',
          text: 'Review the Medical Examination Report (MER) with your trusted independent pediatrician to understand health records.'
        },
        {
          title: 'Child Reservation or Decline',
          text: 'You have up to 48 hours to accept and reserve the child online. You are permitted up to 3 referral options before seniority resets.'
        }
      ],
      mandatoryDocs: [
        'Schedule II (Child Study Report - CSR)',
        'Schedule III (Medical Examination Report - MER)',
        'Pediatrician Evaluation Concurrence',
        'Acceptance Consent Form'
      ],
      proTip: 'Always consult an independent pediatrician to review lab records, vaccination logs, and early growth charts before finalizing your acceptance.'
    },
    {
      id: 4,
      title: 'Pre-Adoption Foster Care',
      duration: '1 – 2 Weeks',
      badge: 'Stage 04: Placement',
      desc: 'Visit the Specialized Adoption Agency to meet your child, complete bonding sessions, and take the child home on an authorized Foster Care Agreement.',
      milestones: [
        {
          title: 'Physical Bonding Meetings',
          text: 'Spend dedicated time at the child care institution over 2-3 days for comfort, feeding, and initial emotional acclimation.'
        },
        {
          title: 'Foster Agreement Execution',
          text: 'Execute Schedule VIII (Pre-Adoption Foster Care Agreement) in the presence of the Agency In-Charge and CWC.'
        },
        {
          title: 'Welcome Home Day',
          text: 'Take your child home! The child legally resides with you in foster care status until the court issues the final order.'
        }
      ],
      mandatoryDocs: [
        'Schedule VIII (Foster Care Agreement)',
        'Physical Handover Protocol Certificate',
        'Child Medical History File & Immunization Card',
        'Government statutory receipt of child maintenance fee'
      ],
      proTip: 'Bring comfort items, familiar clothing colors, or soft toys from the agency to ease the child\'s transition into your home bedroom.'
    },
    {
      id: 5,
      title: 'District Magistrate / Judicial Order',
      duration: '2 – 3 Months',
      badge: 'Stage 05: Legal Decree',
      desc: 'The SAA files an adoption petition before the District Magistrate (DM) or Family Court. The DM conducts a hearing and passes the final legal adoption order.',
      milestones: [
        {
          title: 'Filing of Adoption Petition',
          text: 'Agency counsel files the petition along with HSR, CSR, and consent documents within 10 days of foster placement.'
        },
        {
          title: 'In-Camera Hearing',
          text: 'Brief hearing before the District Magistrate (under JJ Act Amendment). Both parents and child attend; proceedings are private.'
        },
        {
          title: 'Adoption Decree Issued',
          text: 'The DM issues the sealed, certified final Adoption Order declaring you the legal and permanent parents.'
        }
      ],
      mandatoryDocs: [
        'Petition under Section 58(3) or 61 of JJ Act',
        'Original Foster Care Agreement',
        'Certified Copy of DM Adoption Order',
        'Court Fee Challan'
      ],
      proTip: 'Under the 2021 Juvenile Justice Amendment, adoption orders are passed by the District Magistrate directly, significantly speeding up legal finalization.'
    },
    {
      id: 6,
      title: 'Post-Adoption Follow-ups & Citizenship',
      duration: '2 Years (Bi-Annual)',
      badge: 'Stage 06: Integration',
      desc: 'Obtain the official New Birth Certificate showing adoptive parents as mother & father, school registrations, and complete bi-annual social visits.',
      milestones: [
        {
          title: 'New Birth Certificate Issued',
          text: 'Municipal Registrar issues a fresh birth certificate with adoptive parents\' names and amended child name.'
        },
        {
          title: 'Aadhaar & Passport Updation',
          text: 'Enroll child into Aadhaar and apply for passport using the DM adoption decree and new birth certificate.'
        },
        {
          title: 'Bi-Annual Progress Reports',
          text: 'Social worker visits home every 6 months for 2 years to submit post-adoption well-being reports to CARINGS.'
        }
      ],
      mandatoryDocs: [
        'Amended Municipal Birth Certificate',
        'Updated Aadhaar Card',
        '4 Post-Adoption Follow-up Reports (Schedule XII)',
        'School Admission Enrolment Forms'
      ],
      proTip: 'Keep a comprehensive "Life Story Book" or adoption portfolio detailing milestones, first words, and memories. Post-adoption reports are friendly checkpoints.'
    }
  ];

  function init() {
    setupNavButtons();
    renderStage(1);
  }

  function setupNavButtons() {
    const navContainer = document.getElementById('roadmap-nav-container');
    if (!navContainer) return;

    navContainer.innerHTML = '';
    roadmapStages.forEach(stage => {
      const btn = document.createElement('button');
      btn.className = `roadmap-step-btn ${stage.id === 1 ? 'active' : ''}`;
      btn.setAttribute('data-stage-id', stage.id);
      btn.innerHTML = `
        <div class="step-num-pill">Step 0${stage.id}</div>
        <h4>${stage.title}</h4>
        <div class="step-duration">${stage.duration}</div>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.roadmap-step-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderStage(stage.id);
      });
      navContainer.appendChild(btn);
    });
  }

  function renderStage(stageId) {
    const stage = roadmapStages.find(s => s.id === stageId) || roadmapStages[0];
    const panel = document.getElementById('roadmap-detail-panel');
    if (!panel) return;

    const milestonesHtml = stage.milestones.map(m => `
      <li class="milestone-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <div>
          <strong>${m.title}</strong>
          <p>${m.text}</p>
        </div>
      </li>
    `).join('');

    const mandatoryDocsHtml = stage.mandatoryDocs.map(d => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--eucalyptus-teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${d}</span>
      </li>
    `).join('');

    panel.innerHTML = `
      <div class="panel-left">
        <div class="panel-header">
          <span class="stage-badge">${stage.badge}</span>
          <div class="duration-tag">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Estimated: ${stage.duration}</span>
          </div>
        </div>
        <h3 class="panel-title">${stage.title}</h3>
        <p class="panel-desc">${stage.desc}</p>
        
        <h4 style="font-size:1.15rem; color:var(--trust-navy); font-weight:700; margin-bottom:1rem;">
          Key Stage Milestones & Actions
        </h4>
        <ul class="milestones-checklist">
          ${milestonesHtml}
        </ul>
      </div>

      <div class="panel-right">
        <div class="roadmap-side-card">
          <h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-amber)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Statutory Documents
          </h4>
          <ul class="mandatory-docs-list">
            ${mandatoryDocsHtml}
          </ul>

          <h4>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-terracotta)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Counselor's Pro-Tip
          </h4>
          <div class="pro-tip-box">
            ${stage.proTip}
          </div>

          <button class="btn btn-secondary" style="width:100%;" onclick="window.openCounselingModal('Assistance with ${stage.title}')">
            Need Help With This Stage?
          </button>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', init);
})();

/**
 * Aasra Adoption Platform - Statutory Cost & Fee Transparency Estimator
 */

(function() {
  'use strict';

  const domesticFees = [
    {
      item: 'CARINGS Portal Online Registration & Application Fee',
      authority: 'Central Adoption Resource Authority (CARA)',
      amount: 6000,
      notes: 'Payable online directly on official portal via secure gateway.'
    },
    {
      item: 'Home Study Report (HSR) Official Assessment Fee',
      authority: 'Assigned Specialized Adoption Agency (SAA)',
      amount: 6000,
      notes: 'Covers social worker visits, interviews, and official Schedule VII dossier preparation.'
    },
    {
      item: 'Child Care Maintenance & Institution Support Contribution',
      authority: 'Specialized Child Care Institution (CCI)',
      amount: 40000,
      notes: 'Statutory reimbursement towards child healthcare, nutrition, and care during pre-adoption period.'
    },
    {
      item: 'Post-Adoption Follow-Up Reporting (4 Visits over 2 Years)',
      authority: 'Assigned SAA / Social Worker',
      amount: 8000,
      notes: '₹2,000 per bi-annual follow-up visit for two years to ensure child well-being.'
    },
    {
      item: 'District Magistrate Judicial Court Petition & Notarization',
      authority: 'District Administration / Legal Counsel',
      amount: 5000,
      notes: 'Drafting adoption petition, court fee stamps, and certified decree copies.'
    }
  ];

  const nriFees = [
    {
      item: 'CARINGS Overseas Registration & Central Authority Verification',
      authority: 'CARA / Hague Central Authority',
      amount: 25000,
      notes: 'International dossier verification and diplomatic forwarding.'
    },
    {
      item: 'Authorized Foreign Adoption Agency (AFAA) Home Study',
      authority: 'Accredited Foreign Adoption Agency',
      amount: 120000,
      notes: 'Conduct of HSR in adoptive parent\'s country of residence as per Hague standards.'
    },
    {
      item: 'Child Care & Medical Maintenance Fund (In-Country CCI)',
      authority: 'Indian Child Care Institution',
      amount: 350000,
      notes: 'Statutory child care corpus equivalent to regulated international standard ($4,500 - $5,000 USD cap).'
    },
    {
      item: 'Article 5 / 17 Hague Certification & Passport Documentation',
      authority: 'CARA & Regional Passport Office',
      amount: 30000,
      notes: 'Issuance of Certificate of Conformity of Inter-country Adoption and exit visa clearance.'
    }
  ];

  let currentMode = 'domestic'; // 'domestic' or 'nri'

  function init() {
    setupToggles();
    renderFees();
  }

  function setupToggles() {
    const domesticBtn = document.getElementById('cost-btn-domestic');
    const nriBtn = document.getElementById('cost-btn-nri');

    if (domesticBtn && nriBtn) {
      domesticBtn.addEventListener('click', () => {
        domesticBtn.classList.add('active');
        nriBtn.classList.remove('active');
        currentMode = 'domestic';
        renderFees();
      });

      nriBtn.addEventListener('click', () => {
        nriBtn.classList.add('active');
        domesticBtn.classList.remove('active');
        currentMode = 'nri';
        renderFees();
      });
    }
  }

  function renderFees() {
    const tableBody = document.getElementById('cost-table-body');
    const totalEl = document.getElementById('cost-total-amount');
    const noteEl = document.getElementById('cost-schedule-note');
    if (!tableBody) return;

    const data = currentMode === 'domestic' ? domesticFees : nriFees;
    let total = 0;

    tableBody.innerHTML = data.map(item => {
      total += item.amount;
      return `
        <tr>
          <td>
            <strong style="color:var(--trust-navy); display:block;">${item.item}</strong>
            <span style="font-size:0.8rem; color:var(--slate-medium);">${item.notes}</span>
          </td>
          <td>
            <span style="font-size:0.85rem; font-weight:600; color:var(--slate-dark);">${item.authority}</span>
          </td>
          <td style="font-weight:700; color:var(--trust-navy); white-space:nowrap;">
            ₹${item.amount.toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    if (totalEl) {
      totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    if (noteEl) {
      noteEl.textContent = currentMode === 'domestic' 
        ? 'Regulated strictly under Schedule XIII of Adoption Regulations 2022. No agency may demand any additional amount.' 
        : 'Statutory fees in accordance with the 1993 Hague Convention on Protection of Children and Intercountry Adoption.';
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();

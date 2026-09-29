/**
 * Aasra Adoption Platform - Document Readiness Vault
 */

(function() {
  'use strict';

  const initialDocuments = [
    {
      id: 'doc-pan',
      title: 'PAN Card (Both Spouses / Single Parent)',
      category: 'identity',
      mandatory: true,
      desc: 'Clear scanned copy for identity and tax verification on CARINGS portal.',
      completed: true,
      fileName: 'PAN_Copy_PAPs.pdf'
    },
    {
      id: 'doc-aadhaar',
      title: 'Aadhaar Card / Passport (Citizenship Proof)',
      category: 'identity',
      mandatory: true,
      desc: 'Government photo identity proving Indian citizenship or NRI status.',
      completed: true,
      fileName: 'Passport_Identity_Verified.pdf'
    },
    {
      id: 'doc-residence',
      title: 'Current Proof of Residence',
      category: 'identity',
      mandatory: true,
      desc: 'Electricity bill, registered rent agreement (minimum 1-year validity), or property deed.',
      completed: false,
      fileName: ''
    },
    {
      id: 'doc-marriage',
      title: 'Marriage Certificate / Single Status Affidavit',
      category: 'family',
      mandatory: true,
      desc: 'Government registered marriage certificate (2+ years stability) or single parent sworn affidavit.',
      completed: true,
      fileName: 'Marriage_Reg_Certificate.pdf'
    },
    {
      id: 'doc-family-photo',
      title: 'Recent Postcard Family Photograph',
      category: 'family',
      mandatory: true,
      desc: 'Latest clear color photograph of prospective adoptive parents together at home.',
      completed: false,
      fileName: ''
    },
    {
      id: 'doc-itr',
      title: 'Income Tax Returns (Last 3 Financial Years)',
      category: 'financial',
      mandatory: true,
      desc: 'ITR-V acknowledgement or Form 16 demonstrating financial stability.',
      completed: false,
      fileName: ''
    },
    {
      id: 'doc-bank',
      title: 'Bank Statement (Last 6 Months)',
      category: 'financial',
      mandatory: true,
      desc: 'Bank statement reflecting regular salary or business income deposits.',
      completed: false,
      fileName: ''
    },
    {
      id: 'doc-medical',
      title: 'CMO Medical Fitness Certificate (Schedule VI-A)',
      category: 'medical',
      mandatory: true,
      desc: 'Signed certificate from Chief Medical Officer / Registered Doctor certifying fitness and absence of contagious or terminal illness.',
      completed: false,
      fileName: ''
    },
    {
      id: 'doc-police',
      title: 'Police Clearance Certificate (PCC) / Verification',
      category: 'legal',
      mandatory: true,
      desc: 'Character and background verification certificate issued by local police authorities.',
      completed: false,
      fileName: ''
    },
    {
      id: 'doc-reference',
      title: 'Two Recommendation Letters from Non-Relatives',
      category: 'legal',
      mandatory: true,
      desc: 'Letters of reference from respectable community members testifying to character and parenting readiness.',
      completed: false,
      fileName: ''
    }
  ];

  const STORAGE_KEY = 'aasra_doc_vault_state';
  let documents = [];
  let currentCategory = 'all';

  function init() {
    loadState();
    setupCategoryTabs();
    setupDownloadBtn();
    renderVault();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        documents = JSON.parse(saved);
      } else {
        documents = [...initialDocuments];
        saveState();
      }
    } catch (e) {
      documents = [...initialDocuments];
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.vault-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-cat');
        renderVault();
      });
    });
  }

  function setupDownloadBtn() {
    const btn = document.getElementById('download-vault-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function toggleDocStatus(docId) {
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      doc.completed = !doc.completed;
      if (doc.completed && !doc.fileName) {
        doc.fileName = 'Uploaded_Document.pdf';
      }
      saveState();
      renderVault();
      window.showToast(`${doc.title} marked as ${doc.completed ? 'Ready' : 'Pending'}.`, doc.completed ? 'success' : 'info');
    }
  }

  function simulateFileUpload(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    // Simulate file input prompt
    const fakeFileName = `${doc.title.split(' ')[0]}_Dossier_Verified.pdf`;
    doc.completed = true;
    doc.fileName = fakeFileName;
    saveState();
    renderVault();
    window.showToast(`Uploaded simulated file: ${fakeFileName}`, 'success');
  }

  function renderVault() {
    // 1. Calculate overall stats
    const total = documents.length;
    const completed = documents.filter(d => d.completed).length;
    const percent = Math.round((completed / total) * 100);

    const percentText = document.getElementById('vault-percent-text');
    const fillBar = document.getElementById('vault-progress-fill');
    const countBadge = document.getElementById('vault-count-badge');

    if (percentText) percentText.textContent = `${percent}% Ready`;
    if (fillBar) fillBar.style.width = `${percent}%`;
    if (countBadge) countBadge.textContent = `${completed} of ${total} Completed`;

    // 2. Filter documents
    const listEl = document.getElementById('doc-items-list');
    if (!listEl) return;

    const filtered = currentCategory === 'all' 
      ? documents 
      : documents.filter(d => d.category === currentCategory);

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div style="text-align:center; padding: 2.5rem; color: var(--slate-medium);">
          No documents found in this category.
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(doc => `
      <div class="doc-item-row ${doc.completed ? 'completed' : ''}">
        <div class="doc-left">
          <button class="doc-check-btn" onclick="window.toggleDocVaultItem('${doc.id}')" aria-label="Toggle document status">
            ${doc.completed ? `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ` : ''}
          </button>
          <div class="doc-info">
            <h5>${doc.title} ${doc.mandatory ? '<span style="color:var(--primary-terracotta); font-size:0.8rem;">*Mandatory</span>' : ''}</h5>
            <p>${doc.desc}</p>
            ${doc.fileName ? `<span style="display:inline-block; margin-top:4px; font-size:0.78rem; color:var(--eucalyptus-teal); font-weight:600;">📎 ${doc.fileName}</span>` : ''}
          </div>
        </div>

        <div class="doc-right">
          <span class="doc-status-badge ${doc.completed ? 'doc-status-ready' : 'doc-status-missing'}">
            ${doc.completed ? 'Verified & Ready' : 'Pending Upload'}
          </span>
          <button class="btn btn-secondary" style="padding:0.45rem 0.9rem; font-size:0.82rem;" onclick="window.simulateDocUpload('${doc.id}')">
            ${doc.completed ? 'Replace' : 'Upload File'}
          </button>
        </div>
      </div>
    `).join('');
  }

  // Expose global methods for inline HTML onclicks
  window.toggleDocVaultItem = toggleDocStatus;
  window.simulateDocUpload = simulateFileUpload;

  document.addEventListener('DOMContentLoaded', init);
})();

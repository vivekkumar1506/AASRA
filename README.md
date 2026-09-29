# Aasra — Adoption Guidance & Child Care Discovery Platform

A modern, empathetic, and comprehensive interactive web application designed to guide prospective adoptive parents through legal child adoption in India (CARA compliant).

## 🚀 How to Run
- **Zero installation required!**
- Simply **double-click `index.html`** to open the application in any web browser (Chrome, Edge, Firefox, Safari).
- All scripts and styles are client-side and work seamlessly offline.

---

## 📁 Project Structure

```
aasra-adoption-platform/
│
├── index.html                      # Semantic HTML5 Application Shell
├── README.md                       # Documentation & Quickstart Guide
│
├── css/                            # Modular Vanilla CSS Stylesheets
│   ├── design-tokens.css           # Brand color palettes, typography, spacing, dark mode tokens
│   ├── main.css                    # Layout, navigation header, hero, footer, responsive grids
│   └── components.css              # Wizard steps, roadmap timeline, discovery cards, vault, modals
│
├── js/                             # Modular Vanilla JavaScript Logic
│   ├── app.js                      # Theme toggle (Dark/Light), navigation, modal manager, toasts
│   ├── eligibility-checker.js      # Dynamic 4-step adoption eligibility & composite age calculator
│   ├── process-roadmap.js          # Interactive 6-stage legal adoption roadmap & requirements
│   ├── discovery-explorer.js       # Ethical child care discovery & care guide modals
│   ├── document-vault.js           # Document readiness vault with live progress & localStorage
│   ├── cost-calculator.js          # Statutory fee estimator & anti-corruption guidelines
│   └── agency-directory.js         # Searchable Specialized Adoption Agency (SAA) directory
│
└── assets/
    └── images/                     # Curated high-resolution imagery
        ├── hero-family.jpg          # Loving family hero banner
        ├── child-care-discovery.jpg # Nursery & child care discovery banner
        └── counseling-support.jpg   # Compassionate counseling support session
```

---

## ✨ Features Included
1. **Interactive Adoption Eligibility Calculator**: Multi-step quiz evaluating marital status, individual and composite age thresholds against statutory CARA limits, with an instant gauge scorecard and printable report.
2. **Step-by-Step Legal Process Roadmap**: 6 interactive stages covering Portal Registration, Home Study Report (HSR), Child Matching, Foster Placement, DM Court Order, and Post-Adoption Follow-ups.
3. **Ethical Child Discovery & Care Explorer**: Profiles for Infants, Toddlers, Older Children, Biological Siblings, and Special Healthcare Needs with detailed care guides.
4. **Interactive Document Readiness Vault**: Dynamic checklist with live progress tracking, simulated file uploads, and browser persistence (`localStorage`).
5. **Statutory Cost & Fee Transparency**: Domestic vs. NRI fee breakdown with anti-middlemen legal protections under the Juvenile Justice Act.
6. **Authorized Agency Directory**: Search and filter Specialized Adoption Agencies (SAAs) by state and district.
7. **Theme Switcher**: Instant toggle between "Warm Dawn" (light) and "Serene Twilight" (dark).
8. **Confidential Counseling Booking**: Interactive booking modal with form validation and confirmation alerts.

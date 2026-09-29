/**
 * R Bukhari Creative Institute - Interactive Engine
 * Handles navigation, course filters, syllabus modal, admissions, and certificate validation
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Curriculum Database for Populating Modals ---
  const courseDatabase = {
    "Graphic Designing Onsite": {
      tag: "Onsite Studio • 3 Months",
      desc: "Comprehensive studio practice inside our modern computer lab in Chichawatni. Master Adobe Photoshop, Illustrator, and InDesign to produce real-world commercial collateral.",
      modules: [
        "Vector Illustration & Logo Architecture",
        "Photo Manipulation & Creative Retouching",
        "Print Standards & Packaging Design",
        "Upwork & Behance Portfolio Construction"
      ]
    },
    "Digital Marketing Onsite": {
      tag: "Onsite Studio • 2 Months",
      desc: "Learn to manage ad budgets and scale businesses. Practical campaign setups on Facebook Ads Manager, Instagram promotion, TikTok creator strategy, and client onboarding.",
      modules: [
        "Buyer Persona & Target Funnel Architecture",
        "Meta Ads Manager Mastery & Pixel Tracking",
        "Creative Ad Copywriting & Video Scripts",
        "Client Proposal & Retention Blueprints"
      ]
    },
    "YouTube Automation Onsite": {
      tag: "Onsite Studio • 2 Months",
      desc: "Build faceless high-revenue YouTube channels. Step-by-step guidance on profitable niche research, AI voice synthesis, Premiere Pro timeline workflows, and viral thumbnail design.",
      modules: [
        "Cash-Cow Niche & Competitor Research",
        "AI Scriptwriting Pipelines (ChatGPT + ElevenLabs)",
        "Video Editing Speed Techniques in Premiere Pro",
        "YouTube SEO, CTR Optimization & Monetization"
      ]
    },
    "Office Management Onsite": {
      tag: "Onsite Studio • 3 Months",
      desc: "Equip yourself with indispensable administrative IT competencies. Advance from typing proficiency to complex Excel financial modeling and executive presentations.",
      modules: [
        "Advanced Excel Formulas (VLOOKUP, Pivot Tables)",
        "Executive MS Word Documentation Standards",
        "Corporate PowerPoint Presentation Design",
        "Business Email Etiquette & IT Systems Hygiene"
      ]
    },
    "Shopify Complete Course": {
      tag: "Online Learning • 6 Weeks",
      desc: "Master global and local dropshipping. Build conversion-optimized Shopify storefronts from scratch, source winning products, and integrate payment gateways.",
      modules: [
        "Store Theme Customization & UI Optimization",
        "Winning Product Hunting & Supplier Verification",
        "Payment Gateways Setup for Pakistani Merchants",
        "TikTok & Meta Ads for High-Volume Orders"
      ]
    },
    "Facebook Ads / Marketing": {
      tag: "Online Learning • 4 Weeks",
      desc: "Focused masterclass for freelancers and agency owners aiming to master Meta advertising and drive predictable leads for clients.",
      modules: [
        "Advanced Audience Segmentation & Lookalikes",
        "CBO vs. ABO Budget Testing Methodologies",
        "ROAS Calculation & Scaling Profitable Ad Sets",
        "Handling Ad Account Restrictions & Recovery"
      ]
    },
    "Google Ads Course": {
      tag: "Online Learning • 4 Weeks",
      desc: "Capture high-intent search traffic with Google Search, Display, and Performance Max ad campaigns.",
      modules: [
        "Keyword Intent Analysis & Negative Keyword Lists",
        "Google Search Campaign Setup & Quality Score",
        "Performance Max Campaigns & Asset Groups",
        "Conversion Action Setup via Google Tag Manager"
      ]
    },
    "Computer Course Basic to Advance": {
      tag: "Onsite & Online • 2 Months",
      desc: "The ultimate foundational course for students beginning their computer literacy and IT journey.",
      modules: [
        "Windows Operating System Administration",
        "Touch Typing & Keyboard Speed Development",
        "Safe Web Browsing & Cloud Storage Tools",
        "Troubleshooting Common PC Hardware & Software"
      ]
    },
    "Mobile Graphics Designing": {
      tag: "Online Learning • 4 Weeks",
      desc: "Design professional-quality graphics and social reels entirely on your Android or iPhone without needing a high-end PC.",
      modules: [
        "Canva Pro & Pixellab Mastery",
        "Mobile Poster & Thumbnail Composition",
        "CapCut Video Reels & Aesthetic Color Grading",
        "Direct Client Freelancing from Smartphone"
      ]
    }
  };

  // --- 1. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }

  // --- 2. Course Filters (courses.html) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catalogCards = document.querySelectorAll('.catalog-grid .course-pill-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        catalogCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 3. Curriculum Modal Handling (courses.html) ---
  const modal = document.getElementById('syllabusModal');
  const closeBtn = document.getElementById('closeSyllabusModal');
  const mTitle = document.getElementById('mTitle');
  const mDesc = document.getElementById('mDesc');
  const mTrack = document.getElementById('mTrack');
  const mList = document.getElementById('mCurriculumList');
  const mEnrollLink = document.getElementById('mEnrollLink');

  document.querySelectorAll('.btn-trigger-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.getAttribute('data-course');
      const data = courseDatabase[courseName];

      if (data && modal) {
        mTitle.textContent = courseName;
        mDesc.textContent = data.desc;
        mTrack.textContent = data.tag;
        mList.innerHTML = data.modules.map(mod => `<li><i class="fa-solid fa-circle-check"></i> ${mod}</li>`).join('');
        mEnrollLink.href = `admissions.html?course=${encodeURIComponent(courseName)}`;
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // --- 4. Auto-Fill Course in admissions.html from URL Query ---
  const urlParams = new URLSearchParams(window.location.search);
  const courseParam = urlParams.get('course');
  const courseSelect = document.getElementById('fCourse');

  if (courseParam && courseSelect) {
    for (let opt of courseSelect.options) {
      if (opt.value === courseParam) {
        courseSelect.value = courseParam;
        break;
      }
    }
  }

  // Mode Switch in admissions.html
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-mode');
      if (courseSelect) {
        if (mode === 'onsite') {
          courseSelect.value = "Graphic Designing Onsite";
        } else {
          courseSelect.value = "Shopify Complete Course";
        }
      }
    });
  });

  // --- 5. Application Form Submission via WhatsApp ---
  const appForm = document.getElementById('appForm');
  const formResultBox = document.getElementById('formResultBox');
  const btnReset = document.getElementById('btnResetForm');

  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fName').value.trim();
      const phone = document.getElementById('fPhone').value.trim();
      const email = document.getElementById('fEmail').value.trim();
      const course = document.getElementById('fCourse').value;
      const batch = document.getElementById('fBatch').value;
      const goals = document.getElementById('fGoals').value.trim();

      const text = `*New Admission Application - R Bukhari Institute*%0A%0A` +
                   `*Applicant:* ${encodeURIComponent(name)}%0A` +
                   `*Phone:* ${encodeURIComponent(phone)}%0A` +
                   `*Email:* ${encodeURIComponent(email)}%0A` +
                   `*Program:* ${encodeURIComponent(course)}%0A` +
                   `*Shift:* ${encodeURIComponent(batch)}%0A` +
                   `*Goals:* ${encodeURIComponent(goals || 'Standard enrollment')}`;

      // Open WhatsApp direct
      window.open(`https://wa.me/923107735336?text=${text}`, '_blank');

      appForm.style.display = 'none';
      formResultBox.classList.add('show');
    });
  }

  if (btnReset && appForm) {
    btnReset.addEventListener('click', () => {
      appForm.reset();
      appForm.style.display = 'block';
      formResultBox.classList.remove('show');
    });
  }

  // --- 6. Certificate Verification Demo (verify.html) ---
  const verifyCardForm = document.getElementById('verifyCardForm');
  const verifyResultDisplay = document.getElementById('verifyResultDisplay');

  if (verifyCardForm) {
    verifyCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const rollInput = document.getElementById('vRoll').value.trim();
      if (rollInput && verifyResultDisplay) {
        document.getElementById('resID').textContent = rollInput;
        verifyResultDisplay.classList.add('show');
      }
    });
  }

  // Handle URL query on verify.html if passed from index.html quick form
  const certIdParam = urlParams.get('cert_id');
  if (certIdParam && document.getElementById('vRoll')) {
    document.getElementById('vRoll').value = certIdParam;
    if (verifyResultDisplay) {
      document.getElementById('resID').textContent = certIdParam;
      verifyResultDisplay.classList.add('show');
    }
  }

});

document.addEventListener('DOMContentLoaded', () => {
  Auth.requireAuth();

  // Sidebar controls
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  document.getElementById('toggleSidebar')?.addEventListener('click', () => {
    sidebar.classList.add('show');
    sidebarBackdrop.classList.add('show');
  });
  const closeSidebar = () => {
    sidebar.classList.remove('show');
    sidebarBackdrop.classList.remove('show');
  };
  document.getElementById('closeSidebar')?.addEventListener('click', closeSidebar);
  sidebarBackdrop?.addEventListener('click', closeSidebar);
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
  });

  const grid = document.getElementById('companiesGrid');
  const searchInput = document.getElementById('searchCompany');
  let currentCategory = 'All';
  let allCompanies = [];

  const companyModal = new bootstrap.Modal(document.getElementById('companyDetailModal'));

  // Category filter buttons
  document.querySelectorAll('.company-cat-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.company-cat-btn').forEach((b) => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.getAttribute('data-cat');
      filterAndRender();
    });
  });

  searchInput.addEventListener('input', filterAndRender);

  async function loadCompanies() {
    try {
      const res = await API.get('/api/companies');
      if (res.success) {
        allCompanies = res.companies;
        filterAndRender();
      }
    } catch (err) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-danger">
          Failed to load companies data. Please refresh page.
        </div>
      `;
    }
  }

  function filterAndRender() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filtered = allCompanies.filter((c) => {
      const matchCat = currentCategory === 'All' || c.category === currentCategory;
      const matchSearch = c.name.toLowerCase().includes(searchTerm) || c.description.toLowerCase().includes(searchTerm);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5 text-muted">
          <i class="bi bi-building-exclamation fs-1 text-secondary d-block mb-2"></i> No companies found matching your search criteria.
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (c) => `
      <div class="col-md-6 col-lg-4">
        <div class="stat-card h-100 p-4 d-flex flex-column justify-content-between">
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="p-2 rounded border bg-white shadow-sm" style="width: 54px; height: 54px; display:flex; align-items:center; justify-content:center;">
                <img src="${c.logo || 'https://via.placeholder.com/50'}" alt="${c.name}" style="max-width: 40px; max-height: 40px; object-fit: contain;" onerror="this.src='https://via.placeholder.com/50?text=Logo'" />
              </div>
              <span class="badge bg-primary-subtle text-primary">${c.category || 'Product'}</span>
            </div>
            <h4 class="fw-bold text-navy mb-1">${escapeHtml(c.name)}</h4>
            <div class="text-success small fw-semibold mb-2"><i class="bi bi-cash-stack me-1"></i> CTC: ${escapeHtml(c.packageRange || 'Competitive')}</div>
            <p class="text-muted small mb-3">${escapeHtml(c.description ? c.description.substring(0, 90) + '...' : '')}</p>

            <div class="d-flex flex-wrap gap-1 mb-3">
              ${(c.skills || [])
                .slice(0, 4)
                .map((s) => `<span class="badge bg-light text-dark border small">${escapeHtml(s)}</span>`)
                .join('')}
            </div>
          </div>

          <button class="btn btn-outline-custom w-100 mt-2 view-company-btn" data-id="${c._id}">
            View Placement Guide <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    `
      )
      .join('');

    // Attach click handlers
    document.querySelectorAll('.view-company-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('button').getAttribute('data-id');
        openCompanyDetail(id);
      });
    });
  }

  function openCompanyDetail(id) {
    const company = allCompanies.find((c) => c._id === id);
    if (!company) return;

    document.getElementById('modalCompanyName').textContent = company.name;
    document.getElementById('modalCategoryPackage').textContent = `${company.category || 'Product'} Company | CTC: ${company.packageRange || 'Best in Industry'}`;
    document.getElementById('modalDescription').textContent = company.description;

    const logoImg = document.getElementById('modalLogo');
    logoImg.src = company.logo || 'https://via.placeholder.com/50';

    // Skills
    const skillsContainer = document.getElementById('modalSkillsList');
    skillsContainer.innerHTML = (company.skills || [])
      .map((s) => `<span class="badge bg-primary px-3 py-2 fs-6">${escapeHtml(s)}</span>`)
      .join('');

    // Aptitude Topics
    const aptContainer = document.getElementById('modalAptitudeTopics');
    aptContainer.innerHTML = (company.aptitudeTopics || ['Quantitative', 'Logical Reasoning', 'Verbal'])
      .map((t) => `<span class="badge bg-secondary px-3 py-2 fs-6">${escapeHtml(t)}</span>`)
      .join('');

    // Coding Questions
    const codingContainer = document.getElementById('modalCodingList');
    if (company.codingQuestions && company.codingQuestions.length > 0) {
      codingContainer.innerHTML = company.codingQuestions
        .map(
          (q) => `
        <div class="list-group-item d-flex justify-content-between align-items-center py-3">
          <div>
            <div class="fw-bold text-navy">${escapeHtml(q.title)}</div>
            <span class="badge bg-light text-dark border small">${escapeHtml(q.topic || 'DSA')}</span>
            <span class="badge bg-warning-subtle text-warning small ms-1">${escapeHtml(q.difficulty || 'Medium')}</span>
          </div>
          <a href="${q.link || 'https://leetcode.com'}" target="_blank" class="btn btn-sm btn-outline-primary">Solve Problem</a>
        </div>
      `
        )
        .join('');
    } else {
      codingContainer.innerHTML = `<div class="p-3 text-muted">Standard DSA problems (Arrays, Trees, Dynamic Programming) asked in interviews.</div>`;
    }

    // Technical Questions Accordion
    const techContainer = document.getElementById('modalTechAccordion');
    if (company.technicalQuestions && company.technicalQuestions.length > 0) {
      techContainer.innerHTML = company.technicalQuestions
        .map(
          (t, idx) => `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${idx}">
            <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idx}">
              Q${idx + 1}: ${escapeHtml(t.question)}
            </button>
          </h2>
          <div id="collapse${idx}" class="accordion-collapse collapse" data-bs-parent="#modalTechAccordion">
            <div class="accordion-body bg-light small text-muted">
              <strong>Category:</strong> ${escapeHtml(t.category || 'General CS')}<br/>
              <strong>Answer Guidance / Key Points:</strong> ${escapeHtml(t.answerHint || 'Focus on core principles, trade-offs and code examples.')}
            </div>
          </div>
        </div>
      `
        )
        .join('');
    } else {
      techContainer.innerHTML = `<div class="p-3 text-muted">Technical round questions focus on DBMS Normalization, OS Threads vs Processes, and Networking protocols.</div>`;
    }

    // HR Questions
    const hrContainer = document.getElementById('modalHRList');
    if (company.hrQuestions && company.hrQuestions.length > 0) {
      hrContainer.innerHTML = company.hrQuestions
        .map(
          (h) => `
        <div class="list-group-item py-3">
          <div class="fw-bold text-navy"><i class="bi bi-question-circle text-primary me-2"></i> ${escapeHtml(h.question)}</div>
          <div class="text-muted small mt-1"><strong>HR Tip:</strong> ${escapeHtml(h.tip || 'Structure answer with clear real-life examples.')}</div>
        </div>
      `
        )
        .join('');
    } else {
      hrContainer.innerHTML = `<div class="p-3 text-muted">Standard HR questions: "Tell me about yourself", "Why this company?", "Strengths and Weaknesses".</div>`;
    }

    companyModal.show();
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  loadCompanies();
});

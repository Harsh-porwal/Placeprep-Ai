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

  let selectedTopic = 'All';
  const filterDifficulty = document.getElementById('filterDifficulty');
  const filterStatus = document.getElementById('filterStatus');
  const filterCompany = document.getElementById('filterCompany');
  const resetFiltersBtn = document.getElementById('resetFilters');
  const tableBody = document.getElementById('problemsTableBody');
  const solvedCounter = document.getElementById('solvedCounter');

  // Topic chip click handlers
  document.querySelectorAll('.chip-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.chip-btn').forEach((b) => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-secondary');
      });
      e.target.classList.remove('btn-outline-secondary');
      e.target.classList.add('btn-primary', 'active');
      selectedTopic = e.target.getAttribute('data-topic');
      loadQuestions();
    });
  });

  // Filter change listeners
  filterDifficulty.addEventListener('change', loadQuestions);
  filterStatus.addEventListener('change', loadQuestions);
  filterCompany.addEventListener('input', debounce(loadQuestions, 300));
  resetFiltersBtn.addEventListener('click', () => {
    selectedTopic = 'All';
    document.querySelectorAll('.chip-btn').forEach((b) => {
      b.classList.remove('btn-primary', 'active');
      b.classList.add('btn-outline-secondary');
    });
    document.querySelector('.chip-btn[data-topic="All"]').classList.add('btn-primary', 'active');
    filterDifficulty.value = 'All';
    filterStatus.value = 'All';
    filterCompany.value = '';
    loadQuestions();
  });

  async function loadQuestions() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4 text-muted">
          <span class="spinner-border spinner-border-sm me-2"></span> Filtering problems...
        </td>
      </tr>
    `;

    const topicParam = encodeURIComponent(selectedTopic);
    const diffParam = encodeURIComponent(filterDifficulty.value);
    const statusParam = encodeURIComponent(filterStatus.value);
    const companyParam = encodeURIComponent(filterCompany.value.trim());

    try {
      const url = `/api/coding/questions?topic=${topicParam}&difficulty=${diffParam}&status=${statusParam}&company=${companyParam}`;
      const res = await API.get(url);

      if (res.success) {
        renderTable(res.questions);
      }
    } catch (err) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-danger">
            Failed to load coding questions. Please try again.
          </td>
        </tr>
      `;
    }
  }

  function renderTable(questions) {
    if (!questions || questions.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i> No coding problems match your selected filters.
          </td>
        </tr>
      `;
      return;
    }

    let solvedCount = 0;
    tableBody.innerHTML = questions
      .map((q) => {
        if (q.isSolved) solvedCount++;
        const badgeClass =
          q.difficulty === 'Easy'
            ? 'badge-easy'
            : q.difficulty === 'Medium'
            ? 'badge-medium'
            : 'badge-hard';

        return `
        <tr>
          <td>
            <div class="form-check fs-5">
              <input class="form-check-input solved-checkbox" type="checkbox" data-id="${q._id}" ${q.isSolved ? 'checked' : ''} />
            </div>
          </td>
          <td>
            <div class="fw-semibold text-navy">${escapeHtml(q.title)}</div>
            <div class="text-muted small">${escapeHtml(q.description ? q.description.substring(0, 75) + '...' : '')}</div>
          </td>
          <td><span class="badge bg-light text-dark border">${escapeHtml(q.topic)}</span></td>
          <td><span class="badge ${badgeClass} px-2 py-1">${q.difficulty}</span></td>
          <td><span class="text-muted small">${escapeHtml(q.company || 'All')}</span></td>
          <td>
            <a href="${q.externalLink || 'https://leetcode.com'}" target="_blank" class="btn btn-sm btn-outline-primary">
              Solve <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </td>
        </tr>
      `;
      })
      .join('');

    solvedCounter.textContent = `Solved: ${solvedCount} / ${questions.length}`;

    // Add checkbox event listeners
    document.querySelectorAll('.solved-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', async (e) => {
        const questionId = e.target.getAttribute('data-id');
        const isSolved = e.target.checked;

        try {
          const res = await API.post('/api/coding/progress', {
            questionId,
            solved: isSolved,
          });

          if (res.success) {
            loadQuestions(); // Reload to refresh counters
          }
        } catch (err) {
          e.target.checked = !isSolved; // Revert on failure
          alert('Failed to update progress status.');
        }
      });
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Initial Load
  loadQuestions();
});

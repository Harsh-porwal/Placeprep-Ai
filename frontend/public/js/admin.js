document.addEventListener('DOMContentLoaded', async () => {
  Auth.requireAdmin();

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

  // Load Admin Stats
  try {
    const statsRes = await API.get('/api/admin/stats');
    if (statsRes.success && statsRes.stats) {
      document.getElementById('statAdminStudents').textContent = statsRes.stats.totalStudents;
      document.getElementById('statAdminCompanies').textContent = statsRes.stats.totalCompanies;
      document.getElementById('statAdminQuestions').textContent = statsRes.stats.totalQuestions;
      document.getElementById('statAdminInterviews').textContent = statsRes.stats.totalInterviews;
    }
  } catch (err) {
    console.error('Failed to load admin stats:', err);
  }

  // Load Registered Students
  try {
    const studentsRes = await API.get('/api/admin/students');
    const tableBody = document.getElementById('studentsTableBody');

    if (studentsRes.success && studentsRes.students.length > 0) {
      tableBody.innerHTML = studentsRes.students
        .map(
          (s) => `
        <tr>
          <td class="fw-semibold text-navy">${escapeHtml(s.name)}</td>
          <td>${escapeHtml(s.email)}</td>
          <td>${escapeHtml(s.college || 'N/A')}</td>
          <td>${escapeHtml(s.degree || 'B.Tech')} - ${escapeHtml(s.branch || 'CSE')}</td>
          <td><span class="badge bg-light text-dark border">${escapeHtml(s.graduationYear || '2026')}</span></td>
        </tr>
      `
        )
        .join('');
    } else {
      tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No student records found.</td></tr>`;
    }
  } catch (err) {
    document.getElementById('studentsTableBody').innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Error loading students list.</td></tr>`;
  }

  // Add Company Handler
  document.getElementById('addCompanyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('compName').value.trim();
    const category = document.getElementById('compCategory').value;
    const packageRange = document.getElementById('compPackage').value.trim();
    const logo = document.getElementById('compLogo').value.trim();
    const description = document.getElementById('compDesc').value.trim();
    const skills = document.getElementById('compSkills').value.trim();

    try {
      const res = await API.post('/api/admin/companies', {
        name,
        category,
        packageRange,
        logo,
        description,
        skills,
      });

      if (res.success) {
        alert('Company added successfully!');
        e.target.reset();
      }
    } catch (err) {
      alert(err.message || 'Failed to add company.');
    }
  });

  // Add Coding Question Handler
  document.getElementById('addCodingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('codeTitle').value.trim();
    const topic = document.getElementById('codeTopic').value;
    const difficulty = document.getElementById('codeDiff').value;
    const company = document.getElementById('codeCompany').value.trim();
    const externalLink = document.getElementById('codeLink').value.trim();
    const description = document.getElementById('codeDesc').value.trim();

    try {
      const res = await API.post('/api/admin/questions', {
        title,
        topic,
        difficulty,
        company,
        externalLink,
        description,
      });

      if (res.success) {
        alert('Coding question added successfully!');
        e.target.reset();
      }
    } catch (err) {
      alert(err.message || 'Failed to add coding question.');
    }
  });

  // Add Aptitude Question Handler
  document.getElementById('addAptitudeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = document.getElementById('aptQuestion').value.trim();
    const category = document.getElementById('aptCategory').value;
    const correctAnswer = document.getElementById('aptCorrect').value;
    const options = [
      document.getElementById('aptOpt0').value.trim(),
      document.getElementById('aptOpt1').value.trim(),
      document.getElementById('aptOpt2').value.trim(),
      document.getElementById('aptOpt3').value.trim(),
    ];
    const explanation = document.getElementById('aptExplanation').value.trim();

    try {
      const res = await API.post('/api/admin/aptitude', {
        question,
        category,
        correctAnswer,
        options,
        explanation,
      });

      if (res.success) {
        alert('Aptitude question added successfully!');
        e.target.reset();
      }
    } catch (err) {
      alert(err.message || 'Failed to add aptitude question.');
    }
  });

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});

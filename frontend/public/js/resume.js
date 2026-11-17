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

  const form = document.getElementById('resumeForm');
  const alertBox = document.getElementById('alertBox');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');

  const emptyState = document.getElementById('emptyState');
  const reportContainer = document.getElementById('reportContainer');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');

    const fileInput = document.getElementById('resumeFile');
    const resumeText = document.getElementById('resumeText').value.trim();
    const targetJobTitle = document.getElementById('targetJobTitle').value.trim();
    const targetJobDescription = document.getElementById('targetJobDescription').value.trim();

    if (!fileInput.files[0] && !resumeText) {
      alertBox.textContent = 'Please select a resume file (PDF/DOCX) or paste your resume text.';
      alertBox.classList.remove('d-none');
      return;
    }

    const formData = new FormData();
    if (fileInput.files[0]) {
      formData.append('resume', fileInput.files[0]);
    }
    formData.append('resumeText', resumeText);
    formData.append('targetJobTitle', targetJobTitle);
    formData.append('targetJobDescription', targetJobDescription);

    analyzeBtn.disabled = true;
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');

    try {
      const token = Auth.getToken();
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success && data.analysis) {
        renderReport(data.analysis);
      } else {
        alertBox.textContent = data.message || 'Failed to analyze resume.';
        alertBox.classList.remove('d-none');
      }
    } catch (err) {
      alertBox.textContent = err.message || 'Error processing resume file. Please try again.';
      alertBox.classList.remove('d-none');
    } finally {
      analyzeBtn.disabled = false;
      btnText.classList.remove('d-none');
      btnSpinner.classList.add('d-none');
    }
  });

  function renderReport(analysis) {
    emptyState.classList.add('d-none');
    reportContainer.classList.remove('d-none');

    document.getElementById('reportJobRole').textContent = analysis.targetJobTitle || 'Software Engineer Evaluation';
    document.getElementById('reportFileName').textContent = analysis.resumeFileName || 'Resume Document';
    document.getElementById('reportScore').textContent = `${analysis.score || 75} / 100`;
    document.getElementById('reportJobMatch').textContent = `${analysis.jobMatchScore || 70}% Match`;

    // Skills detected
    const skillsContainer = document.getElementById('reportSkillsDetected');
    skillsContainer.innerHTML = (analysis.skillsDetected || [])
      .map((s) => `<span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">${escapeHtml(s)}</span>`)
      .join('');

    // Missing skills
    const missingContainer = document.getElementById('reportMissingSkills');
    missingContainer.innerHTML = (analysis.missingSkills || [])
      .map((s) => `<span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">${escapeHtml(s)}</span>`)
      .join('');

    // Strengths
    const strengthsContainer = document.getElementById('reportStrengths');
    strengthsContainer.innerHTML = (analysis.strengths || [])
      .map((s) => `<li class="list-group-item px-0 text-muted"><i class="bi bi-check text-success me-1"></i> ${escapeHtml(s)}</li>`)
      .join('');

    // Weaknesses
    const weaknessesContainer = document.getElementById('reportWeaknesses');
    weaknessesContainer.innerHTML = (analysis.weaknesses || [])
      .map((s) => `<li class="list-group-item px-0 text-muted"><i class="bi bi-x text-danger me-1"></i> ${escapeHtml(s)}</li>`)
      .join('');

    // Suggestions
    const suggestionsContainer = document.getElementById('reportSuggestions');
    const combinedTips = [...(analysis.formattingSuggestions || []), ...(analysis.contentSuggestions || []), ...(analysis.recommendedImprovements || [])];
    suggestionsContainer.innerHTML = combinedTips.slice(0, 5).map((tip) => `<li class="mb-1">${escapeHtml(tip)}</li>`).join('');
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});

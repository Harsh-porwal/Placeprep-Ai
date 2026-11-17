document.addEventListener('DOMContentLoaded', async () => {
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

  const form = document.getElementById('profileForm');
  const alertBox = document.getElementById('alertBox');
  const successBox = document.getElementById('successBox');

  try {
    const res = await API.get('/api/users/profile');
    if (res.success && res.user) {
      populateForm(res.user);
    }
  } catch (err) {
    const cachedUser = Auth.getUser();
    if (cachedUser) populateForm(cachedUser);
  }

  function populateForm(u) {
    document.getElementById('name').value = u.name || '';
    document.getElementById('email').value = u.email || '';
    document.getElementById('college').value = u.college || '';
    document.getElementById('degree').value = u.degree || 'B.Tech';
    document.getElementById('branch').value = u.branch || 'Computer Science';
    document.getElementById('graduationYear').value = u.graduationYear || '2026';
    document.getElementById('careerGoal').value = u.careerGoal || 'Software Developer';
    document.getElementById('skills').value = Array.isArray(u.skills) ? u.skills.join(', ') : u.skills || '';
    document.getElementById('github').value = u.github || '';
    document.getElementById('linkedin').value = u.linkedin || '';

    document.getElementById('profileNameHeader').textContent = u.name || 'Student';
    document.getElementById('profileEmailHeader').textContent = u.email || '';
    document.getElementById('profileGoalBadge').textContent = u.careerGoal || 'Software Developer';
    document.getElementById('profileAvatar').textContent = u.name ? u.name.charAt(0).toUpperCase() : 'S';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertBox.classList.add('d-none');
    successBox.classList.add('d-none');

    const name = document.getElementById('name').value.trim();
    const college = document.getElementById('college').value.trim();
    const degree = document.getElementById('degree').value;
    const branch = document.getElementById('branch').value.trim();
    const graduationYear = document.getElementById('graduationYear').value;
    const careerGoal = document.getElementById('careerGoal').value;
    const skills = document.getElementById('skills').value.trim();
    const github = document.getElementById('github').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();

    try {
      const res = await API.put('/api/users/profile', {
        name,
        college,
        degree,
        branch,
        graduationYear,
        careerGoal,
        skills,
        github,
        linkedin,
      });

      if (res.success && res.user) {
        Auth.updateUser(res.user);
        populateForm(res.user);
        successBox.classList.remove('d-none');
        setTimeout(() => successBox.classList.add('d-none'), 3500);
      }
    } catch (err) {
      alertBox.textContent = err.message || 'Failed to save profile changes.';
      alertBox.classList.remove('d-none');
    }
  });
});

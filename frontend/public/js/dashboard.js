document.addEventListener('DOMContentLoaded', async () => {
  Auth.requireAuth();

  const user = Auth.getUser();
  if (user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userCollege').textContent = user.college || 'Engineering Student';
    document.getElementById('userInitial').textContent = user.name ? user.name.charAt(0).toUpperCase() : 'S';
  }

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const toggleSidebarBtn = document.getElementById('toggleSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebar');

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.add('show');
      sidebarBackdrop.classList.add('show');
    });
  }

  const closeSidebar = () => {
    sidebar.classList.remove('show');
    sidebarBackdrop.classList.remove('show');
  };

  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    Auth.logout();
  });

  // Fetch Dashboard Analytics from MongoDB backend
  try {
    const res = await API.get('/api/analytics/dashboard');

    if (res.success && res.stats) {
      const stats = res.stats;

      // Update Card Text
      document.getElementById('statCoding').textContent = `${stats.coding.solved} / ${stats.coding.total}`;
      document.getElementById('barCoding').style.width = `${stats.coding.percentage}%`;

      document.getElementById('statInterview').textContent = `${stats.interview.completed} / ${stats.interview.target}`;
      document.getElementById('barInterview').style.width = `${Math.min(100, Math.round((stats.interview.completed / stats.interview.target) * 100))}%`;

      document.getElementById('statAptitude').textContent = `${stats.aptitude.solved} / ${stats.aptitude.total}`;
      document.getElementById('barAptitude').style.width = `${stats.aptitude.percentage}%`;

      document.getElementById('statResume').textContent = `${stats.resume.score} / 100`;
      document.getElementById('barResume').style.width = `${stats.resume.score}%`;

      document.getElementById('statOverall').textContent = `${stats.overallPercentage}%`;

      // Render Chart.js
      if (res.weeklyActivity && document.getElementById('progressChart')) {
        renderProgressChart(res.weeklyActivity);
      }
    }
  } catch (err) {
    console.warn('Dashboard data fetch fallback used:', err);
    // Render default demo chart if network/offline
    renderProgressChart([
      { day: 'Mon', coding: 4, aptitude: 10, interviews: 1 },
      { day: 'Tue', coding: 3, aptitude: 8, interviews: 0 },
      { day: 'Wed', coding: 6, aptitude: 15, interviews: 1 },
      { day: 'Thu', coding: 2, aptitude: 5, interviews: 0 },
      { day: 'Fri', coding: 5, aptitude: 12, interviews: 1 },
      { day: 'Sat', coding: 7, aptitude: 20, interviews: 2 },
      { day: 'Sun', coding: 4, aptitude: 10, interviews: 1 },
    ]);
  }
});

function renderProgressChart(weeklyData) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  const labels = weeklyData.map((d) => d.day);
  const codingData = weeklyData.map((d) => d.coding);
  const aptitudeData = weeklyData.map((d) => d.aptitude);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Coding Solved',
          data: codingData,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
        {
          label: 'Aptitude Questions',
          data: aptitudeData,
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.05)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

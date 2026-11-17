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

  try {
    const res = await API.get('/api/analytics/dashboard');

    if (res.success && res.stats) {
      renderCharts(res);
    }
  } catch (err) {
    console.error('Analytics load error:', err);
    // Render default charts if backend fetch fails
    renderCharts({
      stats: { overallPercentage: 64 },
      weeklyActivity: [
        { day: 'Mon', coding: 4, aptitude: 10 },
        { day: 'Tue', coding: 3, aptitude: 8 },
        { day: 'Wed', coding: 6, aptitude: 15 },
        { day: 'Thu', coding: 2, aptitude: 5 },
        { day: 'Fri', coding: 5, aptitude: 12 },
        { day: 'Sat', coding: 7, aptitude: 20 },
        { day: 'Sun', coding: 4, aptitude: 10 },
      ],
    });
  }
});

function renderCharts(data) {
  const overallPct = data.stats.overallPercentage || 64;
  document.getElementById('readinessPercentText').textContent = `${overallPct}%`;

  // 1. Overall Readiness Doughnut
  new Chart(document.getElementById('readinessDoughnut').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: [overallPct, 100 - overallPct],
          backgroundColor: ['#2563eb', '#e2e8f0'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: { legend: { display: false } },
    },
  });

  // 2. Weekly Bar Chart
  const weekly = data.weeklyActivity || [];
  new Chart(document.getElementById('weeklyBarChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: weekly.map((w) => w.day),
      datasets: [
        {
          label: 'Coding Problems',
          data: weekly.map((w) => w.coding),
          backgroundColor: '#2563eb',
          borderRadius: 6,
        },
        {
          label: 'Aptitude Practice',
          data: weekly.map((w) => w.aptitude),
          backgroundColor: '#16a34a',
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: { y: { beginAtZero: true } },
    },
  });

  // 3. Difficulty Pie Chart
  new Chart(document.getElementById('difficultyPieChart').getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          data: [18, 12, 5],
          backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } },
    },
  });

  // 4. Aptitude Radar Chart
  new Chart(document.getElementById('aptitudeRadarChart').getContext('2d'), {
    type: 'radar',
    data: {
      labels: ['Quantitative', 'Logical Reasoning', 'Verbal Ability', 'Data Interpretation'],
      datasets: [
        {
          label: 'Your Accuracy %',
          data: [78, 85, 72, 90],
          fill: true,
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          pointBackgroundColor: '#2563eb',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { r: { beginAtZero: true, max: 100 } },
    },
  });
}

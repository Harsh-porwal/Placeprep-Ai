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

  const quizCard = document.getElementById('quizCard');
  const resultCard = document.getElementById('resultCard');

  let currentCategory = 'All';
  let questions = [];
  let currentIndex = 0;
  let selectedOption = null;
  let correctCount = 0;
  let timerInterval = null;
  let secondsRemaining = 600; // 10 minutes

  // Category buttons
  document.querySelectorAll('.cat-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-btn').forEach((b) => b.classList.remove('active'));
      const target = e.target.closest('button');
      target.classList.add('active');
      currentCategory = target.getAttribute('data-cat');
      startQuiz();
    });
  });

  async function startQuiz() {
    try {
      const catParam = encodeURIComponent(currentCategory);
      const res = await API.get(`/api/aptitude/questions?category=${catParam}`);

      if (res.success && res.questions.length > 0) {
        questions = res.questions;
        currentIndex = 0;
        correctCount = 0;
        selectedOption = null;
        secondsRemaining = 600;

        quizCard.classList.remove('d-none');
        resultCard.classList.add('d-none');

        startTimer();
        renderQuestion();
      }
    } catch (err) {
      alert('Failed to load aptitude questions.');
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsRemaining--;
      const mins = Math.floor(secondsRemaining / 60);
      const secs = secondsRemaining % 60;
      document.getElementById('quizTimer').innerHTML = `<i class="bi bi-clock-history me-1"></i> ${mins}:${secs < 10 ? '0' : ''}${secs}`;

      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        endQuiz();
      }
    }, 1000);
  }

  function renderQuestion() {
    if (currentIndex >= questions.length) {
      endQuiz();
      return;
    }

    const q = questions[currentIndex];
    selectedOption = null;

    document.getElementById('explanationBox').classList.add('d-none');
    document.getElementById('quizCatBadge').textContent = q.category;
    document.getElementById('quizCountBadge').textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    document.getElementById('quizQuestionText').textContent = q.question;

    const container = document.getElementById('quizOptionsContainer');
    const optionLetters = ['A', 'B', 'C', 'D'];

    container.innerHTML = q.options
      .map(
        (opt, idx) => `
      <div class="form-check p-3 rounded border bg-light option-item cursor-pointer" data-index="${idx}">
        <input class="form-check-input ms-0 me-3" type="radio" name="aptOption" id="opt${idx}" value="${idx}">
        <label class="form-check-label fw-medium text-navy cursor-pointer" for="opt${idx}">
          <strong>${optionLetters[idx]}.</strong> ${escapeHtml(opt)}
        </label>
      </div>
    `
      )
      .join('');

    document.querySelectorAll('.option-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        const radio = item.querySelector('input[type="radio"]');
        radio.checked = true;
        selectedOption = parseInt(radio.value);
        document.querySelectorAll('.option-item').forEach((i) => i.classList.remove('border-primary', 'bg-primary-subtle'));
        item.classList.add('border-primary', 'bg-primary-subtle');
      });
    });
  }

  document.getElementById('submitQuestionBtn').addEventListener('click', () => {
    if (selectedOption === null) {
      alert('Please select an option before proceeding.');
      return;
    }

    const q = questions[currentIndex];
    const explanationBox = document.getElementById('explanationBox');
    const explanationText = document.getElementById('explanationText');

    if (selectedOption === q.correctAnswer) {
      correctCount++;
      explanationBox.className = 'alert alert-success mb-4';
      explanationText.innerHTML = `<strong>Correct!</strong> ${escapeHtml(q.explanation || 'Good job!')}`;
    } else {
      explanationBox.className = 'alert alert-danger mb-4';
      explanationText.innerHTML = `<strong>Incorrect.</strong> Correct answer was Option ${['A', 'B', 'C', 'D'][q.correctAnswer]}. ${escapeHtml(q.explanation || '')}`;
    }

    explanationBox.classList.remove('d-none');

    setTimeout(() => {
      currentIndex++;
      renderQuestion();
    }, 2200);
  });

  document.getElementById('skipBtn').addEventListener('click', () => {
    currentIndex++;
    renderQuestion();
  });

  function endQuiz() {
    clearInterval(timerInterval);
    quizCard.classList.add('d-none');
    resultCard.classList.remove('d-none');

    const total = questions.length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    document.getElementById('resTotal').textContent = total;
    document.getElementById('resCorrect').textContent = correctCount;
    document.getElementById('resIncorrect').textContent = total - correctCount;
    document.getElementById('resAccuracy').textContent = `${accuracy}%`;
  }

  document.getElementById('restartQuizBtn').addEventListener('click', startQuiz);

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  startQuiz();
});

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

  const setupCard = document.getElementById('setupCard');
  const sessionCard = document.getElementById('sessionCard');
  const reportCard = document.getElementById('reportCard');

  const startForm = document.getElementById('startInterviewForm');
  const answerForm = document.getElementById('answerForm');
  const userAnswerInput = document.getElementById('userAnswer');

  const submitAnswerBtn = document.getElementById('submitAnswerBtn');
  const answerBtnText = document.getElementById('answerBtnText');
  const answerBtnSpinner = document.getElementById('answerBtnSpinner');

  let currentSessionId = null;

  // Start Session
  startForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const interviewType = document.getElementById('interviewType').value;
    const difficulty = document.getElementById('difficulty').value;

    try {
      const res = await API.post('/api/interview/start', {
        interviewType,
        difficulty,
      });

      if (res.success) {
        currentSessionId = res.sessionId;
        document.getElementById('sessionCategoryBadge').textContent = res.interviewType;
        document.getElementById('sessionDifficultyBadge').textContent = res.difficulty;
        document.getElementById('questionProgress').textContent = `Question ${res.questionNumber} of ${res.totalQuestions}`;
        document.getElementById('currentQuestionText').textContent = res.currentQuestion;

        setupCard.classList.add('d-none');
        sessionCard.classList.remove('d-none');
        reportCard.classList.add('d-none');
      }
    } catch (err) {
      alert(err.message || 'Failed to start interview session.');
    }
  });

  // Submit Answer
  answerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const answer = userAnswerInput.value.trim();
    if (!answer) return;

    submitAnswerBtn.disabled = true;
    answerBtnText.classList.add('d-none');
    answerBtnSpinner.classList.remove('d-none');

    try {
      const res = await API.post('/api/interview/answer', {
        sessionId: currentSessionId,
        answer,
      });

      if (res.success) {
        userAnswerInput.value = '';

        if (res.completed) {
          // Show final summary report
          sessionCard.classList.add('d-none');
          reportCard.classList.remove('d-none');

          document.getElementById('finalOverall').textContent = `${res.session.overallScore || 80}%`;
          document.getElementById('finalTechnical').textContent = `${res.session.technicalScore || 85}%`;
          document.getElementById('finalComm').textContent = `${res.session.communicationScore || 78}%`;
          document.getElementById('finalSuggestions').textContent = res.session.suggestions || 'Great overall performance!';
        } else {
          // Render evaluation snippet for previous answer
          const evalBox = document.getElementById('evalSnippet');
          evalBox.classList.remove('d-none');
          document.getElementById('prevScore').textContent = res.evaluation.score || 7;
          document.getElementById('prevFeedback').textContent = res.evaluation.feedback || '';

          if (res.evaluation.missingPoints) {
            const missingEl = document.getElementById('prevMissing');
            missingEl.textContent = `Missing points: ${res.evaluation.missingPoints}`;
            missingEl.classList.remove('d-none');
          }

          // Advance to next question
          document.getElementById('questionProgress').textContent = `Question ${res.questionNumber} of ${res.totalQuestions}`;
          document.getElementById('currentQuestionText').textContent = res.nextQuestion;
        }
      }
    } catch (err) {
      alert(err.message || 'Error submitting answer.');
    } finally {
      submitAnswerBtn.disabled = false;
      answerBtnText.classList.remove('d-none');
      answerBtnSpinner.classList.add('d-none');
    }
  });

  // Restart Button
  document.getElementById('restartBtn').addEventListener('click', () => {
    reportCard.classList.add('d-none');
    setupCard.classList.remove('d-none');
  });
});

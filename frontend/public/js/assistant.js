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

  const chatBox = document.getElementById('chatBox');
  const chatForm = document.getElementById('chatForm');
  const userMessageInput = document.getElementById('userMessage');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const clearChatBtn = document.getElementById('clearChatBtn');

  // Suggestion buttons
  document.querySelectorAll('.suggest-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      userMessageInput.value = e.target.textContent;
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  clearChatBtn.addEventListener('click', () => {
    chatBox.innerHTML = `
      <div class="chat-message ai">
        <div class="avatar bg-primary text-white rounded-circle p-2 fs-5" style="width: 40px; height: 40px; display:flex; align-items:center; justify-content:center;">
          <i class="bi bi-robot"></i>
        </div>
        <div class="chat-bubble">
          <strong>PlacePrep AI Mentor:</strong><br />
          Conversation cleared. Ask me any new placement preparation or engineering questions!
        </div>
      </div>
    `;
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userMessageInput.value.trim();
    if (!message) return;

    // Append User Message
    appendMessage(message, 'user');
    userMessageInput.value = '';

    loadingIndicator.classList.remove('d-none');
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      const res = await API.post('/api/ai/chat', { message });

      if (res.success && res.reply) {
        appendMessage(res.reply, 'ai');
      } else {
        appendMessage('Sorry, I encountered an issue processing your request. Please try again.', 'ai');
      }
    } catch (err) {
      appendMessage('Connection error. Please check your network connection.', 'ai');
    } finally {
      loadingIndicator.classList.add('d-none');
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    if (sender === 'user') {
      msgDiv.innerHTML = `
        <div class="avatar bg-secondary text-white rounded-circle p-2 fs-5" style="width: 40px; height: 40px; display:flex; align-items:center; justify-content:center;">
          <i class="bi bi-person"></i>
        </div>
        <div class="chat-bubble">
          ${escapeHtml(text)}
        </div>
      `;
    } else {
      const formattedText = formatMarkdown(text);
      msgDiv.innerHTML = `
        <div class="avatar bg-primary text-white rounded-circle p-2 fs-5" style="width: 40px; height: 40px; display:flex; align-items:center; justify-content:center;">
          <i class="bi bi-robot"></i>
        </div>
        <div class="chat-bubble">
          <strong>PlacePrep AI Mentor:</strong><br />
          ${formattedText}
        </div>
      `;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatMarkdown(text) {
    let formatted = escapeHtml(text);
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-light px-1 text-danger rounded">$1</code>');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  }
});

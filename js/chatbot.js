/* =========================================================
   AASRA - Yuganshi AI Chatbot
   Phase 1+2: UI + FastAPI chat/history connection.
   LLM and RAG will be added behind /api/chat later.
   ========================================================= */

(function () {
    'use strict';

    let chatWindow;
    let messagesContainer;
    let input;
    let sendButton;
    let quickQuestions;
    let currentSessionId = null;

    function createChatbot() {
        const launcher = document.createElement('button');
        launcher.className = 'aasra-chat-launcher';
        launcher.id = 'aasra-chat-launcher';
        launcher.setAttribute('aria-label', 'Open Yuganshi');
        launcher.innerHTML = '💬';
        document.body.appendChild(launcher);

        const windowElement = document.createElement('div');
        windowElement.className = 'aasra-chat-window';
        windowElement.id = 'aasra-chat-window';

        windowElement.innerHTML = `
            <div class="aasra-chat-header">
                <div class="aasra-chat-header-left">
                    <div class="aasra-chat-avatar">🤖</div>
                    <div>
                        <div class="aasra-chat-title">Yuganshi</div>
                        <div class="aasra-chat-status">
                            <span class="aasra-status-dot"></span>
                            Online
                        </div>
                    </div>
                </div>
                <button class="aasra-chat-close" id="aasra-chat-close"
                        aria-label="Close chatbot">×</button>
            </div>

            <div class="aasra-chat-messages" id="aasra-chat-messages">
                <div class="aasra-chat-message bot">
                    Hii 👋, I'm <strong>Yuganshi</strong>.
                    <br><br>
                    I can help you with AASRA application information,
                    adoption process, documents, agencies and other
                    general guidance.
                    <br><br>
                    How can I help you today?
                </div>
            </div>

            <div class="aasra-chat-quick" id="aasra-chat-quick">
                <button class="aasra-quick-btn"
                        data-question="What is the adoption process?">Adoption Process</button>
                <button class="aasra-quick-btn"
                        data-question="What documents are generally required?">Documents</button>
                <button class="aasra-quick-btn"
                        data-question="How can I track my application?">Track Application</button>
            </div>

            <form class="aasra-chat-input-area" id="aasra-chat-form">
                <input type="text" class="aasra-chat-input" id="aasra-chat-input"
                       placeholder="Ask Yuganshi..." autocomplete="off" maxlength="4000" />
                <button type="submit" class="aasra-chat-send"
                        id="aasra-chat-send" aria-label="Send message">➤</button>
            </form>
        `;

        document.body.appendChild(windowElement);

        chatWindow = windowElement;
        messagesContainer = document.getElementById('aasra-chat-messages');
        input = document.getElementById('aasra-chat-input');
        sendButton = document.getElementById('aasra-chat-send');
        quickQuestions = document.getElementById('aasra-chat-quick');

        launcher.addEventListener('click', function () {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) input.focus();
        });

        document.getElementById('aasra-chat-close').addEventListener('click', function () {
            chatWindow.classList.remove('open');
        });

        document.getElementById('aasra-chat-form').addEventListener('submit', function (event) {
            event.preventDefault();
            sendMessage(input.value);
        });

        quickQuestions.querySelectorAll('.aasra-quick-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                sendMessage(button.dataset.question);
            });
        });
    }

    function addMessage(text, sender) {
        const message = document.createElement('div');
        message.className = 'aasra-chat-message ' + sender;
        message.textContent = text;
        messagesContainer.appendChild(message);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'aasra-typing';
        typing.id = 'aasra-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('aasra-typing');
        if (typing) typing.remove();
    }

    async function sendMessage(text) {
        text = text.trim();
        if (!text || !window.AasraAPI) return;

        addMessage(text, 'user');
        input.value = '';
        sendButton.disabled = true;
        showTyping();

        try {
            const res = await window.AasraAPI.chat(text, currentSessionId, null);
            removeTyping();

            if (res.ok && res.data) {
                currentSessionId = res.data.session_id;
                addMessage(res.data.answer || 'I received your message.', 'bot');
            } else {
                addMessage('I could not reach the AASRA backend right now. Please try again.', 'bot');
            }
        } catch (error) {
            removeTyping();
            addMessage('Something went wrong while contacting AASRA. Please try again.', 'bot');
        } finally {
            sendButton.disabled = false;
            input.focus();
        }
    }

    document.addEventListener('DOMContentLoaded', createChatbot);
})();

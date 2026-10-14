// Aniya chat widget — loaded automatically by script.js
(function () {
    if (document.getElementById('chatFab')) return;

    const history = [];

    const wrap = document.createElement('div');
    wrap.innerHTML = `
        <button id="chatFab" class="chat-fab" aria-label="Open chat">💬</button>
        <section id="chatBox" class="chat-box" hidden>
            <div class="chat-head">
                <strong>🌾 Ask Ani</strong>
                <button id="chatClose" aria-label="Close chat">✕</button>
            </div>
            <div id="chatLog" class="chat-log"></div>
            <form id="chatForm" class="chat-form" autocomplete="off">
                <input id="chatInput" maxlength="500" placeholder="Ask about your farm…">
                <button type="submit">Send</button>
            </form>
        </section>`;
    document.body.appendChild(wrap);

    const fab = document.getElementById('chatFab');
    const box = document.getElementById('chatBox');
    const log = document.getElementById('chatLog');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');

    function add(role, text) {
        const d = document.createElement('div');
        d.className = 'chat-msg ' + role;
        d.textContent = text;           // textContent keeps it XSS-safe
        log.appendChild(d);
        log.scrollTop = log.scrollHeight;
        return d;
    }

    function toggle(open) {
        box.hidden = !open;
        fab.hidden = open;
        if (open) {
            if (!log.children.length) {
                add('bot', "Hi! I'm Ani 🌾 Ask me about your plots, watering tasks, harvests, seeds or finances.");
            }
            input.focus();
        }
    }

    fab.onclick = () => toggle(true);
    document.getElementById('chatClose').onclick = () => toggle(false);

    form.onsubmit = async e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        add('user', text);
        const typing = add('bot typing', '…');
        form.querySelector('button').disabled = true;

        try {
            // post() and esc() come from script.js
            const r = await post('Chat/chat.php', { message: text, history });
            typing.remove();
            add('bot', r.reply);
            history.push({ role: 'user', content: text }, { role: 'assistant', content: r.reply });
        } catch (err) {
            typing.remove();
            add('bot error', err.message || 'Something went wrong.');
        }
        form.querySelector('button').disabled = false;
        input.focus();
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const statusDiv = document.getElementById('status');

    // 创建WebSocket连接
    const ws = new WebSocket('ws://localhost:3001');

    // 连接成功
    ws.onopen = () => {
        console.log('已连接到WebSocket服务器');
        statusDiv.textContent = '已连接';
        statusDiv.className = 'status connected';
    };

    // 连接关闭
    ws.onclose = () => {
        console.log('WebSocket连接已关闭');
        statusDiv.textContent = '未连接';
        statusDiv.className = 'status disconnected';
    };

    // 接收消息
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('收到消息:', data);

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message server-message';

        let messageContent = '';
        if (data.type === 'welcome') {
            messageContent = `<strong>欢迎消息:</strong> ${data.message}`;
        } else {
            messageContent = `<strong>收到消息:</strong> ${data.message}`;
        }

        messageContent += `<br><small>${new Date(data.timestamp).toLocaleString()}</small>`;
        messageDiv.innerHTML = messageContent;

        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };

    // 发送消息
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && ws.readyState === WebSocket.OPEN) {
            ws.send(message);

            // 在界面上显示自己发送的消息
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message client-message';
            messageDiv.innerHTML = `<strong>我:</strong> ${message}<br><small>${new Date().toLocaleString()}</small>`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            messageInput.value = '';
        }
    }

    // 点击发送按钮
    sendButton.addEventListener('click', sendMessage);

    // 按Enter键发送
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});

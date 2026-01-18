const tg = window.Telegram.WebApp;

tg.expand();
tg.ready();

const user = tg.initDataUnsafe?.user;
if (user) {
    const username = user.first_name  'Пользователь';
    document.getElementById('username').textContent = username;
}

function sendAction(actionType) {
    const data = {
        action: actionType,
        timestamp: new Date().toISOString(),
    };
    
    tg.sendData(JSON.stringify(data));
    
    showNotification(Действие "${actionType}" выполнено!);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00ff88;
        color: #000;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
    ;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showSection(section) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    event.target.closest('.nav-item').classList.add('active');
    
    if (section === 'balance') {
        alert('Раздел Баланс\nВаш баланс: 1000 ₽');
    } else if (section === 'requisites') {
        alert('Раздел Реквизиты\nКарта: ** 1234\nQIWI: +7****');
    } else if (section === 'history') {
        alert('Раздел История\n1. Пополнение: +500 ₽\n2. Перевод: -200 ₽');
    } else if (section === 'main') {
        alert('Возврат на главную');
    }
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const action = this.querySelector('h3').textContent.toLowerCase();
        sendAction(action);
    });
});

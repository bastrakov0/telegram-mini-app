
// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализация
tg.expand(); // Раскрыть на весь экран
tg.ready(); // Уведомляем Telegram, что приложение готово

// Установка цвета темы
tg.setHeaderColor('#000000');
tg.setBackgroundColor('#000000');

// Данные приложения
let balance = 0.00;
let depositCount = 0;
let withdrawCount = 0;
let transferCount = 0;
const walletAddress = "T9zXp9vLk8nGm3JfD2q1rW5tY7uI0oP4a6";
const userId = "739-228-415";

// Инициализация приложения
function initApp() {
    updateBalanceDisplay();
    updateStats();
    setupEventListeners();
    
    // Начальная анимация
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }, 300);
    
    // Скрываем кнопку "Назад" на главной
    document.getElementById('backBtn').style.display = 'none';
}

// Обновление отображения баланса
function updateBalanceDisplay() {
    document.getElementById('currentBalance').textContent = balance.toFixed(2) + '$';
    document.getElementById('availableBalance').textContent = balance.toFixed(2) + '$';
    document.getElementById('transferBalance').textContent = balance.toFixed(2) + '$';
}

// Обновление статистики
function updateStats() {
    document.getElementById('depositCount').textContent = depositCount;
    document.getElementById('withdrawCount').textContent = withdrawCount;
    document.getElementById('transferCount').textContent = transferCount;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Слушатель для количества символов в заметке
    const transferNote = document.getElementById('transferNote');
    const charCount = document.getElementById('charCount');
    
    if (transferNote && charCount) {
        transferNote.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // Слушатель для суммы вывода
    const withdrawAmount = document.getElementById('withdrawAmount');
    const receiveAmount = document.getElementById('receiveAmount');
    
    if (withdrawAmount && receiveAmount) {
        withdrawAmount.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const fee = 1; // Комиссия 1 USDT
            const receive = amount - fee;
            receiveAmount.textContent = receive > 0 ? receive.toFixed(2) + ' USDT' : '0.00 USDT';
        });
    }
    
    // Слушатель для суммы перевода
    const transferAmount = document.getElementById('transferAmount');
    const recipientAmount = document.getElementById('recipientAmount');
    
    if (transferAmount && recipientAmount) {
        transferAmount.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const feePercent = 0.5; // Комиссия 0.5%
            const fee = amount * (feePercent / 100);
            const receive = amount - fee;
            recipientAmount.textContent = receive.toFixed(2) + '$';
            
            // Обновляем превью получателя
            updateRecipientPreview();
        });
    }
    
    // Слушатель для ID получателя
    const recipientId = document.getElementById('recipientId');
    if (recipientId) {
        recipientId.addEventListener('input', updateRecipientPrev
iew);
    }
}

// Копирование ID пользователя
function copyUserId() {
    navigator.clipboard.writeText(userId)
        .then(() => {
            showNotification('ID скопирован в буфер обмена!');
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
            showNotification('Ошибка копирования', 'error');
        });
}

// Копирование адреса кошелька
function copyAddress() {
    navigator.clipboard.writeText(walletAddress)
        .then(() => {
            showNotification('Адрес скопирован в буфер обмена!');
        })
        .catch(err => {
            console.error('Ошибка копирования: ', err);
            showNotification('Ошибка копирования', 'error');
        });
}

// Вставка адреса из буфера обмена
function pasteAddress() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById('withdrawAddress').value = text;
            showNotification('Адрес вставлен из буфера');
        })
        .catch(err => {
            console.error('Ошибка чтения из буфера: ', err);
            showNotification('Не удалось вставить адрес', 'error');
        });
}

// Установка суммы для перевода
function setTransferAmount(amount) {
    document.getElementById('transferAmount').value = amount;
    
    // Триггерим событие input для обновления расчетов
    const event = new Event('input');
    document.getElementById('transferAmount').dispatchEvent(event);
}

// Обновление превью получателя
function updateRecipientPreview() {
    const recipientId = document.getElementById('recipientId').value;
    const preview = document.getElementById('recipientPreview');
    
    if (recipientId && recipientId.match(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/)) {
        document.getElementById('previewId').textContent = recipientId;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

// Сканирование QR-кода
function scanQR() {
    showNotification('Функция сканирования QR-кода в разработке', 'warning');
}

// Поделиться кошельком
function shareWallet() {
    if (navigator.share) {
        navigator.share({
            title: 'Мой криптокошелек MGR_12',
            text: `Мой адрес для пополнения USDT (TRC-20): ${walletAddress}`,
            url: window.location.href
        })
        .then(() => showNotification('Успешно поделились'))
        .catch(err => {
            console.error('Ошибка sharing: ', err);
            copyAddress();
        });
    } else {
        copyAddress();
    }
}

// Сохранение информации о кошельке
function saveWalletInfo() {
    const walletInfo = `MGR_12 Кошелек\n\nАдрес USDT (TRC-20):\n${walletAddress}\n\nID пользователя: ${userId}`;
    
    // Создаем файл для скачивания
    const blob = new Blob([walletInfo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MGR12_Wallet_${userId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Информация о кошельке сохранена');
}

// Проверка пополнения
function checkDeposit() {
    // Имитация запроса к серверу
    showNotification('Проверяем новые пополнения...', 'info');
    
    setTimeout(() => {
        // В реальном приложении здесь будет ответ от сервера
        showNotification('Новых пополнений не обнаружено', 'info');
    }, 2000);
}

// Обработка вывода средств
function processWithdraw(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const address = document.getElementById('withdrawAddress').value.trim();
    const memo = document.getElementById('withdrawMemo').value.trim();
    
    if (!address.match(/^T[a-zA-Z0-9]{33}$/)) {
        showNotification('Некорректный адрес TRC-20', 'error');
        return;
    }
    
    if (amount < 10) {
        showNotification('Минимальная сумма вывода: 10$', 'error');
        return;
    }
    
    if (amount > balance) {
        showNotificat
ion('Недостаточно средств на балансе', 'error');
        return;
    }
    
    // Подтверждение вывода
    const confirmText = `Подтвердите вывод:\n\nСумма: ${amount.toFixed(2)}$\nАдрес: ${address}\nКомиссия: 1 USDT\nК получению: ${(amount - 1).toFixed(2)} USDT`;
    
    if (confirm(confirmText)) {
        // Имитация обработки вывода
        showNotification('Заявка на вывод отправлена на обработку', 'info');
        
        // Обновляем баланс и статистику
        setTimeout(() => {
            balance -= amount;
            withdrawCount++;
            updateBalanceDisplay();
            updateStats();
            showNotification('Вывод успешно выполнен!', 'success');
            
            // Отправляем данные в бота
            sendAction('withdraw', {
                amount: amount,
                address: address,
                memo: memo,
                balance: balance
            });
            
            // Возвращаемся на главную
            showMain();
        }, 3000);
    }
}

// Обработка перевода
function processTransfer(event) {
    event.preventDefault();
    
    const recipientId = document.getElementById('recipientId').value.trim();
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const note = document.getElementById('transferNote').value.trim();
    
    if (!recipientId.match(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/)) {
        showNotification('Некорректный формат ID получателя', 'error');
        return;
    }
    
    if (amount < 1) {
        showNotification('Минимальная сумма перевода: 1$', 'error');
        return;
    }
    
    if (amount > balance) {
        showNotification('Недостаточно средств на балансе', 'error');
        return;
    }
    
    const fee = amount * 0.005; // 0.5%
    const total = amount + fee;
    
    // Подтверждение перевода
    const confirmText = `Подтвердите перевод:\n\nID получателя: ${recipientId}\nСумма: ${amount.toFixed(2)}$\nКомиссия: ${fee.toFixed(2)}$\nИтого: ${total.toFixed(2)}$`;
    
    if (confirm(confirmText)) {
        // Имитация обработки перевода
        showNotification('Обрабатываем перевод...', 'info');
        
        // Обновляем баланс и статистику
        setTimeout(() => {
            balance -= total;
            transferCount++;
            updateBalanceDisplay();
            updateStats();
            showNotification(`Перевод ${amount.toFixed(2)}$ на ID ${recipientId} выполнен!`, 'success');
            
            // Отправляем данные в бота
            sendAction('transfer', {
                recipientId: recipientId,
                amount: amount,
                fee: fee,
                note: note,
                balance: balance
            });
            
            // Возвращаемся на главную
            showMain();
        }, 2000);
    }
}

// Функция обновления баланса
function updateBalance() {
    const balanceElement = document.getElementById('currentBalance');
    balanceElement.style.opacity = '0.5';
    
    setTimeout(() => {
        // В реальном приложении здесь будет запрос к серверу
        balanceElement.style.opacity = '1';
        showNotification('Баланс обновлен');
    }, 500);
}

// Навигация по страницам
function showPage(pageId) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем нужную страницу
    document.getElementById(pageId).classList.add('active');
    
    // Показываем кнопку "Назад" если это не главная
    const backBtn = document.getElementById('backBtn');
    backBtn.style.display = pageId === 'homePage' ? 'none' : 'flex';
    
    // Обновляем активный пункт меню
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (pageId === 'homePage') {
        document.querySelector('.nav-item:nth-child(3)').classList.add('active');
    }
}

// Показать главную
function showMain() {
    showPage('homePage');
}

// Показать профиль
function showProfilePage() {
    showPage('profilePage
');
    document.querySelector('.nav-item:nth-child(1)').classList.add('active');
}

// Показать пополнение
function showDepositPage() {
    showPage('depositPage');
}

// Показать вывод
function showWithdrawPage() {
    showPage('withdrawPage');
}

// Показать перевод
function showTransferPage() {
    showPage('transferPage');
}

// Показать историю
function showHistory() {
    showNotification('История операций в разработке', 'warning');
}

// Связаться с поддержкой
function contactSupport() {
    tg.openTelegramLink('https://t.me/mgr12_support');
}

// Отправка действия в бота
function sendAction(actionType, data) {
    const fullData = {
        action: actionType,
        ...data,
        timestamp: new Date().toISOString(),
        userId: userId,
        walletAddress: walletAddress
    };
    
    tg.sendData(JSON.stringify(fullData));
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const colors = {
        success: '#00ff88',
        info: '#667eea',
        warning: '#ffa500',
        error: '#ff4757'
    };
    
    const icons = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };
    
    // Удаляем старое уведомление если есть
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => oldNotification.remove(), 300);
    }
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.background = `linear-gradient(135deg, ${colors[type]} 0%, ${colors[type]}80 100%)`;
    notification.style.borderLeft = `4px solid ${colors[type]}`;
    notification.style.color = type === 'warning' ? '#000' : '#fff';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${icons[type]}" style="font-size: 18px;"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initApp);
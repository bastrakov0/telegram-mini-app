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

let currentPage = 'home';

// Инициализация приложения
async function initApp() {
    console.log("Инициализация приложения MGR_12...");
    
    // Загружаем главную страницу
    await loadPage('home');
    
    // Инициализируем общие функции
    initCommonFunctions();
    
    console.log("Приложение инициализировано");
}

// Динамическая загрузка страниц
async function loadPage(pageName) {
    console.log("Загрузка страницы:", pageName);
    
    // Показываем индикатор загрузки
    showLoading(true);
    
    try {
        // Загружаем HTML страницы
        const response = await fetch(`${pageName}.html`);
        if (!response.ok) throw new Error('Страница не найдена');
        
        const html = await response.text();
        
        // Вставляем контент на страницу
        document.getElementById('mainContent').innerHTML = html;
        
        // Обновляем текущую страницу
        currentPage = pageName;
        
        // Обновляем UI
        updateUI();
        
        // Инициализируем специфичные для страницы функции
        initPageSpecificFunctions(pageName);
        
        // Прокручиваем вверх
        window.scrollTo(0, 0);
        
    } catch (error) {
        console.error('Ошибка загрузки страницы:', error);
        showError('Не удалось загрузить страницу');
    } finally {
        showLoading(false);
    }
}

// Показать/скрыть индикатор загрузки
function showLoading(show) {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.style.display = show ? 'flex' : 'none';
    }
}

// Показать ошибку
function showError(message) {
    document.getElementById('mainContent').innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Ошибка</h3>
            <p>${message}</p>
            <button onclick="loadPage('home')">Вернуться на главную</button>
        </div>
    `;
}

// Обновление UI (кнопка Назад, меню)
function updateUI() {
    // Кнопка Назад
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = currentPage === 'home' ? 'none' : 'flex';
    }
    
    // Нижнее меню
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (currentPage === 'home') {
        document.querySelector('.nav-item:nth-child(3)').classList.add('active');
    } else if (currentPage === 'requisites') {
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
    } else if (currentPage === 'history') {
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    }
    
    // Обновляем данные на странице
    updatePageData();
}

// Обновление данных на странице
function updatePageData() {
    // Обновляем баланс
    document.querySelectorAll('.balance-amount').forEach(el => {
        if (el.id !== 'currentBalance') {
            el.textContent = balance.toFixed(2) + '$';
        }
    });
    
    // Обновляем статистику
    document.querySelectorAll('#depositCount').forEach(el => {
        el.textContent = depositCount;
    });
    document.querySelectorAll('#withdrawCount').forEach(el => {
        el.textContent = withdrawCount;
    });
    document.querySelectorAll('#transferCount').forEach(el => {
        el.textContent = transferCount;
    });
    
    // Обновляем доступный баланс
    document.querySelectorAll('#availableBalance').forEach(el => {
        el.textContent = balance.toFixed(2) + '$';
    });
    
    // Обновляем адрес кошелька
    document.querySelectorAll('#walletAddress').forEach(el => {
        el.textContent = walletAddress;
    });
    document.querySelectorAll('#depositAddress').forEach(el => {
        el.textContent = walletAddress;
    });
}

// Инициализация общих функций
function initCommonFunctions() {
    console.log("Инициализация общих функций...");
    
    // Инициализация глобальных функций
    window.showMain = () => loadPage('home');
    window.showRequisitesPage = () => loadPage('requisites');
    window.showHistoryPage = () => loadPage('history');
    window.showDepositPage = () => loadPage('deposit');
    window.showWithdrawPage = () => loadPage('withdraw');
    window.showTransferPage = () => loadPage('transfer');
    
    window.copyUserId = copyUserId;
    window.copyAddress = copyAddress;
    window.updateBalance = updateBalance;
    window.contactSupport = contactSupport;
}

// Инициализация специфичных для страницы функций
function initPageSpecificFunctions(pageName) {
    console.log("Инициализация функций для страницы:", pageName);
    
    switch(pageName) {
        case 'home':
            initHomePage();
            break;
        case 'requisites':
            initRequisitesPage();
            break;
        case 'history':
            initHistoryPage();
            break;
        case 'deposit':
            initDepositPage();
            break;
        case 'withdraw':
            initWithdrawPage();
            break;
        case 'transfer':
            initTransferPage();
            break;
    }
}

// Функции для главной страницы
function initHomePage() {
    console.log("Инициализация главной страницы...");
    
    // Обработчики для карточек
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const action = this.querySelector('h3').textContent;
            
            // Анимация нажатия
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Навигация
            switch(action) {
                case 'Пополнить':
                    showDepositPage();
                    break;
                case 'Вывести':
                    showWithdrawPage();
                    break;
                case 'Перевести':
                    showTransferPage();
                    break;
            }
        });
    });
    
    // Обработчик для обновления баланса
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.onclick = updateBalance;
    }
}

// Функции для страницы реквизитов
function initRequisitesPage() {
    console.log("Инициализация страницы реквизитов...");
    
    // Обработчики для кнопок
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.onclick = copyAddress;
    });
    
    document.querySelectorAll('.address-box').forEach(box => {
        box.onclick = copyAddress;
    });
    
    const shareBtn = document.querySelector('.wallet-btn:nth-child(1)');
    if (shareBtn) shareBtn.onclick = shareWallet;
    
    const saveBtn = document.querySelector('.wallet-btn:nth-child(2)');
    if (saveBtn) saveBtn.onclick = saveWalletInfo;
}

// Функции для страницы истории
function initHistoryPage() {
    console.log("Инициализация страницы истории...");
    
    // Обработчики для кнопок
    const refreshBtn = document.querySelector('.history-btn:nth-child(1)');
    if (refreshBtn) refreshBtn.onclick = loadHistory;
    
    const clearBtn = document.querySelector('.history-btn:nth-child(2)');
    if (clearBtn) clearBtn.onclick = clearHistory;
    
    // Обновляем статистику в истории
    document.getElementById('historyDepositCount').textContent = depositCount;
    document.getElementById('historyWithdrawCount').textContent = withdrawCount;
    document.getElementById('historyTransferCount').textContent = transferCount;
}

// Функции для страницы пополнения
function initDepositPage() {
    console.log("Инициализация страницы пополнения...");
    
    // Обработчики для кнопок
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.onclick = copyAddress;
    });
    
    document.querySelectorAll('.address-box').forEach(box => {
        box.onclick = copyAddress;
    });
    
    const checkBtn = document.querySelector('.check-btn');
    if (checkBtn) checkBtn.onclick = checkDeposit;
    
    const supportBtn = document.querySelector('.support-btn');
    if (supportBtn) supportBtn.onclick = contactSupport;
}

// Функции для страницы вывода
function initWithdrawPage() {
    console.log("Инициализация страницы вывода...");
    
    // Обработчики для формы
    const form = document.querySelector('.withdraw-form');
    if (form) {
        form.onsubmit = processWithdraw;
    }
    
    // Обработчик для вставки адреса
    const pasteBtn = document.querySelector('.paste-btn');
    if (pasteBtn) {
        pasteBtn.onclick = pasteAddress;
    }
    
    // Обработчик для суммы вывода
    const amountInput = document.getElementById('withdrawAmount');
    const receiveAmount = document.getElementById('receiveAmount');
    
    if (amountInput && receiveAmount) {
        amountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const fee = 1; // Комиссия 1 USDT
            const receive = amount - fee;
            receiveAmount.textContent = receive > 0 ? receive.toFixed(2) + ' USDT' : '0.00 USDT';
        });
    }
}

// Функции для страницы перевода
function initTransferPage() {
    console.log("Инициализация страницы перевода...");
    
    // Обработчики для формы
    const form = document.querySelector('.transfer-form');
    if (form) {
        form.onsubmit = processTransfer;
    }
    
    // Обработчик для сканирования QR
    const scanBtn = document.querySelector('.scan-btn');
    if (scanBtn) {
        scanBtn.onclick = scanQR;
    }
    
    // Обработчик для быстрых сумм
    document.querySelectorAll('.quick-amount').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = parseInt(this.textContent);
            setTransferAmount(amount);
        });
    });
    
    // Обработчик для суммы перевода
    const transferAmount = document.getElementById('transferAmount');
    const recipientAmount = document.getElementById('recipientAmount');
    
    if (transferAmount && recipientAmount) {
        transferAmount.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const feePercent = 0.5; // Комиссия 0.5%
            const fee = amount * (feePercent / 100);
            const receive = amount - fee;
            recipientAmount.textContent = receive.toFixed(2) + '$';
            updateRecipientPreview();
        });
    }
    
    // Обработчик для ID получателя
    const recipientId = document.getElementById('recipientId');
    if (recipientId) {
        recipientId.addEventListener('input', updateRecipientPreview);
    }
    
    // Обработчик для заметки
    const transferNote = document.getElementById('transferNote');
    const charCount = document.getElementById('charCount');
    
    if (transferNote && charCount) {
        transferNote.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
}

// ============ ОБЩИЕ ФУНКЦИИ ============

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
            const addressInput = document.getElementById('withdrawAddress');
            if (addressInput) {
                addressInput.value = text;
                showNotification('Адрес вставлен из буфера');
            }
        })
        .catch(err => {
            console.error('Ошибка чтения из буфера: ', err);
            showNotification('Не удалось вставить адрес', 'error');
        });
}

// Установка суммы для перевода
function setTransferAmount(amount) {
    const input = document.getElementById('transferAmount');
    if (input) {
        input.value = amount;
        const event = new Event('input');
        input.dispatchEvent(event);
    }
}

// Обновление превью получателя
function updateRecipientPreview() {
    const recipientId = document.getElementById('recipientId');
    const preview = document.getElementById('recipientPreview');
    
    if (!recipientId || !preview) return;
    
    if (recipientId.value && recipientId.value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/)) {
        document.getElementById('previewId').textContent = recipientId.value;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
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
    showNotification('Проверяем новые пополнения...', 'info');
    
    setTimeout(() => {
        showNotification('Новых пополнений не обнаружено', 'info');
    }, 2000);
}

// Загрузка истории операций
function loadHistory() {
    showNotification('Загрузка истории операций...', 'info');
    
    setTimeout(() => {
        showNotification('История обновлена', 'success');
    }, 1500);
}

// Очистка истории операций
function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить историю операций?')) {
        showNotification('История очищена', 'success');
    }
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
        showNotification('Недостаточно средств на балансе', 'error');
        return;
    }
    
    const confirmText = `Подтвердите вывод:\n\nСумма: ${amount.toFixed(2)}$\nАдрес: ${address}\nКомиссия: 1 USDT\nК получению: ${(amount - 1).toFixed(2)} USDT`;
    
    if (confirm(confirmText)) {
        showNotification('Заявка на вывод отправлена на обработку', 'info');
        
        setTimeout(() => {
            balance -= amount;
            withdrawCount++;
            updatePageData();
            showNotification('Вывод успешно выполнен!', 'success');
            
            sendAction('withdraw', {
                amount: amount,
                address: address,
                memo: memo,
                balance: balance
            });
            
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
    
    const fee = amount * 0.005;
    const total = amount + fee;
    
    const confirmText = `Подтвердите перевод:\n\nID получателя: ${recipientId}\nСумма: ${amount.toFixed(2)}$\nКомиссия: ${fee.toFixed(2)}$\nИтого: ${total.toFixed(2)}$`;
    
    if (confirm(confirmText)) {
        showNotification('Обрабатываем перевод...', 'info');
        
        setTimeout(() => {
            balance -= total;
            transferCount++;
            updatePageData();
            showNotification(`Перевод ${amount.toFixed(2)}$ на ID ${recipientId} выполнен!`, 'success');
            
            sendAction('transfer', {
                recipientId: recipientId,
                amount: amount,
                fee: fee,
                note: note,
                balance: balance
            });
            
            showMain();
        }, 2000);
    }
}

// Функция обновления баланса
function updateBalance() {
    showNotification('Обновляем баланс...', 'info');
    
    setTimeout(() => {
        showNotification('Баланс обновлен', 'success');
    }, 500);
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
    console.log("Данные отправлены в бота:", fullData);
}

// Сканирование QR-кода
function scanQR() {
    showNotification('Функция сканирования QR-кода в разработке', 'warning');
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
    
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => oldNotification.remove(), 300);
    }
    
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
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Делаем loadPage доступной глобально
window.loadPage = loadPage;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initApp);

// Добавьте эти функции в app.js

// Установить максимальную сумму
function setMaxAmount() {
    const input = document.getElementById('depositAmount');
    if (input) {
        input.value = 10000; // Максимальный лимит
        updateDepositCalculation();
    }
}

function setMaxWithdraw() {
    const input = document.getElementById('withdrawAmount');
    if (input) {
        input.value = parseFloat(balance.toFixed(2));
        const event = new Event('input');
        input.dispatchEvent(event);
    }
}

function setMaxTransfer() {
    const input = document.getElementById('transferAmount');
    if (input) {
        input.value = parseFloat(balance.toFixed(2));
        const event = new Event('input');
        input.dispatchEvent(event);
    }
}

// Обновление расчета пополнения
function updateDepositCalculation() {
    const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
    const commission = 0.025; // 2.5%
    const fee = amount * commission;
    const total = amount + fee;
    
    document.getElementById('depositSum').textContent = amount.toFixed(2) + '$';
    document.getElementById('depositTotal').textContent = total.toFixed(2) + '$';
}

// Выбор способа оплаты
function selectPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.payment-method').classList.add('active');
}

// Обработка пополнения
function processDeposit() {
    const amount = parseFloat(document.getElementById('depositAmount').value) || 0;
    
    if (amount < 10) {
        showNotification('Минимальная сумма пополнения: 10$', 'error');
        return;
    }
    
    if (amount > 10000) {
        showNotification('Максимальная сумма пополнения: 10000$', 'error');
        return;
    }
    
    const confirmText = `Подтвердите пополнение:\n\nСумма: ${amount.toFixed(2)}$\nКомиссия: 2.5%\nИтого к оплате: ${(amount * 1.025).toFixed(2)}$`;
    
    if (confirm(confirmText)) {
        showNotification('Перенаправляем на страницу оплаты...', 'info');
        // Здесь будет редирект на платежную систему
    }
}

// Функции для реквизитов
function updateLimit(id, value) {
    document.getElementById('limitValue' + id).textContent = value;
    document.getElementById('cardLimit' + id).textContent = value + '$';
}

function showAddRequisiteModal() {
    document.getElementById('addRequisiteModal').style.display = 'flex';
}

function closeAddRequisiteModal() {
    document.getElementById('addRequisiteModal').style.display = 'none';
}

function selectRequisiteType(type) {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (type === 'card') {
        document.getElementById('cardFields').style.display = 'block';
        document.getElementById('phoneFields').style.display = 'none';
    } else {
        document.getElementById('cardFields').style.display = 'none';
        document.getElementById('phoneFields').style.display = 'block';
    }
}

function saveRequisite(event) {
    event.preventDefault();
    closeAddRequisiteModal();
    showNotification('Реквизиты успешно добавлены', 'success');
}

// Добавьте обработчики событий для полей ввода
function initDepositPage() {
    const amountInput = document.getElementById('depositAmount');
    if (amountInput) {
        amountInput.addEventListener('input', updateDepositCalculation);
    }
}

// Добавьте в инициализацию страниц
function initPageSpecificFunctions(pageName) {
    switch(pageName) {
        case 'home':
            initHomePage();
            break;
        case 'requisites':
            initRequisitesPage();
            break;
        // ... остальные страницы
        
        case 'deposit':
            initDepositPage(); // Добавить эту строку
            break;
    }
}
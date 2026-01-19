// Простая версия для теста - только навигация

// Функции навигации
function showPage(pageId) {
    // Скрыть все страницы
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Показать нужную страницу
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
        page.classList.add('active');
    }
    
    // Показать/скрыть кнопку Назад
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = pageId === 'homePage' ? 'none' : 'flex';
    }
}

// Функции для кнопок
function showMain() {
    console.log("showMain вызвана");
    showPage('homePage');
}

function showProfilePage() {
    console.log("showProfilePage вызвана");
    showPage('profilePage');
}

function showDepositPage() {
    console.log("showDepositPage вызвана");
    showPage('depositPage');
}

function showWithdrawPage() {
    console.log("showWithdrawPage вызвана");
    showPage('withdrawPage');
}

function showTransferPage() {
    console.log("showTransferPage вызвана");
    showPage('transferPage');
}

function showHistory() {
    alert('История в разработке');
}

// Копирование
function copyUserId() {
    alert('ID скопирован: 739-228-415');
}

function copyAddress() {
    alert('Адрес скопирован: T9zXp9vLk8nGm3JfD2q1rW5tY7uI0oP4a6');
}

// Простые функции
function updateBalance() {
    alert('Баланс обновлен');
}

function checkDeposit() {
    alert('Проверяем пополнения...');
}

function contactSupport() {
    alert('Открываем поддержку...');
}

// Делаем функции глобальными
window.showMain = showMain;
window.showProfilePage = showProfilePage;
window.showDepositPage = showDepositPage;
window.showWithdrawPage = showWithdrawPage;
window.showTransferPage = showTransferPage;
window.showHistory = showHistory;
window.copyUserId = copyUserId;
window.copyAddress = copyAddress;
window.updateBalance = updateBalance;
window.checkDeposit = checkDeposit;
window.contactSupport = contactSupport;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log("Страница загружена");
    showPage('homePage');
});
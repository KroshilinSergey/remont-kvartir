function showPopup() {
  document.getElementById('popup').style.display = 'flex';
}

function hidePopup() {
  // Получаем введённый номер телефона
  const phone = document.getElementById('phoneInput').value;

  // Проверяем, заполнен ли номер
  if (!phone) {
    alert('Пожалуйста, введите номер телефона!');
    return;
  }

  // Валидация номера телефона (пример для РФ номеров)
  const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  if (!phoneRegex.test(phone)) {
    alert('Номер телефона введён некорректно!');
    return;
  }

  // Отправляем номер в Telegram через API
  sendToTelegram(phone);

  // Скрываем поп-ап после отправки
  document.getElementById('popup').style.display = 'none';

  // Очищаем поле ввода
  document.getElementById('phoneInput').value = '';

  // Уведомление пользователя
  alert('Спасибо! Ваш номер отправлен.');
}

// Функция для закрытия попапа при клике вне его области
function closePopupOnOutsideClick(event) {
  const popup = document.getElementById('popup');
  
  // Если клик был именно на overlay (пустой области), закрываем попап
  if (event.target === popup) {
    popup.style.display = 'none';
  }
}

// Функция для закрытия по ESC
function closePopupOnEsc(event) {
  if (event.key === 'Escape') {
    const popup = document.getElementById('popup');
    if (popup.style.display === 'flex') {
      popup.style.display = 'none';
    }
  }
}

// Функция для инициализации обработчиков
function initPopup() {
  const popup = document.getElementById('popup');
  
  // Добавляем обработчик клика по пустой области
  popup.addEventListener('click', closePopupOnOutsideClick);
  
  // Добавляем обработчик нажатия ESC
  document.addEventListener('keydown', closePopupOnEsc);
}

// Инициализируем попап при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initPopup();
});

function sendToTelegram(phone) {
  const token = '8443660805:AAGxVeBmRBxGsXtlNTKgvwqFdFbboOOG5_Y';
  const chatId = '596789512';
  const message = `Новый номер телефона: ${phone}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('Сообщение отправлено:', data);
    })
    .catch(error => {
      console.error('Ошибка при отправке:', error);
      alert('Произошла ошибка при отправке номера. Пожалуйста, попробуйте позже.');
    });
}
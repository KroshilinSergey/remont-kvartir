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

  // Форматируем номер телефона
  const cleanPhone = phone.replace(/\D/g, '');
  let formattedPhone;
  
  if (cleanPhone.length === 11 && (cleanPhone.startsWith('7') || cleanPhone.startsWith('8'))) {
    formattedPhone = `+7 (${cleanPhone.substring(1, 4)}) ${cleanPhone.substring(4, 7)}-${cleanPhone.substring(7, 9)}-${cleanPhone.substring(9, 11)}`;
  } else if (cleanPhone.length === 10) {
    formattedPhone = `+7 (${cleanPhone.substring(0, 3)}) ${cleanPhone.substring(3, 6)}-${cleanPhone.substring(6, 8)}-${cleanPhone.substring(8, 10)}`;
  } else {
    formattedPhone = phone;
  }

  // Отправляем номер в Telegram через API
  sendToTelegram(formattedPhone);

  // Скрываем поп-ап после отправки
  document.getElementById('popup').style.display = 'none';

  // Очищаем поле ввода
  document.getElementById('phoneInput').value = '';

  // Уведомление пользователя
  alert('Спасибо! Ваш номер отправлен. Мы перезвоним в течение 15 минут!');
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

// НОВАЯ функция для отправки в Telegram через Vercel API
function sendToTelegram(phone) {
  const data = {
    name: "Обратный звонок", // Обязательное поле
    phone: phone,
    source: "Форма обратного звонка",
    timestamp: new Date().toLocaleString("ru-RU")
  };

  const url = 'https://remont-kvartir.vercel.app/api/send-to-telegram';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Сообщение отправлено в Telegram:', data);
      } else {
        console.error('Ошибка от API:', data);
        // Можно показать более информативное сообщение
        // alert('Произошла ошибка при отправке номера. Пожалуйста, попробуйте позже.');
      }
    })
    .catch(error => {
      console.error('Ошибка при отправке:', error);
      // alert('Произошла ошибка при отправке номера. Пожалуйста, попробуйте позже.');
    });
}пше
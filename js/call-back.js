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

  // Уведомление пользователя
  alert('Спасибо! Ваш номер отправлен.');
}

function sendToTelegram(phone) {
  const token = '8443660805:AAGxVeBmRBxGsXtlNTKgvwqFdFbboOOG5_Y'; // Токен вашего бота
  const chatId = '596789512'; // ID чата, куда будут отправляться сообщения
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

 // Обработка формы
        document.getElementById('contactForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Отменяем стандартное поведение формы

            // Получаем значения полей
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const agree = document.getElementById('agree').checked;

            // Проверка полей
            if (!name || !phone || !agree) {
                alert('Пожалуйста, заполните все поля и согласитесь с условиями.');
                return;
            }

            // Отправка данных на сервер
            const data = {
                name: name,
                phone: phone
            };

            // Пример отправки данных через fetch
            fetch('/api/send-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Форма успешно отправлена!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Ошибка при отправке формы. Попробуйте позже.');
            });
        });

       /*  document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const agree = document.getElementById('agree').checked;

  if (!name || !phone || !agree) {
    alert('Пожалуйста, заполните все поля и согласитесь с условиями.');
    return;
  }

  fetch('/api/send-form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    alert('Форма успешно отправлена!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Ошибка при отправке формы. Попробуйте позже.');
  });
});


 */
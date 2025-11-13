const express = require('express');
const https = require('https');

const app = express();
const PORT = 3000;

const path = require('path');

// Парсинг JSON из POST-запросов
app.use(express.json());

// Статические файлы (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));

// API для приёма данных формы
app.post('/api/send-form', (req, res) => {
  const { name, phone } = req.body;

  console.log('Получены данные:', { name, phone });

  // Отправка в Telegram
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot8443660805:AAGxVeBmRBxGsXtlNTKgvwqFdFbboOOG5_Y/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({
    chat_id: "596789512",
    text: `Заявка:\nИмя: ${name}\nТелефон: ${phone}`
  });

  const reqTelegram = https.request(options, (resTelegram) => {
    let data = '';
    resTelegram.on('data', chunk => data += chunk);
    resTelegram.on('end', () => {
      console.log('Ответ Telegram:', data);
    });
  });

  reqTelegram.on('error', error => {
    console.error('Ошибка Telegram:', error);
  });

  reqTelegram.write(body);
  reqTelegram.end();

  res.json({ status: 'success' });
});

// Главная страница
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

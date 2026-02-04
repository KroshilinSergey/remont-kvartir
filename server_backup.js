const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Маршрут для отправки данных в Telegram
app.post("/api/send-to-telegram", async (req, res) => {
  try {
    console.log("Получена заявка:", req.body);
    
    const { name, phone } = req.body;

    if (!name || !phone) {
      console.error("Ошибка: отсутствуют обязательные поля");
      return res.status(400).json({
        success: false,
        error: "Имя и телефон обязательны",
      });
    }

    // ВСТАВЬТЕ СВОИ ДАННЫЕ TELEGRAM БОТА
    const TELEGRAM_BOT_TOKEN = "8443660805:AAGxVeBmRBxGsXtlNTKgvwqFdFbboOOG5_Y";
    const TELEGRAM_CHAT_ID = "596789512";
    
    const message = `📋 НОВАЯ ЗАЯВКА НА ЗАМЕР\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n⏰ Время: ${new Date().toLocaleString(
      "ru-RU"
    )}`;

    console.log("Отправляю сообщение в Telegram:", message);

    // Отправка сообщения в Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }
    );

    if (response.data.ok) {
      console.log("✅ Сообщение отправлено в Telegram");
      res.json({ 
        success: true, 
        message: "Заявка успешно отправлена!",
        telegramResponse: response.data 
      });
    } else {
      console.error("❌ Ошибка Telegram API:", response.data);
      throw new Error("Ошибка Telegram API");
    }
  } catch (error) {
    console.error("❌ Ошибка при отправке в Telegram:", error.message);
    
    // Детальная информация об ошибке
    if (error.response) {
      console.error("Данные ошибки:", error.response.data);
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data
    });
  }
});

// Проверка работы сервера
app.get("/api/health", (req, res) => {
  console.log("Проверка здоровья сервера");
  res.json({ 
    status: "ok", 
    message: "Прокси-сервер работает",
    timestamp: new Date().toISOString()
  });
});

// Корневой маршрут
app.get("/", (req, res) => {
  res.send(`
    <h1>Telegram Proxy Server</h1>
    <p>Сервер работает корректно</p>
    <p>Endpoints:</p>
    <ul>
      <li>POST /api/send-to-telegram - отправка заявки в Telegram</li>
      <li>GET /api/health - проверка работы сервера</li>
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Прокси-сервер запущен на порту ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📞 Telegram endpoint: POST /api/send-to-telegram`);
});
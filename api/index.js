const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ИСПОЛЬЗУЕМ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Middleware
app.use(cors());
app.use(express.json());

// Маршрут для отправки данных в Telegram
app.post("/api/send-to-telegram", async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Имя и телефон обязательны",
      });
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Переменные окружения не настроены");
    }

    const message = `📋 НОВАЯ ЗАЯВКА НА ЗАМЕР\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n⏰ Время: ${new Date().toLocaleString("ru-RU")}`;

    // Отправка сообщения в Telegram
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      },
    );

    if (response.data.ok) {
      console.log("Сообщение отправлено в Telegram:", response.data.result);
      res.json({ success: true, message: "Заявка успешно отправлена!" });
    } else {
      throw new Error("Ошибка Telegram API");
    }
  } catch (error) {
    console.error("Ошибка при отправке в Telegram:", error.message);
    res.status(500).json({
      success: false,
      error: "Ошибка сервера при отправке заявки",
      details: error.message,
    });
  }
});

// Проверка работы сервера
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Прокси-сервер работает",
    timestamp: new Date().toISOString(),
    bot_token_configured: !!TELEGRAM_BOT_TOKEN,
    chat_id_configured: !!TELEGRAM_CHAT_ID,
  });
});

// Экспорт для Vercel
module.exports = app;

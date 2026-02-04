// api/telegram.js - ОБНОВЛЕННЫЙ КОД
const axios = require("axios");

module.exports = async (req, res) => {
  // Разрешаем CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ПРОВЕРКА ЗДОРОВЬЯ СЕРВЕРА
  if (req.method === "GET" && req.url === "/api/health") {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    
    return res.json({
      status: "ok",
      message: "API работает",
      timestamp: new Date().toISOString(),
      bot_token_configured: !!TELEGRAM_BOT_TOKEN,
      chat_id_configured: !!TELEGRAM_CHAT_ID,
    });
  }

  // ОТПРАВКА В TELEGRAM
  if (req.method === "POST" && req.url === "/api/send-to-telegram") {
    try {
      const { name, phone, email, services, message } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          error: "Имя и телефон обязательны",
        });
      }

      // Используйте переменные окружения Vercel
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

      const telegramMessage = `📋 НОВАЯ ЗАЯВКА\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n${email ? `📧 Email: ${email}\n` : ""}${services ? `🛠 Услуги: ${services}\n` : ""}${message ? `💬 Сообщение: ${message}\n` : ""}⏰ Время: ${new Date().toLocaleString("ru-RU")}`;

      const response = await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: "HTML",
        },
      );

      if (response.data.ok) {
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
  } else {
    // Если это не /api/health и не /api/send-to-telegram
    res.status(404).json({ error: "Not Found" });
  }
};
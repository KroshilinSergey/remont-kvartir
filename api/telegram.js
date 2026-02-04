// api/telegram.js
const axios = require("axios");

module.exports = async (req, res) => {
  // Разрешаем CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, phone, email, services, message, timestamp, fullMessage } =
      req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Имя и телефон обязательны",
      });
    }

    // Используйте переменные окружения Vercel
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const telegramMessage =
      fullMessage ||
      `📋 НОВАЯ ЗАЯВКА\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n${email ? `📧 Email: ${email}\n` : ""}${services ? `🛠 Услуги: ${services}\n` : ""}${message ? `💬 Сообщение: ${message}\n` : ""}⏰ Время: ${timestamp || new Date().toLocaleString("ru-RU")}`;

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
};

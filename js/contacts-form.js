document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const otherField = document.getElementById("otherField");
  const otherInfo = document.getElementById("otherInfo");

  const PROXY_URL = "https://remont-kvartir.vercel.app/api/send-to-telegram";

  // Маска телефона
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 0) {
        if (!value.startsWith("7") && !value.startsWith("8")) {
          value = "7" + value;
        }
        let formattedValue = "+7";
        if (value.length > 1) formattedValue += " (" + value.substring(1, 4);
        if (value.length >= 4) formattedValue += ") " + value.substring(4, 7);
        if (value.length >= 7) formattedValue += "-" + value.substring(7, 9);
        if (value.length >= 9) formattedValue += "-" + value.substring(9, 11);
        e.target.value = formattedValue;
      }
    });
  }

  // Чекбокс "Другое"
  document.querySelectorAll('input[name="service"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const otherCheckbox = document.getElementById("serviceOther");
      if (otherCheckbox && otherCheckbox.checked) {
        if (otherField) otherField.style.display = "block";
        if (otherInfo) otherInfo.required = true;
      } else {
        if (otherField) otherField.style.display = "none";
        if (otherInfo) otherInfo.required = false;
        if (otherInfo) otherInfo.value = "";
      }
    });
  });

  // Отправка формы
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (successMessage) successMessage.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const agree = document.getElementById("agree")
      ? document.getElementById("agree").checked
      : false;
    const otherInfoValue = otherInfo ? otherInfo.value.trim() : "";

    const selectedServices = Array.from(
      document.querySelectorAll('input[name="service"]:checked'),
    ).map((checkbox) => checkbox.value);

    // Валидация
    if (!name || !phone || !agree) {
      showError(
        "Пожалуйста, заполните все обязательные поля и согласитесь с условиями",
      );
      return;
    }

    if (selectedServices.length === 0) {
      showError("Пожалуйста, выберите хотя бы одну услугу");
      return;
    }

    const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      showError(
        "Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX",
      );
      return;
    }

    // Блокируем кнопку
    if (submitBtn) {
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = "Отправка...";
    }

    try {
      // Формируем сообщение
      let servicesText = selectedServices.join(", ");
      if (selectedServices.includes("Другое") && otherInfoValue) {
        servicesText = servicesText.replace(
          "Другое",
          `Другое: ${otherInfoValue}`,
        );
      }

      const now = new Date();
      const samaraTime = new Date(now.getTime() + 4 * 60 * 60000);
      const timestamp = `${String(samaraTime.getDate()).padStart(2, "0")}.${String(samaraTime.getMonth() + 1).padStart(2, "0")}.${samaraTime.getFullYear()} ${String(samaraTime.getHours()).padStart(2, "0")}:${String(samaraTime.getMinutes()).padStart(2, "0")}`;

      let fullMessage = `📋 НОВАЯ ЗАЯВКА С САЙТА\n`;
      fullMessage += `📍 Страница: Контакты\n\n`;
      fullMessage += `👤 Имя: ${name}\n`;
      fullMessage += `📞 Телефон: ${cleanPhone}\n`;
      if (email) fullMessage += `📧 Email: ${email}\n`;
      fullMessage += `🛠 Услуги: ${servicesText}\n`;
      if (message) fullMessage += `💬 Сообщение: ${message}\n`;
      fullMessage += `⏰ Время отправки (Самара): ${timestamp}\n`;
      fullMessage += `🌐 Источник: ${window.location.href}`;

      const messageData = {
        name: name,
        phone: cleanPhone,
        email: email || "Не указан",
        services: servicesText,
        message: message || "Не указано",
        timestamp: timestamp,
        source: "Контакты",
        fullMessage: fullMessage,
      };

      const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const result = await response.json();
      if (result.success) {
        showSuccess(
          "✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут!",
        );
        form.reset();
        if (otherField) otherField.style.display = "none";
        if (otherInfo) {
          otherInfo.required = false;
          otherInfo.value = "";
        }
        document
          .querySelectorAll('input[name="service"]:checked')
          .forEach((checkbox) => {
            checkbox.checked = false;
          });
      } else {
        throw new Error(result.error || "Ошибка сервера");
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      if (error.message.includes("Failed to fetch")) {
        showError(
          "❌ Сервер временно недоступен. Пожалуйста, позвоните нам напрямую по телефону: +7 909 36 29 675",
        );
      } else if (error.message.includes("Network")) {
        showError("❌ Проблемы с сетью. Проверьте подключение к интернету.");
      } else {
        showError("❌ Ошибка отправки: " + error.message);
      }
    } finally {
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (btnText) btnText.textContent = "Отправить заявку";
        }
      }, 2000);
    }
  });

  function showSuccess(message) {
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.style.display = "block";
    }
    if (errorMessage) errorMessage.style.display = "none";
    if (successMessage) {
      successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 15000);
    }
  }

  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
    if (successMessage) successMessage.style.display = "none";
    if (errorMessage) {
      errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 10000);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");
  const otherField = document.getElementById("otherField");
  const otherInfo = document.getElementById("otherInfo");

  // URL прокси-сервера

  const PROXY_URL = "https://remont-kvartir.vercel.app/api/send-to-telegram";

  // Функция для получения Самарского времени (UTC+4)
  function getSamaraTime() {
    const now = new Date();
    // Самарское время: UTC+4 (летом UTC+4, зимой UTC+4)
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const samaraTime = new Date(utcTime + 4 * 60 * 60000); // UTC+4

    const day = String(samaraTime.getDate()).padStart(2, "0");
    const month = String(samaraTime.getMonth() + 1).padStart(2, "0");
    const year = samaraTime.getFullYear();
    const hours = String(samaraTime.getHours()).padStart(2, "0");
    const minutes = String(samaraTime.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // Маска для телефона
  const phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 0) {
      if (!value.startsWith("7") && !value.startsWith("8")) {
        value = "7" + value;
      }

      let formattedValue = "+7";

      if (value.length > 1) {
        formattedValue += " (" + value.substring(1, 4);
      }
      if (value.length >= 4) {
        formattedValue += ") " + value.substring(4, 7);
      }
      if (value.length >= 7) {
        formattedValue += "-" + value.substring(7, 9);
      }
      if (value.length >= 9) {
        formattedValue += "-" + value.substring(9, 11);
      }

      e.target.value = formattedValue;
    }
  });

  // Обработка чекбокса "Другое"
  document.querySelectorAll('input[name="service"]').forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const otherCheckbox = document.querySelector(
        'input[name="service"][value="Другое"]',
      );
      if (otherCheckbox.checked) {
        otherField.style.display = "block";
        otherInfo.required = true;
      } else {
        otherField.style.display = "none";
        otherInfo.required = false;
        otherInfo.value = "";
      }
    });
  });

  // Обработка отправки формы
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Скрываем предыдущие сообщения
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    // Получаем значения полей
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const agree = document.getElementById("agree").checked;

    // Получаем выбранные услуги
    const selectedServices = Array.from(
      document.querySelectorAll('input[name="service"]:checked'),
    ).map((checkbox) => checkbox.value);

    const otherInfoValue = otherInfo.value.trim();

    // Валидация
    if (!name || !phone || !agree) {
      showError(
        "Пожалуйста, заполните все обязательные поля и согласитесь с условиями",
      );
      return;
    }

    // Проверка, выбрана ли хотя бы одна услуга
    if (selectedServices.length === 0) {
      showError("Пожалуйста, выберите хотя бы одну услугу");
      return;
    }

    // Проверка номера телефона
    const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
    const cleanPhone = phone.replace(/\s+/g, "");

    if (!phoneRegex.test(cleanPhone)) {
      showError(
        "Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX",
      );
      return;
    }

    // Блокируем кнопку и показываем индикатор загрузки
    submitBtn.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> Отправка...';

    try {
      // Формируем строку с выбранными услугами
      let servicesText = selectedServices.join(", ");
      if (selectedServices.includes("Другое") && otherInfoValue) {
        servicesText = servicesText.replace(
          "Другое",
          `Другое: ${otherInfoValue}`,
        );
      }

      // Получаем Самарское время
      const samaraTime = getSamaraTime();

      // Формируем сообщение для отправки
      const messageData = {
        name: name,
        phone: cleanPhone,
        services: servicesText,
        timestamp: samaraTime,
        // Формируем полное сообщение для удобства чтения в Telegram
        fullMessage: `📋 НОВАЯ ЗАЯВКА\n\n👤 Имя: ${name}\n📞 Телефон: ${cleanPhone}\n🛠 Услуги: ${servicesText}\n⏰ Время отправки (Самара): ${samaraTime}`,
      };

      // Отправляем данные на прокси-сервер
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
        otherField.style.display = "none";
        otherInfo.required = false;

        // Сброс чекбоксов
        document
          .querySelectorAll('input[name="service"]:checked')
          .forEach((checkbox) => {
            checkbox.checked = false;
          });

        // Дополнительно: можно сохранить в localStorage для статистики
        const submissions = JSON.parse(
          localStorage.getItem("formSubmissions") || "[]",
        );
        submissions.push({
          name: name,
          phone: cleanPhone,
          services: servicesText,
          date: new Date().toLocaleString(),
          samaraTime: samaraTime,
        });
        localStorage.setItem("formSubmissions", JSON.stringify(submissions));
      } else {
        throw new Error(result.error || "Ошибка сервера");
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);

      // Если прокси-сервер недоступен, пытаемся отправить напрямую (только для разработки)
      if (window.location.hostname === "localhost") {
        console.log("Прокси-сервер недоступен, пробуем прямой запрос...");
        showSuccess("✅ Заявка отправлена! (тестовый режим)");
        form.reset();
        otherField.style.display = "none";
        otherInfo.required = false;

        // Сброс чекбоксов
        document
          .querySelectorAll('input[name="service"]:checked')
          .forEach((checkbox) => {
            checkbox.checked = false;
          });
      } else {
        showError(
          "❌ Ошибка отправки. Пожалуйста, попробуйте еще раз или позвоните нам напрямую.",
        );
      }
    } finally {
      // Разблокируем кнопку через 3 секунды
      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = "Отправить заявку";
      }, 3000);
    }
  });

  function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    errorMessage.style.display = "none";

    // Автоматически скрываем сообщение через 10 секунд
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 10000);
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    successMessage.style.display = "none";
    submitBtn.disabled = false;
    btnText.textContent = "Отправить заявку";
  }

  // Проверяем, был ли пользователь уже на сайте
  if (!localStorage.getItem("firstVisit")) {
    localStorage.setItem("firstVisit", new Date().toISOString());
    console.log("Первый визит пользователя");
  }
});

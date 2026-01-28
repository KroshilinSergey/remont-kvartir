// js/accordion.js
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎯 ACCORDION LOADED for price.html");

  // ШАГ 1: Убираем все классы .show из HTML перед инициализацией
  document.querySelectorAll(".accordion-content.show").forEach((content) => {
    content.classList.remove("show");
  });

  // ШАГ 2: Убираем активные классы с заголовков
  document.querySelectorAll(".accordion-title.active").forEach((title) => {
    title.classList.remove("active");
  });

  // Собираем все заголовки аккордеона
  const accordionTitles = document.querySelectorAll(".accordion-title");

  if (accordionTitles.length === 0) {
    console.warn("⚠️ Не найдены элементы с классом .accordion-title");
    return;
  }

  console.log(`✅ Найдено ${accordionTitles.length} аккордеонов`);

  // Инициализация - скрываем все контенты
  document.querySelectorAll(".accordion-content").forEach((content) => {
    content.style.display = "none";
  });

  // Добавляем обработчик клика для каждого заголовка
  accordionTitles.forEach((title) => {
    title.addEventListener("click", function () {
      console.log("Клик по аккордеону:", this.textContent);

      // Находим соответствующий контент
      const contentId = this.getAttribute("data-target");
      const content = document.getElementById(contentId);

      if (!content) {
        console.error("Не найден контент с ID:", contentId);
        return;
      }

      // Проверяем, открыт ли текущий аккордеон
      const isCurrentlyOpen = content.style.display === "block";

      // Закрываем все аккордеоны
      closeAllAccordions();

      // Если текущий был закрыт - открываем его
      if (!isCurrentlyOpen) {
        // Открываем контент
        content.style.display = "block";
        content.classList.add("show"); // Добавляем класс для CSS анимаций

        // Добавляем активный класс
        this.classList.add("active");

        // Анимируем иконку
        const icon = this.querySelector("i");
        if (icon) {
          icon.style.transform = "rotate(180deg)";
        }

        console.log("✅ Аккордеон открыт:", contentId);
      } else {
        console.log("✅ Аккордеон закрыт:", contentId);
      }
    });
  });

  // Функция закрытия всех аккордеонов
  function closeAllAccordions() {
    // Закрываем все контенты
    document.querySelectorAll(".accordion-content").forEach((content) => {
      content.style.display = "none";
      content.classList.remove("show");
    });

    // Убираем активные классы
    document.querySelectorAll(".accordion-title").forEach((title) => {
      title.classList.remove("active");

      // Возвращаем иконку в исходное положение
      const icon = title.querySelector("i");
      if (icon) {
        icon.style.transform = "rotate(0deg)";
      }
    });
  }

  console.log(
    "✅ Accordion system ready! Все аккордеоны закрыты по умолчанию.",
  );
});

/* function toggleAccordion(element) {
  const targetId = element.dataset.target;
  const content = document.getElementById(targetId);

  // 1. Закрываем ВСЕ открытые аккордеоны, КРОМЕ текущего
  document.querySelectorAll(".accordion-content.active").forEach((item) => {
    if (item !== content) {
      // Пропускаем текущий элемент
      item.style.maxHeight = null;
      item.classList.remove("active");
      item.previousElementSibling.classList.remove("active");
    }
  });

  // 2. Переключаем состояние ТОЛЬКО текущего аккордеона
  if (content.classList.contains("active")) {
    // Если уже открыт — закрываем
    content.style.maxHeight = null;
    content.classList.remove("active");
    element.classList.remove("active");
  } else {
    // Если закрыт — открываем
    content.style.maxHeight = content.scrollHeight + "px";
    content.classList.add("active");
    element.classList.add("active");
  }
}
 */

function toggleAccordion(element) {
  const targetId = element.dataset.target;
  const content = document.getElementById(targetId);

  // 1. Закрываем ВСЕ открытые аккордеоны, КРОМЕ текущего
  document.querySelectorAll(".accordion-content.active").forEach((item) => {
    if (item !== content) {
      // Пропускаем текущий элемент
      item.style.maxHeight = null;
      item.classList.remove("active");
      item.previousElementSibling.classList.remove("active");
    }
  });

  // 2. Переключаем состояние ТОЛЬКО текущего аккордеона
  if (content.classList.contains("active")) {
    // Если уже открыт — закрываем
    content.style.maxHeight = null;
    content.classList.remove("active");
    element.classList.remove("active");
  } else {
    // Если закрыт — открываем
    content.style.maxHeight = content.scrollHeight + "px";
    content.classList.add("active");
    element.classList.add("active");
  }
}

// Добавляем функционал автоматического раскрытия аккордеона по хешу в URL
document.addEventListener('DOMContentLoaded', function() {
  const hash = window.location.hash; // Получаем хэш (например, #section1)

  if (hash) {
    const targetId = hash.substring(1); // Убираем символ #, получаем id (section1)
    const content = document.getElementById(targetId);
    const header = document.querySelector(`[data-target="${targetId}"]`); // Находим элемент-заголовок аккордеона

    if (content && header) {
      // Вызываем функцию toggleAccordion для автоматического раскрытия
      toggleAccordion(header);
    }
  }
});

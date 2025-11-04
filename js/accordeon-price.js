function toggleAccordion(element) {
  const targetId = element.dataset.target;
  const content = document.getElementById(targetId);

  // 1. Закрываем ВСЕ открытые аккордеоны (снимаем .active и сбрасываем высоту)
  document.querySelectorAll('.accordion-content.active').forEach(item => {
    item.style.maxHeight = null; // Скрываем содержимое
    item.classList.remove('active'); // Убираем класс active
    item.previousElementSibling.classList.remove('active'); // Убираем active у заголовка
  });

  // 2. Раскрываем только текущий аккордеон
  if (content.style.maxHeight) {
    content.style.maxHeight = null; // Если уже открыт — закрываем
    element.classList.remove('active'); // Убираем фон у заголовка
  } else {
    content.style.maxHeight = content.scrollHeight + 'px'; // Раскрываем
    element.classList.add('active'); // Добавляем фон у заголовка
  }
}

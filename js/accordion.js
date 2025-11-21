// js/accordion.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 ACCORDION LOADED');
    
    // Скрываем все аккордеоны при загрузке
    document.querySelectorAll('.accordion-content').forEach(content => {
        content.classList.remove('show');
    });
    
    // Обработчики кликов
    document.querySelectorAll('.accordion-title').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isOpen = content.classList.contains('show');
            
            // Закрываем все аккордеоны
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.classList.remove('show');
            });
            
            // Убираем активный класс со всех кнопок
            document.querySelectorAll('.accordion-title').forEach(b => {
                b.classList.remove('active');
            });
            
            // Открываем текущий аккордеон если он был закрыт
            if (!isOpen) {
                content.classList.add('show');
                this.classList.add('active');
                
                // Принудительно применяем стили к внутреннему контенту
                applyContentStyles();
            }
        });
    });
    
    // Функция для принудительного применения стилей к контенту
    function applyContentStyles() {
        document.querySelectorAll('.about_link-all').forEach(container => {
            container.style.display = 'flex';
            container.style.visibility = 'visible';
            container.style.opacity = '1';
        });
        
        document.querySelectorAll('.about_link-one').forEach(link => {
            link.style.display = 'block';
            link.style.visibility = 'visible';
            link.style.opacity = '1';
        });
    }
    
    // Применяем стили сразу при загрузке
    applyContentStyles();
    
    console.log('✅ Accordion ready');
});
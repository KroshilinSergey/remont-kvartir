// АККОРДЕОН FAQ - ИСПРАВЛЕННАЯ ВЕРСИЯ
document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт аккордеона загружен');
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        console.error('Элементы .faq-item не найдены на странице!');
        return;
    }
    
    console.log(`Найдено элементов FAQ: ${faqItems.length}`);
    
    // Инициализация - закрываем все ответы
    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        if (answer) {
            answer.style.display = 'none'; // Используем display вместо max-height
        }
        
        const arrow = item.querySelector('.faq-arrow i');
        if (arrow) {
            arrow.className = 'fas fa-chevron-down';
        }
        
        item.classList.remove('active');
    });
    
    // Добавляем обработчики клика на вопросы
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const arrow = item.querySelector('.faq-arrow i');
        
        if (!question || !answer || !arrow) {
            console.warn('Не найдены все необходимые элементы в FAQ-элементе');
            return;
        }
        
        question.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Клик по FAQ вопросу');
            
            // Проверяем, открыт ли текущий элемент
            const isActive = item.classList.contains('active');
            
            // Закрываем ВСЕ элементы
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherArrow = otherItem.querySelector('.faq-arrow i');
                
                if (otherAnswer) {
                    otherAnswer.style.display = 'none';
                }
                if (otherArrow) {
                    otherArrow.className = 'fas fa-chevron-down';
                }
            });
            
            // Если текущий элемент был закрыт - открываем его
            if (!isActive) {
                item.classList.add('active');
                answer.style.display = 'block';
                arrow.className = 'fas fa-chevron-up';
                console.log('Открыт FAQ элемент');
            } else {
                // Если был открыт - уже закрыт выше
                console.log('Закрыт FAQ элемент');
            }
        });
    });
    
    // Закрытие при клике в любом месте страницы
    document.addEventListener('click', function(e) {
        // Проверяем, был ли клик не по FAQ-элементу
        if (!e.target.closest('.faq-item') && !e.target.closest('.faq-question')) {
            console.log('Клик вне FAQ, закрываем все');
            
            faqItems.forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                const arrow = item.querySelector('.faq-arrow i');
                
                if (answer) {
                    answer.style.display = 'none';
                }
                if (arrow) {
                    arrow.className = 'fas fa-chevron-down';
                }
            });
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('Нажата Escape, закрываем все FAQ');
            
            faqItems.forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('.faq-answer');
                const arrow = item.querySelector('.faq-arrow i');
                
                if (answer) {
                    answer.style.display = 'none';
                }
                if (arrow) {
                    arrow.className = 'fas fa-chevron-down';
                }
            });
        }
    });
    
    console.log('Аккордеон успешно инициализирован');
});
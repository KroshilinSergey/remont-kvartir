document.addEventListener('DOMContentLoaded', function() {
    const titles = document.querySelectorAll('.accordion-title');
    
    titles.forEach(title => {
        title.addEventListener('click', function() {
            // Получаем текущий контент
            const currentContent = this.nextElementSibling;
            
            // Закрываем все открытые аккордеоны
            document.querySelectorAll('.accordion-content').forEach(content => {
                if (content !== currentContent) {
                    content.classList.remove('show');
                }
            });
            
            // Переключаем состояние текущего контента
            currentContent.classList.toggle('show');
        });
    });
});


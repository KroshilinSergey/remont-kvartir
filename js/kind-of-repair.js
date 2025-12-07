 // Функция для плавной прокрутки к секциям
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Обновляем активную вкладку
            document.querySelectorAll('.repair-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Находим соответствующую вкладку и делаем её активной
            const tabs = document.querySelectorAll('.repair-tab');
            if (sectionId === 'cosmetic') {
                tabs[0].classList.add('active');
            } else if (sectionId === 'capital') {
                tabs[1].classList.add('active');
            }
        }
        
        // Добавляем отслеживание прокрутки для обновления активной вкладки
        window.addEventListener('scroll', function() {
            const cosmeticSection = document.getElementById('cosmetic');
            const capitalSection = document.getElementById('capital');
            const tabs = document.querySelectorAll('.repair-tab');
            
            const scrollPosition = window.scrollY + 100;
            
            // Получаем позиции секций
            const cosmeticPosition = cosmeticSection.offsetTop;
            const capitalPosition = capitalSection.offsetTop;
            
            // Определяем, какая секция сейчас видна
            if (scrollPosition < capitalPosition - 200) {
                tabs[0].classList.add('active');
                tabs[1].classList.remove('active');
            } else {
                tabs[0].classList.remove('active');
                tabs[1].classList.add('active');
            }
        });
        
        // Анимация карточек при прокрутке
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-card');
                }
            });
        }, observerOptions);
        
        // Наблюдаем за карточками
        document.querySelectorAll('.repair-type-card').forEach(card => {
            observer.observe(card);
        });
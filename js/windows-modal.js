// Данные для профилей окон с изображениями
const windowProfiles = {
    'kve': {
        title: 'Профиль КВЕ',
        name: 'КВЕ',
        description: 'Профиль КВЕ экологичен, безопасен для здоровья и окружающей среды. Устойчив к перепадам температур, влаге, химическим и механическим воздействиям. Долговечен, сохраняет свойства в любых условиях, обеспечивая надёжность и комфорт.',
        image: 'img/KBE.png',
        metrics: {
            heat: '123%',
            light: '135%',
            noise: '105%'
        },
        price: 'от 4 550 ₽/м'
    },
    'rehau': {
        title: 'Профиль REHAU',
        name: 'REHAU',
        description: 'Пластиковые окна из профиля REHAU заслужили безупречную репутацию благодаря более чем 50-летнему опыту производства в Германии. Их элегантный дизайн и безупречное качество воплощают в себе настоящую немецкую классику.',
        image: 'img/REHAU.webp',
        metrics: {
            heat: '133%',
            light: '130%',
            noise: '111%'
        },
        price: 'от 6 910 ₽/м'
    },
    'schmitz': {
        title: 'Профиль SCHMITZ',
        name: 'SCHMITZ',
        description: 'Немецкое качество и инновационные технологии. Профиль SCHMITZ сочетает в себе высокую энергоэффективность, отличную шумоизоляцию и современный дизайн.',
        image: 'img/SCHMITZ.png',
        metrics: {
            heat: '125%',
            light: '128%',
            noise: '108%'
        },
        price: ' от 5 745 ₽/м'
    }
};

// Функция для открытия модального окна
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Устанавливаем профиль КВЕ по умолчанию
        updateProfile('kve');
        
        // Добавляем класс для анимации
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

// Функция для закрытия модального окна
function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Функция для обновления профиля
function updateProfile(profileId) {
    const profile = windowProfiles[profileId];
    if (!profile) return;
    
    // Обновляем элементы
    const modalTitle = document.querySelector('.modal-title');
    const profileName = document.getElementById('profile-name');
    const profileDescription = document.getElementById('profile-description');
    const profileImage = document.getElementById('profile-image');
    const metricHeat = document.getElementById('metric-heat');
    const metricLight = document.getElementById('metric-light');
    const metricNoise = document.getElementById('metric-noise');
    const profilePrice = document.getElementById('profile-price');
    
    if (modalTitle) modalTitle.textContent = profile.title;
    if (profileName) profileName.textContent = profile.name;
    if (profileDescription) profileDescription.textContent = profile.description;
    if (profileImage) {
        profileImage.src = profile.image;
        profileImage.alt = profile.name.toLowerCase();
    }
    if (metricHeat) metricHeat.textContent = profile.metrics.heat;
    if (metricLight) metricLight.textContent = profile.metrics.light;
    if (metricNoise) metricNoise.textContent = profile.metrics.noise;
    if (profilePrice) profilePrice.textContent = profile.price;
    
    // Обновляем активную кнопку
    updateActiveBrand(profileId);
}

// Функция для обновления активного бренда
function updateActiveBrand(activeProfileId) {
    const brandColumns = document.querySelectorAll('.brand-column');
    brandColumns.forEach(col => {
        if (col.getAttribute('data-brand') === activeProfileId) {
            col.classList.add('active');
        } else {
            col.classList.remove('active');
        }
    });
}

// Функция для расчета профиля
function calculateProfile() {
    closeProfileModal();
    setTimeout(function() {
        // Здесь можно вызвать существующую функцию showPopup()
        // или перенаправить на форму
        if (typeof showPopup === 'function') {
            showPopup();
        } else {
            window.location.href = 'index.html#record';
        }
    }, 300);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Window profiles modal script loaded');
    
    // Находим все кнопки "Подробнее" и добавляем обработчики
    const detailButtons = document.querySelectorAll('.about_link-one');
    
    detailButtons.forEach(button => {
        // Заменяем ссылки на кнопки
        if (button.tagName === 'A') {
            const parent = button.parentNode;
            const newButton = document.createElement('button');
            newButton.className = button.className;
            newButton.textContent = button.textContent;
            newButton.type = 'button';
            newButton.addEventListener('click', openProfileModal);
            parent.replaceChild(newButton, button);
        } else if (button.tagName === 'BUTTON') {
            button.addEventListener('click', openProfileModal);
        }
    });
    
    // Закрытие модального окна при клике на крестик
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProfileModal);
    }
    
    // Закрытие модального окна при клике вне его
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeProfileModal();
            }
        });
    }
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProfileModal();
        }
    });
    
    // Обработчики для переключения брендов
    const brandColumns = document.querySelectorAll('.brand-column');
    brandColumns.forEach(col => {
        col.addEventListener('click', function() {
            const profileId = this.getAttribute('data-brand');
            updateProfile(profileId);
        });
    });
    
    // Обработчик кнопки "ПОЛУЧИТЬ ТОЧНЫЙ РАСЧЕТ"
    const calculateBtn = document.querySelector('.modal-calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateProfile);
    }
    
    // Добавляем глобальные функции для использования в onclick
    window.openProfileModal = openProfileModal;
    window.closeProfileModal = closeProfileModal;
    window.calculateProfile = calculateProfile;
    
    console.log('Window profiles modal script initialized');
});
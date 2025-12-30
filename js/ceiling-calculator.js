// Калькулятор стоимости натяжных потолков
document.addEventListener('DOMContentLoaded', function() {
    // Базовые цены по умолчанию (используются если не найдены в таблице)
    const defaultPrices = {
        'matte': 640,    // Матовые
        'glossy': 640,   // Глянцевые
        'satin': 640     // Сатиновые
    };
    
    // Коэффициенты для цветного потолка
    const colorMultipliers = {
        'white': 1.0,
        'colored': 1.2   // +20% для цветного
    };
    
    // Соответствие названий опций калькулятора с названиями в таблице
    const optionNameMapping = {
        'Обход трубы': 'Дополнительное отверстие до 50 мм / обход трубы',
        'Профиль стеновой ПВХ по периметру': 'Профиль стеновой ПВХ по периметру',
        'Лента-плингус (вставка) белая с установкой': 'Лента-плингус вставка белая с установкой',
        'Установка закладной под люстру': 'Установка закладной под люстру',
        'Установка точечного светильника': 'Установка точечного светильника',
        'Эл. кабель с проведением эл. проводки': 'Эл. кабель с проведением эл. проводки',
        'Установка светодиодной ленты': 'Установка светодиодной ленты'
    };
    
    // Соответствие единиц измерения
    const unitMapping = {
        'Обход трубы': 'шт',
        'Профиль стеновой ПВХ по периметру': 'пог.м',
        'Лента-плингус (вставка) белая с установкой': 'пог.м',
        'Установка закладной под люстру': 'шт',
        'Установка точечного светильника': 'шт',
        'Эл. кабель с проведением эл. проводки': 'пог.м',
        'Установка светодиодной ленты': 'пог. м'
    };
    
    // Кэш для цен из таблицы
    let priceTableCache = {};
    
    // Функция для парсинга таблицы цен
    function parsePriceTable() {
        const rows = document.querySelectorAll('.price-table tbody tr');
        priceTableCache = {};
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const serviceName = cells[0].textContent.trim();
                const unit = cells[1].textContent.trim();
                const priceText = cells[2].textContent.trim().replace(/\s/g, '');
                const price = parseInt(priceText);
                
                if (!isNaN(price)) {
                    priceTableCache[serviceName] = {
                        price: price,
                        unit: unit
                    };
                }
            }
        });
        
        return Object.keys(priceTableCache).length > 0;
    }
    
    // Функция для поиска цены по названию (точный поиск)
    function findPriceInTable(searchName) {
        const cleanSearch = searchName.toLowerCase().trim();
        
        // 1. Прямое сравнение
        for (const [key, value] of Object.entries(priceTableCache)) {
            if (key.toLowerCase() === cleanSearch) {
                return value.price;
            }
        }
        
        // 2. Проверяем, содержится ли поисковое название в ключе таблицы
        for (const [key, value] of Object.entries(priceTableCache)) {
            if (key.toLowerCase().includes(cleanSearch)) {
                return value.price;
            }
        }
        
        // 3. Проверяем, содержится ли ключ таблицы в поисковом названии
        for (const [key, value] of Object.entries(priceTableCache)) {
            if (cleanSearch.includes(key.toLowerCase())) {
                return value.price;
            }
        }
        
        return null;
    }
    
    // Функция для получения цены дополнительной опции (улучшенная версия)
    function getOptionPrice(optionName) {
        // ФИКС: Для ленты-плингуса всегда используем 100 руб. из прайса
        if (optionName.includes('плингус')) {
            console.log(`Для "${optionName}" используем фиксированную цену из прайса: 100 руб.`);
            return 100;
        }
        
        // Для остальных опций ищем в таблице
        const mappedName = optionNameMapping[optionName];
        if (mappedName) {
            const priceFromMapping = findPriceInTable(mappedName);
            if (priceFromMapping !== null) {
                return priceFromMapping;
            }
        }
        
        // Пробуем найти прямое совпадение в таблице
        const directPrice = findPriceInTable(optionName);
        if (directPrice !== null) {
            return directPrice;
        }
        
        // Цены по умолчанию из прайса (обновлены)
        const defaultOptionPrices = {
            'Обход трубы': 400,
            'Профиль стеновой ПВХ по периметру': 200,
            'Лента-плингус (вставка) белая с установкой': 100, // ФИКСИРОВАННО 100 руб.
            'Установка закладной под люстру': 700,
            'Установка точечного светильника': 270,
            'Эл. кабель с проведением эл. проводки': 60,
            'Установка светодиодной ленты': 650
        };
        
        return defaultOptionPrices[optionName] || 1000;
    }
    
    // Функция для получения единицы измерения опции
    function getOptionUnit(optionName) {
        if (unitMapping[optionName]) {
            return unitMapping[optionName];
        }
        
        const mappedName = optionNameMapping[optionName];
        if (mappedName && priceTableCache[mappedName]) {
            return priceTableCache[mappedName].unit;
        }
        
        // Определяем по названию
        if (optionName.includes('м.п.') || optionName.includes('пог. м') || 
            optionName.includes('Профиль') || optionName.includes('Лента') ||
            optionName.includes('плингус') || optionName.includes('кабель')) {
            return 'пог.м';
        }
        
        return 'шт';
    }
    
    // Функция для получения базовой цены за м² из таблицы
    function getBasePriceFromTable(texture) {
        const textureNames = {
            'matte': 'Матовые натяжные потолки',
            'glossy': 'Глянцевые натяжные потолки',
            'satin': 'Сатиновые натяжные потолки'
        };
        
        const tableName = textureNames[texture];
        if (tableName) {
            const price = findPriceInTable(tableName);
            if (price !== null) {
                return price;
            }
        }
        
        return defaultPrices[texture] || 640;
    }
    
    // Функция для получения цены обработки дополнительного угла
    function getExtraCornerPrice() {
        const price = findPriceInTable('Обработка доп. угла');
        if (price !== null) {
            return price;
        }
        
        return 375;
    }
    
    // Элементы калькулятора
    const areaInput = document.getElementById('area');
    const areaRange = document.getElementById('area-range');
    const cornersInput = document.getElementById('corners');
    const cornersRange = document.getElementById('corners-range');
    const textureButtons = document.querySelectorAll('.texture-btn');
    const colorButtons = document.querySelectorAll('.color-btn');
    const additionalOptions = document.querySelectorAll('.add-option');
    const resultPrice = document.querySelector('.result-price');
    const breakdownItems = document.querySelectorAll('.breakdown-item');
    const totalValue = document.querySelector('.total-value');
    
    // Текущие значения
    let currentArea = 14;
    let currentCorners = 4;
    let currentTexture = 'matte';
    let currentColor = 'white';
    let additionalTotal = 0;
    
    // Функция для обновления цен дополнительных опций из таблицы
    function updateAdditionalOptionPrices() {
        additionalOptions.forEach(option => {
            const nameElement = option.querySelector('.add-name');
            const priceElement = option.querySelector('.add-price');
            const quantityInput = option.querySelector('.add-quantity');
            
            if (nameElement && priceElement && quantityInput) {
                const optionName = nameElement.textContent.trim();
                
                // Получаем цену из таблицы или используем значение по умолчанию
                const price = getOptionPrice(optionName);
                const unit = getOptionUnit(optionName);
                
                // Форматируем отображение цены
                let displayPrice = `${price.toLocaleString()} руб.`;
                if (unit) {
                    displayPrice += `/${unit}`;
                }
                
                // Обновляем отображение цены и data-атрибут для расчета
                priceElement.textContent = displayPrice;
                quantityInput.setAttribute('data-price', price);
                
                // ФИКС: Для ленты-плингуса проверяем, что цена именно 100
                if (optionName.includes('плингус') && price !== 100) {
                    console.warn(`Внимание! Цена для "${optionName}" должна быть 100 руб., но получено: ${price} руб.`);
                    // Принудительно устанавливаем 100
                    quantityInput.setAttribute('data-price', 100);
                }
            }
        });
        
        // Пересчитываем итог после обновления цен
        calculateTotal();
    }
    
    // Синхронизация полей ввода площади
    areaInput.addEventListener('input', function() {
        let value = parseFloat(this.value) || 1;
        if (value < 1) this.value = 1;
        if (value > 500) this.value = 500;
        currentArea = value;
        areaRange.value = value;
        calculateTotal();
    });
    
    areaRange.addEventListener('input', function() {
        currentArea = parseFloat(this.value);
        areaInput.value = currentArea;
        calculateTotal();
    });
    
    // Синхронизация полей ввода углов
    cornersInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 3;
        if (value < 3) this.value = 3;
        if (value > 20) this.value = 20;
        currentCorners = value;
        cornersRange.value = value;
        calculateTotal();
    });
    
    cornersRange.addEventListener('input', function() {
        currentCorners = parseInt(this.value);
        cornersInput.value = currentCorners;
        calculateTotal();
    });
    
    // Выбор фактуры потолка
    textureButtons.forEach(button => {
        button.addEventListener('click', function() {
            textureButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTexture = this.getAttribute('data-texture');
            calculateTotal();
        });
    });
    
    // Выбор цвета потолка
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
            calculateTotal();
        });
    });
    
    // Управление дополнительными опциями
    additionalOptions.forEach(option => {
        const minusBtn = option.querySelector('.add-minus');
        const plusBtn = option.querySelector('.add-plus');
        const quantityInput = option.querySelector('.add-quantity');
        
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value) || 0;
            if (value > 0) {
                value--;
                quantityInput.value = value;
                calculateTotal();
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value) || 0;
            value++;
            quantityInput.value = value;
            calculateTotal();
        });
        
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            if (value < 0) this.value = 0;
            calculateTotal();
        });
    });
    
    // Функция расчета общей стоимости
    function calculateTotal() {
        // Получаем базовую цену за м² из таблицы
        const basePrice = getBasePriceFromTable(currentTexture);
        
        const colorMultiplier = colorMultipliers[currentColor];
        const mainCeilingPrice = currentArea * basePrice * colorMultiplier;
        
        // Стоимость обработки дополнительных углов (свыше 4)
        let cornersPrice = 0;
        if (currentCorners > 4) {
            const extraCorners = currentCorners - 4;
            const cornerPrice = getExtraCornerPrice();
            cornersPrice = extraCorners * cornerPrice;
        }
        
        // Стоимость дополнительных опций
        additionalTotal = 0;
        
        additionalOptions.forEach(option => {
            const quantityInput = option.querySelector('.add-quantity');
            const nameElement = option.querySelector('.add-name');
            
            if (quantityInput && nameElement) {
                let price = parseInt(quantityInput.getAttribute('data-price')) || 1000;
                const quantity = parseInt(quantityInput.value) || 0;
                
                // ФИКС: Для ленты-плингуса проверяем цену
                if (nameElement.textContent.includes('плингус') && price !== 100) {
                    console.warn(`Исправляем цену плингуса с ${price} на 100 руб.`);
                    price = 100;
                }
                
                const optionTotal = price * quantity;
                additionalTotal += optionTotal;
            }
        });
        
        // Итоговая стоимость
        const totalPrice = mainCeilingPrice + cornersPrice + additionalTotal;
        
        // Обновление отображения
        updateDisplay(mainCeilingPrice, cornersPrice, additionalTotal, totalPrice);
    }
    
    // Функция обновления отображения результатов
    function updateDisplay(mainPrice, cornersPrice, additionalPrice, totalPrice) {
        // Форматирование чисел с пробелами
        const formatNumber = (num) => {
            return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        };
        
        // Обновление итоговой цены
        resultPrice.innerHTML = `${formatNumber(totalPrice)} <span>руб.</span>`;
        
        // Обновление детализации
        if (breakdownItems.length >= 5) {
            // Площадь помещения
            breakdownItems[0].querySelector('.breakdown-value').textContent = 
                `${formatNumber(mainPrice)} руб.`;
            breakdownItems[0].querySelector('span:first-child').textContent = 
                `Площадь помещения (${currentArea} м²)`;
            
            // Количество углов
            breakdownItems[1].querySelector('.breakdown-value').textContent = 
                `${formatNumber(cornersPrice)} руб.`;
            breakdownItems[1].querySelector('span:first-child').textContent = 
                `Количество углов (${currentCorners} шт.)`;
            
            // Фактура
            const textureNames = {
                'matte': 'Матовый',
                'satin': 'Сатиновый',
                'glossy': 'Глянцевый'
            };
            breakdownItems[2].querySelector('.breakdown-value').textContent = 
                `0 руб.`;
            breakdownItems[2].querySelector('span:first-child').textContent = 
                `Фактура: ${textureNames[currentTexture]}`;
            
            // Цвет
            const colorNames = {
                'white': 'Белый',
                'colored': 'Цветной'
            };
            breakdownItems[3].querySelector('.breakdown-value').textContent = 
                `0 руб.`;
            breakdownItems[3].querySelector('span:first-child').textContent = 
                `Цвет: ${colorNames[currentColor]}`;
            
            // Дополнительные опции
            breakdownItems[4].querySelector('.breakdown-value').textContent = 
                `${formatNumber(additionalPrice)} руб.`;
        }
        
        // Итоговая сумма
        totalValue.textContent = `${formatNumber(totalPrice)} руб.`;
    }
    
    // Инициализация калькулятора
    function initCalculator() {
        // Сначала парсим таблицу цен
        parsePriceTable();
        
        // Затем обновляем цены опций из таблицы
        setTimeout(() => {
            updateAdditionalOptionPrices();
        }, 100);
    }
    
    // Наблюдатель за изменениями таблицы цен
    const observer = new MutationObserver(function() {
        parsePriceTable();
        updateAdditionalOptionPrices();
    });
    
    // Начинаем наблюдение за таблицей цен
    const priceTable = document.querySelector('.price-table');
    if (priceTable) {
        observer.observe(priceTable, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    
    // Инициализация при загрузке
    initCalculator();
    
    // Также обновляем при изменении видимости страницы
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            initCalculator();
        }
    });
});
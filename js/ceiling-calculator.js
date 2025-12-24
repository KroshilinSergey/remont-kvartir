// Калькулятор стоимости натяжных потолков
document.addEventListener('DOMContentLoaded', function() {
    // Базовые цены из кода 2
    const basePrices = {
        'matte': 640,    // Матовые
        'glossy': 640,   // Глянцевые
        'satin': 640     // Сатиновые
    };
    
    // Коэффициенты для цветного потолка
    const colorMultipliers = {
        'white': 1.0,
        'colored': 1.2   // +20% для цветного
    };
    
    // Соответствие названий опций с таблицей
    const optionMapping = {
        'Обход трубы': ['Дополнительное отверстие до 50 мм', 'шт'],
        'Профиль стеновой ПВХ по периметру': ['Установка микроплинтуса (белый/цветной)', 'пог. м'],
        'Лента-плингус (вставка) белка с установкой': [], // Нет в таблице
        'Монтаж люстры без сборки': ['Установка люстры на закладную', 'шт'],
        'Установка встроительного светильника': ['Установка точечного светильника', 'шт'],
        'Встроительный светильник GX33 + LED лампа': ['Освещение натяжных потолков', 'точка'],
        'Эл. кабель с проведением эл. проводки': [], // Нет в таблице
        'Установка потолочного карниза': [], // Нет в таблице
        'Корниз потолочный 2-х рядный (крючки, стопора в комплекте)': [], // Нет в таблице
        'Изготовление ниши под скрытый карниз': [] // Нет в таблице
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
                const price = parseInt(cells[2].textContent.trim().replace(/\s/g, ''));
                
                if (!isNaN(price)) {
                    priceTableCache[serviceName] = {
                        price: price,
                        unit: unit
                    };
                }
            }
        });
        
        console.log('Загружено цен из таблицы:', Object.keys(priceTableCache).length);
    }
    
    // Функция для получения цены услуги из таблицы
    function getPriceFromTable(serviceName) {
        for (const [key, value] of Object.entries(priceTableCache)) {
            if (key.toLowerCase().includes(serviceName.toLowerCase()) || 
                serviceName.toLowerCase().includes(key.toLowerCase())) {
                return value.price;
            }
        }
        
        // Если точное соответствие не найдено, ищем частичное
        const searchTerms = serviceName.split(' ');
        for (const [key, value] of Object.entries(priceTableCache)) {
            for (const term of searchTerms) {
                if (term.length > 3 && key.toLowerCase().includes(term.toLowerCase())) {
                    return value.price;
                }
            }
        }
        
        return null; // Цена не найдена
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
    const btnOrder = document.querySelector('.btn-order');
    
    // Текущие значения
    let currentArea = 14;
    let currentCorners = 4;
    let currentTexture = 'matte';
    let currentColor = 'white';
    let additionalTotal = 0;
    
    // Функция для обновления цен дополнительных опций
    function updateAdditionalOptionPrices() {
        additionalOptions.forEach(option => {
            const nameElement = option.querySelector('.add-name');
            const priceElement = option.querySelector('.add-price');
            const quantityInput = option.querySelector('.add-quantity');
            
            if (nameElement && priceElement && quantityInput) {
                const optionName = nameElement.textContent.trim();
                let price = 1000; // Значение по умолчанию
                
                // Пытаемся найти цену в таблице
                const tablePrice = getPriceFromTable(optionName);
                if (tablePrice !== null) {
                    price = tablePrice;
                } else {
                    // Проверяем маппинг
                    if (optionMapping[optionName] && optionMapping[optionName].length > 0) {
                        const mappedPrice = getPriceFromTable(optionMapping[optionName][0]);
                        if (mappedPrice !== null) {
                            price = mappedPrice;
                        }
                    }
                }
                
                // Обновляем отображение цены и data-атрибут
                priceElement.textContent = `${price.toLocaleString()} руб.${getUnitForOption(optionName)}`;
                quantityInput.setAttribute('data-price', price);
                
                // Обновляем итог, если количество уже выбрано
                const currentQuantity = parseInt(quantityInput.value) || 0;
                if (currentQuantity > 0) {
                    calculateTotal();
                }
            }
        });
    }
    
    // Функция для получения единицы измерения
    function getUnitForOption(optionName) {
        // Определяем единицу измерения по названию опции
        if (optionName.includes('м.п.') || optionName.includes('пог. м')) return '/м.п.';
        if (optionName.includes('шт.')) return '/шт.';
        if (optionName.includes('м²')) return '/м²';
        
        // По умолчанию
        if (optionName.includes('труб')) return '/шт.';
        if (optionName.includes('Профиль') || optionName.includes('Лента')) return '/м.п.';
        if (optionName.includes('люстры') || optionName.includes('светильник')) return '/шт.';
        
        return '/шт.';
    }
    
    // Синхронизация полей ввода площади
    areaInput.addEventListener('input', function() {
        const value = parseFloat(this.value) || 1;
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
        const value = parseInt(this.value) || 3;
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
        // Стоимость основного полотна
        const basePrice = basePrices[currentTexture];
        const colorMultiplier = colorMultipliers[currentColor];
        const mainCeilingPrice = currentArea * basePrice * colorMultiplier;
        
        // Стоимость обработки дополнительных углов (свыше 4)
        let cornersPrice = 0;
        if (currentCorners > 4) {
            const extraCorners = currentCorners - 4;
            // Ищем цену в таблице
            const cornerPriceFromTable = getPriceFromTable('Обработка доп. угла');
            cornersPrice = extraCorners * (cornerPriceFromTable || 375); // Из кода 2 или из таблицы
        }
        
        // Стоимость дополнительных опций
        additionalTotal = 0;
        additionalOptions.forEach(option => {
            const quantityInput = option.querySelector('.add-quantity');
            const price = parseInt(quantityInput.getAttribute('data-price')) || 1000;
            const quantity = parseInt(quantityInput.value) || 0;
            additionalTotal += price * quantity;
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
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        };
        
        // Обновление итоговой цены
        resultPrice.textContent = `${formatNumber(Math.round(totalPrice))} `;
        
        // Обновление детализации
        if (breakdownItems.length >= 5) {
            // Площадь помещения
            breakdownItems[0].querySelector('.breakdown-value').textContent = 
                `${formatNumber(Math.round(mainPrice))} руб.`;
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
        totalValue.textContent = `${formatNumber(Math.round(totalPrice))} руб.`;
    }
    
    // Обработчик кнопки заказа
    btnOrder.addEventListener('click', function() {
        const textureNames = {
            'matte': 'Матовый',
            'satin': 'Сатиновый',
            'glossy': 'Глянцевый'
        };
        
        const colorNames = {
            'white': 'Белый',
            'colored': 'Цветной'
        };
        
        // Собираем данные о дополнительных опциях
        const selectedOptions = [];
        additionalOptions.forEach(option => {
            const name = option.querySelector('.add-name').textContent;
            const quantity = parseInt(option.querySelector('.add-quantity').value) || 0;
            const price = parseInt(option.querySelector('.add-quantity').getAttribute('data-price')) || 1000;
            if (quantity > 0) {
                selectedOptions.push(`${name}: ${quantity} шт. x ${price} руб. = ${price * quantity} руб.`);
            }
        });
        
        // Формируем сообщение для заказа
        let message = `ЗАКАЗ НА УСТАНОВКУ НАТЯЖНОГО ПОТОЛКА:\n\n`;
        message += `Площадь: ${currentArea} м²\n`;
        message += `Количество углов: ${currentCorners} шт.\n`;
        message += `Фактура: ${textureNames[currentTexture]}\n`;
        message += `Цвет: ${colorNames[currentColor]}\n`;
        message += `Технология: Cold Stretch (без нагрева)\n\n`;
        
        if (selectedOptions.length > 0) {
            message += `Дополнительные опции:\n`;
            selectedOptions.forEach(option => {
                message += `- ${option}\n`;
            });
            message += `\n`;
        }
        
        message += `ПРЕДВАРИТЕЛЬНАЯ СТОИМОСТЬ: ${resultPrice.textContent}\n\n`;
        message += `Цены взяты из прайс-листа компании.\n`;
        message += `Для подтверждения заказа с вами свяжется наш менеджер в течение 15 минут.`;
        
        alert(message);
        
        // Отправка данных на сервер (заглушка)
        console.log('Данные заказа:', {
            area: currentArea,
            corners: currentCorners,
            texture: currentTexture,
            color: currentColor,
            options: selectedOptions,
            total: resultPrice.textContent.trim()
        });
    });
    
    // Инициализация калькулятора
    parsePriceTable(); // Сначала парсим таблицу
    updateAdditionalOptionPrices(); // Обновляем цены опций
    calculateTotal(); // Делаем первый расчет
    
    // Обновляем цены при изменении таблицы (если она динамическая)
    const observer = new MutationObserver(function() {
        parsePriceTable();
        updateAdditionalOptionPrices();
        calculateTotal();
    });
    
    // Наблюдаем за изменениями в таблице
    const priceTable = document.querySelector('.price-table');
    if (priceTable) {
        observer.observe(priceTable, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
});
 document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            
            // URL прокси-сервера (замените на адрес вашего сервера)
            const PROXY_URL = 'https://https://telegram-proxy-xumy.onrender.com/api/send-to-telegram';
            
            // Маска для телефона
            const phoneInput = document.getElementById('phone');
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    if (!value.startsWith('7') && !value.startsWith('8')) {
                        value = '7' + value;
                    }
                    
                    let formattedValue = '+7';
                    
                    if (value.length > 1) {
                        formattedValue += ' (' + value.substring(1, 4);
                    }
                    if (value.length >= 4) {
                        formattedValue += ') ' + value.substring(4, 7);
                    }
                    if (value.length >= 7) {
                        formattedValue += '-' + value.substring(7, 9);
                    }
                    if (value.length >= 9) {
                        formattedValue += '-' + value.substring(9, 11);
                    }
                    
                    e.target.value = formattedValue;
                }
            });
            
            // Обработка отправки формы
            form.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                // Скрываем предыдущие сообщения
                successMessage.style.display = 'none';
                errorMessage.style.display = 'none';
                
                // Получаем значения полей
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const agree = document.getElementById('agree').checked;
                
                // Валидация
                if (!name || !phone || !agree) {
                    showError('Пожалуйста, заполните все поля и согласитесь с условиями');
                    return;
                }
                
                // Проверка номера телефона
                const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
                const cleanPhone = phone.replace(/\s+/g, '');
                
                if (!phoneRegex.test(cleanPhone)) {
                    showError('Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
                    return;
                }
                
                // Блокируем кнопку и показываем индикатор загрузки
                submitBtn.disabled = true;
                btnText.innerHTML = '<span class="loading"></span> Отправка...';
                
                try {
                    // Отправляем данные на прокси-сервер
                    const response = await fetch(PROXY_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            name: name,
                            phone: cleanPhone,
                            timestamp: new Date().toISOString()
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showSuccess('✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в течение 15 минут!');
                        form.reset();
                        
                        // Дополнительно: можно сохранить в localStorage для статистики
                        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
                        submissions.push({
                            name: name,
                            phone: cleanPhone,
                            date: new Date().toLocaleString()
                        });
                        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
                        
                    } else {
                        throw new Error(result.error || 'Ошибка сервера');
                    }
                    
                } catch (error) {
                    console.error('Ошибка при отправке формы:', error);
                    
                    // Если прокси-сервер недоступен, пытаемся отправить напрямую (только для разработки)
                    if (window.location.hostname === 'localhost') {
                        console.log('Прокси-сервер недоступен, пробуем прямой запрос...');
                        showSuccess('✅ Заявка отправлена! (тестовый режим)');
                        form.reset();
                    } else {
                        showError('❌ Ошибка отправки. Пожалуйста, попробуйте еще раз или позвоните нам напрямую.');
                    }
                    
                } finally {
                    // Разблокируем кнопку через 3 секунды
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        btnText.textContent = 'Отправить заявку';
                    }, 3000);
                }
            });
            
            function showSuccess(message) {
                successMessage.textContent = message;
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // Автоматически скрываем сообщение через 10 секунд
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 10000);
            }
            
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                submitBtn.disabled = false;
                btnText.textContent = 'Отправить заявку';
            }
            
            // Проверяем, был ли пользователь уже на сайте
            if (!localStorage.getItem('firstVisit')) {
                localStorage.setItem('firstVisit', new Date().toISOString());
                console.log('Первый визит пользователя');
            }
        });
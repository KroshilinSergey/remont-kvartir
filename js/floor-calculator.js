document.addEventListener('DOMContentLoaded', function() {
  // Элементы калькулятора
  const areaInput = document.getElementById('area');
  const areaRange = document.getElementById('area-range');
  const areaValue = document.getElementById('area-value');
  const resultPrice = document.querySelector('.result-price');
  const totalValue = document.querySelector('.total-value');
  const breakdownValues = document.querySelectorAll('.breakdown-value');
  
  // Радио-кнопки покрытия
  const coatingRadios = document.querySelectorAll('input[name="coating"]');
  
  // Дополнительные опции
  const demolitionQuantity = document.querySelectorAll('.add-quantity')[0];
  const demolitionPlus = document.querySelectorAll('.add-plus')[0];
  const demolitionMinus = document.querySelectorAll('.add-minus')[0];
  
  const demolitionPlinthQuantity = document.querySelectorAll('.add-quantity')[1];
  const demolitionPlinthPlus = document.querySelectorAll('.add-plus')[1];
  const demolitionPlinthMinus = document.querySelectorAll('.add-minus')[1];
  
  const mountingPlinthQuantity = document.querySelectorAll('.add-quantity')[2];
  const mountingPlinthPlus = document.querySelectorAll('.add-plus')[2];
  const mountingPlinthMinus = document.querySelectorAll('.add-minus')[2];
  
  const thresholdQuantity = document.querySelectorAll('.add-quantity')[3];
  const thresholdPlus = document.querySelectorAll('.add-plus')[3];
  const thresholdMinus = document.querySelectorAll('.add-minus')[3];
  
  // Элементы для отображения разбивки
  const breakdownCoating = document.querySelector('.breakdown-coating');
  const breakdownDemolition = document.querySelector('.breakdown-demolition');
  const breakdownMounting = document.querySelector('.breakdown-mounting');
  
  // Цены из прайса
  const prices = {
    laminate: 380,     // Укладка ламината (с подложкой)
    parquet: 450,      // Укладка паркетной доски (в "замок") с подложкой
    linoleum: 200,     // Настил линолеума
    demolition: 100,   // Демонтаж линолеума/ламината/паркета
    demolitionPlinth: 100, // Демонтаж плинтусов
    mountingPlinth: 100,   // Монтаж плинтусов
    threshold: 100     // Монтаж порожка
  };
  
  // Текущие значения
  let area = parseFloat(areaInput.value);
  let selectedCoating = null;
  let selectedCoatingPrice = 0;
  
  // Инициализация
  updateAreaDisplay();
  calculateTotal();
  
  // Связываем ползунок и числовое поле для площади
  areaInput.addEventListener('input', function() {
    area = parseFloat(this.value) || 0;
    areaRange.value = area;
    updateAreaDisplay();
    calculateTotal();
  });
  
  areaRange.addEventListener('input', function() {
    area = parseFloat(this.value);
    areaInput.value = area;
    updateAreaDisplay();
    calculateTotal();
  });
  
  // Обработчики для радио-кнопок покрытия
  coatingRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        selectedCoating = this.value;
        selectedCoatingPrice = parseFloat(this.dataset.price);
        updateCoatingDisplay();
        calculateTotal();
      }
    });
  });
  
  // Обработчики для демонтажа покрытия
  demolitionPlus.addEventListener('click', () => updateQuantity(demolitionQuantity, 1));
  demolitionMinus.addEventListener('click', () => updateQuantity(demolitionQuantity, -1));
  demolitionQuantity.addEventListener('input', calculateTotal);
  
  // Обработчики для демонтажа плинтусов
  demolitionPlinthPlus.addEventListener('click', () => updateQuantity(demolitionPlinthQuantity, 1));
  demolitionPlinthMinus.addEventListener('click', () => updateQuantity(demolitionPlinthQuantity, -1));
  demolitionPlinthQuantity.addEventListener('input', calculateTotal);
  
  // Обработчики для монтажа плинтусов
  mountingPlinthPlus.addEventListener('click', () => updateQuantity(mountingPlinthQuantity, 1));
  mountingPlinthMinus.addEventListener('click', () => updateQuantity(mountingPlinthQuantity, -1));
  mountingPlinthQuantity.addEventListener('input', calculateTotal);
  
  // Обработчики для монтажа порожка
  thresholdPlus.addEventListener('click', () => updateQuantity(thresholdQuantity, 1));
  thresholdMinus.addEventListener('click', () => updateQuantity(thresholdQuantity, -1));
  thresholdQuantity.addEventListener('input', calculateTotal);
  
  // Функции
  function updateAreaDisplay() {
    areaValue.textContent = area.toFixed(1);
  }
  
  function updateCoatingDisplay() {
    const coatingOptions = document.querySelectorAll('.coating-option');
    coatingOptions.forEach(option => {
      option.style.borderColor = '#e0e0e0';
      option.style.background = '#f8f9fa';
    });
    
    if (selectedCoating) {
      const selectedOption = document.querySelector(`input[name="coating"][value="${selectedCoating}"]`).closest('.coating-option');
      selectedOption.style.borderColor = '#3498db';
      selectedOption.style.background = '#fff';
    }
  }
  
  function updateQuantity(input, change) {
    let currentValue = parseInt(input.value) || 0;
    currentValue += change;
    if (currentValue < 0) currentValue = 0;
    input.value = currentValue;
    calculateTotal();
  }
  
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  
  function calculateTotal() {
    let total = 0;
    
    // Стоимость покрытия (площадь × цена покрытия)
    let coatingCost = 0;
    if (selectedCoating && selectedCoatingPrice > 0) {
      coatingCost = area * selectedCoatingPrice;
      total += coatingCost;
      breakdownCoating.style.display = 'flex';
      breakdownCoating.querySelector('.breakdown-value').textContent = formatNumber(Math.round(coatingCost)) + ' руб.';
    } else {
      breakdownCoating.style.display = 'none';
    }
    
    // Стоимость демонтажных работ
    let demolitionCost = 0;
    const demolitionQty = parseInt(demolitionQuantity.value) || 0;
    if (demolitionQty > 0) {
      demolitionCost = demolitionQty * prices.demolition;
      total += demolitionCost;
    }
    
    const demolitionPlinthQty = parseInt(demolitionPlinthQuantity.value) || 0;
    if (demolitionPlinthQty > 0) {
      demolitionCost += demolitionPlinthQty * prices.demolitionPlinth;
      total += demolitionPlinthQty * prices.demolitionPlinth;
    }
    
    if (demolitionCost > 0) {
      breakdownDemolition.style.display = 'flex';
      breakdownDemolition.querySelector('.breakdown-value').textContent = formatNumber(Math.round(demolitionCost)) + ' руб.';
    } else {
      breakdownDemolition.style.display = 'none';
    }
    
    // Стоимость монтажных работ
    let mountingCost = 0;
    const mountingPlinthQty = parseInt(mountingPlinthQuantity.value) || 0;
    if (mountingPlinthQty > 0) {
      mountingCost = mountingPlinthQty * prices.mountingPlinth;
      total += mountingCost;
    }
    
    const thresholdQty = parseInt(thresholdQuantity.value) || 0;
    if (thresholdQty > 0) {
      mountingCost += thresholdQty * prices.threshold;
      total += thresholdQty * prices.threshold;
    }
    
    if (mountingCost > 0) {
      breakdownMounting.style.display = 'flex';
      breakdownMounting.querySelector('.breakdown-value').textContent = formatNumber(Math.round(mountingCost)) + ' руб.';
    } else {
      breakdownMounting.style.display = 'none';
    }
    
    // Обновление итоговой стоимости
    resultPrice.textContent = formatNumber(Math.round(total)) + ' руб.';
    totalValue.textContent = formatNumber(Math.round(total)) + ' руб.';
    
    // Анимация изменения цены
    resultPrice.classList.add('price-change');
    setTimeout(() => {
      resultPrice.classList.remove('price-change');
    }, 500);
  }
});
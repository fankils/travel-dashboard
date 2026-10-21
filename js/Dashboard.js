import { ToDoWidget } from './ToDoWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { CurrencyWidget } from './CurrencyWidget.js';
import { QuoteWidget } from './QuoteWidget.js';

export class Dashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.widgets = [];

    this.container.addEventListener('widget-remove', (e) => {
      this.removeWidget(e.detail.id);
    });

    document.addEventListener('dashboard-save', () => {
      this.saveState();
    });
  }

  loadState() {
    try {
      const saved = localStorage.getItem('dashboard-state');
      if (saved) {
        const state = JSON.parse(saved);
        state.forEach(item => {
          this.addWidget(item.type, item.data);
        });
      }
    } catch (e) {
      console.error('Ошибка восстановления', e);
    }
  }

  saveState() {
    try {
      const state = this.widgets.map(w => w.getState());
      localStorage.setItem('dashboard-state', JSON.stringify(state));
    } catch (e) {
      console.error('Ошибка сохранения', e);
    }
  }

  addWidget(type, savedData = null) {
    // Запрещаем дубликаты для API-виджетов
    if (type !== 'todo' && this.widgets.some(w => w.type === type)) {
      alert('Этот виджет уже добавлен!');
      return;
    }

    const id = `${type}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    let widget;

    if (type === 'todo') {
      widget = new ToDoWidget(id, 'Список дел', savedData);
    } else if (type === 'weather') {
      widget = new WeatherWidget(id, 'Погода в СПб');
    } else if (type === 'currency') {
      widget = new CurrencyWidget(id, 'Курсы валют (ЦБ РФ)');
    } else if (type === 'quote') {
      widget = new QuoteWidget(id, 'Цитата дня');
    } else {
      return;
    }

    this.widgets.push(widget);
    this.container.appendChild(widget.render());
    this.saveState();
  }

  removeWidget(id) {
    const index = this.widgets.findIndex(w => w.id === id);
    if (index !== -1) {
      this.widgets[index].destroy();
      this.widgets.splice(index, 1);
      this.saveState();
    }
  }
}
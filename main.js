import { Dashboard } from './js/Dashboard.js';

document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new Dashboard('dashboard');

  // Восстанавливаем виджеты при загрузке страницы
  dashboard.loadState();

  document.querySelector('[data-add="todo"]').addEventListener('click', () => {
    dashboard.addWidget('todo');
  });

  document.querySelector('[data-add="weather"]').addEventListener('click', () => {
    dashboard.addWidget('weather');
  });
  
  document.querySelector('[data-add="currency"]').addEventListener('click', () => {
    dashboard.addWidget('currency');
  });

  document.querySelector('[data-add="quote"]').addEventListener('click', () => {
    dashboard.addWidget('quote');
  });
});
import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
  constructor(id, title) {
    super(id, title);
    this.type = 'quote';
    this.controller = null;
    // Локальные цитаты на случай проблем с сетью
    this.fallbackQuotes = [
      { quote: "Путешествия учат больше, чем что бы то ни было.", author: "Анатоль Франс" },
      { quote: "Мир — это книга, и те, кто не путешествуют, читают только одну страницу.", author: "Святой Августин" },
      { quote: "Лучше один раз увидеть, чем сто раз услышать.", author: "Народная мудрость" }
    ];
  }

  render() {
    super.render();
    this.loadData();
    return this.element;
  }

  async loadData() {
    this.body.innerHTML = '<p class="status-msg">Загрузка цитаты...</p>';

    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    // Ставим таймаут на 3 секунды
    const timeoutId = setTimeout(() => this.controller.abort(), 3000);

    try {
      const url = 'https://dummyjson.com/quotes/random';
      const response = await fetch(url, { signal: this.controller.signal });

      clearTimeout(timeoutId); // Отменяем таймаут, если успели загрузить

      if (!response.ok) throw new Error('Ошибка сети');

      const data = await response.json();
      
      this.body.innerHTML = `
        <div class="quote-info">
          <p class="quote-text">"${data.quote}"</p>
          <p class="quote-author">— ${data.author}</p>
          <button class="btn btn--secondary quote-refresh" style="margin-top: 15px; width: 100%;">Обновить</button>
        </div>
      `;
      this.bindRefresh();

    } catch (error) {
      clearTimeout(timeoutId);
      // Если сеть не работает (или таймаут), показываем случайную цитату из массива
      this.showFallback();
    }
  }

  showFallback() {
    const randomQuote = this.fallbackQuotes[Math.floor(Math.random() * this.fallbackQuotes.length)];
    
    this.body.innerHTML = `
      <div class="quote-info">
        <p class="quote-text">"${randomQuote.quote}"</p>
        <p class="quote-author">— ${randomQuote.author}</p>
        <p class="status-msg" style="font-size: 0.8rem; margin-top: 10px; color: #e67e22;">
          [Демо-данные: сеть недоступна]
        </p>
        <button class="btn btn--primary quote-retry" style="margin-top: 10px; width: 100%;">Повторить запрос</button>
      </div>
    `;

    this.body.querySelector('.quote-retry').addEventListener('click', () => this.loadData());
  }

  bindRefresh() {
    const refreshBtn = this.body.querySelector('.quote-refresh');
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.loadData());
  }

  destroy() {
    if (this.controller) this.controller.abort();
    super.destroy();
  }
}
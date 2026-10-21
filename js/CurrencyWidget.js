import { UIComponent } from './UIComponent.js';

export class CurrencyWidget extends UIComponent {
  constructor(id, title) {
    super(id, title);
    this.type = 'currency';
    this.controller = null;
  }

  render() {
    super.render();
    this.loadData();
    return this.element;
  }

  async loadData() {
    this.body.innerHTML = '<p class="status-msg">Загрузка курсов валют...</p>';

    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    try {
      const url = 'https://www.cbr-xml-daily.ru/daily_json.js';
      const response = await fetch(url, { signal: this.controller.signal });

      if (!response.ok) throw new Error('Ошибка сети');

      const data = await response.json();
      const usd = data.Valute.USD;
      const eur = data.Valute.EUR;
      
      this.body.innerHTML = `
        <div class="currency-info">
          <p class="currency-line"><strong>USD</strong> = ${usd.Value.toFixed(2)} RUB</p>
          <p class="currency-line"><strong>EUR</strong> = ${eur.Value.toFixed(2)} RUB</p>
          <p class="currency-date">Дата: ${data.Date.split('T')[0]}</p>
        </div>
      `;
    } catch (error) {
      if (error.name === 'AbortError') return;

      this.body.innerHTML = `
        <p class="status-msg status-msg--error">Не удалось загрузить курсы валют.</p>
        <button class="btn btn--primary retry-btn">Повторить</button>
      `;
      
      const retryBtn = this.body.querySelector('.retry-btn');
      retryBtn.addEventListener('click', () => this.loadData());
    }
  }

  destroy() {
    if (this.controller) this.controller.abort();
    super.destroy();
  }
}
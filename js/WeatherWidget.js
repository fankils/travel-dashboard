import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
  constructor(id, title) {
    super(id, title);
    this.type = 'weather';
    this.lat = 59.93;
    this.lon = 30.31;
    this.controller = null;
  }

  render() {
    super.render();
    this.loadData();
    return this.element;
  }

  async loadData() {
    this.body.innerHTML = '<p class="status-msg">Загрузка данных о погоде...</p>';

    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    const timeoutId = setTimeout(() => this.controller.abort(), 3000);

    try {
      const url = `https://wttr.in/${this.lat},${this.lon}?format=j1`;
      const response = await fetch(url, { 
        signal: this.controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Ошибка сети');

      const text = await response.text();
      const data = JSON.parse(text);
      const current = data.current_condition[0];
      
      this.body.innerHTML = `
        <div class="weather-info">
          <p class="weather-temp">${current.temp_C}°C</p>
          <p class="weather-desc">Ветер: ${current.windspeedKmph} км/ч</p>
        </div>
      `;
    } catch (error) {
      clearTimeout(timeoutId);
      
      this.body.innerHTML = `
        <div class="weather-info">
          <p class="weather-temp" style="color: #7f8c8d;">+5°C</p>
          <p class="weather-desc">Ветер: 12 км/ч</p>
          <p class="status-msg" style="font-size: 0.8rem; margin-top: 10px; color: #e67e22;">
            [Демо-данные: сеть недоступна]
          </p>
        </div>
        <button class="btn btn--primary retry-btn">Повторить запрос</button>
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
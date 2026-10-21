export class UIComponent {
  constructor(id, title) {
    this.id = id;
    this.title = title;
    this.type = ''; // Устанавливается в наследниках
    this.element = null;
    this.isMinimized = false;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'widget';
    this.element.id = this.id;

    const header = document.createElement('div');
    header.className = 'widget-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'widget-title';
    titleEl.textContent = this.title;

    const actions = document.createElement('div');
    actions.className = 'widget-actions';

    const btnMin = document.createElement('button');
    btnMin.className = 'widget-btn widget-btn--min';
    btnMin.innerHTML = '−';
    btnMin.type = 'button';
    btnMin.title = 'Свернуть/Развернуть';
    btnMin.addEventListener('click', () => this.minimize());

    const btnClose = document.createElement('button');
    btnClose.className = 'widget-btn widget-btn--close';
    btnClose.innerHTML = '×';
    btnClose.type = 'button';
    btnClose.title = 'Удалить виджет';
    btnClose.addEventListener('click', () => {
      this.element.dispatchEvent(new CustomEvent('widget-remove', { 
        bubbles: true, 
        detail: { id: this.id } 
      }));
    });

    actions.appendChild(btnMin);
    actions.appendChild(btnClose);
    header.appendChild(titleEl);
    header.appendChild(actions);

    this.body = document.createElement('div');
    this.body.className = 'widget-body';

    this.element.appendChild(header);
    this.element.appendChild(this.body);

    return this.element;
  }

  minimize() {
    this.isMinimized = !this.isMinimized;
    this.element.classList.toggle('is-minimized', this.isMinimized);
  }

  // Метод для получения состояния виджета (для сохранения)
  getState() {
    return { type: this.type, data: null };
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
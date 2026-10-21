import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
  constructor(id, title, savedTasks = null) {
    super(id, title);
    this.type = 'todo';
    // Если есть сохраненные задачи - берем их, иначе пустой массив
    this.tasks = savedTasks ? savedTasks : [];
  }

  render() {
    super.render();

    const form = document.createElement('form');
    form.className = 'todo-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'todo-input';
    input.placeholder = 'Что взять в поездку?';
    input.required = true;

    const addBtn = document.createElement('button');
    addBtn.type = 'submit';
    addBtn.className = 'btn btn--primary';
    addBtn.textContent = 'Добавить';

    form.appendChild(input);
    form.appendChild(addBtn);

    const list = document.createElement('ul');
    list.className = 'todo-list';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        this.addTask(text);
        input.value = '';
      }
    });

    this.body.appendChild(form);
    this.body.appendChild(list);
    this.renderTasks(list);

    return this.element;
  }

  addTask(text) {
    const task = { id: Date.now().toString(), text: text, completed: false };
    this.tasks.push(task);
    this.updateAndRender();
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.updateAndRender();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.updateAndRender();
  }

  updateAndRender() {
    this.renderTasks(this.body.querySelector('.todo-list'));
    // Сообщаем дашборду, что нужно сохранить изменения
    document.dispatchEvent(new Event('dashboard-save'));
  }

  renderTasks(listElement) {
    listElement.innerHTML = '';
    this.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'is-completed' : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => this.toggleTask(task.id));

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = task.text;

      const delBtn = document.createElement('button');
      delBtn.className = 'todo-delete';
      delBtn.type = 'button';
      delBtn.innerHTML = '×';
      delBtn.addEventListener('click', () => this.deleteTask(task.id));

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(delBtn);
      listElement.appendChild(li);
    });
  }

  // Возвращаем задачи для сохранения
  getState() {
    return { type: this.type, data: this.tasks };
  }
}
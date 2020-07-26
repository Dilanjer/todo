class Todo {
  constructor(selector) {
    this.$el = document.querySelector(selector);
    this.todoItemsList = new Map([]);
    this.setup();
    this.render();

  }
  getTemplate() {
    return `
        <div class="todo__input">
        <input type="text" class="input" data-type="text-input">
        <button class="todo__add btn btn-add" data-type="item-add">+ Add</button>
        </div>
        <div class="todo__list">
          <div class="todo__title">Todo List</div>
          <ul class="todo__items" data-type="todo-list"></ul>
        </div>
      `
  }
  setup() {
    this.$el.classList.add("todo");
    this.$el.innerHTML = this.getTemplate();
    this.$todoList = this.$el.querySelector('[data-type="todo-list"]');
    this.$textInput = this.$el.querySelector('[data-type="text-input"]');

    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener("click", this.clickHandler);

    if (window.localStorage.todoList === undefined) this.saveTodoList();
    this.loadTodoList();
  }
  render() {
    this.$todoList.innerHTML = "";
    for (let item of this.todoItemsList.values()) {
      let outHTML = `
          <li data-id="${item.id}" class="todo__item ${item.done ? "done" : ""}">
            <input type="checkbox" ${item.done ? "checked" : ""} class="todo__checkbox" data-type="item-done">
            <span class="todo__text">${item.text}</span>
            <button class="todo__delete btn btn-delete" data-type="item-remove">× Delete</button>
          </li>
        `
      this.$todoList.innerHTML += outHTML;
    }
    this.isEmpty();
  }
  isEmpty() {
    const empty = `<li class="todo__item"><span class="todo__text empty">List is empty</span></li>`
    if (this.todoListIsEmpty) return this.$todoList.innerHTML = empty;
  }
  get todoListIsEmpty() {
    return this.todoItemsList.size === 0;
  }
  saveTodoList() {
    window.localStorage.todoList = JSON.stringify(Array.from(this.todoItemsList.entries()));
  }
  loadTodoList() {
    this.todoItemsList = new Map(JSON.parse(localStorage.todoList));
  }
  clickHandler(event) {
    const { type } = event.target.dataset;
    const elem = event.composedPath()[1];
    const { id } = elem.dataset;

    if (type === "item-add") {
      this.addItem(this.$textInput.value);
    } else if (type === "item-remove") {
      this.removeItem(id, elem);

    } else if (type === "item-done") {
      this.isDone(id, elem);
    }
  }
  addItem(value) {
    if (value.length != 0) {
      this.$textInput.value = "";
      const itemIndex = this.todoItemsList.size + 1;
      this.todoItemsList.set(`${itemIndex}`, { id: itemIndex, done: false, text: value });
      this.render();
      this.saveTodoList();
    } else {
      alert("Text field is empty");
    }
  }
  removeItem(id, elem) {
    elem.remove();
    this.todoItemsList.delete(id);
    this.isEmpty();
    this.saveTodoList();
  }
  isDone(id, elem) {
    this.todoItemsList.get(id).done = !this.todoItemsList.get(id).done;
    elem.classList.toggle("done");
    this.saveTodoList();
  }

  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    window.localStorage.clear();
    this.$el.innerHTML = "";
  }
}
let todo = new Todo("#todo");

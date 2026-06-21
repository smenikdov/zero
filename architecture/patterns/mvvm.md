# MVVM (Model-View-ViewModel)

## Определение

MVVM — архитектурный паттерн, в котором ViewModel выступает как «модель представления»: она берёт данные из Model и
преобразует их в формат, готовый для отображения View. Ключевая особенность — двусторонний data binding между View и
ViewModel: View автоматически обновляется при изменении ViewModel и наоборот.

## Подробности

MVVM был представлен Microsoft в 2005 году для WPF (Windows Presentation Foundation) и Silverlight. Архитектор Джон
Госсман разработал паттерн, чтобы использовать мощную систему привязки данных (data binding) платформы.

**Роли**:
- **Model** — данные и бизнес-логика (аналогично MVC/MVP).
- **View** — декларативное описание UI (XAML, HTML-шаблоны, JSX). Привязана к ViewModel через data binding.
- **ViewModel** — адаптер между Model и View. Не знает о конкретной реализации View (нет ссылки на DOM-элементы).
Предоставляет свойства и команды, к которым View привязывается.

Ключевое отличие от MVP: ViewModel ничего не знает о View (в MVP Presenter знает интерфейс View). Связь односторонняя —
View знает о ViewModel через binding, а ViewModel о View — нет. Это делает ViewModel легко тестируемой без mock-объектов
View.

Современные фронтенд-фреймворки реализуют MVVM-подобную модель:
- **Vue** — реактивные `ref/reactive` + шаблоны с `v-model`.
- **Angular** — компоненты с двусторонней привязкой `[(ngModel)]`.
- **React** — не является чистым MVVM, но `useState` + JSX дают похожий эффект; MobX добавляет настоящий observable-based binding.

## Плюсы

- **Автоматическая синхронизация** — data binding избавляет от ручного обновления DOM.
- **Тестирование ViewModel без View** — ViewModel не имеет ссылок на UI.
- **Чистая View** — в шаблоне минимум императивной логики, в основном декларативные привязки.
- **Разделение труда** — дизайнер работает с View, разработчик с ViewModel/Model.

## Минусы

- **Сложность отладки binding** — неявные связи могут приводить к каскадным обновлениям.
- **Перегрузка ViewModel** — со временем ViewModel может превратиться в God Object.
- **Производительность** — при большом числе bindings обновления могут тормозить.
- **Порог входа** — разработчику нужно понимать, как работает реактивная система.

## Когда применять

- Приложения с богатым UI и множеством динамических элементов (формы, дашборды).
- Фреймворки с нативной поддержкой data binding (Vue, Angular, WPF).
- Когда нужна чёткая граница между логикой представления и UI-кодом.

## Пример на JS (Vue-подобный стиль)

```js
// === Model (чистые данные + бизнес-логика) ===
class ShoppingCartModel {
  #items = [];

  addItem(product, qty = 1) {
    const existing = this.#items.find(i => i.id === product.id);
    if (existing) { existing.qty += qty; }
    else { this.#items.push({ ...product, qty }); }
  }

  removeItem(id) {
    this.#items = this.#items.filter(i => i.id !== id);
  }

  get total() {
    return this.#items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  get items() { return [...this.#items]; }
}

// === ViewModel (реактивный адаптер) ===
class CartViewModel {
  constructor(model) {
    this.model = model;
    this._listeners = [];
  }

  // Реактивное состояние (упрощённый observable)
  #state = { items: [], total: 0 };
  #listeners = [];

  get state() { return { ...this.#state }; }

  // Подписка для View
  subscribe(listener) {
    this.#listeners.push(listener);
    listener(this.#state); // начальное состояние
  }

  #notify() {
    this.#state = { items: this.model.items, total: this.model.total };
    this.#listeners.forEach(fn => fn(this.#state));
  }

  // Команды (привязываются к кнопкам в View)
  addItem(product) {
    this.model.addItem(product);
    this.#notify();
  }

  removeItem(id) {
    this.model.removeItem(id);
    this.#notify();
  }
}

// === View (рендер-функция — замена шаблона) ===
function renderCart(viewModel, rootEl) {
  const tpl = document.createElement("template");

  viewModel.subscribe(({ items, total }) => {
    const itemsHTML = items.map(i =>
      `<li>${i.name} x${i.qty} — $${i.price * i.qty}
        <button data-id="${i.id}" class="remove">Удалить</button>
      </li>`
    ).join("");

    rootEl.innerHTML = `
      <ul>${itemsHTML || "<li>Корзина пуста</li>"}</ul>
      <strong>Итого: $${total}</strong>
      <button id="add-sample">Добавить товар</button>
    `;

    rootEl.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => viewModel.removeItem(Number(btn.dataset.id)));
    });

    rootEl.querySelector("#add-sample").addEventListener("click", () => {
      viewModel.addItem({ id: Date.now(), name: "Товар", price: 100 });
    });
  });
}

// === Сборка ===
const model = new ShoppingCartModel();
const vm = new CartViewModel(model);
renderCart(vm, document.getElementById("app"));
```

## Ссылки

- John Gossman: [Introduction to MVVM](https://docs.microsoft.com/en-us/archive/blogs/johngossman/introduction-t...)
- Martin Fowler: [Presentation Model](https://martinfowler.com/eaaDev/PresentationModel.html) — предшественник MVVM


# Atomic Design

## Определение

Atomic Design — методология создания дизайн-систем и UI-компонентов, предложенная Брэдом Фростом в 2013 году. Интерфейс
строится из компонентов пяти уровней: Atoms → Molecules → Organisms → Templates → Pages. Каждый уровень собирается из
компонентов предыдущего.

## Подробности

Название — метафора из химии: атомы комбинируются в молекулы, молекулы — в организмы, и так до полноценной страницы.
Методология применима не только к дизайну, но и к архитектуре фронтенд-приложений: иерархия компонентов отражает
сложность и зону ответственности.

**Уровни Atomic Design**:

1. **Atoms (Атомы)** — базовые, неделимые UI-элементы: кнопка, инпут, лейбл, иконка, цвет, шрифт. Не имеют собственного контекста.
2. **Molecules (Молекулы)** — комбинация атомов, выполняющая одну функцию: поле поиска (инпут + кнопка), карточка товара
(изображение + заголовок + цена).
3. **Organisms (Организмы)** — сложные, самостоятельные блоки интерфейса: хедер (логотип + навигация + поиск), форма
оформления заказа, каталог продуктов.
4. **Templates (Шаблоны)** — компоновка организмов на странице без реальных данных, «скелет» страницы.
5. **Pages (Страницы)** — шаблон, наполненный реальными данными. Итоговый вид страницы.

На практике уровни часто сокращают до трёх: Atoms (базовые), Molecules/Organisms (составные), Templates/Pages (макеты).

**Связь с компонентными фреймворками** (React, Vue, Svelte): Atomic Design — не строгая догма, а удобный способ
классификации компонентов. Не нужно слепо следовать уровням, если компонент не вписывается.

## Плюсы

- **Переиспользование** — система строится снизу вверх, компоненты многократно используются.
- **Консистентность дизайна** — изменения в атомах распространяются на все уровни.
- **Единый язык** — дизайнеры и разработчики говорят об одних и тех же «атомах» и «молекулах».
- **Масштабирование** — легко добавлять новые страницы из существующих компонентов.

## Минусы

- **Жёсткая классификация** — не всегда понятно, к какому уровню отнести компонент (карточка — молекула или организм?).
- **Overhead на старте** — проектирование всей иерархии до начала разработки.
- **Сложность для динамических UI** — дашборды, конструкторы, где компоненты вложены в разных комбинациях.

## Когда применять

- Крупные приложения с развитой дизайн-системой.
- Продукты с несколькими интерфейсами (админка, клиент, партнёр).
- Команды, где дизайнеры и разработчики тесно сотрудничают.

## Пример на JS

```js
// === Atoms ===
// Button.js
class Button {
  constructor({ label, onClick, variant = "primary" }) {
    this.label = label;
    this.onClick = onClick;
    this.variant = variant;
  }

  render() {
    return `<button class="btn btn--${this.variant}" onclick="${this.onClick}">${this.label}</button>`;
  }
}

// Input.js
class Input {
  constructor({ placeholder, type = "text", value = "" }) {
    this.placeholder = placeholder;
    this.type = type;
    this.value = value;
  }

  render() {
    return `<input type="${this.type}" placeholder="${this.placeholder}" value="${this.value}" />`;
  }
}

// === Molecules (комбинация атомов) ===
// SearchBar.js
class SearchBar {
  constructor({ onSearch }) {
    this.input = new Input({ placeholder: "Поиск...", type: "search" });
    this.button = new Button({ label: "Найти", onClick: onSearch });
  }

  render() {
    return `
      <div class="search-bar">
        ${this.input.render()}
        ${this.button.render()}
      </div>
    `;
  }
}

// ProductCard.js
class ProductCard {
  constructor({ name, price, image }) {
    this.name = name;
    this.price = price;
    this.image = image;
  }

  render() {
    return `
      <div class="product-card">
        <img src="${this.image}" alt="${this.name}" />
        <h3>${this.name}</h3>
        <span>${this.price} ₽</span>
        ${new Button({ label: "В корзину", variant: "secondary" }).render()}
      </div>
    `;
  }
}

// === Organisms (композиция молекул и атомов) ===
// Header.js
class Header {
  render() {
    return `
      <header class="header">
        <img src="/logo.png" alt="Logo" class="header__logo" />
        <nav class="header__nav">
          <a href="/">Главная</a>
          <a href="/catalog">Каталог</a>
          <a href="/about">О нас</a>
        </nav>
        ${new SearchBar({ onSearch: "handleSearch()" }).render()}
      </header>
    `;
  }
}

// ProductGrid.js
class ProductGrid {
  constructor(products) {
    this.products = products;
  }

  render() {
    const cards = this.products.map(p => new ProductCard(p).render()).join("");
    return `<div class="product-grid">${cards}</div>`;
  }
}

// === Templates (макет без данных) ===
class CatalogTemplate {
  constructor({ searchBar, header }) {
    this.header = header;
    this.searchBar = searchBar;
  }

  render(products) {
    return `
      <div class="page">
        ${this.header.render()}
        <main>
          <h1>Каталог</h1>
          ${this.searchBar.render()}
          <div class="product-grid-placeholder">
            <!-- Сюда будет вставлен ProductGrid -->
          </div>
        </main>
      </div>
    `;
  }
}

// === Pages (шаблон + данные) ===
function renderCatalogPage() {
  const header = new Header();
  const searchBar = new SearchBar({ onSearch: "handleSearch()" });
  const template = new CatalogTemplate({ header, searchBar });

  const products = [
    { name: "Книга", price: 500, image: "/img/book.jpg" },
    { name: "Ручка", price: 50, image: "/img/pen.jpg" },
  ];

  document.getElementById("app").innerHTML = template.render(products);
}

renderCatalogPage();
```

## Ссылки

- Brad Frost: [Atomic Design (книга)](https://atomicdesign.bradfrost.com/)
- Storybook: инструмент для разработки UI-компонентов по атомарной методологии


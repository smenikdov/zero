# FSD (Feature-Sliced Design)

## Определение

Feature-Sliced Design (FSD) — методология организации фронтенд-приложений, в которой код группируется по функциональным
слоям и бизнес-фичам, а не по технической природе (components, hooks, utils). Цель — сделать архитектуру предсказуемой,
масштабируемой и устойчивой к изменениям.

## Подробности

FSD решает проблему, знакомую всем фронтенд-разработчикам: папка `components/` разрастается до сотен файлов, в `utils/`
лежит всё подряд, импорты хаотичны, зависимости непрозрачны.

**Слои FSD (сверху вниз)**:

```
app/          — инициализация, роутинг, глобальные стили, провайдеры
pages/        — композиция фич и виджетов для страницы, маршруты
widgets/      — крупные самостоятельные блоки (хедер, футер, сайдбар)
features/     — пользовательские сценарии (форма входа, корзина, поиск)
entities/     — бизнес-сущности (пользователь, товар, заказ)
shared/       — переиспользуемый код без бизнес-специфики (UI-kit, утилиты, типы)
```

**Правила слоёв**:
- Каждый слой может импортировать только нижние слои.
- `shared` не может импортировать ничего из вышестоящих.
- `entities` не могут импортировать `features` или `widgets`.
- `features` не могут зависеть друг от друга (изоляция фич).

**Сегменты** — внутри каждого слоя и фичи:

```
entities/user/
├── model/       — бизнес-логика, сторы, хуки
├── ui/          — компоненты
├── api/         — запросы к API
├── lib/         — вспомогательные функции
├── config/      — конфигурация
└── index.ts     — публичный API слоя (что можно импортировать снаружи)
```

**Public API** — ключевая концепция. Каждый модуль/слайс имеет `index.ts`, который экспортирует только то, что разрешено
использовать извне. Это как `package.json` для внутренних пакетов: контроль над тем, что становится публичным
контрактом.

## Плюсы

- **Предсказуемая структура** — новый разработчик знает, где искать код.
- **Контроль зависимостей** — линтер может проверять правила слоёв автоматически.
- **Изоляция фич** — удаление фичи не оставляет мёртвого кода в shared.
- **Масштабирование** — одинаково хорошо работает на 5 и 50 разработчиках.

## Минусы

- **Социальная сложность** — команда должна договориться о границах слоёв.
- **Начальный overhead** — на старте структура выглядит избыточной для простого приложения.
- **Жёсткость** — не всё укладывается в слои; иногда правила приходится адаптировать.

## Когда применять

- Средние и крупные фронтенд-приложения (10+ страниц, 3+ разработчиков).
- Проекты с активной бизнес-логикой на фронтенде.
- Команды, где важна предсказуемость импортов и изоляция кода.

## Пример на JS (React-подобная структура)

```
src/
├── app/
│   ├── index.js           — создание роутера, провайдеров
│   ├── router.js
│   └── styles/
│       └── globals.css
│
├── pages/
│   ├── catalog/
│   │   └── index.js       — CatalogPage: композиция виджетов
│   └── cart/
│       └── index.js       — CartPage
│
├── widgets/
│   ├── header/
│   │   ├── ui/
│   │   │   └── Header.jsx
│   │   └── index.js
│   └── product-list/
│       ├── ui/
│       │   └── ProductList.jsx
│       └── index.js
│
├── features/
│   ├── search/
│   │   ├── model/
│   │   │   └── useSearch.js  — хук с логикой поиска
│   │   ├── ui/
│   │   │   └── SearchInput.jsx
│   │   └── index.js
│   └── add-to-cart/
│       ├── model/
│       │   └── useCart.js
│       ├── ui/
│       │   └── AddToCartButton.jsx
│       └── index.js
│
├── entities/
│   ├── product/
│   │   ├── model/
│   │   │   └── product.store.js
│   │   ├── api/
│   │   │   └── product.api.js
│   │   └── index.js
│   └── cart/
│       ├── model/
│       │   └── cart.store.js
│       └── index.js
│
└── shared/
    ├── ui/            — UI-kit (кнопки, инпуты, модалки)
    ├── api/           — HTTP-клиент, interceptors
    ├── lib/           — общие утилиты, хелперы
    └── index.js
```

```js
// === shared/ui/Button.js ===
export function Button({ label, onClick, variant = "primary" }) {
  return `<button class="btn btn--${variant}" onclick="(${onClick})()">${label}</button>`;
}

// === entities/product/index.js (public API) ===
export { useProducts } from "./model/product.store.js";
export { fetchProducts } from "./api/product.api.js";

// === features/search/index.js (public API) ===
export { SearchInput } from "./ui/SearchInput.jsx";
export { useSearch } from "./model/useSearch.js";

// feature внутри использует shared и entities
// features/search/ui/SearchInput.js
import { Button } from "shared/ui/Button";     // shared (разрешено)
import { useSearch } from "../model/useSearch"; // свой model

// === pages/catalog/index.js ===
// Импортирует только из widget, feature, entity, shared
import { Header } from "widgets/header";
import { ProductList } from "widgets/product-list";
import { SearchInput } from "features/search";

export function CatalogPage() {
  return `
    ${Header()}
    <main>
      ${SearchInput()}
      ${ProductList()}
    </main>
  `;
}
```

## Ссылки

- [feature-sliced.design](https://feature-sliced.design/ru/) — официальная документация
- [FSD Overview (youtube)](https://www.youtube.com/watch?v=8pcu9MwTzJo)
- [FSD ESLint plugin](https://github.com/feature-sliced/eslint-plugin) — автоматическая проверка правил слоёв


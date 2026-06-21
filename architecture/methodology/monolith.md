# Монолитная архитектура (Monolith)

## Определение

Монолит — архитектурный стиль, при котором всё приложение работает как единый процесс, использует одну базу данных и
разворачивается как одна единица (один артефакт). Все компоненты (UI, бизнес-логика, доступ к данным) живут внутри
одного приложения и общаются напрямую через вызовы функций, а не по сети.

## Подробности

Долгое время монолит считался «антипаттерном» на фоне хайпа микросервисов. Это заблуждение. Монолит — оптимальный выбор
для большинства проектов, особенно на ранних стадиях.

**Виды монолитов**:

1. **Single-Process Monolith** — классика: один процесс, один репозиторий, один деплой. Прост в разработке и отладке.
2. **Modular Monolith** — один процесс, но внутри разделён на модули с чёткими границами. Модули общаются через
публичные API/интерфейсы, не через сеть. Базы данных могут быть разделены по модулям внутри одного сервера.
3. **Distributed Monolith** — антипаттерн: система разбита на «микросервисы», но они не могут деплоиться независимо
(общая схема БД, синхронная цепочка вызовов, общий код).

Modular Monolith — отличный компромисс: преимущества монолита (простота, производительность, транзакции) с модульностью
микросервисов.

**Почему монолит — не всегда плохо**:
- Shopify — многомиллиардный бизнес на модульном монолите (Ruby on Rails).
- Stack Overflow — монолит на C# с несколькими вспомогательными сервисами, обслуживает миллионы пользователей.
- Многие успешные стартапы начинали с монолита и эволюционировали в микросервисы только когда возникала реальная потребность.

## Плюсы

- **Простота** — один репозиторий, один деплой, один процесс отладки.
- **Производительность** — вызовы функций без сети, без сериализации/десериализации.
- **Транзакции** — ACID в одной БД без распределённых транзакций.
- **Низкий порог входа** — разработчик может запустить всё локально одной командой.
- **Скорость разработки** — меньше инфраструктуры, быстрее итерации.

## Минусы

- **Связанность** — без дисциплины модули становятся запутанными (Big Ball of Mud).
- **Масштабирование команды** — больше 20-30 разработчиков в одном коде — конфликты и замедление.
- **Масштабирование приложения** — масштабируется целиком, даже если узкое место — один компонент.
- **Деплой** — любое изменение требует деплоя всего приложения.

## Когда применять

- Стартапы и MVP — скорость важнее масштабируемости.
- Простые/средние системы, не требующие независимого масштабирования частей.
- Небольшие команды (до 20 разработчиков).
- Системы, где критична strong consistency и транзакции.

## Пример: модульный монолит на JS

```js
// Модульный монолит: один процесс, но изолированные модули
// Структура папок:
// modules/
//   orders/
//     index.js (публичный API модуля)
//     order.service.js
//     order.repository.js
//   catalog/
//     index.js
//     product.service.js
//     product.repository.js
//   shared/
//     event-bus.js

// === Shared: Event Bus (внутрипроцессный) ===
class EventBus {
  #handlers = new Map();

  on(event, handler) {
    const list = this.#handlers.get(event) ?? [];
    list.push(handler);
    this.#handlers.set(event, list);
  }

  emit(event, payload) {
    for (const h of this.#handlers.get(event) ?? []) {
      h(payload);
    }
  }
}

const eventBus = new EventBus();

// === Module: Catalog (каждый модуль — независимый пакет) ===
// modules/catalog/index.js
class CatalogModule {
  #products = [
    { id: 1, name: "Книга", price: 500, stock: 10 },
    { id: 2, name: "Ручка", price: 50, stock: 100 },
  ];

  getProduct(id) { return this.#products.find(p => p.id === id); }

  listProducts() { return [...this.#products]; }

  reserveStock(productId, qty) {
    const product = this.getProduct(productId);
    if (!product || product.stock < qty) {
      throw new Error("Недостаточно товара");
    }
    product.stock -= qty;
  }
}

// === Module: Orders ===
// modules/orders/index.js
class OrdersModule {
  #orders = [];

  constructor(catalog, eventBus) {
    this.catalog = catalog;     // Зависимость через контракт
    this.eventBus = eventBus;
  }

  createOrder(items) {
    const order = {
      id: this.#orders.length + 1,
      items: [],
      total: 0,
      status: "created",
    };

    for (const { productId, qty } of items) {
      const product = this.catalog.getProduct(productId);
      this.catalog.reserveStock(productId, qty);
      order.items.push({ productId, name: product.name, price: product.price, qty });
      order.total += product.price * qty;
    }

    this.#orders.push(order);
    this.eventBus.emit("OrderCreated", order);
    return order;
  }
}

// === Module: Notifications (подписывается на события) ===
// modules/notifications/index.js
class NotificationsModule {
  constructor(eventBus) {
    eventBus.on("OrderCreated", (order) => {
      console.log(`[Email] Заказ #${order.id} на сумму ${order.total} создан`);
    });
  }
}

// === Сборка приложения ===
const catalog = new CatalogModule();
const orders = new OrdersModule(catalog, eventBus);
const notifications = new NotificationsModule(eventBus); // слушает события

orders.createOrder([
  { productId: 1, qty: 2 },
  { productId: 2, qty: 1 },
]);
// → [Email] Заказ #1 на сумму 1050 создан

// Всё в одном процессе, никаких HTTP-запросов, но модули изолированы.
// Позже CatalogModule и OrdersModule можно вынести в отдельные сервисы,
// заменив прямой вызов на HTTP/gRPC — контракт останется тем же.
```

## Ссылки

- Kamil Grzybek: [Modular Monolith](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer)
- Sam Newman: Monolith to Microservices
- Shopify Engineering: [Deconstructing the
Monolith](https://shopify.engineering/deconstructing-monolith-designing-software-maximize-developer-productivity)


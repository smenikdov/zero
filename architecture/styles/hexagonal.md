# Гексагональная архитектура (Ports & Adapters)

## Определение

Гексагональная архитектура (Hexagonal Architecture, Ports & Adapters) — архитектурный стиль, предложенный Алистером
Кокбёрном, в котором бизнес-логика приложения изолирована от внешнего мира через «порты» и «адаптеры». Внешние системы
(БД, UI, API, очереди) подключаются к ядру приложения через адаптеры, реализующие интерфейсы-порты.

## Подробности

Название «гексагон» (шестиугольник) — скорее визуальная метафора, а не буквальное ограничение: число портов может быть
любым. Шестиугольная форма в диаграммах позволяет показать множество адаптеров с разных сторон, не выделяя «главную»
сторону.

Ключевые понятия:

- **Ядро (Domain)** — чистая бизнес-логика, не зависит от фреймворков, БД, протоколов.
- **Порт (Port)** — интерфейс, определяющий, как ядро хочет взаимодействовать с внешним миром. Бывают входящие (API, UI
команды) и исходящие (сохранение, отправка сообщений).
- **Адаптер (Adapter)** — конкретная реализация порта. Заменяем: тестовый адаптер для unit-тестов, реальный адаптер для
продакшена.

Гексагональная архитектура — основа для Clean Architecture Роберта Мартина: та же идея «зависимостей внутрь», но с более
детальной раскладкой по слоям.

В отличие от классической трёхслойной архитектуры (контроллер → сервис → репозиторий), где верхние слои зависят от
нижних, здесь все зависимости направлены к центру.

## Плюсы

- **Тестируемость** — ядро тестируется изолированно, внешние адаптеры заменяются моками.
- **Заменяемость инфраструктуры** — смена БД, UI-фреймворка, протокола не трогает бизнес-логику.
- **Отложенные решения** — можно начать с in-memory хранилища, подключить Postgres позже.
- **Чёткие границы** — адаптеры не могут знать друг о друге.

## Минусы

- **Много boilerplate-кода** — каждый порт и адаптер требует интерфейса и реализации.
- **Сложность для малых проектов** — избыточно для простого CRUD.
- **Кривая обучения** — команде нужно привыкнуть мыслить портами и адаптерами.

## Когда применять

- Сложные домены, где бизнес-логика — главная ценность.
- Продукты с длинным жизненным циклом, где инфраструктура будет меняться.
- Системы, требующие высокой тестируемости и низкой связанности с фреймворками.

## Пример на JS

```js
// === Ядро: бизнес-логика (не зависит от внешнего мира) ===
class OrderService {
  constructor(orderRepository, paymentGateway, notificationPort) {
    this.orderRepository = orderRepository; // исходящий порт
    this.paymentGateway = paymentGateway;    // исходящий порт
    this.notificationPort = notificationPort; // исходящий порт
  }

  async placeOrder(orderData) {
    if (orderData.items.length === 0) {
      throw new Error("Заказ не может быть пустым");
    }

    const order = {
      id: crypto.randomUUID(),
      items: orderData.items,
      total: orderData.items.reduce((s, i) => s + i.price * i.qty, 0),
      status: "pending",
    };

    const paymentResult = await this.paymentGateway.charge(order.total);

    if (paymentResult.success) {
      order.status = "paid";
      await this.orderRepository.save(order);
      await this.notificationPort.send(order.id, "Заказ оплачен");
    } else {
      order.status = "payment_failed";
      await this.notificationPort.send(order.id, "Оплата не прошла");
    }

    return order;
  }
}

// === Порты (интерфейсы) — абстрактные классы или просто контракты ===
// Исходящие порты — то, что нужно ядру от внешнего мира
class OrderRepository {
  async save(order) { throw new Error("Not implemented"); }
  async findById(id) { throw new Error("Not implemented"); }
}

class PaymentGateway {
  async charge(amount) { throw new Error("Not implemented"); }
}

class NotificationPort {
  async send(orderId, message) { throw new Error("Not implemented"); }
}

// === Адаптеры (конкретные реализации портов) ===
class PostgresOrderRepository extends OrderRepository {
  async save(order) { /* INSERT INTO orders */ console.log("Saved to PG:", order.id); }
  async findById(id) { /* SELECT */ console.log("Found in PG:", id); return null; }
}

class StripePaymentGateway extends PaymentGateway {
  async charge(amount) {
    console.log(`Charged $${amount} via Stripe`);
    return { success: true, transactionId: "txn_123" };
  }
}

class EmailNotification extends NotificationPort {
  async send(orderId, message) {
    console.log(`Email отправлен по заказу ${orderId}: ${message}`);
  }
}

// === Сборка (Composition Root) ===
const orderService = new OrderService(
  new PostgresOrderRepository(),
  new StripePaymentGateway(),
  new EmailNotification()
);

// === Использование ===
orderService.placeOrder({
  items: [
    { name: "Книга", price: 500, qty: 1 },
    { name: "Ручка", price: 50, qty: 3 },
  ],
}).then(console.log);

// Для тестов — подставляем in-memory адаптеры:
class InMemoryOrderRepository extends OrderRepository {
  #storage = new Map();
  async save(order) { this.#storage.set(order.id, order); }
  async findById(id) { return this.#storage.get(id); }
}
```

## Ссылки

- Alistair Cockburn: [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- Juan Manuel: [Hexagonal Architecture with JS](https://dev.to/juanmanuel4/hexagonal-architecture-with-javascript-2d3l)


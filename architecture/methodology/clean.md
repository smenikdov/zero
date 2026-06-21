# Чистая архитектура (Clean Architecture)

## Определение

Чистая архитектура (Clean Architecture) — архитектурный стиль, описанный Робертом Мартином, в котором бизнес-логика
приложения изолирована от инфраструктуры через систему концентрических слоёв. Все зависимости направлены внутрь, к
центру, где находятся наиболее стабильные и ценные сущности.

## Подробности

Clean Architecture обобщает Гексагональную архитектуру, DCI, BCE и другие архитектуры с разделением ответственности.
Главная идея — «правило зависимостей» (Dependency Rule): зависимости в коде могут указывать только внутрь. Внешние слои
знают о внутренних, но не наоборот.

**Слои (снаружи внутрь)**:

1. **Frameworks & Drivers** — фреймворки, БД, UI, HTTP-серверы. Самый изменчивый слой.
2. **Interface Adapters** — адаптеры, преобразующие форматы между внешним миром и use cases (контроллеры, презентеры,
репозитории-реализации).
3. **Application / Use Cases** — сценарии использования (бизнес-операции). Оркеструют поток данных между сущностями и адаптерами.
4. **Domain / Entities** — чистые бизнес-объекты и правила. Не зависят ни от чего кроме бизнес-языка.

**Пересечение границ**: чтобы внешний слой вызывал внутренний, используется принцип инверсии зависимостей (DIP).
Внутренний слой объявляет интерфейс (порт), внешний слой его реализует (адаптер).

Clean Architecture НЕ предписывает конкретную структуру папок или технологий — это набор принципов, а не шаблон.

## Плюсы

- **Независимость от фреймворков** — бизнес-логика не знает о Express, React, Postgres.
- **Тестируемость** — каждый слой тестируется изолированно.
- **Независимость от БД и UI** — можно сменить SQL на NoSQL, REST на GraphQL.
- **Долгосрочная поддерживаемость** — изменения изолированы в пределах слоя.

## Минусы

- **Много слоёв и boilerplate** — даже простая операция требует 4-5 файлов.
- **Кривая обучения** — команда должна понимать Dependency Rule.
- **Избыточно для простых CRUD-систем** — архитектура сложнее задачи.

## Когда применять

- Сложные бизнес-системы с долгим жизненным циклом (ERP, банкинг, страхование).
- Продукты, где бизнес-логика — ключевая ценность и будет развиваться годами.
- Команды с высокой инженерной зрелостью.

## Пример на JS (структура папок и ключевой код)

```
src/
├── domain/                  # Entities
│   └── order.entity.js
├── application/             # Use Cases
│   └── place-order.usecase.js
├── infrastructure/          # Adapters
│   ├── persistence/
│   │   └── postgres-order-repo.js
│   └── payment/
│       └── stripe-gateway.js
└── interfaces/              # Interface Adapters (для внеш осталось adapters/:)
    ├── http/
    │   └── order.controller.js
    └── dto/
        └── order.dto.js
```

```js
// === Domain: Entity (чистая бизнес-логика) ===
class Order {
  constructor(id, items) {
    this.id = id;
    this.items = items;
    this.status = "draft";
  }

  get total() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  }

  place() {
    if (this.items.length === 0) throw new Error("Заказ пуст");
    if (this.total <= 0) throw new Error("Некорректная сумма");
    this.status = "placed";
  }
}

// === Application: Use Case (оркестрация) ===
class PlaceOrderUseCase {
  constructor(orderRepository, paymentGateway) {
    this.orderRepository = orderRepository; // интерфейс (порт)
    this.paymentGateway = paymentGateway;   // интерфейс (порт)
  }

  async execute(orderData) {
    const order = new Order(
      orderData.id ?? crypto.randomUUID(),
      orderData.items
    );
    order.place();

    const payment = await this.paymentGateway.charge(order.total);

    if (!payment.success) {
      throw new Error("Платёж не прошёл");
    }

    await this.orderRepository.save(order);
    return order;
  }
}

// === Infrastructure: Adapter (реализация порта) ===
class PostgresOrderRepository {
  constructor(pool) { this.pool = pool; }
  async save(order) {
    await this.pool.query(
      "INSERT INTO orders (id, items, status, total) VALUES ($1, $2, $3, $4)",
      [order.id, JSON.stringify(order.items), order.status, order.total]
    );
  }
}

class StripePaymentGateway {
  async charge(amount) {
    return { success: true, transactionId: "pi_123" };
  }
}

// === Interfaces: Controller (адаптер HTTP) ===
class OrderController {
  constructor(placeOrderUseCase) {
    this.placeOrderUseCase = placeOrderUseCase;
  }

  async create(req, res) {
    try {
      const order = await this.placeOrderUseCase.execute(req.body);
      res.status(201).json(order);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}

// === Сборка (Composition Root) ===
const pool = new Pool({ connectionString: "..." });
const orderRepo = new PostgresOrderRepository(pool);
const paymentGw = new StripePaymentGateway();
const useCase = new PlaceOrderUseCase(orderRepo, paymentGw);
const controller = new OrderController(useCase);
```

## Ссылки

- Robert C. Martin: Clean Architecture (книга)
- [The Clean Architecture (блог Мартина)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- Jason Taylor: [Clean Architecture Solution Template](https://github.com/jasontaylordev/CleanArchitecture)


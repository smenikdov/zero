# Слоистая архитектура (Layered / N-Tier Architecture)

## Определение

Слоистая архитектура (Layered Architecture) — один из самых фундаментальных архитектурных стилей, при котором приложение
организовано в виде горизонтальных слоёв, каждый из которых отвечает за свою зону ответственности. Верхние слои зависят от
нижних, но не наоборот. Классическое разделение: Presentation (представление), Business Logic (бизнес-логика),
Data Access (доступ к данным), Database (база данных).

## Подробности

Слоистая архитектура — это, пожалуй, самая интуитивная и распространённая модель организации кода. Она появилась
задолго до формального описания и лежит в основе большинства корпоративных приложений.

**Классические слои (сверху вниз)**:

1. **Presentation Layer (UI)** — пользовательский интерфейс: веб-страницы, мобильные экраны, CLI, API-контроллеры.
   Отвечает за отображение данных и обработку пользовательского ввода. Содержит минимум логики.

2. **Application / Service Layer** — слой прикладной логики: сценарии использования (use cases), оркестрация операций,
   координация между бизнес-объектами и инфраструктурой. Не содержит бизнес-правил, но знает *последовательность действий*.

3. **Business / Domain Layer** — ядро приложения: бизнес-правила, сущности, валидации, расчёты. Это самый ценный слой,
   который должен быть независим от UI, БД и фреймворков.

4. **Persistence / Data Access Layer (DAL)** — абстракция над хранилищем данных: репозитории, ORM-маппинг, запросы к БД.
   Скрывает детали хранения от верхних слоёв.

5. **Database Layer** — сама база данных (PostgreSQL, MongoDB, файловая система).

**Правила слоистой архитектуры**:

- Каждый слой может обращаться только к слою непосредственно под ним (строгая модель) или к любому нижнему слою
  (расслабленная модель).
- Слой НЕ должен знать о слоях над ним — Presentation знает о Business, но Business не знает о Presentation.
- Общение между слоями происходит через вызовы методов/функций или через Dependency Injection.
- Данные передаются между слоями через DTO (Data Transfer Objects) или прямые вызовы.

**Вариации**:

- **3-Tier** — классическое разделение на Presentation, Logic, Data. Каждый уровень может быть на отдельном сервере.
- **N-Tier** — больше трёх слоёв (например, выделение отдельного Service Layer, Cache Layer, Integration Layer).
- **Strict vs Relaxed** — строгая модель: слой N может обращаться только к слою N-1. Расслабленная: слой N может
  обращаться к любому нижнему слою.

**Отличие от Clean/Onion/Hexagonal**:

Слоистая архитектура организует код *горизонтально* (по техническим зонам ответственности). Clean, Onion и Hexagonal
архитектуры строятся вокруг *вертикали* бизнес-логики, помещая её в центр и инвертируя зависимости через интерфейсы.
В слоистой архитектуре Business-слой напрямую зависит от DAL (через интерфейс или нет — зависит от реализации),
тогда как в Clean Architecture зависимости всегда направлены внутрь.

## Плюсы

- **Простота** — интуитивно понятная модель, легко объяснить новичкам.
- **Чёткое разделение ответственности** — код UI, логики и данных физически разделён.
- **Широкое распространение** — стандарт де-факто в enterprise-разработке, большинство разработчиков знакомы с подходом.
- **Простота тестирования** — каждый слой можно тестировать изолированно (мокая слой ниже).
- **Заменяемость слоёв** — теоретически можно заменить БД или UI, не трогая бизнес-логику.

## Минусы

- **Протекание абстракции** — на практике слои часто «протекают»: бизнес-логика начинает зависеть от деталей БД,
  UI-специфичные форматы просачиваются в доменный слой.
- **Синдром лазаньи** (Lasagna Architecture) — слишком много слоёв, каждый из которых просто пробрасывает вызовы вниз
  без дополнительной логики.
- **Жёсткость** — при добавлении нового функционала часто приходится менять все слои сверху вниз.
- **Связанность с инфраструктурой** — бизнес-логика обычно зависит от DAL напрямую, что затрудняет смену БД.
- **Неочевидные границы** — на практике сложно провести чёткую грань между Application Layer и Business Layer.

## Когда применять

- Традиционные корпоративные приложения с CRUD-операциями.
- Проекты, где бизнес-логика относительно проста и стабильна.
- Небольшие и средние команды без необходимости сложной архитектурной изоляции.
- Приложения, не требующие смены БД или UI в будущем.
- Когда важна скорость разработки и простота понимания системы.

## Пример на JS

```js
// Слоистая архитектура в Node.js: классическое разделение по слоям
// Структура папок:
// src/
//   presentation/
//     controllers/
//     routes.js
//   application/
//     use-cases/
//   domain/
//     entities/
//     services/
//   data/
//     repositories/
//     models/
//   config/
//     database.js

// === Слой конфигурации: database.js ===
const { Pool } = require("pg");
const pool = new Pool({ connectionString: "postgres://..." });

// === Слой данных (Data Access): repositories ===
// src/data/repositories/order.repository.js
class OrderRepository {
  // Репозиторий — мост между бизнес-логикой и SQL
  async findById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE id = $1", [id]
    );
    return rows[0] ?? null;
  }

  async save(order) {
    const { rows } = await pool.query(
      `INSERT INTO orders (customer_id, total, status)
       VALUES ($1, $2, $3) RETURNING *`,
      [order.customerId, order.total, order.status]
    );
    return rows[0];
  }

  async findByCustomer(customerId) {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE customer_id = $1", [customerId]
    );
    return rows;
  }
}

// === Доменный слой (Business Logic) ===
// src/domain/entities/order.js
class Order {
  constructor({ id, customerId, items = [], status = "pending" }) {
    this.id = id;
    this.customerId = customerId;
    this.items = items;
    this.status = status;
  }

  // Бизнес-правило: валидация заказа
  isValid() {
    return this.items.length > 0
      && this.customerId != null
      && this.status !== "cancelled";
  }

  // Бизнес-правило: расчёт скидки (VIP > 10000 = 10%)
  calculateDiscount(isVip) {
    const rawTotal = this.items.reduce(
      (sum, item) => sum + item.price * item.qty, 0
    );
    if (isVip && rawTotal > 10_000) {
      return rawTotal * 0.9;
    }
    return rawTotal;
  }
}

// src/domain/services/order.service.js
class OrderService {
  // Доменный сервис: операции, не принадлежащие одной сущности
  static validateAndApplyDiscount(order, isVip) {
    if (!order.isValid()) {
      throw new Error("Заказ невалиден");
    }
    return order.calculateDiscount(isVip);
  }
}

// === Прикладной слой (Application Layer): Use Cases ===
// src/application/use-cases/create-order.use-case.js
class CreateOrderUseCase {
  constructor(orderRepo, notificationService) {
    this.orderRepo = orderRepo;           // Зависимость от слоя данных
    this.notificationService = notificationService;
  }

  // Сценарий использования: создание заказа с бизнес-валидацией
  async execute({ customerId, items, isVip }) {
    // 1. Создаём доменный объект
    const order = new Order({ customerId, items });

    // 2. Применяем доменную логику
    const total = OrderService.validateAndApplyDiscount(order, isVip);
    order.total = total;

    // 3. Сохраняем через репозиторий (слой данных)
    const savedOrder = await this.orderRepo.save(order);

    // 4. Побочный эффект: уведомление
    await this.notificationService.send("order_created", savedOrder);

    return savedOrder;
  }
}

// === Слой представления (Presentation Layer): Controllers ===
// src/presentation/controllers/order.controller.js
class OrderController {
  constructor(createOrderUseCase) {
    this.createOrderUseCase = createOrderUseCase;
  }

  // HTTP-контроллер: только принимает запрос и отдаёт ответ
  async create(req, res) {
    try {
      const { customerId, items } = req.body;
      const isVip = req.user.tier === "vip";

      // Делегируем ВСЮ работу use case'у
      const order = await this.createOrderUseCase.execute({
        customerId,
        items,
        isVip,
      });

      res.status(201).json({ order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getByCustomer(req, res) {
    // Контроллер может напрямую вызывать репозиторий
    // для простых чтений (CQRS-lite подход)
    // ...
  }
}

// === Внедрение зависимостей (Dependency Injection) ===
// src/app.js — точка сборки
function buildApp() {
  // Создаём слои снизу вверх
  const orderRepo = new OrderRepository();
  const notificationService = new NotificationService();

  // Use case получает зависимости через конструктор
  const createOrderUseCase = new CreateOrderUseCase(
    orderRepo,
    notificationService
  );

  // Контроллер получает use case
  const orderController = new OrderController(createOrderUseCase);

  return { orderController };
}

// === Маршруты (тоже Presentation Layer) ===
// src/presentation/routes.js
const { Router } = require("express");
const { orderController } = buildApp();

const router = Router();
router.post("/api/orders", (req, res) => orderController.create(req, res));

module.exports = router;

// Граф зависимостей (строго сверху вниз):
// Presentation (Controller) → Application (Use Case) → Domain (Entity/Service)
//                                                          ↓
//                                                     Data (Repository) → Database
```

```js
// ===== АНТИПРИМЕР: нарушение слоёв =====

// ПЛОХО: контроллер содержит бизнес-логику и SQL
app.post("/api/orders", async (req, res) => {
  // Бизнес-логика прямо в контроллере
  const items = req.body.items;
  if (!items?.length) return res.status(400).json({ error: "Нет товаров" });

  let total = items.reduce((s, i) => s + i.price * i.qty, 0);
  if (req.user.vip && total > 10000) total *= 0.9;

  // SQL прямо в контроллере
  const result = await pool.query(
    "INSERT INTO orders (user_id, total) VALUES ($1, $2)",
    [req.user.id, total]
  );

  res.json(result.rows[0]);
});
// Проблемы:
// - Бизнес-правила (валидация, скидка) размазаны по контроллерам
// - SQL в контроллере = невозможно сменить БД
// - Нельзя протестировать бизнес-логику без HTTP
// - Дублирование логики между разными контроллерами

// ===== ХОРОШО: чёткое разделение по слоям =====

// Контроллер — только HTTP-обвязка
class OrderController {
  constructor(createOrderUseCase) {
    this.createOrderUseCase = createOrderUseCase;
  }

  async create(req, res) {
    try {
      const order = await this.createOrderUseCase.execute({
        customerId: req.user.id,
        items: req.body.items,
        isVip: req.user.vip,
      });
      res.status(201).json({ order });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
// Бизнес-логика изолирована, тестируема, переиспользуема.
// Смена БД или UI не требует изменений в доменном слое.
```

## Ссылки

- Martin Fowler: [Patterns of Enterprise Application Architecture (PoEAA)](https://martinfowler.com/eaaCatalog/)
- Microsoft: [N-Tier Architecture Style](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier)
- Mark Richards, Neal Ford: Fundamentals of Software Architecture (O'Reilly)
- Eric Evans: Domain-Driven Design (о различиях между слоистой и DDD-архитектурой)

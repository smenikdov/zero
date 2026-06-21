# Полтергейст (Poltergeist)

## Определение

Poltergeist — антипаттерн, при котором в системе существуют классы-«призраки» с коротким жизненным циклом и минимальной
полезной логикой. Они создаются только для того, чтобы вызвать метод другого объекта, и сразу уничтожаются. Их роль —
быть ненужным посредником, добавляющим сложности и ноль ценности.

## Подробности

Термин введён в книге AntiPatterns (Brown et al., 1998). Название отражает суть: как полтергейст в фольклоре создаёт
хаос, оставаясь невидимым, так и эти классы вносят шум, не делая реальной работы.

Признаки полтергейста:
- Класс/объект создаётся, вызывает ОДИН метод на другом объекте, уничтожается.
- Основной код — это делегирование: `return this.someObject.doSomething(args)`.
- Класс не имеет состояния (stateless), но при этом не является ни утилитой, ни сервисом, ни стратегией.
- Добавление класса не уменьшило связанность и не улучшило тестируемость.

## Почему это проблема

- **Раздувание кодовой базы** — файлы, которые не несут ценности.
- **Больше точек отказа** — каждый слой — потенциальное место для бага.
- **Сложность навигации** — чтобы понять flow, нужно пройти через 4 файла вместо 1.
- **Slower dev velocity** — написание и поддержка полтергейстов отнимает время.

## Как избежать

- **YAGNI** (You Ain't Gonna Need It) — не добавляй классы «про запас», «на всякий случай».
- **Спрашивай: что этот класс добавляет?** — если ответ «ничего» или «просто вызывает другой класс», удаляй.
- **Избегай слоёв ради слоёв** — `Controller → Service → Repository` не всегда оправдано. Для простого `SELECT *`
достаточно контроллера.

## Пример на JS

```js
// ❌ Цепочка полтергейстов
class CreateUserController {
  constructor(service) { this.service = service; }

  async handle(req, res) {
    // Полтергейст: просто вызывает сервис
    const user = await this.service.create(req.body);
    res.json(user);
  }
}

class CreateUserService {
  constructor(repository, validator) {
    this.repository = repository;
    this.validator = validator;
  }

  async create(data) {
    // Полтергейст: валидация + делегирование
    this.validator.validate(data);
    return this.repository.insert(data);
  }
}

class CreateUserRepository {
  constructor(db) { this.db = db; }

  async insert(data) {
    // Единственная реальная работа: SQL-запрос
    const { rows } = await this.db.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [data.name, data.email]
    );
    return rows[0];
  }
}

// 3 файла, 3 класса, 0 реальной бизнес-логики.
// Всё, что они делают — INSERT.
// Тестами покрыть можно, но ценой раздувания.

// ✅ Прагматичное решение: один обработчик
async function createUserHandler(req, res, db) {
  const { name, email } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: "Имя слишком короткое" });
  }
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Некорректный email" });
  }

  const { rows } = await db.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  res.status(201).json(rows[0]);
}

// Делает ровно то же самое, в одном месте, без полтергейстов.
// Когда появится реальная бизнес-логика (скидки, права, события) —
// тогда выделить в сервис.

// === Когда разбиение оправдано ===
// Бизнес-логика НЕ просто INSERT — тогда сервис несёт ценность
class OrderPlacementService {
  constructor(orders, inventory, payments, notifications) {
    this.orders = orders;
    this.inventory = inventory;
    this.payments = payments;
    this.notifications = notifications;
  }

  async execute(orderData) {
    // Реальная бизнес-логика: координация нескольких систем
    await this.inventory.reserve(orderData.items);
    const payment = await this.payments.charge(orderData.total);
    const order = await this.orders.create({ ...orderData, paymentId: payment.id });
    await this.notifications.send("OrderPlaced", order);
    return order;
  }
}
```

## Ссылки

- Brown et al.: AntiPatterns (1998, глава о Poltergeist)
- Martin Fowler: [AnemicDomainModel](https://martinfowler.com/bliki/AnemicDomainModel.html) — смежная проблема


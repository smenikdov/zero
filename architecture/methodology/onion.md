# Луковая архитектура (Onion Architecture)

## Определение

Луковая архитектура (Onion Architecture) — архитектурный стиль, предложенный
Джеффри Палермо в 2008 году. Строится вокруг доменной модели в центре,
а инфраструктурные слои наращиваются вокруг, как кольца луковицы. Все
зависимости направлены внутрь, к ядру.

## Подробности

Название отражает визуальную метафору: слой за слоем, центр — домен, кольца
вокруг — инфраструктура. Луковая архитектура — один из предшественников
Clean Architecture Роберта Мартина и близкий родственник гексагональной
архитектуры Кокбёрна.

**Слои (снаружи внутрь)**:

1. **Infrastructure** — БД, файловая система, API-клиенты,
   фреймворки, UI.
2. **Application Services** — сценарии использования,
   оркестрация, интерфейсы репозиториев и сервисов (порты).
3. **Domain Services** — безстатовая доменная логика,
   не принадлежащая одной сущности.
4. **Domain Model (Core)** — сущности, value objects,
   агрегаты, бизнес-правила. Самое стабильное ядро.

**Правило зависимостей** — такое же, как в Clean Architecture:
все зависимости направлены внутрь. Инфраструктура зависит от домена,
но не наоборот. Пересечение границ — через принцип инверсии
зависимостей (DIP): интерфейсы объявляются во внутреннем слое,
реализации — во внешнем.

**Отличие от Clean Architecture**: в Onion Architecture меньше
предписанных слоёв и больше акцента на доменную модель как на
абсолютный центр. Clean Architecture добавляет явный слой Use Cases
и более детальную классификацию.

## Плюсы

- **Независимость от инфраструктуры** — домен не знает о БД
  и фреймворках.
- **Тестируемость** — каждый слой тестируется изолированно,
  ядро — без mock-объектов.
- **Заменяемость** — смена БД или UI не трогает бизнес-логику.
- **Долговечность** — архитектура устойчива к изменениям
  внешних технологий.

## Минусы

- **Много слоёв** — даже простая операция требует кода
  в нескольких слоях.
- **Кривая обучения** — команда должна понимать DIP
  и правило зависимостей.
- **Избыточно для простых CRUD-приложений**.

## Когда применять

- Сложные бизнес-системы с долгим жизненным циклом.
- Проекты, где доменная модель — главная ценность,
  и инфраструктура будет меняться.
- Хорошая альтернатива Clean Architecture, когда хочется меньше
  формальных слоёв, но с сохранением принципа изоляции домена.

## Схема

```
        ┌──────────────────────────────┐
        │       Infrastructure         │
        │  ┌────────────────────────┐  │
        │  │  Application Services  │  │
        │  │  ┌──────────────────┐  │  │
        │  │  │  Domain Services │  │  │
        │  │  │  ┌────────────┐  │  │  │
        │  │  │  │   Domain   │  │  │  │
        │  │  │  │   Model    │  │  │  │
        │  │  │  │  (Core)    │  │  │  │
        │  │  │  └────────────┘  │  │  │
        │  │  └──────────────────┘  │  │
        │  └────────────────────────┘  │
        └──────────────────────────────┘
```

## Пример на JS

```js
// === Domain Model (Core) — чистая бизнес-логика ===
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class Cart {
  #items = [];

  addItem(product, qty) {
    if (qty <= 0) throw new Error("Количество должно быть > 0");
    const existing = this.#items.find(i => i.product.id === product.id);
    if (existing) { existing.qty += qty; }
    else { this.#items.push({ product, qty }); }
  }

  get total() {
    return this.#items.reduce((s, i) => s + i.product.price * i.qty, 0);
  }

  get items() { return [...this.#items]; }
}

// === Domain Services ===
class DiscountCalculator {
  calculate(cart, discountRate) {
    return cart.total * discountRate;
  }
}

// === Application Services (порты — интерфейсы, определяемые доменом) ===
class OrderRepository {
  async save(order) { throw new Error("Not implemented"); }
}

// === Application Services (Use Cases) ===
class CheckoutUseCase {
  constructor(orderRepo, discountCalc) {
    this.orderRepo = orderRepo;
    this.discountCalc = discountCalc;
  }

  async execute(cart) {
    if (cart.items.length === 0) throw new Error("Корзина пуста");

    const discount = this.discountCalc.calculate(cart, 0.1);
    const total = cart.total - discount;

    const order = {
      id: crypto.randomUUID(),
      items: cart.items,
      total: Math.max(0, total),
      createdAt: new Date(),
    };

    await this.orderRepo.save(order);
    return order;
  }
}

// === Infrastructure (адаптеры, реализующие порты) ===
class PostgresOrderRepository extends OrderRepository {
  constructor(pool) { super(); this.pool = pool; }

  async save(order) {
    await this.pool.query(
      `INSERT INTO orders (id, items, total, created_at)
       VALUES ($1, $2, $3, $4)`,
      [order.id, JSON.stringify(order.items), order.total, order.createdAt]
    );
  }
}

// === Composition Root (сборка всех слоёв) ===
const pool = new Pool({ connectionString: "..." });
const orderRepo = new PostgresOrderRepository(pool);
const discountCalc = new DiscountCalculator();
const checkout = new CheckoutUseCase(orderRepo, discountCalc);

// === Использование ===
const cart = new Cart();
cart.addItem(new Product(1, "Книга", 500), 1);
cart.addItem(new Product(2, "Ручка", 50), 2);

checkout.execute(cart).then(console.log);
```

## Ссылки

- Jeffrey Palermo: [The Onion Architecture (2008)](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
- Robert C. Martin: Clean Architecture (книга)


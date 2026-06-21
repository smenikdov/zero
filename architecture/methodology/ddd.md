# DDD (Domain-Driven Design)

## Определение

Domain-Driven Design (предметно-ориентированное проектирование) — подход к разработке сложных систем, описанный Эриком
Эвансом в книге 2003 года. Основной фокус — не на технологиях, а на глубоком понимании предметной области (домена).
Программная модель должна отражать ментальную модель экспертов предметной области, а код и разговорный язык команды —
совпадать.

## Подробности

Центральная идея DDD — **единый язык (Ubiquitous Language)**. Все участники (доменные эксперты, разработчики, аналитики,
тестировщики) используют один и тот же язык, отражённый в коде. Если эксперт говорит «заказ переходит в статус
„отгружен“ после подтверждения оплаты», то в коде будет `order.ship()` или `order.transitionTo(OrderStatus.SHIPPED)` —
дословно.

DDD делится на стратегический и тактический дизайн:

**Стратегический дизайн**:
- **Bounded Context** — явная граница, внутри которой модель имеет однозначный смысл. Например, «Товар» в контексте
«Каталог» имеет свойства название/цена/фото, а в контексте «Склад» — вес/габариты/ячейка. Это разные модели с возможным
общим ID.
- **Context Map** — схема отношений между контекстами: Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer и др.

**Тактический дизайн** — строительные блоки внутри Bounded Context:
- **Entity** — объект с уникальным идентификатором и жизненным циклом. Равенство по ID, а не по всем полям.
- **Value Object** — объект без идентификатора, равенство по всем полям, неизменяемый. Например, `Money(amount, currency)`.
- **Aggregate** — кластер Entity и Value Objects, с корневой Entity (Aggregate Root) как точкой входа. Все изменения
идут через корень.
- **Domain Event** — важное событие в домене: «OrderPlaced», «PaymentReceived».
- **Repository** — коллекционноподобный доступ к агрегатам.
- **Domain Service** — безстатовая операция, которая не принадлежит одной Entity.
- **Factory** — инкапсуляция сложного создания агрегатов.

## Плюсы

- **Отражение бизнеса в коде** — код понятен экспертам предметной области.
- **Управление сложностью** — Bounded Contexts ограничивают ветер изменений.
- **Гибкость** — DDD хорошо сочетается с микросервисами (1 bounded context → 1 микросервис).
- **Качество модели** — глубокое моделирование выявляет неявные инварианты и краевые случаи.

## Минусы

- **Высокий порог входа** — много концепций, книг, паттернов.
- **Нужен доступ к экспертам** — без доменных экспертов DDD вырождается.
- **Избыточно для простых доменов** — CRUD не требует DDD.
- **Трудоёмкость** — моделирование требует времени и итераций.

## Когда применять

- Сложные бизнес-системы с нетривиальными правилами (финтех, логистика, страхование).
- Проекты, где бизнес-логика — главная ценность, а не инфраструктура.
- Долгоживущие продукты, которые будут развиваться годами.

## Пример на JS

```js
// === Value Objects ===
class Money {
  constructor(amount, currency = "RUB") {
    if (amount < 0) throw new Error("Сумма не может быть отрицательной");
    this.amount = amount;
    this.currency = currency;
  }

  add(other) {
    if (this.currency !== other.currency) throw new Error("Разные валюты");
    return new Money(this.amount + other.amount, this.currency);
  }

  equals(other) {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

class OrderItem {
  constructor(productId, name, price, qty) {
    this.productId = productId;
    this.name = name;
    this.price = price instanceof Money ? price : new Money(price);
    this.qty = qty;
  }

  get subtotal() {
    return new Money(this.price.amount * this.qty, this.price.currency);
  }
}

// === Aggregate Root ===
class Order {
  #items = [];
  #status = "draft";

  constructor(id) {
    this.id = id;
  }

  // Единственная точка входа для изменения агрегата
  addItem(productId, name, price, qty) {
    if (this.#status !== "draft") {
      throw new Error("Можно добавлять только в черновик");
    }
    this.#items.push(new OrderItem(productId, name, price, qty));
  }

  place() {
    if (this.#items.length === 0) {
      throw new Error("Нельзя оформить пустой заказ");
    }
    this.#status = "placed";
    this.events = [{ type: "OrderPlaced", orderId: this.id, total: this.total }];
  }

  cancel(reason) {
    if (this.#status === "shipped") {
      throw new Error("Нельзя отменить отправленный заказ");
    }
    this.#status = "cancelled";
    this.events = [{ type: "OrderCancelled", orderId: this.id, reason }];
  }

  get total() {
    return this.#items.reduce(
      (sum, item) => sum.add(item.subtotal),
      new Money(0)
    );
  }

  get status() { return this.#status; }
  get items() { return [...this.#items]; }
}

// === Repository (порт) ===
class OrderRepository {
  async findById(id) { throw new Error("Not implemented"); }
  async save(order) { throw new Error("Not implemented"); }
}

// === Использование ===
const order = new Order("order-1");
order.addItem("p-1", "Книга", new Money(500), 1);
order.addItem("p-2", "Ручка", new Money(50), 2);
order.place();

console.log(order.total); // Money { amount: 600, currency: "RUB" }
console.log(order.items.map(i => i.subtotal));
// [Money { amount: 500 }, Money { amount: 100 }]
```

## Ссылки

- Eric Evans: Domain-Driven Design: Tackling Complexity in the Heart of Software (2003)
- Vaughn Vernon: Implementing Domain-Driven Design (2013)
- Martin Fowler: [BoundedContext](https://martinfowler.com/bliki/BoundedContext.html)


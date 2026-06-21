# CQRS (Command Query Responsibility Segregation)

## Определение

CQRS — архитектурный паттерн, разделяющий операции чтения (Query) и записи (Command) на разные модели. Вместо одной
универсальной модели данных используются две независимые: одна для выполнения команд (изменение состояния) и одна для
запросов (чтение данных).

## Подробности

Идея CQRS выросла из CQS (Command Query Separation) Бертрана Мейера, который утверждал, что метод должен либо изменять
состояние (Command), либо возвращать данные (Query), но не то и другое одновременно. CQRS поднимает этот принцип на
уровень архитектуры всей системы.

В классической трёхслойной архитектуре одна и та же модель данных используется и для чтения, и для записи. Это удобно
для простых CRUD-приложений, но по мере роста сложности модели становятся перегруженными: им приходится обслуживать
десятки разных представлений (экранов, отчётов), и каждый сценарий записи усложняется необходимостью поддерживать
удобную структуру для чтения.

CQRS решает это разделением: командная модель оптимизирована под бизнес-логику и инварианты, а модель чтения
денормализована и оптимизирована под конкретные представления. Модели могут жить в разных базах данных, на разных
серверах, с разными технологиями хранения.

Часто CQRS идёт в связке с Event Sourcing: команды порождают события, которые проецируются на read-модель через
обработчики (projectors).

## Плюсы

- **Независимое масштабирование** — read-сторону можно масштабировать горизонтально независимо от write-стороны.
- **Оптимизация под задачу** — read-модель может использовать денормализованные данные, кэши, полнотекстовые индексы;
write-модель — строгую нормализацию.
- **Упрощение запросов** — каждый запрос получает модель, специально подготовленную для него, без сложных JOIN-ов.
- **Независимая эволюция** — изменение логики записи не ломает чтение и наоборот.

## Минусы

- **Двойная сложность** — вместо одной модели приходится поддерживать две и синхронизацию между ними.
- **Eventual consistency** — после команды read-модель может отставать, нужны механизмы согласованности.
- **Избыточность для простых систем** — для CRUD-приложений CQRS — переусложнение.
- **Необходимость инфраструктуры** — брокеры сообщений, очереди, отдельные БД.

## Когда применять

- Системы с высокой асимметрией чтения и записи (соцсети — много читают, мало пишут).
- Сложные домены, где бизнес-логика записи сильно отличается от логики представления.
- Требования к независимому масштабированию read и write.
- В связке с Event Sourcing.

## Пример на JS

```js
// === Write side (Command Model) ===
class BankAccount {
  #id;
  #events = [];

  constructor(id) { this.#id = id; }

  deposit(amount) {
    if (amount <= 0) throw new Error("Сумма должна быть положительной");
    this.#events.push({ type: "Deposited", accountId: this.#id, amount });
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Сумма должна быть положительной");
    if (this.getBalance() < amount) throw new Error("Недостаточно средств");
    this.#events.push({ type: "Withdrawn", accountId: this.#id, amount });
  }

  getEvents() { return [...this.#events]; }
  getBalance() {
    return this.#events.reduce((sum, e) =>
      e.type === "Deposited" ? sum + e.amount : sum - e.amount, 0
    );
  }
}

// === Read side (Query Model) — денормализованное представление ===
class AccountSummary {
  constructor() {
    this.accounts = new Map(); // accountId -> { balance, lastOperation }
  }

  apply(event) {
    const acc = this.accounts.get(event.accountId) ?? { balance: 0, lastOperation: null };
    if (event.type === "Deposited") acc.balance += event.amount;
    if (event.type === "Withdrawn") acc.balance -= event.amount;
    acc.lastOperation = event.type;
    this.accounts.set(event.accountId, acc);
  }

  getSummary(accountId) {
    return this.accounts.get(accountId) ?? { balance: 0, lastOperation: null };
  }
}

// === Использование ===
const account = new BankAccount("acc-1");
account.deposit(100);
account.withdraw(30);

const summary = new AccountSummary();
account.getEvents().forEach(e => summary.apply(e));

console.log(summary.getSummary("acc-1")); // { balance: 70, lastOperation: "Withdrawn" }
```

## Ссылки

- Martin Fowler: [CQRS](https://martinfowler.com/bliki/CQRS.html)
- Greg Young: [CQRS Documents](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf)


# Event Sourcing (Хранилище событий)

## Определение

Event Sourcing — подход к хранению данных, при котором вместо текущего состояния объекта сохраняются все изменения
(события), которые привели к этому состоянию. Текущее состояние восстанавливается последовательным применением
(проигрыванием) событий от начала истории. Аналог в реальном мире — бухгалтерская книга: баланс не перезаписывается, а
вычисляется из всех приходных и расходных записей.

## Подробности

В классическом подходе (CRUD) мы храним последнее состояние: `users` → `{ id: 1, name: "Alice", balance: 700 }`. При
изменении баланса старая запись перезаписывается. История теряется.

В Event Sourcing:
```
События для счёта 42:
1. AccountCreated { owner: "Alice" }
2. Deposited { amount: 1000 }        → баланс 1000
3. Withdrawn { amount: 300 }         → баланс 700
4. Deposited { amount: 200 }         → баланс 900
5. Withdrawn { amount: 150 }         → баланс 750 ← текущее состояние
```

Текущий баланс (750) нигде не хранится — он вычисляется из событий.

**Event Store** — специализированная БД для хранения событий (EventStoreDB, Axon, или самописный поверх Postgres).
Хранит поток событий для каждого агрегата, проиндексированный по версии.

**Проекции (Projections)** — read-модели, построенные из событий. Например: текущий баланс, отчёт за месяц, история
операций в UI. Проекции обновляются при поступлении новых событий. Одно хранилище событий может порождать множество
проекций для разных целей.

**CQRS** — естественный спутник Event Sourcing: команды порождают события, события строят проекции для запросов.

**Snapshot** — чтобы не проигрывать тысячи событий при восстановлении, периодически сохраняется слепок состояния. При
восстановлении берётся последний snapshot + события после него.

## Плюсы

- **Полная история** — всегда можно узнать, КАК система пришла к текущему состоянию.
- **Аудит из коробки** — журнал событий = идеальный след для compliance (финтех, банкинг).
- **Временны́е запросы** — «какой баланс был неделю назад?» — просто остановить проигрывание на нужной дате.
- **Устойчивость к багам** — если баг испортил состояние, исправляем обработчик и перестраиваем проекции.
- **События как база интеграции** — другие сервисы подписываются на события и строят свои проекции.

## Минусы

- **Сложность запросов** — нельзя просто `SELECT * WHERE balance > 1000`, нужны проекции.
- **Eventual consistency** — проекции отстают от хранилища событий.
- **Миграция событий** — изменение структуры события (Upcasting) сложнее, чем миграция схемы БД.
- **Большой объём хранения** — все события занимают больше места, чем текущее состояние.
- **Удаление данных** — GDPR (право на забвение) трудно: события неизменяемы.

## Когда применять

- Финансовые системы, аудит, compliance.
- Системы, где история изменений — самостоятельная ценность.
- Сложные домены с CQRS.
- IoT/телеметрия (потоки событий от устройств).

## Пример на JS (Redux-подобный Event Store)

```js
// === События (неизменяемые факты) ===
const events = [];

function recordEvent(type, payload) {
  const event = {
    id: events.length + 1,
    type,
    payload,
    timestamp: Date.now(),
    version: events.length + 1,
  };
  events.push(event);
  return event;
}

// === Агрегат (восстанавливается из событий) ===
class BankAccount {
  constructor(id) {
    this.id = id;
    this.owner = "";
    this.balance = 0;
    this.status = "new";
  }

  // Восстановление из истории событий
  static fromHistory(id, eventStream) {
    const account = new BankAccount(id);
    for (const event of eventStream) {
      account.#apply(event);
    }
    return account;
  }

  // Обработчики событий — чистая функция (событие + состояние → новое состояние)
  #apply(event) {
    switch (event.type) {
      case "AccountCreated":
        this.owner = event.payload.owner;
        this.status = "active";
        break;
      case "Deposited":
        this.balance += event.payload.amount;
        break;
      case "Withdrawn":
        this.balance -= event.payload.amount;
        break;
      case "Closed":
        this.status = "closed";
        break;
    }
    this.#lastEventId = event.id;
  }

  // Команды (выполняют проверки и записывают события)
  static create(id, owner) {
    const account = new BankAccount(id);
    account.#emit("AccountCreated", { owner });
    return account;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Сумма должна быть положительной");
    this.#emit("Deposited", { amount });
  }

  withdraw(amount) {
    if (amount <= 0) throw new Error("Сумма должна быть положительной");
    if (this.balance < amount) throw new Error("Недостаточно средств");
    this.#emit("Withdrawn", { amount });
  }

  #emit(type, payload) {
    this.#apply({ type, payload }); // применяем к текущему состоянию
    recordEvent(type, { accountId: this.id, ...payload }); // записываем в журнал
  }
}

// === Использование ===
const acc = BankAccount.create("acc-1", "Alice");
acc.deposit(1000);
acc.withdraw(300);
acc.deposit(200);

console.log(acc.balance); // 900
console.log(events);
// [
//   { id: 1, type: "AccountCreated", payload: { accountId: "acc-1", owner: "Alice" }, ... },
//   { id: 2, type: "Deposited", payload: { accountId: "acc-1", amount: 1000 }, ... },
//   { id: 3, type: "Withdrawn", payload: { accountId: "acc-1", amount: 300 }, ... },
//   { id: 4, type: "Deposited", payload: { accountId: "acc-1", amount: 200 }, ... },
// ]

// === Восстановление из журнала ===
const restored = BankAccount.fromHistory("acc-1", events);
console.log(restored.balance); // 900
```

## Ссылки

- Martin Fowler: [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- Greg Young: [CQRS and Event Sourcing](https://www.youtube.com/watch?v=JHGkaShoyNs)
- EventStoreDB documentation


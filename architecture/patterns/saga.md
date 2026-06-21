# Saga (Сага)

## Определение

Saga — архитектурный паттерн управления распределёнными транзакциями в микросервисной архитектуре. Последовательность
локальных транзакций, где каждая обновляет данные внутри одного сервиса и публикует событие или сообщение для запуска
следующей. Если какая-либо транзакция проваливается, сага выполняет компенсирующие действия для отката уже выполненных
шагов.

## Подробности

В монолите одна транзакция может охватывать несколько таблиц — ACID гарантирует консистентность. В микросервисах у
каждого сервиса своя база, и распределённые транзакции (2PC/XA) приносят блокировки и проблемы с доступностью. Сага —
альтернатива: вместо одной атомарной транзакции — цепочка локальных.

Два основных типа саг:

1. **Хореография (Choreography)** — сервисы обмениваются событиями напрямую, без центрального координатора. Каждый
сервис знает, на какое событие подписаться и что делать дальше. Просто, но при росте числа шагов становится трудно
отследить общий поток.

2. **Оркестрация (Orchestration)** — центральный оркестратор управляет последовательностью, отправляя команды сервисам и
получая ответы. Поток управления явный, но оркестратор становится единой точкой отказа (решается репликацией) и может
накапливать логику.

Компенсирующие транзакции — ключевая идея саги. Для каждого шага определяется действие отмены: если списал деньги —
верни, если зарезервировал товар — сними резервацию, если отправил письмо — отправь письмо с извинениями.

## Плюсы

- **Нет распределённых блокировок** — каждый сервис автономен, система доступна.
- **Слабая связанность** — сервисы взаимодействуют через события/команды.
- **Горизонтальное масштабирование** — каждый шаг саги — независимый сервис.
- **Устойчивость** — отказ одного сервиса не кладёт всю систему.

## Минусы

- **Eventual consistency** — между шагами саги система в промежуточном состоянии.
- **Сложность компенсаций** — не все операции легко откатить (отправка email, списание бонусов с истекшим сроком).
- **Нет изоляции** — параллельные саги могут видеть промежуточные состояния друг друга (аномалии).
- **Отладка** — распределённый поток сложнее отлаживать, чем монолитную транзакцию.

## Когда применять

- Микросервисная архитектура с отдельными БД на сервис.
- Бизнес-процессы, требующие координации нескольких сервисов (оформление заказа: склад, оплата, доставка).
- Системы, где доступность важнее немедленной консистентности.

## Пример на JS (оркестрируемая сага)

```js
class SagaOrchestrator {
  constructor() {
    this.steps = []; // [{ action, compensate }]
  }

  addStep(action, compensate) {
    this.steps.push({ action, compensate });
    return this;
  }

  async execute(params) {
    const executed = [];
    try {
      let result = params;
      for (const step of this.steps) {
        result = await step.action(result);
        executed.push(step);
      }
      return result;
    } catch (error) {
      // Откат уже выполненных шагов в обратном порядке
      let compensationParams = params;
      for (const step of executed.reverse()) {
        try {
          compensationParams = await step.compensate(compensationParams);
        } catch (compError) {
          console.error("Ошибка компенсации:", compError);
        }
      }
      throw error;
    }
  }
}

// === Сервисы (упрощённо) ===
const orderService = {
  createOrder: async ({ orderId, amount }) => {
    console.log(`Заказ ${orderId} создан на сумму ${amount}`);
    return { orderId, amount, status: "created" };
  },
  cancelOrder: async ({ orderId }) => {
    console.log(`Заказ ${orderId} отменён`);
    return { orderId, status: "cancelled" };
  },
};

const paymentService = {
  charge: async ({ orderId, amount }) => {
    if (amount > 1000) throw new Error("Недостаточно средств"); // эмуляция ошибки
    console.log(`Списано ${amount} по заказу ${orderId}`);
    return { orderId, amount, paymentStatus: "paid" };
  },
  refund: async ({ orderId, amount }) => {
    console.log(`Возврат ${amount} по заказу ${orderId}`);
    return { orderId, paymentStatus: "refunded" };
  },
};

// === Сборка саги ===
const saga = new SagaOrchestrator()
  .addStep(
    (p) => orderService.createOrder(p),
    (p) => orderService.cancelOrder(p)
  )
  .addStep(
    (p) => paymentService.charge(p),
    (p) => paymentService.refund(p)
  );

// === Запуск ===
saga.execute({ orderId: "order-42", amount: 500 })
  .then(console.log)
  .catch((e) => console.error("Сага провалилась:", e.message));

// При amount > 1000 сработает компенсация: отмена заказа + возврат
```

## Ссылки

- Garcia-Molina, Salem: [Sagas (1987)](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf)
- Chris Richardson: [Microservices Patterns — Saga](https://microservices.io/patterns/data/saga.html)
- Microsoft: [Saga distributed transactions
pattern](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)


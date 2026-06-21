# Магические числа (Magic Numbers)

## Определение

Магические числа — неименованные числовые, строковые или иные литералы в коде, смысл которых неочевиден из контекста.
Число появляется «из воздуха», и чтобы понять его происхождение, нужно либо быть автором кода, либо провести
археологические раскопки в истории коммитов.

## Подробности

Термин относится не только к числам, но и к любым литералам: строки, регулярные выражения, булевы значения. Любой
литерал, чей смысл не очевиден без дополнительного объяснения — магический.

Примеры:
- `if (status === 3)` — что значит статус 3? Отменён? Завершён? Ошибка?
- `setTimeout(() => refresh(), 60000)` — 60000 миллисекунд = 1 минута, но не сразу понятно.
- `if (age >= 18)` — здесь 18 очевидно (возраст совершеннолетия), это НЕ магическое число, но лучше всё равно в константу.
- `str.substring(0, 10)` — почему 10? Это длина превью? Лимит поля?
- `if (balance < 0.01)` — 0.01 — это «очень мало»? Или специфический порог?

Особая опасность — **дублирование**: магическое число повторяется в 10 местах. Когда его нужно изменить, 2 места забудут
поправить, и появятся трудноуловимые баги.

## Почему это проблема

- **Неочевидность — первоисточник багов** — разработчик перепутал 30 и 60 дней и не заметил.
- **Хрупкость** — при изменении значения нужно найти все места использования, а поиск по числу `30` выдаёт сотни результатов.
- **Документация рассеяна** — смысл числа существует только в голове автора или в комментарии, который устарел.

## Как избежать

- **Именованные константы** — `const MIN_AGE = 18`, `const POLLING_INTERVAL_MS = 60_000`.
- **Enum вместо числовых статусов** — `const OrderStatus = { PENDING: 0, CONFIRMED: 1, SHIPPED: 2, CANCELLED: 3 }`.
- **Извлечение магических литералов в конфиг** — только если это действительно конфигурация, а не бизнес-константа.
- **Выразительные имена** — `PREVIEW_MAX_LENGTH`, `RETRY_ATTEMPTS`, `CACHE_TTL_SECONDS`.

## Пример на JS

```js
// ❌ Магические числа и строки повсюду
function validateOrder(order) {
  if (order.items.length === 0) {
    throw new Error("Пустой заказ");
  }
  if (order.items.length > 50) {
    throw new Error("Слишком много позиций");
  }
  if (order.total < 500) {
    throw new Error("Минимальная сумма заказа — 500");
  }
  if (order.status === 3) {
    throw new Error("Нельзя изменить отменённый заказ");
  }
  if (order.delivery === "express") {
    order.surcharge = 350;
  }
}

// ✅ Именованные константы и Enum
const OrderLimits = {
  MIN_ITEMS: 1,
  MAX_ITEMS: 50,
  MIN_AMOUNT: 500,
};

const OrderStatus = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  CANCELLED: 3,
};

const DeliveryType = {
  STANDARD: "standard",
  EXPRESS: "express",
  PICKUP: "pickup",
};

const SURCHARGE_BY_DELIVERY = {
  [DeliveryType.EXPRESS]: 350,
  [DeliveryType.PICKUP]: 0,
  [DeliveryType.STANDARD]: 0,
};

function validateOrder(order) {
  if (order.items.length < OrderLimits.MIN_ITEMS) {
    throw new Error("Пустой заказ");
  }
  if (order.items.length > OrderLimits.MAX_ITEMS) {
    throw new Error(`Максимум ${OrderLimits.MAX_ITEMS} позиций`);
  }
  if (order.total < OrderLimits.MIN_AMOUNT) {
    throw new Error(`Минимальная сумма — ${OrderLimits.MIN_AMOUNT}`);
  }
  if (order.status === OrderStatus.CANCELLED) {
    throw new Error("Нельзя изменить отменённый заказ");
  }
  // Наценка вычисляется явно
  order.surcharge = SURCHARGE_BY_DELIVERY[order.delivery] ?? 0;
}
```

## Ссылки

- Robert C. Martin: Clean Code (правило: «Не используй магические числа»)
- [ESLint: no-magic-numbers](https://eslint.org/docs/latest/rules/no-magic-numbers)


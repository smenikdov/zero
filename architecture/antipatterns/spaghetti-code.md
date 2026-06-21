# Спагетти-код (Spaghetti Code)

## Определение

Спагетти-код — код с запутанной структурой управления: неясные переходы, глубокие вложенности, отсутствие чёткой
последовательности выполнения, обилие побочных эффектов. Название отражает визуальный образ: как тарелка спагетти, где
трудно отследить отдельную нить.

## Подробности

Термин появился в 1970-х годах в контексте языков с оператором `goto` (Fortran, BASIC), где можно было перепрыгивать в
произвольную точку программы. Хотя современные языки не поощряют goto, спагетти-код никуда не делся — он просто обрёл
новые формы:

- **Callback hell** — каскад вложенных коллбэков «вправо»: `step1(() => step2(() => step3(() => ...)))`.
- **Promise цепочки без обработки ошибок** — `.then().then().then()` без структуры.
- **Глубоковложенные if/else** — 5-6 уровней, ветвление на каждом шаге.
- **Флаговые переменные** — `let shouldContinue = true; while (shouldContinue) { if (...) shouldContinue = false; }`.
- **«Тайные» побочные эффекты** — функция меняет глобальное состояние, от которого зависит неочевидный код в другом модуле.

Спагетти-код делает невозможным локальное понимание: чтобы разобраться в одном методе, нужно прочитать 10 других файлов.

## Почему это проблема

- **Сложность чтения** — разработчик тратит 80% времени на понимание, 20% на написание.
- **Ошибки незаметны** — неочевидные пути выполнения порождают баги, которые трудно воспроизвести.
- **Блокировка тестирования** — невозможно протестировать изолированно единицу кода.
- **Каскадные изменения** — правка одного условия разваливает пять несвязанных сценариев.

## Как избежать

- **Линейный код** — early return вместо вложенных if: `if (!valid) return; // основной код`.
- **Декомпозиция** — разбивать длинные методы на маленькие с одной ответственностью.
- **Избегать мутаций** — предпочитать иммутабельные данные и чистые функции.
- **Async/await** вместо цепочек промисов — читается линейно.
- **Цикломатическая сложность** — метрика, измеряющая количество независимых путей в функции. Держать под контролем (<= 10).

## Пример на JS

```js
// ❌ Спагетти-код
function processOrder(order, user, promo) {
  let discount = 0;
  let total = 0;

  if (user) {
    if (user.isVip) {
      discount = 0.2;
    } else if (user.isRegular) {
      if (user.purchases > 10) {
        discount = 0.1;
      } else {
        if (promo) {
          if (promo.type === "percent") {
            discount = promo.value / 100;
          } else if (promo.type === "fixed") {
            discount = promo.value / order.items.length;
          }
        }
      }
    } else {
      if (promo && promo.type === "percent") {
        discount = promo.value / 100;
      }
    }
  } else {
    if (promo) {
      discount = promo.value / 100;
    }
  }

  for (let i = 0; i < order.items.length; i++) {
    const item = order.items[i];
    let itemTotal = item.price * item.quantity;
    if (item.discountable !== undefined) {
      if (item.discountable) {
        itemTotal -= itemTotal * discount;
      }
    } else {
      itemTotal -= itemTotal * discount;
    }
    total += itemTotal;
    if (total < 0) total = 0;
  }

  console.log("Order processed:", order.id, "Total:", total);
  return { orderId: order.id, total };
}

// ✅ Линейный код с декомпозицией
function calculateDiscount(user, promo) {
  if (user?.isVip) return 0.2;
  if (isLoyal(user)) return 0.1;
  if (promo?.type === "percent") return promo.value / 100;
  if (promo?.type === "fixed") return 0; // фиксированные скидки применяются иначе
  return 0;
}

function isLoyal(user) {
  return user?.isRegular && user.purchases > 10;
}

function calculateItemTotal(item, discount) {
  const gross = item.price * item.quantity;
  const isDiscountable = item.discountable !== false; // по умолчанию — да
  return isDiscountable ? gross * (1 - discount) : gross;
}

function processOrder(order, user, promo) {
  const discount = calculateDiscount(user, promo);

  const total = order.items
    .map(item => calculateItemTotal(item, discount))
    .reduce((sum, t) => sum + t, 0);

  console.log("Order processed:", order.id, "Total:", Math.max(0, total));
  return { orderId: order.id, total: Math.max(0, total) };
}
```

## Ссылки

- Edsger Dijkstra: [Go To Statement Considered Harmful (1968)](https://dl.acm.org/doi/10.1145/362929.362947)
- Robert C. Martin: Clean Code (глава о функциях)
- Wikipedia: [Cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)


# Преждевременная оптимизация (Premature Optimization)

## Определение

Преждевременная оптимизация — практика усложнения кода ради производительности до того, как профилирование показало, что
этот код — узкое место. Разработчик жертвует читаемостью и простотой, пытаясь «сделать быстро» то, что и так работает
достаточно быстро.

Дональд Кнут: «Преждевременная оптимизация — корень всех зол» (1974).

## Подробности

Кнут сделал это заявление в контексте структурного программирования и компиляторов, но с тех пор его цитируют (часто
чрезмерно) для оправдания любого неоптимального кода. Важно понимать полную цитату: «Мы должны забыть о мелкой
эффективности, скажем, в 97% случаев: преждевременная оптимизация — корень всех зол. Но мы не должны упускать
возможности в оставшихся 3%».

Проблема не в оптимизации как таковой, а в её **преждевременности**. Оптимизация уместна когда:
1. Есть измерения (profiling), показывающие проблему.
2. Неоптимальный код влияет на пользовательский опыт.
3. Стоимость оптимизации (усложнение кода) соразмерна выгоде.

Формы преждевременной оптимизации:
- Ручной кэш на старте проекта, когда объём данных неизвестен.
- Сложные многопоточные структуры для приложения с 10 пользователями.
- Бинарные протоколы вместо HTTP, когда задержка не измерялась.
- Микрооптимизации на уровне цикла (`++i` вместо `i++`, ручное инлайнирование) без профилирования.
- Отказ от ORM/фреймворка «потому что он медленный» до замера.

## Почему это проблема

- **Усложнение кода** — оптимизированный код сложнее читать и менять.
- **Трата времени** — оптимизация того, что не является узким местом.
- **Ложная уверенность** — разработчик думает, что решил проблему производительности, которой не было.
- **Блокировка дальнейшей оптимизации** — нечитаемый код сложнее профилировать и оптимизировать позже.

## Как избежать

1. **Measure first, optimize second** — всегда начинай с профилирования.
2. **Выбирай правильный уровень** — оптимизация алгоритма (O(n²) → O(n log n)) ценнее микрооптимизации цикла.
3. **Знай свои данные** — какой объём реален? Оптимизация для миллиона записей, когда их 100 — пустая трата.
4. **Сохраняй читаемость** — если оптимизация делает код нечитаемым, цена слишком высока.

## Пример на JS

```js
// ❌ Преждевременная оптимизация: ручное кэширование
// до того, как показано, что это узкое место
class ExpensiveOptimizedReport {
  #cache = new Map();
  #cacheTimestamps = new Map();

  async getStats(dateRange) {
    const key = `${dateRange.from}_${dateRange.to}`;

    // Сложный самописный кэш с инвалидацией
    const cached = this.#cache.get(key);
    const timestamp = this.#cacheTimestamps.get(key);
    if (cached && Date.now() - timestamp < 60_000) {
      return cached;
    }

    const data = await this.#fetchStats(dateRange);

    // Инвалидация по LRU (усложнение!)
    if (this.#cache.size > 100) {
      const oldest = [...this.#cacheTimestamps.entries()]
        .sort((a, b) => a[1] - b[1])[0][0];
      this.#cache.delete(oldest);
      this.#cacheTimestamps.delete(oldest);
    }

    this.#cache.set(key, data);
    this.#cacheTimestamps.set(key, Date.now());
    return data;
  }

  async #fetchStats({ from, to }) {
    // SELECT COUNT(*) FROM orders ...
    return { total: 42, revenue: 10500 };
  }
}

// ✅ Простое решение: сначала напиши понятный код,
// потом профилируй и кэшируй там, где нужно
class SimpleReport {
  async getStats(dateRange) {
    return this.#fetchStats(dateRange);
  }

  async #fetchStats({ from, to }) {
    return { total: 42, revenue: 10500 };
  }
}

// === Когда оптимизация ОПРАВДАНА ===
// Профилирование показало: getStats вызывается 10000 раз в минуту,
// запрос к БД занимает 200ms → нужен кэш.
// Используем готовое решение:

const NodeCache = require("node-cache");
class MeasuredReport {
  #cache;

  constructor() {
    // Готовый, протестированный кэш, а не самописный
    this.#cache = new NodeCache({ stdTTL: 60, maxKeys: 100 });
  }

  async getStats(dateRange) {
    const key = `${dateRange.from}_${dateRange.to}`;

    const cached = this.#cache.get(key);
    if (cached) return cached;

    const data = await this.#fetchStats(dateRange);
    this.#cache.set(key, data);
    return data;
  }

  async #fetchStats({ from, to }) {
    return { total: 42, revenue: 10500 };
  }
}
```

## Ссылки

- Donald Knuth: Structured Programming with go to Statements (ACM Computing Surveys, 1974)
- Martin Fowler: [Yet Another Optimization Article](https://martinfowler.com/articles/yetAnotherOptimizationArticle.html)


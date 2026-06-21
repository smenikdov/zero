# Soft-Coding (Чрезмерная конфигурируемость)

## Определение

Soft-coding — антипаттерн, противоположный hard-coding: вынос в конфигурацию (файлы, БД, переменные окружения) всего
подряд, включая бизнес-логику и контроль потока выполнения. Вместо читаемого кода получается система с распределённой по
конфигам логикой, которую невозможно понять без изучения всех конфигурационных файлов.

## Подробности

Здоровая практика: выносить в конфигурацию параметры среды (URL БД, порты, ключи API), настройки, которые различаются
между окружениями (dev/stage/prod), и тюнинг-параметры (размер пула соединений, таймауты).

Soft-coding — это когда в конфиги уходит бизнес-логика: правила валидации, порядок шагов пайплайна, формулы расчёта,
флаги фич, определяющие критически разное поведение. Это создаёт «систему внутри системы» — конфигурационный язык,
который по сути является плохо спроектированным языком программирования без отладчика, без проверки типов и без
нормального инструментария.

Признаки soft-coding:
- Явный if/else в коде, где каждая ветка — lookup в конфиг.
- Конфигурационные файлы с собственной условной логикой и ссылками.
- Бизнес-правила хранятся в БД в виде JSON/XML и «интерпретируются» на лету.

## Почему это проблема

- **Невидимость логики** — поведение системы распределено между кодом и десятками конфигурационных файлов.
- **Нет проверки на этапе компиляции/линта** — ошибка в конфиге обнаруживается только в рантайме.
- **Отладка — кошмар** — чтобы понять, почему сработала та или иная ветка, нужно собрать конфиг со всех слоёв.
- **Фальшивая гибкость** — изменение конфига часто требует деплоя или перезапуска, что ничем не отличается от изменения кода.
- **Умножение сущностей** — конфигурация порождает свой DSL, который рано или поздно потребует версионирования,
документации и тестов.

## Как найти баланс

Хорошая эвристика: конфигурация — это то, что **меняется между окружениями** или **настраивается пользователем без
участия разработчика**. Всё остальное — код.

- Параметры подключения → конфигурация ✅
- Таймауты, ретраи, лимиты → конфигурация ✅
- Правила валидации, бизнес-условия → код ✅
- Порядок шагов бизнес-процесса → код ✅

## Пример

```js
// ❌ Soft-coding: бизнес-логика в JSON-конфиге

// config/business-rules.json
{
  "orderValidation": {
    "minAmount": 100,
    "maxItems": 10,
    "allowedCategories": ["books", "electronics"],
    "rules": [
      {
        "condition": "order.total > 5000",
        "action": "requireApproval",
        "approver": "manager"
      },
      {
        "condition": "order.total > 1000 && order.category === 'electronics'",
        "action": "requirePhoneConfirmation"
      }
    ]
  }
}

// server.js
const config = require("./config/business-rules.json");

function validateOrder(order) {
  if (order.amount < config.orderValidation.minAmount) {
    throw new Error("Сумма слишком мала");
  }
  // "Интерпретатор" бизнес-правил из конфига...
  for (const rule of config.orderValidation.rules) {
    if (eval(rule.condition)) { // eval — ещё и опасно
      if (rule.action === "requireApproval") {
        order.status = "pending_approval";
      }
      // логика размазана между кодом и конфигом
    }
  }
}

// ✅ Бизнес-правила в коде, параметры — в конфиге
// config/app.json
{
  "database": { "host": "localhost", "port": 5432 },
  "orderLimits": { "minAmount": 100, "maxItems": 10 }
}

// business/order-validation.js
class OrderValidation {
  constructor({ minAmount, maxItems }) {
    this.minAmount = minAmount;
    this.maxItems = maxItems;
  }

  validate(order) {
    this.#checkMinAmount(order);
    this.#checkMaxItems(order);
    this.#checkHighValue(order);
    this.#checkElectronics(order);
  }

  #checkMinAmount(order) {
    if (order.total < this.minAmount) {
      throw new Error("Сумма заказа ниже минимальной");
    }
  }

  #checkMaxItems(order) {
    if (order.items.length > this.maxItems) {
      throw new Error("Слишком много позиций");
    }
  }

  #checkHighValue(order) {
    if (order.total > 5000) {
      order.requireApproval("manager"); // явный вызов метода
    }
  }

  #checkElectronics(order) {
    if (order.total > 1000 && order.category === "electronics") {
      order.requirePhoneConfirmation(); // читаемо, типизировано, отлаживаемо
    }
  }
}
```

## Ссылки

- The Daily WTF: [Soft Coding](https://thedailywtf.com/articles/soft_coding)
- Heidi Helfand: [Hard Coding vs. Soft Coding](https://www.youtube.com/watch?v=0ksd3oQBgFY)


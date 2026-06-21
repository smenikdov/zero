# Хардкодинг (Hard-Coding)

## Определение

Hard-Coding — практика встраивания данных напрямую в исходный код вместо использования констант, конфигурационных
файлов, переменных окружения или внешних источников. Значения, которые могут измениться (URL-адреса, таймауты,
ключи, пороги, строки), жёстко зашиваются в логику программы.

## Подробности

Хардкодинг не всегда зло: константы вроде `Math.PI`, фиксированные размеры буферов или литералы `0`, `1`, `-1` в проверках
границ допустимы, если они не изменятся при смене окружения, и если их смысл очевиден из контекста.

Проблема возникает, когда жёстко зашитое значение должно меняться между окружениями (dev/staging/prod), или когда его повторное
использование требует копирования, или когда оно лишено семантики и неочевидно для другого разработчика.

Признаки хардкодинга:
- В коде встречаются raw-строки с URL, путями к файлам, именами хостов.
- Числовые литералы, смысл которых неясен без комментария.
- Одинаковые значения разбросаны по нескольким файлам.
- Смена окружения требует правок в исходном коде, а не в конфигурации.

Частный случай — хардкодинг учётных данных (API-ключи, пароли) непосредственно в коде, что является критической уязвимостью
безопасности.

## Почему это проблема

- **Трудоёмкое переключение окружений** — для деплоя на staging/prod нужно менять код.
- **Дублирование** — одно и то же значение копируется в десятках мест; изменение требует правок везде.
- **Потеря семантики** — число `7` ничего не говорит; `MAX_LOGIN_ATTEMPTS` — говорит.
- **Риск ошибок** — легко пропустить одно из мест при изменении, что приводит к рассинхронизации.
- **Риск безопасности** — зашитые в коде токены, ключи и пароли попадают в репозиторий.

## Как избежать

- **Выносить изменяемые значения в конфигурацию** — `.env`, config-файлы, переменные окружения.
- **Именованные константы** — даже если значение не выносится в конфиг, дать ему осмысленное имя.
- **12-Factor App: Config** — рекомендует отделять конфигурацию от кода.
- **Default + override** — задавать значения по умолчанию в коде с возможностью переопределения через конфиг.
- **Никогда не хранить секреты в коде** — использовать vault-сервисы, CI/CD-переменные, `.env` (исключённый из git).

## Пример на JS

```js
// ❌ Хардкодинг
async function fetchUsers() {
  const res = await fetch("https://api.myapp.com/v1/users", {
    headers: { "X-API-Key": "sk-abc1234567890" },
    timeout: 5000,
  });
  return res.json();
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6; // что такое 0 и 6?
}

function calculateDiscount(price, userType) {
  if (userType === "vip") return price * 0.8;   // магическая скидка 20%
  if (userType === "regular") return price * 0.95;
  return price;
}

// ✅ Конфигурация и именованные константы
// .env
// API_BASE_URL=https://api.myapp.com/v1
// API_KEY=sk-abc1234567890
// REQUEST_TIMEOUT=5000

const SATURDAY = 6;
const SUNDAY = 0;

const DISCOUNT = {
  VIP: 0.2,
  REGULAR: 0.05,
} as const;

async function fetchUsers() {
  const res = await fetch(`${process.env.API_BASE_URL}/users`, {
    headers: { "X-API-Key": process.env.API_KEY },
    signal: AbortSignal.timeout(Number(process.env.REQUEST_TIMEOUT)),
  });
  return res.json();
}

function isWeekend(date) {
  const day = date.getDay();
  return day === SUNDAY || day === SATURDAY;
}

function calculateDiscount(price: number, userType: "vip" | "regular") {
  const discount = DISCOUNT[userType.toUpperCase()] ?? 0;
  return price * (1 - discount);
}
```

## Ссылки

- [12-Factor App: III. Config](https://12factor.net/config)
- Robert C. Martin: Clean Code (глава о значимых именах и константах)
- [Wikipedia: Hard coding](https://en.wikipedia.org/wiki/Hard_coding)

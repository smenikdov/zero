# Copy-Paste-Driven Development (Разработка через копипаст)

## Определение

Copy-Paste-Driven Development — «методология», при которой разработчик вместо выделения общей логики в переиспользуемую
функцию/модуль копирует блок кода и вносит минимальные правки. Кодовая база наполняется дубликатами, увеличивается в
объёме, и каждое изменение требует правки в десятках идентичных мест.

## Подробности

Копипаст — самый быстрый способ «решить» задачу здесь и сейчас. Разработчик находит похожий код, копирует, подправляет
пару параметров — готово. Проблема в том, что этот «быстрый» способ обходится экспоненциально дороже в долгосрочной
перспективе.

Причины копипаста:
- **Нехватка времени** — дедлайн горит, нет времени на рефакторинг.
- **Неуверенность** — разработчик боится сломать существующий код, если будет его обобщать.
- **Незнание DRY** — отсутствие привычки искать дублирование.
- **Разные владельцы** — команда A и команда B пишут одно и то же, не зная друг о друге.

Формы дублирования:
- **Буквальное** — идентичный код в нескольких местах.
- **Структурное** — разный код, но одинаковая логика (разные алгоритмы делают одно и то же).
- **Концептуальное** — разные части системы решают одну и ту же задачу независимо.

## Почему это проблема

- **Каскад исправлений** — баг в скопированной логике нужно фиксить в N местах.
- **Разрастание кодовой базы** — больше кода = больше багов = больше времени на поддержку.
- **Расхождение копий** — со временем копии мутируют по-разному, и объединить их становится невозможно.
- **Нарушение DRY** — каждое знание в системе должно иметь единственное представление.

## Как избежать

- **Правило трёх раз** — если код скопирован дважды, это нормально. На третий — выделяй в общую функцию.
- **DRY-рефакторинг** — регулярно просматривать код на предмет дублирования.
- **Линтеры** — `eslint-plugin-detect-duplicate`, jscpd (copy-paste detector).
- **Общие библиотеки** — выделять общий код в пакеты (монорепо: shared пакет в turborepo/nx).

## Пример на JS

```js
// ❌ Копипаст
function validateCreateUser(data) {
  const errors = [];
  if (!data.name || data.name.length < 2) {
    errors.push("Имя должно быть не короче 2 символов");
  }
  if (!data.email || !data.email.includes("@")) {
    errors.push("Некорректный email");
  }
  if (!data.password || data.password.length < 8) {
    errors.push("Пароль должен быть не короче 8 символов");
  }
  return errors;
}

function validateUpdateUser(data) {
  const errors = [];
  if (data.name && data.name.length < 2) {
    errors.push("Имя должно быть не короче 2 символов");
  }
  if (data.email && !data.email.includes("@")) {
    errors.push("Некорректный email");
  }
  if (data.password && data.password.length < 8) {
    errors.push("Пароль должен быть не короче 8 символов");
  }
  return errors;
}

function validateSignup(data) {
  const errors = [];
  if (!data.name || data.name.length < 2) {
    errors.push("Имя должно быть не короче 2 символов");
  }
  if (!data.email || !data.email.includes("@")) {
    errors.push("Некорректный email");
  }
  if (!data.password || data.password.length < 8) {
    errors.push("Пароль должен быть не короче 8 символов");
  }
  if (data.password !== data.passwordConfirmation) {
    errors.push("Пароли не совпадают");
  }
  return errors;
}

// ✅ DRY: выделение общей логики
const validators = {
  requiredString: (value, minLength, fieldName) => {
    if (!value || value.length < minLength) {
      return `${fieldName} должно быть не короче ${minLength} символов`;
    }
    return null;
  },
  optionalString: (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
      return `${fieldName} должно быть не короче ${minLength} символов`;
    }
    return null;
  },
  email: (value, required = true) => {
    if (required && !value) return "Email обязателен";
    if (value && !value.includes("@")) return "Некорректный email";
    return null;
  },
};

function collectErrors(checks) {
  const errors = [];
  for (const check of checks) {
    const error = check();
    if (error) errors.push(error);
  }
  return errors;
}

function validateCreateUser(data) {
  return collectErrors([
    () => validators.requiredString(data.name, 2, "Имя"),
    () => validators.email(data.email, true),
    () => validators.requiredString(data.password, 8, "Пароль"),
  ]);
}

function validateUpdateUser(data) {
  return collectErrors([
    () => validators.optionalString(data.name, 2, "Имя"),
    () => validators.email(data.email, false),
    () => validators.optionalString(data.password, 8, "Пароль"),
  ]);
}

function validateSignup(data) {
  return collectErrors([
    () => validators.requiredString(data.name, 2, "Имя"),
    () => validators.email(data.email, true),
    () => validators.requiredString(data.password, 8, "Пароль"),
    () => data.password !== data.passwordConfirmation
      ? "Пароли не совпадают"
      : null,
  ]);
}
```

## Ссылки

- Andrew Hunt, David Thomas: The Pragmatic Programmer (принцип DRY)
- Wikipedia: [Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)


# DI (Dependency Injection)

## Определение

Dependency Injection (внедрение зависимостей) — архитектурный паттерн, при котором объект получает свои зависимости
извне, а не создаёт их самостоятельно. Зависимости передаются через конструктор, метод или свойство. Это частный случай
инверсии контроля (IoC).

## Подробности

В традиционном коде объект сам управляет созданием своих зависимостей: `this.db = new MySQLConnection()`. Это жёсткая
связанность: чтобы заменить MySQL на Postgres, нужно менять код класса.

DI инвертирует ответственность: класс объявляет, что ему нужно, а кто-то снаружи (IoC-контейнер или Composition Root)
предоставляет готовые экземпляры.

**Три способа внедрения**:

1. **Constructor Injection** (рекомендуемый) — зависимости передаются в конструктор. Объект всегда в валидном состоянии
после создания.
2. **Setter/Property Injection** — зависимости выставляются через сеттеры. Используется для опциональных зависимостей.
3. **Method Injection** — зависимость передаётся аргументом одного метода. Когда зависимость нужна только в одном методе.

**IoC-контейнер** — библиотека, которая автоматически разрешает граф зависимостей. Он знает, как создавать объекты, и
рекурсивно подставляет нужные зависимости. Популярные контейнеры: InversifyJS, Awilix (Node.js), NestJS DI, Angular DI.

DI — ключевой механизм для реализации принципа инверсии зависимостей (D из SOLID) и построения гексагональной / чистой
архитектуры.

## Плюсы

- **Слабая связанность** — классы зависят от абстракций, а не конкретных реализаций.
- **Тестируемость** — легко подставить mock вместо реальной БД или API.
- **Централизованное управление** — жизненный цикл объектов и конфигурация в одном месте (Composition Root).
- **Заменяемость** — смена инфраструктуры не затрагивает бизнес-логику.

## Минусы

- **Усложнение кода** — больше интерфейсов, фабрик, «проводок».
- **Неявное поведение контейнера** — ошибки конфигурации контейнера проявляются в рантайме.
- **Порог входа** — новичкам трудно понять, откуда берутся зависимости.
- **Избыточно для малого** — в простом скрипте DI — переусложнение.

## Когда применять

- Средние и крупные проекты с множеством взаимозависимых компонентов.
- Системы с высокой потребностью в тестировании.
- Когда ожидается смена инфраструктурных компонентов (БД, платёжные шлюзы, API).

## Пример на JS

```js
// === Абстракции (порты) ===
class Logger {
  log(message) { throw new Error("Not implemented"); }
}

class Database {
  async query(sql) { throw new Error("Not implemented"); }
}

// === Конкретные реализации (адаптеры) ===
class ConsoleLogger extends Logger {
  log(message) { console.log(`[LOG] ${message}`); }
}

class PostgresDatabase extends Database {
  async query(sql) { return [{ id: 1, name: "Alice" }]; }
}

// === Ручное внедрение через конструктор ===
class UserService {
  constructor(database, logger) {
    this.database = database; // внедрено
    this.logger = logger;      // внедрено
  }

  async getUser(id) {
    this.logger.log(`Запрос пользователя ${id}`);
    const rows = await this.database.query(
      `SELECT * FROM users WHERE id = ${id}`
    );
    return rows[0];
  }
}

// === Composition Root (единственное место, где создаются зависимости) ===
const db = new PostgresDatabase();
const logger = new ConsoleLogger();
const userService = new UserService(db, logger);

userService.getUser(1);

// === Простой DI-контейнер (упрощённый) ===
class Container {
  #registrations = new Map();
  #instances = new Map();

  register(name, factory, dependencies = []) {
    this.#registrations.set(name, { factory, dependencies });
  }

  resolve(name) {
    if (this.#instances.has(name)) return this.#instances.get(name);

    const reg = this.#registrations.get(name);
    if (!reg) throw new Error(`Не найдено: ${name}`);

    const deps = reg.dependencies.map(d => this.resolve(d));
    const instance = reg.factory(...deps);
    this.#instances.set(name, instance);
    return instance;
  }
}

// Регистрируем
const container = new Container();
container.register("logger", () => new ConsoleLogger());
container.register("database", () => new PostgresDatabase());
container.register(
  "userService",
  (db, log) => new UserService(db, log),
  ["database", "logger"] // зависимости
);

const svc = container.resolve("userService");
svc.getUser(1);
```

## Ссылки

- [youtube](https://www.youtube.com/watch?v=f270BoTicMA)
- https://www.youtube.com/watch?v=DpMGEhwuuyA
- https://www.youtube.com/watch?v=yOC0e0NMZ-E
- https://www.youtube.com/watch?v=J1f5b4vcxCQ
- https://www.youtube.com/watch?v=CK_OY_gZrCE


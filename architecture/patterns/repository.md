# Repository (Репозиторий)

## Определение

Repository — архитектурный паттерн, предоставляющий коллекционноподобный интерфейс для доступа к данным. Репозиторий
скрывает детали хранения (SQL, NoSQL, файловая система, API) за единообразным интерфейсом, позволяя доменному слою
работать с данными, не зная о технологии хранения.

## Подробности

Паттерн описан Эриком Эвансом в книге Domain-Driven Design (2003) и Мартином Фаулером в Patterns of Enterprise
Application Architecture.

Репозиторий — это посредник между доменной моделью и слоем хранения данных. Для доменного кода репозиторий выглядит как
коллекция объектов в памяти:

```js
const user = await userRepo.findById(42);
const recentUsers = await userRepo.findBy({ active: true });
await userRepo.save(newUser);
await userRepo.delete(42);
```

Ключевые принципы:
- **Абстракция хранилища** — домен не знает, что под капотом: Postgres, MongoDB, REST API или in-memory массив.
- **Интерфейс в домене, реализация в инфраструктуре** — описание `UserRepository` живёт в доменном слое, а
`PostgresUserRepository` — в инфраструктурном.
- **Один репозиторий на агрегат** — в DDD у каждого корневого агрегата свой репозиторий.

Отличие от DAO (Data Access Object): DAO ориентирован на таблицу и содержит CRUD-операции плюс SQL-запросы. Repository
ориентирован на доменную модель, скрывает даже факт использования БД, не говоря уже о деталях SQL.

## Плюсы

- **Изоляция домена** — бизнес-логика не зависит от схемы БД и SQL.
- **Тестируемость** — in-memory репозиторий для тестов заменяет реальную БД.
- **Заменяемость хранилища** — смена MySQL на Postgres не трогает бизнес-логику.
- **Единый язык** — репозиторий говорит на языке домена: `findActiveUsers()`, а не `SELECT ... WHERE ...`.

## Минусы

- **Абстракция может протекать** — query-методы со сложной фильтрацией, спецификации приводят к сложным реализациям.
- **Потеря возможностей БД** — джойны, агрегации, оконные функции не всегда удобно мапить на методы репозитория.
- **Дополнительный слой** — для простого CRUD репозиторий — лишний код.

## Когда применять

- Domain-Driven Design — репозиторий обязательная часть тактического дизайна.
- Системы, где возможна смена технологии хранения.
- Сложная бизнес-логика, которая не должна зависеть от схемы БД.
- Проекты с высокими требованиями к тестированию.

## Пример на JS

```js
// === Доменный слой: интерфейс репозитория (порт) ===
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.activated = false;
  }

  activate() {
    if (this.activated) throw new Error("Уже активирован");
    this.activated = true;
  }
}

class UserRepository {
  async findById(id) { throw new Error("Not implemented"); }
  async save(user) { throw new Error("Not implemented"); }
  async delete(id) { throw new Error("Not implemented"); }
  async findByEmail(email) { throw new Error("Not implemented"); }
}

// === Доменный сервис (использует репозиторий через абстракцию) ===
class UserActivationService {
  constructor(userRepo) {
    this.userRepo = userRepo; // зависит от абстракции
  }

  async activateUser(id) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error("Пользователь не найден");

    user.activate();
    await this.userRepo.save(user);
    return user;
  }
}

// === Инфраструктурный слой: реализация репозитория (адаптер) ===
class PostgresUserRepository extends UserRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      "SELECT id, name, email, activated FROM users WHERE id = $1", [id]
    );
    if (rows.length === 0) return null;
    const u = new User(rows[0].id, rows[0].name, rows[0].email);
    u.activated = rows[0].activated;
    return u;
  }

  async save(user) {
    await this.pool.query(
      `INSERT INTO users (id, name, email, activated)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET name=$2, email=$3, activated=$4`,
      [user.id, user.name, user.email, user.activated]
    );
  }

  async delete(id) {
    await this.pool.query("DELETE FROM users WHERE id = $1", [id]);
  }

  async findByEmail(email) {
    const { rows } = await this.pool.query(
      "SELECT id, name, email, activated FROM users WHERE email = $1", [email]
    );
    return rows.length ? this.#hydrate(rows[0]) : null;
  }

  #hydrate(row) {
    const u = new User(row.id, row.name, row.email);
    u.activated = row.activated;
    return u;
  }
}

// === In-Memory репозиторий для тестов ===
class InMemoryUserRepository extends UserRepository {
  #storage = new Map();

  async findById(id) { return this.#storage.get(id) ?? null; }
  async save(user) { this.#storage.set(user.id, user); }
  async delete(id) { this.#storage.delete(id); }
  async findByEmail(email) {
    for (const u of this.#storage.values()) {
      if (u.email === email) return u;
    }
    return null;
  }
}

// === Использование ===
// const pool = new Pool({ ... });
// const repo = new PostgresUserRepository(pool);
// const service = new UserActivationService(repo);
// service.activateUser(42);
```

## Ссылки

- Eric Evans: Domain-Driven Design (книга, глава 6)
- Martin Fowler: [Repository](https://martinfowler.com/eaaCatalog/repository.html)


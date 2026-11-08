# Слоистая архитектура (Layered Architecture)

## Определение

Слоистая архитектура (Layered Architecture, n-layer) — архитектурный стиль, в котором приложение логически
разделяется на горизонтальные слои с чёткими обязанностями. Каждый слой знает только о слое ниже себя и общается с ним
через его публичный API. Классический вариант — Presentation → Business → Persistence → Database.

## Подробности

Слои — это **логическая** организация кода внутри приложения (часто внутри одного процесса). Их не следует путать с
уровнями (tiers): уровни описывают физическое размещение на машинах и процессах.

**Типичные слои** (сверху вниз):

1. **Presentation** — UI, HTTP-контроллеры, CLI. Принимает ввод, отдаёт ответ, не содержит бизнес-правил.
2. **Business / Application** — сценарии использования, валидация, оркестрация доменной логики.
3. **Persistence** — репозитории, ORM-маппинг, доступ к хранилищу.
4. **Database** — сама БД (или внешнее хранилище); иногда не выделяют как отдельный слой кода.

**Правило зависимостей** — классическое: зависимости направлены вниз. Presentation зависит от Business, Business — от
Persistence. Верхний слой не должен «перепрыгивать» через средний (например, контроллер не ходит в БД напрямую).

**Отличие от Onion / Clean / Hexagonal**: в слоистой архитектуре верхние слои зависят от нижних, включая инфраструктуру.
В Onion/Clean/Hexagonal зависимости разворачивают внутрь (к домену) через DIP: домен не зависит от БД и фреймворков.

Именно эту «классическую трёхслойку» (контроллер → сервис → репозиторий) обычно имеют в виду, когда сравнивают с
гексагональной и чистой архитектурой.

## Плюсы

- **Простота** — интуитивная модель, знакома большинству разработчиков.
- **Разделение обязанностей** — UI, логика и данные не смешиваются в одном месте.
- **Лёгкий старт** — хорошо подходит для CRUD и типовых корпоративных приложений.
- **Предсказуемая структура** — новый разработчик быстро находит, куда класть код.

## Минусы

- **Зависимость от инфраструктуры** — бизнес-слой часто протекает деталями ORM и БД.
- **Анемичная модель** — логика уезжает в сервисы, сущности становятся «мешками полей».
- **Жёсткость** — сквозные фичи трогают все слои сразу.
- **Соблазн shortcut'ов** — со временем слои начинают вызывать друг друга в обход правил.

## Когда применять

- Типовые CRUD/админ-системы без сложного домена.
- Небольшие и средние приложения, где важна скорость разработки.
- Команды, которым нужна понятная структура «из коробки», без портов и адаптеров.
- Как стартовая точка перед усложнением до Onion/Clean/Hexagonal, если домен разрастётся.

## Схема

```
┌─────────────────────────┐
│     Presentation        │  UI / Controllers
├─────────────────────────┤
│   Business / Application│  Use cases, rules
├─────────────────────────┤
│      Persistence        │  Repositories / ORM
├─────────────────────────┤
│       Database          │  Storage
└─────────────────────────┘
         ↓ зависит от
```

## Пример на JS

```js
// === Persistence ===
class UserRepository {
  #users = new Map();

  save(user) {
    this.#users.set(user.id, user);
    return user;
  }

  findByEmail(email) {
    return [...this.#users.values()].find(u => u.email === email) ?? null;
  }
}

// === Business ===
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  register(email, name) {
    if (!email.includes("@")) throw new Error("Некорректный email");
    if (this.userRepository.findByEmail(email)) {
      throw new Error("Пользователь уже существует");
    }

    const user = { id: crypto.randomUUID(), email, name };
    return this.userRepository.save(user);
  }
}

// === Presentation ===
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  create(req) {
    const user = this.userService.register(req.email, req.name);
    return { status: 201, body: user };
  }
}

// === Composition ===
const repo = new UserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

console.log(controller.create({ email: "a@b.c", name: "Ann" }));
```

## Ссылки

- Microsoft Docs: [Common web application architectures — Layered architecture](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)
- Martin Fowler: Patterns of Enterprise Application Architecture

# Божественный объект (God Object)

## Определение

God Object (Божественный объект) — класс или модуль, который знает слишком много и/или делает слишком много. Он нарушает
принцип единственной ответственности (SRP): управляет всем — от бизнес-логики до форматирования дат и отправки email.
Любое изменение системы требует правки God Object.

## Подробности

Другое название — «The Blob» (капля, которая поглощает всё). Возникает постепенно: начинается с удобного класса-утилиты
или «менеджера», которому добавляют метод за методом. Через год в классе 5000+ строк, 150 публичных методов, и никто не
знает, что половина из них делает.

Признаки God Object:
- Имя класса содержит `Manager`, `Handler`, `Processor`, `Context`, `Application`, `Utils`, `Helpers`.
- Класс имеет десятки разнородных зависимостей (БД, кэш, email, файловая система, HTTP-клиент).
- Методы класса оперируют разными уровнями абстракции: `calculateTaxes()` соседствует с `formatPhoneNumber()`.
- Изменение любой фичи требует правки этого класса.
- Класс невозможно покрыть тестами — слишком много зависимостей.

В антипаттерн God Object часто вырождаются ORM-модели (Active Record) и God-компоненты во фронтенде (один компонент
`App.jsx` на 2000 строк).

## Почему это проблема

- **Нарушение SRP** — множество причин для изменения в одном классе.
- **Merge-конфликты** — несколько разработчиков одновременно правят один файл.
- **Нечитаемость** — невозможно быстро понять, что делает класс.
- **Блокировка тестирования** — чтобы протестировать один метод, нужно замокать 10 зависимостей.

## Как избежать

- **SRP и ISP** — дробить на классы с одной ответственностью.
- **Декомпозиция по доменным сущностям** — вместо `OrderManager.createOrder()` и `OrderManager.cancelOrder()`, создать
`Order` как агрегат, `OrderService`, `OrderRepository`.
- **Избегать God-имен** — `*Manager`, `*Utils`, `*Helpers` — красные флаги.
- **Размер класса как метрика** — если класс > 300 строк, пора делить.

## Пример на JS

```js
// ❌ God Object
class ApplicationManager {
  constructor() {
    this.db = new Database();
    this.mailer = new Mailer();
    this.cache = new Cache();
    this.logger = new Logger();
  }

  // Бизнес-логика
  createUser(name, email) { /* ... */ }
  updateUser(id, data) { /* ... */ }

  // Отправка уведомлений
  sendWelcomeEmail(user) { /* ... */ }
  sendPasswordReset(email) { /* ... */ }

  // Форматирование
  formatPhone(phone) { /* ... */ }
  formatCurrency(amount) { /* ... */ }

  // Кэширование
  cacheUser(id, data) { /* ... */ }
  getCachedUser(id) { /* ... */ }

  // Логирование
  logAction(user, action) { /* ... */ }

  // Генерация отчётов
  generateSalesReport(from, to) { /* ... */ }

  // ... ещё 140 методов
}

// ✅ Разделение по ответственности
class UserService {
  constructor(userRepo, emailService) {
    this.userRepo = userRepo;
    this.emailService = emailService;
  }

  async registerUser(name, email) {
    const user = await this.userRepo.create({ name, email });
    await this.emailService.sendWelcome(user);
    return user;
  }
}

class EmailService {
  constructor(mailer, logger) {
    this.mailer = mailer;
    this.logger = logger;
  }

  async sendWelcome(user) {
    await this.mailer.send({
      to: user.email,
      subject: "Добро пожаловать!",
      body: `Привет, ${user.name}!`,
    });
    this.logger.log("welcome_email_sent", { userId: user.id });
  }
}

class SalesReport {
  constructor(db) {
    this.db = db;
  }

  async generate(from, to) {
    const data = await this.db.query(
      "SELECT ... FROM orders WHERE created_at BETWEEN $1 AND $2", [from, to]
    );
    return this.#buildReport(data);
  }

  #buildReport(data) { /* формирование структуры отчёта */ }
}

// Форматирование → чистые функции без зависимостей
function formatPhone(phone) {
  return phone.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, "+$1 ($2) $3-$4-$5");
}

function formatCurrency(amount, currency = "RUB") {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(amount);
}
```

## Ссылки

- Robert C. Martin: Clean Code (глава о SRP)
- William Brown et al.: [AntiPatterns: Refactoring Software, Architectures, and Projects in
Crisis](https://en.wikipedia.org/wiki/AntiPatterns)


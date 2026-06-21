# SOLID

## Определение

SOLID — пять принципов объектно-ориентированного дизайна, сформулированных Робертом Мартином («Дядюшка Боб»). Акроним
расшифровывается как: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation и Dependency
Inversion. Принципы помогают строить гибкие, расширяемые и поддерживаемые системы.

## S — Single Responsibility Principle (Принцип единственной ответственности)

Каждый модуль или класс должен иметь одну и только одну причину для изменения. Ответственность — это «ось изменения»:
если у класса две разных причины меняться, значит, у него две ответственности, и их нужно разделить.

**Почему это важно**: изменения в одной ответственности не должны ломать другую. Класс, отвечающий и за бизнес-логику, и
за форматирование отчёта, будет меняться при смене и правил расчёта, и шаблона отчёта.

```js
// ❌ Две ответственности: расчёт зарплаты и форматирование отчёта
class Employee {
  calculatePay() { /* ... */ }
  generateReport() { /* HTML-отчёт */ }
  saveToDatabase() { /* ... */ }
}

// ✅ Разделено
class PayCalculator {
  calculatePay(employee) { /* ... */ }
}

class EmployeeReport {
  generate(employee) { /* HTML */ }
}

class EmployeeRepository {
  save(employee) { /* БД */ }
}
```

## O — Open/Closed Principle (Принцип открытости/закрытости)

Программные сущности должны быть открыты для расширения, но закрыты для изменения. Существующий работающий код не должен
модифицироваться при добавлении новых возможностей — вместо этого мы расширяем поведение через новые классы.

**Почему это важно**: изменение существующего кода рискует внести баги. Расширение через новый код безопаснее и
позволяет добавлять функциональность параллельно.

```js
// ❌ Изменение существующего класса при каждом новом типе скидки
class DiscountCalculator {
  getDiscount(type, amount) {
    if (type === "loyalty") return amount * 0.1;
    if (type === "seasonal") return amount * 0.2;
    // Новый тип → меняем этот класс
  }
}

// ✅ Расширение через новые классы
class Discount {
  apply(amount) { throw new Error("Override"); }
}

class LoyaltyDiscount extends Discount {
  apply(amount) { return amount * 0.1; }
}

class SeasonalDiscount extends Discount {
  apply(amount) { return amount * 0.2; }
}

class BlackFridayDiscount extends Discount {
  apply(amount) { return amount * 0.5; }
}

class DiscountCalculator {
  getDiscount(discount, amount) {
    return discount.apply(amount);
  }
}

// Использование
const calc = new DiscountCalculator();
calc.getDiscount(new BlackFridayDiscount(), 1000); // 500
```

## L — Liskov Substitution Principle (Принцип подстановки Барбары Лисков)

Подклассы должны заменять родительские классы без изменения корректности программы. Если функция ожидает объект типа
`Base`, она должна корректно работать с любым подтипом `Base`, не зная о разнице.

**Почему это важно**: нарушение приводит к защитным проверкам `if (x instanceof SubClass)` и хрупкому коду, где
полиморфизм не работает.

```js
// ❌ Квадрат не может заменить прямоугольник без сюрпризов
class Rectangle {
  set width(w) { this._width = w; }
  set height(h) { this._height = h; }
  get area() { return this._width * this._height; }
}

class Square extends Rectangle {
  set width(w) { this._width = this._height = w; } // сюрприз: меняет и height
  set height(h) { this._width = this._height = h; }
}

function enlargeWidth(rect) {
  rect.width = rect.width * 2; // Для Square это неявно меняет и height
}

// ✅ LSP не нарушен — контракт ясен, или фигуры не наследуются друг от друга
class Shape {
  get area() { throw new Error("Override"); }
}

class ProperRectangle extends Shape {
  #width; #height;
  constructor(w, h) { super(); this.#width = w; this.#height = h; }
  set width(w) { this.#width = w; }
  set height(h) { this.#height = h; }
  get area() { return this.#width * this.#height; }
}

class ProperSquare extends Shape {
  #side;
  constructor(s) { super(); this.#side = s; }
  set side(s) { this.#side = s; }
  get area() { return this.#side ** 2; }
}
```

## I — Interface Segregation Principle (Принцип разделения интерфейса)

Много специализированных интерфейсов лучше одного общего. Клиенты не должны зависеть от методов, которые они не используют.

**Почему это важно**: «толстые» интерфейсы создают лишние зависимости и заставляют реализовывать ненужные методы,
заполняя их заглушками.

```js
// ❌ Один толстый интерфейс — все клиенты страдают
class Machine {
  print(doc) { throw new Error("Not implemented"); }
  scan(doc) { throw new Error("Not implemented"); }
  fax(doc) { throw new Error("Not implemented"); }
}

class OldPrinter extends Machine {
  print(doc) { /* ок */ }
  scan(doc) { throw new Error("Не умею!"); } // нарушение ISP
  fax(doc) { throw new Error("Не умею!"); }
}

// ✅ Тонкие, разделённые интерфейсы
class Printer {
  print(doc) { throw new Error("Not implemented"); }
}

class Scanner {
  scan(doc) { throw new Error("Not implemented"); }
}

class FaxMachine {
  fax(doc) { throw new Error("Not implemented"); }
}

class OldSimplePrinter extends Printer {
  print(doc) { /* только печать */ }
}

class MFP extends Printer {
  // Композиция вместо наследования (mixin или delegation)
  constructor() {
    super();
    this.scanner = new ActualScanner();
    this.fax = new ActualFaxMachine();
  }
  scan(doc) { return this.scanner.scan(doc); }
  fax(doc) { this.fax.fax(doc); }
}
```

## D — Dependency Inversion Principle (Принцип инверсии зависимостей)

Модули верхнего уровня не должны зависеть от модулей нижнего уровня. Оба должны зависеть от абстракций. Абстракции не
должны зависеть от деталей. Детали должны зависеть от абстракций.

**Почему это важно**: инвертирует традиционное направление зависимостей, делая высокоуровневую политику независимой от
низкоуровневых деталей. Легко заменить БД, платёжный шлюз, систему доставки уведомлений.

```js
// ❌ Высокоуровневый модуль зависит от низкоуровневого
class OrderService {
  constructor() {
    this.db = new MySQLDatabase();      // жёсткая зависимость
    this.mailer = new SMTPMailer();     // жёсткая зависимость
  }

  async placeOrder(order) {
    await this.db.save(order);
    await this.mailer.send(order.email, "Заказ оформлен");
  }
}

// ✅ Зависимости инвертированы через абстракции
class OrderService {
  constructor(database, notifier) {
    this.database = database;   // зависит от абстракции
    this.notifier = notifier;   // зависит от абстракции
  }

  async placeOrder(order) {
    await this.database.save(order);
    await this.notifier.send(order.email, "Заказ оформлен");
  }
}

// Детали реализуют абстракции
class MySQLDatabase {
  async save(data) { /* INSERT */ }
}

class PostgresDatabase {
  async save(data) { /* INSERT */ }
}

class EmailNotifier {
  async send(to, msg) { /* SMTP */ }
}

class PushNotifier {
  async send(to, msg) { /* Push */ }
}

// Составление в едином месте (Composition Root)
const service = new OrderService(
  new PostgresDatabase(),
  new EmailNotifier()
);
```

## SOLID в архитектуре

Принципы SOLID применимы не только к классам, но и к архитектурным модулям:

- **SRP** на уровне сервиса: микросервис должен иметь одну бизнес-причину для изменения.
- **OCP** на уровне архитектуры: плагинная система, middleware-пайплайны.
- **DIP** на уровне слоёв: Clean Architecture, гексагональная архитектура — все они основаны на инверсии зависимостей.

## Ссылки

- Robert C. Martin: Clean Architecture (книга)
- Robert C. Martin: [The Principles of OOD](http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod)
- Martin Fowler: [SOLID](https://martinfowler.com/bliki/SOLID.html)


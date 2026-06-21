# MVC (Model-View-Controller)

## Определение

MVC — архитектурный паттерн, разделяющий приложение на три слоя: Model (данные и бизнес-логика), View (представление),
Controller (обработка пользовательского ввода). Цель — отделить логику обработки данных от их отображения.

## Подробности

Паттерн впервые описан Трюгве Реенскаугом в 1979 году в контексте Smalltalk в Xerox PARC. Изначальная версия отличалась
от того, что сегодня понимают под MVC в веб-фреймворках.

**Классический MVC (Smalltalk)**:
- **Model** — хранит данные и бизнес-логику, уведомляет View об изменениях через паттерн Observer.
- **View** — отображает данные из Model, подписывается на изменения.
- **Controller** — принимает пользовательский ввод (клики, клавиши), модифицирует Model.

View и Controller образуют пару: для каждого View — свой Controller. View знает о Model (читает данные), Model НЕ знает
о View (только рассылает уведомления).

**Веб-MVC** (Rails, Django, Laravel):
- Model — ORM-сущности, бизнес-логика часто «протекает» в контроллеры.
- View — шаблоны (HTML, JSON).
- Controller — принимает HTTP-запрос, вызывает Model, выбирает View.

Ключевое отличие веб-MVC от классического: запрос-ориентированность. Каждый HTTP-запрос → контроллер → модель → view →
ответ. Нет долгоживущих связей Observer между Model и View.

## Плюсы

- **Разделение ответственности** — проще развивать и тестировать компоненты независимо.
- **Переиспользование Model** — одна логика может обслуживать разные представления (веб, мобильное API, CLI).
- **Распараллеливание разработки** — фронтенд и бэкенд могут работать независимо при чётком контракте.

## Минусы

- **Controller становится «мусоркой»** — разработчики часто сваливают в контроллер логику, которая должна быть в Model
или выделена в Service.
- **Сложность с асинхронностью** — классический MVC — синхронный; в современных приложениях Model часто асинхронна.
- **Переусложнение для простых экранов** — когда весь экран — одна таблица из БД, MVC избыточен.

## Когда применять

- Веб-приложения с нетривиальной логикой обработки данных.
- Проекты, где ожидается несколько представлений одной модели.
- Командная разработка с разделением фронтенда и бэкенда.

## Пример на JS (упрощённый веб-MVC с Express)

```js
// === Model ===
class TaskModel {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  getAll() { return [...this.tasks]; }

  create(title) {
    const task = { id: this.nextId++, title, done: false };
    this.tasks.push(task);
    return task;
  }

  toggle(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    return task;
  }

  delete(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}

// === Controller ===
class TaskController {
  constructor(model) {
    this.model = model;
  }

  list(req, res) {
    res.json(this.model.getAll());
  }

  create(req, res) {
    const task = this.model.create(req.body.title);
    res.status(201).json(task);
  }

  toggle(req, res) {
    const task = this.model.toggle(Number(req.params.id));
    if (!task) return res.status(404).json({ error: "Not found" });
    res.json(task);
  }

  delete(req, res) {
    this.model.delete(Number(req.params.id));
    res.status(204).end();
  }
}

// === Приложение (сборка) ===
const express = require("express");
const app = express();
app.use(express.json());

const model = new TaskModel();
const controller = new TaskController(model);

app.get("/tasks", (req, res) => controller.list(req, res));
app.post("/tasks", (req, res) => controller.create(req, res));
app.patch("/tasks/:id", (req, res) => controller.toggle(req, res));
app.delete("/tasks/:id", (req, res) => controller.delete(req, res));

app.listen(3000);
```

## Схема

```
Пользователь ──► Controller (обработка ввода)
                    │
                    ▼
                  Model (данные + логика)
                    │
                    ▼
                  View (шаблон/JSON)
```

## Ссылки

- Trygve Reenskaug: [The Model-View-Controller](https://folk.universitetetioslo.no/trygver/2007/MVC_Originals.pdf)
- Martin Fowler: [GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html)


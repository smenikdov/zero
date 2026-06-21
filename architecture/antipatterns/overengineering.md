# Оверинжиниринг (Overengineering)

## Определение

Оверинжиниринг — создание системы существенно более сложной, чем требуется
для решения поставленной задачи. Избыточные абстракции, фреймворки,
архитектурные слои и механизмы, которые не оправданы реальными требованиями
и лишь увеличивают стоимость разработки и поддержки.

## Подробности

Оверинжиниринг возникает не из злого умысла, а из лучших побуждений:
разработчик хочет «сделать правильно», «заложить на будущее», «как в гугле».
Проблема в том, что будущее часто не наступает, а сложность — здесь и сейчас.

Типичные проявления:

- **Фреймворк ради фреймворка** — подключение тяжёлого стейт-менеджера
  (Redux + Sagas) для формы из двух полей.
- **Микросервисы для MVP** — 12 сервисов и Kafka для приложения,
  у которого ещё нет пользователей.
- **Абстракции про запас** — интерфейс на каждый класс, фабрика фабрик,
  DI-контейнер для трёх зависимостей.
- **Перегрузка конфигурациями** — десятки переменных окружения
  и feature-флагов для функциональности, которая не менялась годами.
- **Полировка неважного** — неделя на выбор идеального naming convention
  или три дня на анимацию кнопки, которую никто не заметит.
- **Универсальные решения** — «движок правил», «гибкая система плагинов»,
  «конструктор отчётов» для задачи, которая решается 50 строками кода.

Корень проблемы — смещение фокуса с ценности для пользователя на
техническое совершенство. Инженер решает интересную техническую задачу,
а не бизнес-задачу.

Отличие от смежных антипаттернов:
- **Inner-Platform Effect** — частный случай: создание платформы
  внутри платформы.
- **Golden Hammer** — применение знакомого инструмента ко всему
  (оверинжиниринг — про избыточность, а не про неподходящий инструмент).
- **Premature Optimization** — частный случай: усложнение ради
  производительности без замеров.

## Почему это проблема

- **Затраты времени** — недели на архитектуру, которая не приносит
  ценности пользователю.
- **Сложность поддержки** — onboarding нового разработчика занимает
  месяцы из-за вычурной архитектуры.
- **Замедление итераций** — добавление простой фичи требует правок
  в 10 слоях абстракции.
- **Когнитивная нагрузка** — команда тратит ресурс на понимание
  архитектуры, а не домена.
- **Риск переписывания** — когда становится очевидно, что архитектура
  избыточна, проще переписать с нуля, чем упрощать.

## Как избежать

1. **YAGNI (You Ain't Gonna Need It)** — не добавляй функциональность
   или абстракцию, пока она не понадобилась прямо сейчас.
2. **Принцип простейшего работающего решения** — выбирай минимальную
   архитектуру, решающую задачу.
3. **Отложенные решения** — откладывай выбор технологии/архитектуры
   до момента, когда получишь больше информации.
4. **Правило трёх** — абстракция оправдана, когда один и тот же паттерн
   встретился трижды, а не упреждающе.
5. **Спрашивай «какую проблему это решает сейчас?»** — если ответ
   «возможно, пригодится потом» — не делай.

## Пример на JS

```js
// ❌ Оверинжиниринг: TODO-приложение как микросервисная экосистема
// Архитектура (для списка задач на одного пользователя):
// ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
// │ todo-api │ │ auth-svc │ │ analytix │ │  notify  │ │  search  │
// │  (REST)  │ │ (OAuth)  │ │ (Kafka)  │ │  (SMTP)  │ │ (Elastic)│
// └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
//
// + Docker Compose из 15 контейнеров, CI/CD для каждого,
//   мониторинг Prometheus + Grafana + ELK
//
// Реальная потребность: хранить список задач. 200 строк кода.

// ❌ Оверинжиниринг на уровне кода: абстракции про запас
interface ITodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: Priority;
  tags: Tag[];
  assignedTo?: User;
  dueDate?: Date;
}

interface ITodoRepository {
  findById(id: string): Promise<ITodoItem>;
  findAll(filter?: TodoFilter): Promise<ITodoItem[]>;
  save(item: ITodoItem): Promise<void>;
  delete(id: string): Promise<void>;
  findByStatus(status: TodoStatus): Promise<ITodoItem[]>;
}

class TodoFilter {
  constructor(
    public status?: TodoStatus,
    public priority?: Priority,
    public tags?: Tag[],
    public searchQuery?: string
  ) {}
}

class TodoService {
  constructor(
    private readonly repo: ITodoRepository,
    private readonly validator: TodoValidator,
    private readonly eventBus: IEventBus,
    private readonly logger: ILogger
  ) {}

  async createTodo(dto: CreateTodoDTO): Promise<ITodoItem> {
    this.logger.info("Creating todo", { dto });
    this.validator.validate(dto);

    const todo: ITodoItem = {
      id: crypto.randomUUID(),
      title: dto.title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: dto.priority ?? Priority.MEDIUM,
      tags: dto.tags ?? [],
    };

    await this.repo.save(todo);
    this.eventBus.emit("TodoCreated", todo);
    this.logger.info("Todo created", { id: todo.id });
    return todo;
  }

  async toggleTodo(id: string): Promise<ITodoItem> {
    const todo = await this.repo.findById(id);
    if (!todo) throw new TodoNotFoundError(id);

    todo.completed = !todo.completed;
    todo.updatedAt = new Date();

    await this.repo.save(todo);
    this.eventBus.emit(todo.completed ? "TodoCompleted" : "TodoReopened", todo);
    return todo;
  }

  // ... ещё 10 методов, 3 интерфейса, 5 DTO
}

// ✅ Решение, соразмерное задаче
class TodoApp {
  #todos = [];

  add(title) {
    if (!title?.trim()) throw new Error("Название обязательно");
    this.#todos.push({
      id: this.#todos.length + 1,
      title: title.trim(),
      done: false,
    });
  }

  toggle(id) {
    const todo = this.#todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  remove(id) {
    this.#todos = this.#todos.filter(t => t.id !== id);
  }

  get all() { return [...this.#todos]; }
  get active() { return this.#todos.filter(t => !t.done); }
  get done() { return this.#todos.filter(t => t.done); }
}

const app = new TodoApp();
app.add("Купить хлеб");
app.add("Написать тесты");
app.toggle(1);
console.log(app.active); // [{ id: 2, title: "Написать тесты", done: false }]
```

## Ссылки

- Extreme Programming: принцип YAGNI
- Kent Beck: Extreme Programming Explained
- Martin Fowler: [Is High Quality Software Worth the Cost?](https://martinfowler.com/articles/is-quality-worth-cost.html)

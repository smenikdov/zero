# MVP (Model-View-Presenter)

## Определение

MVP — производный от MVC архитектурный паттерн, где роль посредника выполняет Presenter. View делегирует всю логику
Presenter-у и остаётся «пассивной»: не читает Model напрямую, а получает готовые данные через Presenter. View и Model
полностью изолированы друг от друга.

## Подробности

MVP был популяризирован в 1990-х годах компанией Taligent (совместное предприятие IBM, Apple и HP). Существует две
основные разновидности:

**Passive View** — View предельно тонкая: только отображает то, что дал Presenter, и пересылает события обратно.
Presenter знает о View через интерфейс и полностью управляет её состоянием.

**Supervising Controller** — View может выполнять простую логику отображения (привязка данных), Presenter обрабатывает
сложные взаимодействия и координирует Model.

В MVP View и Presenter связаны взаимно (View вызывает Presenter, Presenter обновляет View через интерфейс). Model ничего
не знает ни о View, ни о Presenter.

Ключевое отличие от MVC: в MVP View не подписывается на изменения Model — Presenter явно обновляет View после изменений
в Model. Это делает MVP более предсказуемым и тестируемым ценой большей связанности View и Presenter.

## Плюсы

- **Отличная тестируемость** — View можно замокать через интерфейс, Presenter тестируется изолированно.
- **Тонкая View** — вся логика в Presenter, View легко заменить (например, сменить UI-фреймворк).
- **Явный поток данных** — Presenter явно проталкивает данные, нет скрытых связей Observer.

## Минусы

- **Двусторонняя связь** — View знает о Presenter, Presenter знает о View. Больше кода для поддержки.
- **Presenters быстро раздуваются** — вся логика экрана в одном классе.
- **Много boilerplate** — интерфейс View, Presenter, модель — для каждого экрана.

## Когда применять

- Приложения, где тестирование критично, а View сложна (много состояний, условного отображения).
- Миграция между UI-фреймворками (замена Swing на JavaFX, jQuery на React).
- Android-разработка — MVP был де-факто стандартом до появления MVVM и Jetpack Compose.

## Пример на JS

```js
// === Model ===
class UserModel {
  async getUser(id) {
    // Имитация запроса к API
    return { id, name: "Alice", email: "alice@example.com" };
  }
}

// === View Interface (контракт) ===
class UserView {
  showUser(user) { throw new Error("Not implemented"); }
  showError(message) { throw new Error("Not implemented"); }
  showLoading() { throw new Error("Not implemented"); }
  hideLoading() { throw new Error("Not implemented"); }
}

// === Presenter ===
class UserPresenter {
  constructor(view, model) {
    this.view = view;
    this.model = model;
  }

  async loadUser(id) {
    this.view.showLoading();
    try {
      const user = await this.model.getUser(id);
      this.view.showUser(user); // Presenter явно проталкивает данные
    } catch (e) {
      this.view.showError(e.message);
    } finally {
      this.view.hideLoading();
    }
  }
}

// === Конкретная View (DOM) ===
class DOMUserView extends UserView {
  constructor() {
    super();
    this.el = document.getElementById("user-profile");
  }

  showUser(user) {
    this.el.innerHTML = `<h2>${user.name}</h2><p>${user.email}</p>`;
  }

  showError(msg) {
    this.el.innerHTML = `<p class="error">${msg}</p>`;
  }

  showLoading() { this.el.innerHTML = "<p>Загрузка...</p>"; }
  hideLoading() { /* скрыть спиннер */ }
}

// === Сборка и использование ===
const view = new DOMUserView();
const model = new UserModel();
const presenter = new UserPresenter(view, model);

document.getElementById("btn-load").addEventListener("click", () => {
  presenter.loadUser(42);
});

// === Тест Presenter-а ===
class TestUserView extends UserView {
  constructor() {
    super();
    this.displayedUser = null;
    this.errorMessage = null;
  }
  showUser(user) { this.displayedUser = user; }
  showError(msg) { this.errorMessage = msg; }
  showLoading() { /* noop */ }
  hideLoading() { /* noop */ }
}

// const testView = new TestUserView();
// const presenter = new UserPresenter(testView, new UserModel());
// await presenter.loadUser(1);
// assert(testView.displayedUser.name === "Alice");
```

## Ссылки

- Martin Fowler: [GUI Architectures](https://martinfowler.com/eaaDev/uiArchs.html) — раздел о MVP
- Taligent: [MVP original paper](https://web.archive.org/web/20150412164004/http://www.wildcrest.com/Potel/Portfolio/mvp.pdf)


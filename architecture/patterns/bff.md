# BFF (Backend For Frontend)

## Определение

BFF — архитектурный паттерн, при котором для каждого типа клиента (мобильное приложение, веб-SPA, IoT-устройство,
стороннее API) создаётся отдельный бэкенд-слой. Этот слой адаптирует общие сервисы под специфические нужды конкретного
фронтенда: агрегирует данные, оптимизирует payload, обрабатывает особенности аутентификации.

## Подробности

Паттерн описан Сэмом Ньюманом в книге Building Microservices (2015) и позже развит в Patterns of Microservices. BFF
возник как решение проблемы «универсального API Gateway», который пытается обслужить все типы клиентов и быстро
становится перегруженным специфичной для клиентов логикой.

Проблема универсального API:
- Мобильному приложению нужны сжатые данные (мало трафика) и агрегированные ответы (меньше запросов).
- Веб-SPA может делать много параллельных запросов, но нуждается в детальной модели.
- IoT-устройство отправляет телеметрию пачками и почти не читает.
- Все три клиента вынуждены работать с одним API, который либо раздут, либо неудобен каждому.

Решение: отдельный BFF для каждого канала.

**Пример**: единый сервис заказов отдаёт детальные сущности. Мобильный BFF агрегирует их в плоский список для экрана
320px, веб-BFF отдаёт развёрнутые карточки товаров, BFF партнёрского API добавляет информацию о комиссии.

BFF тесно связан с конкретным фронтендом, часто разрабатывается той же командой. Это НЕ общий API Gateway — он
специфичен и не должен использоваться другими клиентами.

## Плюсы

- **Оптимизация под клиента** — каждый BFF отдаёт именно то, что нужно его клиенту.
- **Изоляция изменений** — изменение формата для мобилки не ломает веб и наоборот.
- **Разделение команд** — мобильная команда владеет своим BFF, веб — своим.
- **Безопасность** — можно применять разные политики аутентификации для разных каналов.

## Минусы

- **Дублирование** — агрегации и трансформации могут повторяться между BFF.
- **Больше сервисов** — каждый BFF нужно деплоить, мониторить, поддерживать.
- **Риск раздувания** — BFF превращается в монолит с бизнес-логикой.
- **Координация** — общие изменения в нижележащих сервисах требуют обновления всех BFF.

## Когда применять

- Разные клиенты с существенно разными требованиями к API (мобилка vs веб vs IoT).
- Микросервисная архитектура, где нижележащие сервисы не оптимизированы под конкретные UI.
- Команды, организованные по каналам (mobile squad, web squad), а не по слоям.

## Пример на JS

```js
// === Общий сервис заказов (не привязан к конкретному UI) ===
function createOrderService() {
  return {
    async getOrder(id) {
      return {
        id,
        items: [
          { productId: 1, name: "Книга", price: 500, qty: 2 },
          { productId: 2, name: "Ручка", price: 50, qty: 1 },
        ],
        status: "shipped",
        createdAt: "2024-03-15T10:00:00Z",
        delivery: {
          address: "ул. Ленина, 1",
          eta: "2024-03-18",
          tracking: "TRACK-123-RU",
          courierPhone: "+7-999-123-45-67",
        },
      };
    },
  };
}

// === Мобильный BFF (минимум данных) ===
function createMobileBFF(orderService) {
  const express = require("express");
  const app = express();

  app.get("/api/mobile/orders/:id", async (req, res) => {
    const order = await orderService.getOrder(req.params.id);

    // Мобилке нужно компактно: только то, что на экране
    const mobileView = {
      id: order.id,
      status: order.status,
      total: order.items.reduce((s, i) => s + i.price * i.qty, 0),
      eta: order.delivery.eta,
    };
    res.json(mobileView);
  });

  return app;
}

// === Веб-BFF (полноценная детализация) ===
function createWebBFF(orderService) {
  const express = require("express");
  const app = express();

  app.get("/api/web/orders/:id", async (req, res) => {
    const order = await orderService.getOrder(req.params.id);

    // Вебу нужно всё, включая подробную карточку товаров и доставку
    const webView = {
      ...order,
      items: order.items.map(i => ({
        ...i,
        subtotal: i.price * i.qty,
        thumbnail: `/images/products/${i.productId}.jpg`, // веб-BFF добавляет ссылки
      })),
      delivery: {
        ...order.delivery,
        trackingUrl: `https://tracking.dhl.com/?code=${order.delivery.tracking}`,
      },
      _links: {
        self: `/orders/${order.id}`,
        cancel: `/orders/${order.id}/cancel`,
      },
    };
    res.json(webView);
  });

  return app;
}

// === IoT BFF (телеметрия, бинарный протокол) ===
function createIoTBFF(orderService) {
  const express = require("express");
  const app = express();

  app.get("/api/iot/orders/:id", async (req, res) => {
    const order = await orderService.getOrder(req.params.id);

    // IoT-устройству нужно только то, что влияет на складскую логистику
    const iotView = {
      id: order.id,
      status: order.status,
      itemIds: order.items.map(i => i.productId),
      eta: order.delivery.eta,
    };
    res.json(iotView);
  });

  return app;
}

// === Запуск BFF на разных портах ===
// createMobileBFF(createOrderService()).listen(3001);
// createWebBFF(createOrderService()).listen(3002);
// createIoTBFF(createOrderService()).listen(3003);
```

## Схема

```
Мобильное приложение ──► Mobile BFF (:3001) ──┐
                                               │
Веб-SPA ───────────────► Web BFF (:3002) ──────┼──► Order Service
                                               │
IoT устройство ────────► IoT BFF (:3003) ──────┘
```

## Ссылки

- Sam Newman: Building Microservices & Patterns of Microservices
- Phil Calçado: [The BFF Pattern](https://samnewman.io/patterns/architectural/bff/)


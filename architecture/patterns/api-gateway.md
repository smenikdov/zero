# API Gateway

## Определение

API Gateway — архитектурный паттерн, в котором единая точка входа (шлюз) принимает все запросы от клиентов и
маршрутизирует их к соответствующим микросервисам. Шлюз берёт на себя кросс-функциональные задачи: аутентификацию,
агрегацию ответов, трансформацию протоколов, rate limiting и логирование.

## Подробности

В микросервисной архитектуре клиенту может потребоваться обратиться к десяткам сервисов с разными протоколами (REST,
gRPC, WebSocket, GraphQL), адресами и форматами ответов. API Gateway решает эту проблему, предоставляя клиентам
уникальный и предсказуемый API.

Основные функции API Gateway:

1. **Маршрутизация** — диспетчеризация запросов на основе пути, заголовков, метода HTTP.
2. **Агрегация** — один клиентский запрос может требовать данных из нескольких сервисов; шлюз собирает ответы и
возвращает объединённый результат.
3. **Аутентификация** — проверка токенов на входе, проксирование identity в сервисы.
4. **Трансформация** — преобразование между протоколами (внешний REST → внутренний gRPC).
5. **Мониторинг и логирование** — единая точка сбора метрик, трейсинга и логов.
6. **Rate limiting, кэширование, CORS** — кросс-функциональные политики.

Варианты реализации: Backend For Frontend (BFF) — отдельный шлюз под каждый тип клиента (мобилка, веб, IoT); общий API
Gateway — один шлюз для всех клиентов; комбинированный подход.

## Плюсы

- **Единая точка входа** — клиентам не нужно знать топологию внутренних сервисов.
- **Упрощение клиентской логики** — аутентификация, агрегация и ретраи переносятся на шлюз.
- **Безопасность** — сервисы могут быть скрыты от внешней сети, доступ только через шлюз.
- **Смена протоколов** — gRPC для внутреннего общения, REST для внешнего.

## Минусы

- **Единая точка отказа** — падение шлюза отключает все сервисы.
- **Бутылочное горлышко** — весь трафик проходит через шлюз.
- **Риск раздувания** — на шлюз сваливают бизнес-логику, превращая его в монолит агрегации.
- **Задержка** — лишний сетевой hop.

## Когда применять

- Микросервисная система с большим количеством сервисов.
- Разные типы клиентов с разными требованиями к API (мобильное приложение, SPA, партнёры).
- Необходимость скрыть внутреннюю архитектуру от внешнего мира.
- Нужны общие политики безопасности на периметре.

## Пример на JS (упрощённый gateway)

```js
const http = require("http");

const services = {
  orders: "http://localhost:3001",
  users: "http://localhost:3002",
  inventory: "http://localhost:3003",
};

// Агрегированная функция: собрать заказ + информацию о пользователе
async function aggregateOrderDetails(orderId) {
  const orderRes = await fetch(`${services.orders}/orders/${orderId}`);
  const order = await orderRes.json();

  const userRes = await fetch(`${services.users}/users/${order.userId}`);
  const user = await userRes.json();

  const stockRes = await Promise.all(
    order.items.map(item =>
      fetch(`${services.inventory}/stock/${item.productId}`)
        .then(r => r.json())
    )
  );

  return {
    ...order,
    user: { id: user.id, name: user.name },
    items: order.items.map((item, i) => ({
      ...item,
      inStock: stockRes[i].available,
    })),
  };
}

// Gateway
const server = http.createServer(async (req, res) => {
  // Аутентификация
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.writeHead(401);
    return res.end(JSON.stringify({ error: "Unauthorized" }));
  }

  // Маршрутизация + агрегация
  const orderMatch = req.url.match(/^\/api\/orders\/(\d+)$/);

  if (orderMatch) {
    try {
      const data = await aggregateOrderDetails(orderMatch[1]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(502);
      res.end(JSON.stringify({ error: "Bad Gateway", detail: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(8080, () => console.log("API Gateway на :8080"));
```

## Схема

```
Клиент ──► API Gateway (:8080) ──► Orders (:3001)
                            │
                            ├──► Users (:3002)
                            │
                            └──► Inventory (:3003)
```

## Ссылки

- Chris Richardson: [Microservices Patterns — API Gateway](https://microservices.io/patterns/apigateway.html)
- NGINX: [API Gateway use cases](https://www.nginx.com/learn/api-gateway/)
- Kong, KrakenD, Envoy, Traefik — популярные реализации


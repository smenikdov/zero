# Serverless (Бессерверная архитектура)

## Определение

Serverless — архитектурный стиль, при котором разработчик пишет и деплоит функции, а облачный провайдер (AWS, GCP,
Azure) управляет серверами, масштабированием и жизненным циклом. Код выполняется только в ответ на события и
оплачивается по факту использования, а не за аренду серверов.

## Подробности

Название «бессерверная» не означает отсутствия серверов — они есть, но разработчик ими не управляет. Основные категории:

**FaaS (Function as a Service)** — модель, где код организован в функции, каждая из которых реагирует на триггер:
- HTTP-запрос (AWS Lambda + API Gateway, Cloud Functions + Firebase Hosting)
- Сообщение в очереди (SQS, Pub/Sub)
- Изменение данных (DynamoDB Streams, Firestore события)
- Cron/расписание (CloudWatch Events, Cloud Scheduler)
- Файл в хранилище (S3 upload → Lambda обработка изображения)

**BaaS (Backend as a Service)** — облачные сервисы, заменяющие бэкенд:
- Аутентификация: Firebase Auth, Auth0, Cognito
- Базы данных: Firebase Firestore, DynamoDB, FaunaDB
- Хранилище файлов: S3, Cloud Storage
- API Gateway: AWS API Gateway, Google Cloud Endpoints

**Характеристики FaaS**:
- **Stateless** — каждое выполнение функции независимо, состояние во внешних сервисах (БД, кэш).
- **Краткосрочность** — функции имеют таймаут (обычно до 15 мин на AWS).
- **Автомасштабирование** — провайдер создаёт экземпляры по мере роста нагрузки, включая ноль.
- **Cold start** — если функция долго не вызывалась, первый вызов медленнее из-за инициализации среды.

## Плюсы

- **Нулевая стоимость простоя** — платишь только за выполнение. Нет запросов → нет счёта.
- **Автоматическое масштабирование** — от 0 до тысяч параллельных выполнений без настройки.
- **Минимум операционной работы** — не нужно управлять серверами, ОС, патчами.
- **Быстрый старт** — деплой одной функции занимает минуты.

## Минусы

- **Cold start** — задержка при первом вызове или после периода неактивности.
- **Привязка к провайдеру** — функции завязаны на конкретный облачный API (AWS, GCP, Azure).
- **Ограничения среды** — фиксированные рантаймы, таймауты, память, payload size.
- **Сложность отладки** — распределённый трейсинг нужен, чтобы понять цепочку вызовов.
- **Стоимость на большом масштабе** — при высокой и стабильной нагрузке serverless может быть дороже выделенных серверов.

## Когда применять

- Эпизодическая нагрузка (отчёты, batch-обработка, cron).
- Прототипы, MVP — быстрый старт без инфраструктуры.
- Обработка событий (загрузка фото → создание миниатюр, webhooks).
- API с неравномерной нагрузкой (ночные/дневные пики).

## Пример на JS (AWS Lambda стиль)

```js
// === Функция для AWS Lambda: создание заказа ===
// Структура serverless-приложения (одна функция = один файл):
// functions/
//   create-order.js
//   get-order.js
//   process-payment.js  // триггер: сообщение в SQS

// --- create-order.js ---
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.ORDERS_TABLE;

exports.handler = async (event) => {
  // event — HTTP-запрос от API Gateway
  const { items } = JSON.parse(event.body);

  // Валидация на входе
  if (!items || items.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Заказ не может быть пустым" }),
    };
  }

  const order = {
    id: event.requestContext.requestId, // уникальный ID от API Gateway
    items,
    status: "created",
    createdAt: new Date().toISOString(),
  };

  // Сохранение в DynamoDB (state через внешний сервис)
  await client.send(new PutCommand({
    TableName: TABLE,
    Item: order,
  }));

  return {
    statusCode: 201,
    body: JSON.stringify(order),
  };
};

// --- process-payment.js (триггер: SQS-сообщение) ---
exports.handler = async (event) => {
  for (const record of event.Records) {
    const { orderId, amount } = JSON.parse(record.body);

    // Обработка платежа
    console.log(`Платёж на сумму ${amount} по заказу ${orderId}`);

    // Обновление статуса в БД (упрощённо)
    await client.send(new UpdateCommand({
      TableName: process.env.ORDERS_TABLE,
      Key: { id: orderId },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": "paid" },
    }));
  }
};

// === Локальная эмуляция функции для отладки ===
if (require.main === module) {
  const mockEvent = {
    body: JSON.stringify({ items: [{ name: "Книга", price: 500 }] }),
    requestContext: { requestId: "local-test-1" },
  };
  exports.handler(mockEvent).then(console.log);
}
```

## Ссылки

- AWS Lambda, Google Cloud Functions, Azure Functions — документация
- Martin Fowler: [Serverless Architectures](https://martinfowler.com/articles/serverless.html)
- Serverless Framework: [serverless.com](https://www.serverless.com/)


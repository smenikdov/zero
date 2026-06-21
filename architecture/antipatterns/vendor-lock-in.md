# Зависимость от вендора (Vendor Lock-In)

## Определение

Vendor Lock-In — ситуация, при которой система настолько сильно привязана к конкретному поставщику (облачному
провайдеру, проприетарной технологии, SDK), что миграция на альтернативу становится непомерно дорогой или технически
невозможной. Зависимость не всегда плоха, но она должна быть осознанным выбором с оценкой рисков и стратегией выхода.

## Подробности

Привязка к вендору — это спектр, а не бинарное состояние. Уровни lock-in:

1. **Данные** — ваши данные в проприетарном формате, из которого нет экспорта.
2. **API/SDK** — код насыщен вызовами проприетарного SDK, альтернативе нужно переписывать всю интеграцию.
3. **Инфраструктура** — архитектура использует уникальные облачные сервисы (AWS Lambda, DynamoDB, SQS), миграция в
другое облако требует перепроектирования.
4. **Бизнес-процессы и контракты** — вендор встроен в операционные процессы, контракт на годы, штрафы за выход.

Облачные провайдеры сознательно создают lock-in через проприетарные сервисы: AWS Lambda проще, чем Kubernetes, но
миграция с Lambda на GCP Cloud Functions — это переписывание. DynamoDB с on-demand scaling удобнее Postgres, но при
миграции вы теряете этот уник.

Не всякий lock-in плох. Если вы стартап, скорость важнее портабельности — используйте managed сервисы. Но к моменту,
когда портабельность станет важна, вы должны иметь стратегию.

## Почему это проблема

- **Рост цен** — вендор знает, что вы привязаны, и поднимает тарифы.
- **Прекращение поддержки** — вендор закрывает продукт/API, на котором у вас всё построено.
- **Отсутствие портабельности** — нельзя перенести часть нагрузки в другое облако.
- **Ограничение инноваций** — вы не можете использовать технологии, которые вендор не поддерживает.

## Как избежать (снизить риски)

1. **Абстракция через порты и адаптеры** — бизнес-логика не зависит от конкретного облачного SDK.
2. **Стандарты и open-source** — Postgres вместо DynamoDB, Kubernetes вместо ECS/Fargate, OpenTelemetry вместо CloudWatch.
3. **Мультиоблачная стратегия** (только если оправдана масштабом) — распределять нагрузку между провайдерами.
4. **Регулярный экспорт данных** — всегда иметь возможность выгрузить свои данные в открытом формате.
5. **Оценка стоимости миграции** — провести PoC миграции, понять реальную цену.

## Пример на JS

```js
// ❌ Прямая привязка к AWS SDK во всей кодовой базе
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const s3 = new S3Client({ region: "us-east-1" });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const sqs = new SQSClient({});

class OrderService {
  async placeOrder(order) {
    // Сохранить в DynamoDB
    await ddb.send(new PutCommand({
      TableName: "orders",
      Item: { id: order.id, ...order },
    }));

    // Сохранить чек в S3
    await s3.send(new PutObjectCommand({
      Bucket: "receipts",
      Key: `${order.id}.json`,
      Body: JSON.stringify(order),
    }));

    // Отправить событие в SQS
    await sqs.send(new SendMessageCommand({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/123/orders-queue",
      MessageBody: JSON.stringify({ type: "OrderPlaced", orderId: order.id }),
    }));

    return order;
  }
}

// ✅ Абстракция через порты — бизнес-логика не знает о провайдере
class StoragePort {
  async save(key, data) { throw new Error("Not implemented"); }
}

class DatabasePort {
  async save(collection, item) { throw new Error("Not implemented"); }
}

class MessageQueuePort {
  async publish(topic, message) { throw new Error("Not implemented"); }
}

// Бизнес-логика — чистая, без привязки к вендору
class OrderService {
  constructor(storage, database, messageQueue) {
    this.storage = storage;
    this.database = database;
    this.messageQueue = messageQueue;
  }

  async placeOrder(order) {
    await this.database.save("orders", order);
    await this.storage.save(`receipts/${order.id}.json`, JSON.stringify(order));
    await this.messageQueue.publish("orders", { type: "OrderPlaced", orderId: order.id });
    return order;
  }
}

// === AWS-адаптеры (один из возможных провайдеров) ===
class S3Storage extends StoragePort {
  constructor(bucket) { super(); this.bucket = bucket; this.s3 = new S3Client({}); }
  async save(key, data) {
    await this.s3.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: data }));
  }
}

class DynamoDBDatabase extends DatabasePort {
  constructor() { super(); this.ddb = DynamoDBDocumentClient.from(new DynamoDBClient({})); }
  async save(table, item) {
    await this.ddb.send(new PutCommand({ TableName: table, Item: item }));
  }
}

class SQSPubSub extends MessageQueuePort {
  constructor(queueUrl) { super(); this.queueUrl = queueUrl; this.sqs = new SQSClient({}); }
  async publish(topic, message) {
    await this.sqs.send(new SendMessageCommand({ QueueUrl: this.queueUrl, MessageBody: JSON.stringify(message) }));
  }
}

// === GCP-адаптеры (альтернативный провайдер) ===
class CloudStorage extends StoragePort {
  constructor(bucket) { super(); this.bucket = this.#getBucket(bucket); }
  async save(key, data) {
    await this.bucket.file(key).save(data);
  }
  #getBucket(name) { /* GCS bucket init */ }
}
// ... и так для Firestore, PubSub

// Миграция с AWS на GCP — меняем адаптеры, бизнес-логика не трогается.
```

## Ссылки

- Martin Fowler: [Vendor Lock-In](https://martinfowler.com/articles/oss-lockin.html)
- Gregor Hohpe: Cloud Strategy (книга)


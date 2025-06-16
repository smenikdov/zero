## Основные виды JOIN
- `INNER JOIN`
- `LEFT JOIN (LEFT OUTER JOIN)`
- `RIGHT JOIN (RIGHT OUTER JOIN)`
- `FULL JOIN (FULL OUTER JOIN)`
- `CROSS JOIN`
- `NATURAL JOIN`


## Основные объединяющие операторы
- `UNION`          | все строки из обоих запросов
- `UNION ALL`      |
- `INTERSECT`      | только общие строки
- `INTERSECT ALL`  |
- `EXCEPT`         | строки из 1-го, отсутствующие во 2-ом
- `EXCEPT ALL`     |


## Операторы для работы с массивом и списком данных
- `ALL`  | Проверяет, выполняется ли условие для всех значение в наборе
- `ANY`  | Проверяет, выполняется ли условие хотя бы для одного значения в наборе
- `SOME` | Синоним ANY
- `IN`   | Проверяет присутствует ли значение в наборе 


## Прочие команды
- `INNER JOIN documents USING (document_id)`                                  | короткая запись JOIN, когда ключи в таблицах имеют одинаковое название
- `WHERE EXISTS(SLECT 1 FROM ORDERS WHERE orders.customer_id = customers.id)` | проверяет, возвращает ли подзапрос какие либо строки
- `TO_CHAR("date", 'YYYY-MM-DD') AS "date"`                                   | меняет формат даты
- `COALESCE(SUM("amount"), 0) AS "amount"`                                    | проверка на NULL
- `SUM(sd."dutySum" - sd."dutySumReturned") FILTER (WHERE sd."dutyIsActive") AS "dutySum"`
- `ARRAY_AGG(
       JSON_BUILD_OBJECT(
           'boUnhandledStatus', bousc."boUnhandledStatus",
           'createDate', bousc."createDate"
       )
       ORDER BY bousc."createDate"
   ) AS "statusHistory"`
- ``


## Функции для работы со строками
1. Конкатенация строк
`||` Оператор конкатенации строк
`CONCAT(str1, str2, ...)` Объединяет строки, игнорируя NULL
`CONCAT_WS(separator, str1, str2, ...)` Объединяет строки с указанным разделителем, игнорируя NULL

2. Изменение регистра
`LOWER(str)` Преобразует строку в нижний регистр
`UPPER(str)` Преобразует строку в верхний регистр
`INITCAP(str)` Делает первую букву каждого слова заглавной

3. Извлечение и обрезка
`LENGTH(str)` Возвращает длину строки
`CHAR_LENGTH(str)` Синоним для LENGTH
`SUBSTRING(str FROM start FOR length)` Извлекает подстроку
`LEFT(str, n)` Возвращает первые n символов
`RIGHT(str, n)` Возвращает последние n символов
`TRIM([BOTH | LEADING | TRAILING] chars FROM str)` Удаляет указанные символы с начала, конца или обеих сторон строки
`BTRIM(str, chars)` Удаляет символы с начала и конца
`LTRIM(str, chars)` Удаляет символы только с начала
`RTRIM(str, chars)` Удаляет символы только с конца

4. Поиск и замена
`POSITION(substr IN str)` Возвращает позицию первого вхождения подстроки (начинается с 1)
`STRPOS(str, substr)` Аналог POSITION, но с другим синтаксисом
`REPLACE(str, from, to)` Заменяет все вхождения подстроки
`REGEXP_REPLACE(str, pattern, replacement [, flags])` Заменяет подстроку по регулярному выражению

5. Разделение и объединение
`SPLIT_PART(str, delimiter, n)` Возвращает n-ю часть строки, разделённой по разделителю
`STRING_AGG(expression, delimiter)` Объединяет строки в одну с разделителем (агрегатная функция)

6. Форматирование
`FORMAT(str, args...)` Форматирует строку по шаблону, аналогично sprintf
`FORMAT('Hello %s', 'World')` → `'Hello World'`

`TO_HEX(number)` Преобразует число в шестнадцатеричную строку

7. Проверка содержимого
`LIKE` Проверяет соответствие шаблону с % (любой набор символов) и _ (один символ)
`ILIKE` Как LIKE, но нечувствительно к регистру
`~` Проверяет соответствие регулярному выражению
`!~` Проверяет несоответствие регулярному выражению
`SIMILAR TO` Проверяет соответствие шаблону, комбинирующему LIKE и регулярные выражения

8. Кодирование и преобразование
`ENCODE(data, format)` Кодирует бинарные данные в строку (например, в base64)
`ENCODE('Hello'::bytea, 'base64')`.

`DECODE(str, format)` Декодирует строку в бинарные данные
`DECODE('SGVsbG8=', 'base64')`.

`QUOTE_IDENT(str)` Экранирует строку для использования как идентификатор
`QUOTE_IDENT('my table')` → `"my table"`.

`QUOTE_LITERAL(str)` Экранирует строку для использования как строковый литерал
`QUOTE_LITERAL('Hello')` → `'Hello'`.

9. Другие полезные функции
`REPEAT(str, n)` Повторяет строку n раз
`REVERSE(str)` Переворачивает строку
`MD5(str)` Вычисляет MD5-хеш строки


## Функции для работы со JSONB
1. Операторы для доступа к данным

*-> Извлекает значение по ключу (для объекта) или индексу (для массива). Возвращает jsonb*
`'{"a": 1, "b": 2}'::jsonb -> 'a'`        → 1 (как jsonb)
`'[1, 2, 3]'::jsonb -> 1`                 → 2 (как jsonb)

*->> Извлекает значение по ключу или индексу и возвращает его как текст (text)*
`'{"a": 1, "b": 2}'::jsonb ->> 'a'`       → '1' (как текст)
`'[1, 2, 3]'::jsonb ->> 1`                → '2' (как текст)

*#> Извлекает значение по указанному пути (массив строк). Возвращает jsonb*
`'{"a": {"b": 1}}'::jsonb #> '{a, b}'`    → 1 (как jsonb)

*#>> Извлекает значение по пути и возвращает его как текст*
`'{"a": {"b": 1}}'::jsonb #>> '{a, b}'`   → '1' (как текст)

2. Операторы для проверки структуры

*@> Проверяет, содержит ли левый jsonb правый (включая все ключи и значения)*
`'{"a": 1, "b": 2}'::jsonb @> '{"a": 1}'::jsonb`   → true

*<@ Проверяет, содержится ли левый jsonb в правом*
`'{"a": 1}'::jsonb <@ '{"a": 1, "b": 2}'::jsonb`   → true

*? Проверяет, существует ли ключ (или строка как элемент массива)*
`'{"a": 1, "b": 2}'::jsonb ? 'a'`                  → true

*?| Проверяет, существует ли хотя бы один из указанных ключей*
`'{"a": 1, "b": 2}'::jsonb ?| array['a', 'c']`     → true

*?& Проверяет, существуют ли все указанные ключи*
`'{"a": 1, "b": 2}'::jsonb ?& array['a', 'b']`     → true

3. Функции для работы с jsonb

*jsonb_array_elements(jsonb) Разворачивает массив jsonb в набор строк (значений). Используется в FROM с LATERAL.*
`SELECT JSONB_ARRAY_ELEMENTS('[1, 2, 3]'::jsonb);`

*jsonb_array_elements_text(jsonb) Аналог jsonb_array_elements, но возвращает значения как текст*
`JSONB_ARRAY_ELEMENTS_TEXT('[1, "text", 3]'::jsonb)` → '1', 'text', '3'.

*jsonb_array_length(jsonb) Возвращает длину массива jsonb*
`JSONB_ARRAY_LENGTH('[1, 2, 3]'::jsonb)` → 3

*jsonb_object_keys(jsonb) Возвращает набор ключей объекта jsonb*
`SELECT JSONB_OBJECT_KEYS('{"a": 1, "b": 2}'::jsonb);`

*jsonb_extract_path(jsonb, variadic text[]) Извлекает значение по пути (аналог #>)*
`JSONB_EXTRACT_PATH('{"a": {"b": 1}}'::jsonb, 'a', 'b')` → 1 (как jsonb).

*jsonb_extract_path_text(jsonb, variadic text[]) Извлекает значение по пути как текст (аналог #>>)*
`JSONB_EXTRACT_PATH_TEXT('{"a": {"b": 1}}'::jsonb, 'a', 'b')` → '1'

*jsonb_typeof(jsonb) Возвращает тип значения jsonb (object, array, string, number, boolean, null)*
`JSONB_TYPEOF('{"a": 1}'::jsonb)` → 'object'

*jsonb_pretty(jsonb) Форматирует jsonb в читаемый вид с отступами*
`JSONB_PRETTY('{"a": 1, "b": [2, 3]}'::jsonb)`

4. Функции для создания и модификации jsonb

*to_jsonb(anyelement) Преобразует значение PostgreSQL (например, строку, число, массив) в jsonb*
`tO_JSONB('Hello')` → '"Hello"'::jsonb

*jsonb_build_object(VARIADIC "any") Создаёт объект jsonb из пар ключ-значение*
`JSONB_BUILD_OBJECT('a', 1, 'b', 'text')` → {"a": 1, "b": "text"}

*jsonb_build_array(VARIADIC "any") Создаёт массив jsonb из переданных значений*
`JSONB_BUILD_ARRAY(1, 'text', true)` → [1, "text", true]

*jsonb_set(jsonb, path, value, [create_missing]) Обновляет или добавляет значение по указанному пути*
`JSONB_SET('{"a": 1}'::jsonb, '{a}', '2'::jsonb)` → {"a": 2}

*Если create_missing = true (по умолчанию), создаёт недостающие ключи*
`JSONB_SET('{}'::jsonb, '{a, b}', '1'::jsonb)` → {"a": {"b": 1}}

*jsonb_set_lax(jsonb, path, value, [create_missing], [null_value_treatment]) Аналог jsonb_set, но с гибкой обработкой NULL*
`JSONB_SET_LAX('{"a": 1}'::jsonb, '{a}', NULL, true, 'delete_key')` → {} (удаляет ключ)

*jsonb_insert(jsonb, path, value, [insert_after]) Вставляет значение в массив по пути*
`JSONB_INSERT('[1, 2]'::jsonb, '{1}', '1.5'::jsonb)` → [1, 1.5, 2]

*jsonb_strip_nulls(jsonb) Удаляет все ключи с null-значениями из объекта*
`JSONB_STRIP_NULLS('{"a": null, "b": 1}'::jsonb)` → {"b": 1}

5. Агрегатные функции

*jsonb_agg(expression) Собирает значения в массив jsonb*
`SELECT JSONB_AGG(name) FROM (VALUES ('a'), ('b')) AS t(name);`

*jsonb_object_agg(key, value) Создаёт объект jsonb из пар ключ-значение*
`SELECT JSONB_OBJECT_AGG(name, val) FROM (VALUES ('a', 1), ('b', 2)) AS t(name, val);`

6. Удаление элементов

*jsonb - text Удаляет ключ из объекта или элемент из массива по индексу*
`'{"a": 1, "b": 2}'::jsonb - 'a'` → {"b": 2}
`'[1, 2, 3]'::jsonb - 1 → [1, 3]`.

*jsonb - text[] Удаляет ключи или элементы по указанному пути*
`'{"a": {"b": 1}}'::jsonb - '{a, b}'` → {"a": {}}

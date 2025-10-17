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


## Условия
Простой CASE
```sql
CASE expression
    WHEN value1 THEN result1
    WHEN value2 THEN result2
    ...
    [ELSE default_result]
END
```

Поисковый CASE
```sql
CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ...
    [ELSE default_result]
END
```

```sql
SELECT IF(10 > 20, 'TRUE', 'FALSE');
SELECT NULLIF('SQL Academy', 'SQL Academy') AS sql_trainer;
SELECT IFNULL('SQL Academy', 'Альтернатива SQL Academy') AS sql_trainer;
```

```sql
SELECT department,
       SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) AS male_count,
       SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) AS female_count
FROM employees
GROUP BY department;
```

*FILTER используется в агрегатных функциях для ограничения набора строк, которые учитываются при вычислении агрегата*
```sql
SELECT department,
       COUNT(*) FILTER(WHERE gender = 'M') AS male_count,
       COUNT(*) FILTER(WHERE gender = 'F') AS female_count
FROM employees
GROUP BY department;

SELECT name, priority
FROM tasks
ORDER BY CASE priority
             WHEN 'high' THEN 1
             WHEN 'medium' THEN 2
             WHEN 'low' THEN 3
             ELSE 4
         END;
```

## Сортировка
```sql
SELECT column1, column2
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC];

SELECT name, bonus
FROM employees
ORDER BY bonus ASC NULLS FIRST;
```

## Оконные функции
```sql
SELECT 
    <оконная_функция>(<поле_таблицы>) OVER (
       [PARTITION BY <столбцы_для_разделения>]
       [ORDER BY <столбцы_для_сортировки>]
       [ROWS|RANGE <определение_диапазона_строк>]
    ) AS alias
FROM table;
```


## Функции ранжирования
`ROW_NUMBER()` Возвращает порядковый номер строки в окне (не учитывает ties)
`RANK()` Возвращает порядковый номер строки в окне (учитывает ties)
`DENSE_RANK()` Аналог RANK, но без пропусков при ties
`NTILE(n)` Разбивает окно на n равных частей
`CUME_DIST() PERCENT_RANK()` Процентный ранг (0-1) и кумулятивное распределение


## Функции смещения
`LAG(column, [offset = 1, default])` Значение из предыдущих строк в окне
`LEAD(column, [offset = 1, default])` Значение из следующих строк в окне
`FIRST_VALUE(column)` Значение из первой строки в окне
`LAST_VALUE(column)` Значение из последней строки в окне


## Прочие команды
- `INNER JOIN documents USING (document_id)`                                  | короткая запись JOIN, когда ключи в таблицах имеют одинаковое название
- `WHERE EXISTS(SLECT 1 FROM ORDERS WHERE orders.customer_id = customers.id)` | проверяет, возвращает ли подзапрос какие либо строки
- `COALESCE(SUM("amount"), 0) AS "amount"`                                    | проверка на NULL
- `SELECT DISTINCT ON (team) * FROM employees
   ORDER BY team, birth_date DESC`
- `ARRAY_AGG(
       JSON_BUILD_OBJECT(
           'boUnhandledStatus', bousc."boUnhandledStatus",
           'createDate', bousc."createDate"
       )
       ORDER BY bousc."createDate"
   ) AS "statusHistory"`

## Функции для работы с числами
1. Математические функции
`ABS(x)` Возвращает абсолютное значение
`CEIL(x)` Округление в большую сторону
`FLOOR(x)` Округление в меньшую сторону
`ROUND(x[, n])` Округление до n знаков после запятой
`TRUNC(x[, n])` Обрезает до n знаков после запятой
`MOX(x, y)` Возвращает остаток от деления
`DEV(x, y)` Возвращает целую часть от деления
`POWER(x, y)` Возведение в степень
`SQRT(x)` Возвращает квадратный корень
`CBRT(x)` Возвращает кубический корень
`LN(x)` Возвращает натуральный логарифм
`LOG(x)` Логарифм по основанию 10
`EXP(x)` Экспонента, возводит число е в степень x

2. Тригонометрические функции
`SIN(x)` Синус
`COS(x)` Косинус
`TAN(x)` Тангенс
`ASIN(x)` Арксинус
`ACOS(x)` Арккосинус
`ATAN(x)` Арктангенс
`PI()` Возвращает число PI

3. Случайные числа
`RANDOM()` Возвращает случайное число от 0 до 1
`SETSEED(x)` Устанавливает начальное значение генератора случайных чисел (от -1 до 1)

4. Преобразование типов
`TO_NUMBER(str, format)` Преобразует строку в число
`SELECT '123.45'::NUMERIC` Преобразует тип в число
`TO_CHAR(x, format)` Преобразует число в строку

5. Агрегатные функции для чисел
`AVG(x)` Возвращает среднее значение
`COUNT(x)` Возвращает количество строк
`MAX(x)` Возвращает максимальное значение
`MIN(x)` Возвращает минимальное значение
`SUM(x)` Возвращает сумму
`STDDEV(x)` Возвращает стандартное отклонение
`VARIANCE(x)` Возвращает дисперсию

6. Прочие полезные функции
`FACTORIAL(n)` Возвращает факториал
`GREATEST(x, y[, ...])` Возвращает большее чисел
`LEAST(x, y[, ...])` Возвращает меньшее чисел
`SIGN(x)` Возвращает знак числа (-1, 0, 1)
`ISFINITE(x)` Проверяет является ли число конечным
`GENERATE_SERIES(x, y [, step])` Возвращает последовательность чисел


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
`SUBSTRING(str FROM start [FOR length])` Извлекает подстроку, может работать с регуляркой
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
`STRING_AGG(expression, delimiter [ORDER BY expression])` Объединяет строки в одну с разделителем (агрегатная функция)

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
`TO_JSONB('Hello')` → '"Hello"'::jsonb

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

## Функции для работы с датами
1. Извлечение компонентов даты/времени

*EXTRACT(field FROM source) Извлекает компонент даты/времени*
`EXTRACT(YEAR FROM TIMESTAMP '2025-09-25 07:41:00');` → 2025

*DATE_PART('field', source) Аналог EXTRACT, но с другим синтаксисом*
`DATE_PART('year', TIMESTAMP '2025-09-25 07:41:00'` → 2025

*DATE_TRUNC('field', source) Усекает дату/время до указанного уровня точности*
`DATE_TRUNC('month', TIMESTAMP '2025-09-25 07:41:00');` → '2025-09-01 00:00:00'

2. Арифметика с датами
`SELECT TIMESTAMP '2025-09-25 07:41:00' + INTERVAL '1 day'` Добавляет 1 день
`SELECT DATE '2025-09-25' - DATE '2025-09-01` Вернёт интервал в днях
`SELECT AGE(TIMESTAMP '2025-09-25', TIMESTAMP '2025-01-01');` Вернёт интервал (примерно 8 месяцев и 24 дня)

3. Текущая дата и время
`SELECT CURRENT_DATE`  Вернёт текущую дату
`SELECT CURRENT_TIME`  Вернёт текущее время
`SELECT CURRENT_TIMESTAMP`  Вернёт текущую дату и время
`SELECT NOW()` Аналог CURRENT_TIMESTAMP
`SELECT LOCALTIMESTAMP` Вернёт текущую дату и время без часового пояса
`SELECT CLOCK_TIMESTAMP` Возвращает текущее время на момент выполнения запроса (в отличие от NOW(), которая фиксирует время начала транзакции)

4. Преобразование и форматирование
`SELECT TO_DATE('25.09.2025', 'DD.MM.YYYY');` Преобразует строку в дату по указанному формату
`SELECT TO_TIMESTAMP('25.09.2025 07:41', 'DD.MM.YYYY HH24:MI');` Преобразует строку в метку времени по указанному формату
`SELECT TO_CHAR(CURRENT_TIMESTAMP, 'DD Month YYYY, HH24:MI:SS');` Форматирует дату/время в строку по указанному шаблону

5. Работа с интервалами

*JUSTIFY_HOURS(interval) Преобразует интервал, нормализуя часы*
`SELECT JUSTIFY_HOURS(INTERVAL '25 hours')` → '1 day 01:00:00'

*JUSTIFY_DAYS(interval) Преобразует интервал, нормализуя дни*
`SELECT JUSTIFY_DAYS(INTERVAL '32 days')` → '1 month 2 days'

6. Работа с часовыми поясами

*AT TIME ZONE Преобразует дату/время в другой часовой пояс*
`SELECT TIMESTAMP '2025-09-25 07:41:00' AT TIME ZONE 'UTC'`

*TIMEZONE(zone, timestamp) Аналог AT TIME ZONE*
`SELECT TIMEZONE('America/New_York', CURRENT_TIMESTAMP)`

7. Прочие полезные функции
`MAKE_DATE(year, month, day)` Создаёт дату
`MAKE_TIMESTAMP(year, month, day, hour, minute, second)` Создаёт метку времени
`MAKE_INTERVAL(days, hours, minutes, seconds)` Создаёт интервал
`OVERLAPS(start1, end1, start2, end2)` Проверяет пересечение интервалов


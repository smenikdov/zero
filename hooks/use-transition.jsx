/*
## Что такое useTransition

useTransition — это хук React, введенный в React 18, который позволяет помечать определенные обновления состояния как
"некритичные" (переходные), чтобы React мог обрабатывать их с меньшим приоритетом. Это улучшает производительность
пользовательского интерфейса.

## Как useTransition улучшает производительность UI?

1) useTransition позволяет отделить срочные обновления (например, реакция на ввод пользователя) от менее срочных
2) Во время выполнения тяжелых обновлений (например, фильтрации большого списка) интерфейс остается отзывчивым,
   так как React может прерывать низкоприоритетные задачи для обработки высокоприоритетных (например, ввода текста)
3) useTransition возвращает флаг isPending, который можно использовать для отображения индикаторов загрузки
4) Если компонент или его поддерево требуют значительных вычислений для рендеринга, useTransition позволяет React выполнять эти обновления постепенно, избегая блокировки интерфейс

## Что такое "concurrent rendering" в React?

Concurrent rendering (параллельный рендеринг) — это новая парадигма рендеринга, введенная в React 18, которая позволяет React обрабатывать
несколько задач рендеринга одновременно, приостанавливать, прерывать или возобновлять их в зависимости от приоритета.

Без concurrent rendering React обрабатывает все обновления синхронно, что может привести к "зависанию" интерфейса.
С concurrent rendering React может рендерить частично, приостанавливать рендер для обработки событий пользователя, а затем продолжить.

## Когда useTransition не нужен?

1) Простые и быстрые обновления
2) Все обновления критичны

*/

function FilterList() {
    const [query, setQuery] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [isPending, startTransition] = useTransition();

    const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

    const handleFilter = (value) => {
        setQuery(value);
        startTransition(() => {
            setFilteredItems(items.filter(item => item.toLowerCase().includes(value.toLowerCase())));
        });
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => handleFilter(e.target.value)}
                placeholder="Filter items..."
            />
            {isPending && <p>Loading...</p>}
            <ul>
                {filteredItems.slice(0, 100).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

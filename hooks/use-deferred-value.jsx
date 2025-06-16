/*
## Чем useDeferredValue отличается от useTransition?

useTransition
    используется для пометки обновлений состояния как некритичных (переходных), чтобы React мог приостановить их выполнение в пользу срочных задач
    возвращает массив [isPending, startTransition]
useDeferredValue
    используется для создания отложенной версии значения (например, строки, числа, объекта), которое React обновляет с низким приоритетом, если оно изменилось
    возвращает отложенное значение, которое может "отставать" от исходного, пока React не завершит более приоритетные задачи.

## Как React решает, когда обновлять отложенное значение?

1) React планирует обновление с низким приоритетом
2) Если в процессе выполнения появляются новые срочные задачи (например, пользователь вводит текст), React приостанавливает обновление  чтобы обработать их
3) Как только срочные задачи завершены, React продолжает рендеринг с отложенным значением
3.*) Если исходное значение изменяется снова до завершения рендеринга с предыдущим deferredValue, React может отменить промежуточный рендер и начать новый с последним значением
3.*) React использует внутренний тайм-аут (по умолчанию около 5 секунд), чтобы гарантировать, что отложенное значение в конечном итоге обновится, даже если срочные задачи продолжают поступать
*/

function SearchComponent() {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);
    const filteredItems = items.filter(item => item.toLowerCase().includes(deferredQuery.toLowerCase()));

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <p>Searching for: {deferredQuery}</p>
            <ul>
                {filteredItems.slice(0, 100).map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

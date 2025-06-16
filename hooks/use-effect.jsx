/*
## Что делает useEffect? Когда он вызывается?

Выполняет переданную функцию (эффект) после рендеринга компонента.
Если указан массив зависимостей, эффект вызывается только при изменении этих зависимостей.
Если массив зависимостей пуст ([]), эффект вызывается только один раз после монтирования.
Если массив зависимостей не указан, эффект вызывается после каждого рендера.

## Зачем нужен массив зависимостей?

Массив зависимостей (dependency array) в useEffect определяет, когда эффект должен быть выполнен.
Он позволяет React оптимизировать выполнение эффекта, избегая ненужных вызовов.

## Как очистить эффект (cleanup) при размонтировании компонента? Можно ли передать ему асинхронную функцию, почему?

Функция очистки (cleanup) — это функция, которую можно вернуть из useEffect. Она выполняется:
Перед повторным вызовом эффекта (если зависимости изменились).
При размонтировании компонента (удалении из DOM).

## Можно ли передать асинхронную функцию в useEffect?

Нет. useEffect ожидает, что переданная функция вернёт либо undefined, либо функцию очистки (не Promise).
Если передать async функцию, React выдаст предупреждение, и очистка может не работать корректно.
Асинхронные операции могут завершиться после размонтирования компонента, что приведёт к попытке обновления состояния в несуществующем компоненте (утечка памяти).

## Почему все переменные, используемые внутри useEffect, должны быть включены в массив зависимостей

React использует замыкания для хранения состояния и пропсов внутри useEffect. Когда компонент рендерится,
useEffect фиксирует значения переменных, которые были актуальны на момент этого рендера. Если переменная,
используемая в useEffect, не указана в массиве зависимостей, эффект будет использовать устаревшее значение
этой переменной, что может привести к ошибкам.
*/

const async fetchTodo = () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
        const json = await response.json();
        if (json.code !== 200) {
            throw new Error('ERROR TO FETCH TODO');
        }
        const todo = json.data;
        return todo
    }
    catch(error) {
        console.log('ERROR TO FETCH TODO', error);
    }
};

const useTodo = async () => {
    const [ todo, setTodo ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(null);

    const onMount = async () => {
        setIsLoading(true);
        const todo = await fetchTodo();
        if (todo) {
            setTodo(todo);
        } else {
            setError('Не удалось загрузить задачу. Попробуете позже или обратитесь в техподдержку');
        }

        setIsLoading(false);
    }

    useEffect(() => {
        onMount();
    }, []);

    return {
        todo,
        isLoading,
        error,
    };
};

function Todo() {
    const { todo, isLoading, error } = useTodo();

    if (isLoading) {
        return 'Загрузка...'
    }

    if (error) {
        return error;
    }

    return (
        <div>
            <p className="p-2">
                {todo.title}
            </p>
        </div>
    );
}

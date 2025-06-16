/*
## Как useState управляет состоянием?

При вызове useState(initialValue) React создаёт внутреннее состояние для компонента и инициализирует его значением initialValue.
При вызове функции setState React обновляет значение состояния и вызывает повторный рендеринг компонента, чтобы отобразить новое состояние.
React сохраняет состояние между рендерами, используя замыкания и внутренний механизм хранения.

## Что произойдет, если вызвать setCount несколько раз в одном обработчике событий?

Если вызвать setState (например, setCount) несколько раз в одном обработчике событий, React не будет обновлять состояние после
каждого вызова немедленно. Вместо этого React группирует (batches) все вызовы setState в рамках одного цикла событий и
выполняет только одно обновление состояния и рендеринг

## Как избежать лишних рендеров при обновлении состояния?

useMemo, useCallback, разделение состояние, React.memo
*/

function Counter() {
    const [ count, setCount ] = useState(0);

    const handleIncrement = () => {
        if (count >= 10) {
            return;
        }
        setCount(count + 1);
    };

    const handleDecrement = () => {
        if (count <= 0) {
            return;
        }
        setCount(count - 1);
    };

    return (
        <div>
            <button onClick={handleDecrement}>-</button>
            <p>Count: {count}</p>
            <button onClick={handleIncrement}>+</button>
        </div>
    );
}

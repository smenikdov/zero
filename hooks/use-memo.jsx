/*
## Когда использовать useMemo?

Тяжелые вычисления, оптимизация

## Как useMemo помогает оптимизировать производительность?

useMemo сохраняет результат вычислений и возвращает его при следующем рендере, если зависимости не изменились

## Чем отличается useMemo от useCallback? 

useMemo: Мемоизирует значение, возвращаемое функцией (например, объект, массив, примитив).
useCallback: Мемоизирует функцию, чтобы сохранить её ссылку (референс) между рендерами.
*/

function FactorialCalculator() {
    const [number, setNumber] = useState(0);

    const factorial = useMemo(() => {
        const calc = n => (n <= 1 ? 1 : n * calc(n - 1));
        return calc(number);
    }, [number]);

    return (
        <div>
            <input type="number" value={number} onChange={e => setNumber(Number(e.target.value))} />
            <p>Factorial of {number} is {factorial}</p>
        </div>
    );
}

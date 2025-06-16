/*
## Чем useRef отличается от useState?

Возвращает изменяемый объект, который сохраняет свое текущее значение между рендерингами. В отличие от useState,
изменение значения useRef не вызывает повторный рендеринг компонента.

## Как использовать useRef для доступа к DOM-элементам?

1) const myRef = useRef(null);
2) <input ref={myRef} type="text" />
3) myRef.current.focus();
*/

function InputTracker() {
    const [input, setInput] = useState('');
    const prevInputRef = useRef();

    useEffect(() => {
        prevInputRef.current = input;
    }, [input]);

    return (
        <div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <p>Current: {input}</p>
            <p>Previous: {prevInputRef.current || 'None'}</p>
        </div>
    );
}

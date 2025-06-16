/*
## Когда стоит использовать useReducer вместо useState?

Сложная логика состояния. Когда состояние компонента имеет сложную структуру (например, объект с множеством полей или
вложенные данные) и логика его обновления включает несколько условий или переходов.
Множественные действия. Если состояние изменяется разными способами (например, добавление, удаление, обновление элементов в списке),
useReducer позволяет централизовать логику обновления в одном редьюсере вместо множества setState вызовов.
Предсказуемость и тестируемость. Так как редьюсер — это чистая функция, которая принимает состояние и действие и возвращает новое состояние

## Как передать дополнительные данные в действие (action.payload)?

useReducer действие (action) — это объект, который обычно содержит поле type для определения типа действия и payload
для передачи дополнительных данных. Вы можете структурировать действие так, чтобы передавать любые данные через payload.
*/

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { ...state, count: state.count + state.step };
        case 'decrement':
            return { ...state, count: state.count - state.step };
        case 'reset':
            return { ...state, count: 0 };
        case 'setStep':
            return { ...state, step: action.payload };
        default:
            return state;
    }
}

function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div>
            <p>Count: {state.count}</p>
            <p>Step: {state.step}</p>
            <input
                type="number"
                value={state.step}
                onChange={e => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
            />
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
        </div>
    );
}

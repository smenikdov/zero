/*
## Что такое useActionState?

useActionState — это экспериментальный хук, введённый в React 19, предназначенный для упрощения работы
с асинхронными действиями, особенно в контексте форм, но не ограниченный ими. Он предоставляет удобный
способ управления состоянием действия (action), включая статус выполнения, результат и ошибки асинхронных операций

## Как useActionState взаимодействует с асинхронными функциями?

Асинхронная функция, переданная в useActionState, может быть любой функцией, возвращающей промис. Хук автоматически обрабатывает состояния pending, success и error
Если функция возвращает значение, оно становится новым state
Хук интегрируется с Concurrent Rendering и React Transitions, что позволяет управлять асинхронными операциями без блокировки UI

## Можно ли использовать useActionState без формы? Как?

Пример снизу

*/


// EXAMPLE 1 ====================================================================

async function increment(previousState, formData) {
    return previousState + 1;
}

function StatefulForm({}) {
    const [state, action, isPending] = useActionState(increment, 0);
    return (
        <form>
            {state}
            <button formAction={action}>Increment</button>
        </form>
    )
}


// EXAMPLE 2 ====================================================================

async function updateCounter(prevState, action) {
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (action) {
        case 'increment':
            return { count: prevState.count + 1, error: null };
        case 'decrement':
            return { count: Math.max(0, prevState.count - 1), error: null };
        default:
            return { ...prevState, error: 'Invalid action' };
    }
}

function Counter() {
    const [state, action, isPending] = useActionState(updateCounter, { count: 0, error: null });

    return (
        <div>
            <p>Count: {state.count}</p>

            <button onClick={() => action('increment')} disabled={isPending}>+1</button>
            <button onClick={() => action('decrement')} disabled={isPending}>-1</button>
            <button onClick={() => action('reset')} disabled={isPending}>Reset</button>

            {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
            {isPending && <p>Updating...</p>}
        </div>
    );
}

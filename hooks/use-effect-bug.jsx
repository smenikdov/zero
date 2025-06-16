import { useEffect, useState } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Count:', count); // Всегда будет использовать count из первого рендера
        }, 1000);

        return () => clearInterval(interval);
    }, []); // count не в зависимостях

    return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}

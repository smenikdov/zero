{
    // BAD: expensive component will always re-render

    function Page() {
        const [count, setCount] = useState(0);

        return (
            <div>
                <button onClick={() => setCount(count + 1)}>Increment</button>
                <ExpensiveComponent />
            </div>
        );
    }
}

{
    // GOOD: children will only re-render when they change
    
    function Page({ children }) {
        const [count, setCount] = useState(0);

        return (
            <div>
                <button onClick={() => setCount(count + 1)}>Increment</button>
                {children}
            </div>
        );
    }
}

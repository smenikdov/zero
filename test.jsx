function Task(props) {
    const { items } = props;

    const sum = useMemo(() => {
        return items.reduce((acc, item) => acc + item, 0);
    }, [items]);

    return (
        <div>
            {items.map((item, index) => (
                <div key={index}>
                    { item }
                </div>
            ))}

            <div>
                Итого: { sum }
            </div>
        </div>
    );
}

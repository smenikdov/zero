function Form() {
    const [ name, setName ] = useState('');
    const [ age, setAge ] = useState('');

    // Way to save object link between re-renders
    // BAD
    // const user = { name, age };

    // GOOD
    const user = useMemo(() => {
        return { name, age };
    }, [name, age]);

    return (
        <div>
            ...
        </div>
    );
}

function Form() {
    const form = useState({
        rate: 0, 
        amount: 0, 
        term: 0,
    });

    // BAD
    // const total = form.rate * form.amount * form.term;

    // GOOD
    // const total = useMemo(() => {
    //     return form.rate * form.amount * form.term;
    // }, form);

    // PERFECT
    const total = useMemo(() => {
        return form.rate * form.amount * form.term;
    }, [form.rate, form.amount, form.term]);


    return (
        <form>
            ...
        </form>
    );
}

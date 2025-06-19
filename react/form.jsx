function Form() {
    const form = useState({
        name: '', 
        email: '', 
        phone: '', 
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    return (
        <form>
            <input name="name" value={form.name} onChange={handleChange} />
            <input name="email" value={form.email} onChange={handleChange} />
            <input name="phone" value={form.phone} onChange={handleChange} />
        </form>
    );
}

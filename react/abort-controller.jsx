function Post({ id }) {
    const [post, setPost] = useState(null);


    const fetchPost = useCallback(async () => {
        const controller = new AbortController();  

        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { signal: controller.signal });
            const json = await response.json();
            setPost(json);
        }
        catch (error) {
            console.error(error);
        }

        return () => {
            controller.abort();
        };
    }, [id]);

    useEffect(() => {
        return fetchPost();
    }, [fetchPost]);

    return (
        <div>
            ...
        </div>
    );
}

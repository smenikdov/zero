/*
## Чем useLayoutEffect отличается от useEffect?

1) render. React рендерит компоненты, одновременно запускает useInsertionEffect (синхронно)
2) commit. React обновляет DOM
3) useLayoutEffect. Вызывается useLayoutEffect (синхронно)
4) paint. Браузер отрисовывает изменения
4) useEffect. Вызывается useEffect (асинхронно)

useLayoutEffect Работает в фазе "layout" браузера, что позволяет изменять DOM до его отображения.
useEffect Это позволяет не блокировать основной поток рендеринга, что улучшает производительность.

## В каких случаях стоит использовать useLayoutEffect?

Когда побочный эффект влияет на визуальное отображение DOM и должен быть выполнен до отрисовки,
чтобы избежать мерцания или неправильного отображения интерфейса

## Какие проблемы могут возникнуть при неправильном использовании useLayoutEffect?

Замедление рендеринга, ошибки на сервере (SSR), бесконечный рендеринг
*/

function ElementWidth() {
    const [width, setWidth] = useState(0);
    const divRef = useRef(null);

    useLayoutEffect(() => {
        if (divRef.current) {
            setWidth(divRef.current.offsetWidth);
        }
    }, []);

    return (
        <div>
            <div ref={divRef} style={{ width: '200px', height: '100px', background: 'lightblue' }}>
                Measure me!
            </div>
            <p>Width: {width}px</p>
        </div>
    );
}

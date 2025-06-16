/*
## Чем useInsertionEffect отличается от useEffect и useLayoutEffect?

1) render. React рендерит компоненты, одновременно запускает useInsertionEffect (синхронно)
2) commit. React обновляет DOM
3) useLayoutEffect. Вызывается useLayoutEffect (синхронно)
4) paint. Браузер отрисовывает изменения
4) useEffect. Вызывается useEffect (асинхронно)

## Почему этот хук предназначен в основном для библиотек CSS-in-JS?

Создан специально для библиотек CSS-in-JS, чтобы динамически вставлять стили (например, <style> теги)
в DOM до того, как компоненты начнут использовать эти стили. Это гарантирует, что стили будут доступны
до применения изменений в DOM. Если стили вставляются слишком поздно (например, в useEffect или useLayoutEffect),
это может привести к ситуации, когда DOM отрисовывается без стилей, вызывая мерцание

## Какие проблемы могут возникнуть при неправильной очистке стилей в useInsertionEffect?

1) Утечки памяти
2) Конфликты стилей
3) Производительность
*/

function HighlightedText({ text, isHighlighted }) {
    useInsertionEffect(() => {
        const style = document.createElement('style');
        style.textContent = `.highlight { background-color: yellow; padding: 2px; }`;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return <span className={isHighlighted ? 'highlight' : ''}>{text}</span>;
}

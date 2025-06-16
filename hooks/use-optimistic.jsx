/*
## Что такое useOptimistic? Как useOptimistic обеспечивает согласованность UI при асинхронных операциях?

useOptimistic — это хук, введённый в React 18.2 (экспериментальный API, доступный в React 19 или в экспериментальных сборках),
предназначенный для реализации оптимистических обновлений в пользовательском интерфейсе. Оптимистическое обновление предполагает,
что асинхронная операция (например, запрос к серверу) завершится успешно, и UI обновляется немедленно с предполагаемым результатом,
не дожидаясь ответа сервера. Это улучшает воспринимаемую производительность и согласованность интерфейса.

## В каких сценариях стоит использовать useOptimistic вместо useState?

useOptimistic предназначен для ситуаций, где требуется оптимистическое обновление UI, в то время как useState
— это общий хук для управления состоянием. Вот сценарии, когда useOptimistic предпочтительнее:

1) Частые асинхронные действия с низкой вероятностью ошибок
2) Интерактивные интерфейсы
3) Сценарии с откатом

## Как обрабатывать ошибки в оптимистических обновлениях?

хуй его знает

*/

function Thread({ messages, sendMessageAction }) {
    const formRef = useRef();

    function formAction(formData) {
        addOptimisticMessage(formData.get('message'));
        formRef.current.reset();
        startTransition(async () => {
            await sendMessageAction(formData);
        });
    }

    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        messages,
        (state, newMessage) => [
            {
                text: newMessage,
                sending: true
            },
            ...state,
        ]
    );

    return (
        <>
            <form action={formAction} ref={formRef}>
                <input type="text" name="message" placeholder="Hello!" />
                <button type="submit">Send</button>
            </form>
            {optimisticMessages.map((message, index) => (
                <div key={index}>
                    {message.text}
                    {!!message.sending && <small> (Sending...)</small>}
                </div>
            ))}

        </>
    );
}

export default function App() {
    const [messages, setMessages] = useState([
        { text: 'Hello there!', sending: false, key: 1 }
    ]);
    async function sendMessageAction(formData) {
        const sentMessage = await deliverMessage(formData.get('message'));
        startTransition(() => {
            setMessages((messages) => [{ text: sentMessage }, ...messages]);
        })
    }
    return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}

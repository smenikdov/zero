## Типы

*Base types*
- string
- number
- boolean
- null
- undefined
- array
- object
- bigint
- symbol
- void
- any
- never
- unknown
- tuple
- enum

*Literal type* — тип, соответствующий точной переменной, предоставляемой самим JS
`let value: 1 | 2 | 3 = 1`

*Type alias* — пользовательский тип
`type User = { name: string; age: number }`

*Intersection type* — тип, соответствующий объединению(пересечению) двух других типов
`type User = { name: string } & { age: number }`

*Union type* — тип, соответствующий объединению(или) двух других типов
`let value: string | number = 1`

*Conditional types* — тип, который зависит от условия

*Distributive conditional types* — это механизм, который позволяет conditional types автоматически
"распределяться" по union types

*Mapped types* — это механизм, который позволяет создавать сигнатуру доступа по индексу

## Enum

*Enum* — набор констант, которые называются в соответствии с их значением

*Гетерогенный enum* — enum, который позволяет содержать как строковые, так и числовые значения
внутри одной структуры.


## Interface

*Interface* — структура, которая описывает свойства и методы объекта


## Utility Types

*Utility Types* — это набор встроенных типов, которые позволяют манипулировать типами данных
`Record` создаёт тип, который является записью с ключами, определёнными в первом параметре, и
значениями типа, определённого во втором параметре
`ReturnType<Type>` извлекает тип возвращаемого значения функции Type
`Awaited<T>`  обозначает тип, который будет возвращён из промиса T
`Pick<T, K extends keyof T>` выбирает свойства объекта типа T с ключами, указанными в K 
`Omit<T, K extends keyof T>` выбирает свойства объекта типа T, исключая те, которые указаны в K
`Partial<T>` делает все свойства объекта типа T необязательными
`Required<T>` делает все свойства объекта типа T обязательными
`Readonly<T>` делает все свойства объекта типа T доступными только для чтения
`Exclude<UnionType, ExcludedMembers>` исключает определённые типы из Union Type
`Extract<Type, Union>` извлекает из типа Type только те типы, которые присутствуют в Union
`NonNullable<Type>` извлекает тип из Type, исключая null и undefined
`Parameters<Type>` извлекает типы аргументов функции Type
`ConstructorParameters<Type>` извлекает типы аргументов конструктора Type
`InstanceType<Type>` извлекает тип экземпляра класса Type
`ThisParameterType<Type>` извлекает тип this из функции Type
`OmitThisParameter<Type>` определяет функцию без типа this
`ThisType<Type>` добавляет тип this к функции Type
`Uppercase<StringType>, Lowercase<StringType>, Capitalize<StringType>, Uncapitalize<StringType>`


## Generics

*Generics* — это механизм, который позволяет создавать функции и классы, работающие с различными
типами данных, не привязываясь к конкретному типу заранее

## Utils
`keyof`
`typeof`
`in`
`extends`
`infer`

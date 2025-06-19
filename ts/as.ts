interface Person {
    name: string;
    age: number;
}

// As type ========================================================================================
const myCanvas = document.getElementById('main_canvas') as HTMLCanvasElement

// As never =======================================================================================
type EmptyType<Type> = {
  [Property in keyof Type as never]: Type[Property]
}
type EmptyTypeExample = EmptyType<Person>

// As const =======================================================================================
const req = { url: 'https://Example.com', method: 'GET' } as const
req.url = 'test'; // error

// As property ====================================================================================
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
}

type GetPerson = Getters<Person>

// Remove keys ====================================================================================
type MyOmit<Type, Fields extends keyof Type> = {
  [Property in keyof Type as Exclude<Property, Fields>]: Type[Property]
}

type PersonName = MyOmit<Person, 'age'>



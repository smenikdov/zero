interface Person {
    name: string;
    age: number;
}

type A = 'a' | 'b' | 'c';
type B = 'a' | 'b';

// Conditional types ==============================================================================
type CnditionalType1 = Person extends RegExp ? 1 : 0
type MessageOf<Type> = Type extends { message: unknown } ? Type['message'] : never
type Flatten1<Type> = Type extends any[] ? Type[number] : Type

// Infer ==========================================================================================
type Flatten2<Type> = Type extends Array<infer Item> ? Item : Type
type MyReturnType<Type extends (...args: any) => any> =
    Type extends (...args: any) => infer R ? R : never;
type FakeReturnType<T> =
    T extends ((...args: any) => infer R extends string) ? `${ R }_return_type` : never;

// Distributive conditional types =================================================================
type CnditionalType2 = 'a' extends string ? 1 : 0
type CnditionalType3 = ['a'] extends [string] ? 1 : 0
type CnditionalType4 = ['a', 7] extends [string, number] ? 1 : 0
type ToArray1<Type> = Type extends string ? Type[] : never
type ToArray2<Type> = [Type] extends [string] ? Type[] : never
type Array1 = ToArray1<A>
type Array2 = ToArray2<A>

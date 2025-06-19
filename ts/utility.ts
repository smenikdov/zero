interface Person {
    name: string;
    age: number;
}

type A = 'a' | 'b' | 'c';
type B = 'a' | 'b';

// Indexed access =================================================================================
type Age = Person['age']
type AgeOrName1 = Person['age' | 'name']
type AgeOrName2 = Person[keyof Person]
type Status = Person['status'] // error

// Partial ========================================================================================
type partialPerson = Partial<Person>;

// Pick ===========================================================================================
type pickedPerson = Pick<Person, 'name'>;

// Omit ===========================================================================================
type omitPerson = Omit<Person, 'name'>;

// Exclude ========================================================================================
type excludeA = Exclude<A, 'a' | 'b'>;

// Extract ========================================================================================
type extractAB = Extract<A, B>;

// Record =========================================================================================
type recordType = Record<A, number>;

// Uppercase ======================================================================================
type upperA = Uppercase<A>;

// Awaited + ReturnType ===========================================================================
async function getData(): Promise<string> {
    return 'hello';
}
type awaitedData = Awaited<ReturnType<typeof getData>>;

// Custom utility types ===========================================================================
type OrNull<Type> = Type | null
type OneOrMany<Type> = Type | Type[]
type NotOrNull<Type> = NonNullable<OrNull<Type>>;

// Helpful types ==================================================================================
type AnyObject = Record<PropertyKey, any>;
type AnyFunction = (...args: any[]) => any;


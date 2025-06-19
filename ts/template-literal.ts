interface Person {
    name: string;
    age: number;
}

type A = 'a' | 'b' | 'c'
type B = 'a' | 'b'

// Literal type ===================================================================================
type World = 'world'
type HelloWorld = `Hello ${World}`
type Seven = 7;
type HelloSeven = `Hello ${Seven}`

// Union type =====================================================================================
type HelloA = `Hello ${A}`
type HelloAB = `Hello ${A} ${B}`

// Never ==========================================================================================
type HelloNever = `Hello ${never}`

// TODO ==========================================================================================

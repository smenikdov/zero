interface Person {
    name: string;
    age: number;
}

type A = 'a' | 'b' | 'c'
type B = 'a' | 'b'

// Interface ======================================================================================
type KeyofPerson = keyof Person
let keyOfPerson: KeyofPerson = 'name';
keyOfPerson = 'age';
keyOfPerson = 'blabla'; // error

// Union ==========================================================================================
type KeyofA = keyof A
let keyOfA: KeyofA = 'toString';

// Tuple ==========================================================================================
type Tuple = ['a', 'b', 'c']
type KeyofTuple = keyof Tuple
let keyOfTuple: KeyofTuple = '0';
keyOfTuple = 'slice'
keyOfTuple = 'length'

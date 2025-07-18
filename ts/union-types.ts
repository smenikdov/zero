type A = 'a' | 'b' | 'c';
type B = 'e' | 'a';

// Example ========================================================================================
type Union = A | B;
type Intersection = A & B;
type ObjectIntersection = { name: string } & { age: number };
type Never = string & number;
type Merge = { a: A } & { readonly a: A };
const merge: Merge = { a: 'a' };
merge.a = 'b';


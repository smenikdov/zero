// Example 1 ======================================================================================
function longest<Type extends { length: number }>(a: Type, b: Type) {
    return a.length >= b.length ? a : b;
}

const longerArr = longest([1, 2], [1, 2, 3]);
const longerStr = longest('alice', 'bob');
const notOK = longest(10, 100); // error

// Example 2 ======================================================================================

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

const x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, 'a');
getProperty(x, 'm'); // error

// Recursion ======================================================================================
type Tree<T> = {
    value: T;
    left: Tree<T> | null;
    right: Tree<T> | null;
};

type NumberTree = Tree<number>;

const tree: NumberTree = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 4,
            left: null,
            right: null,
        },
        right: {
            value: 5,
            left: null,
            right: null,
        },
    },
    right: null,
};

type MyAwaited<T extends any> = T extends Promise<infer R> ? MyAwaited<R> : T;

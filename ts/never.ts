// Example 1 ======================================================================================
type Shape = 1 | 2 | 3;

function getArea(shape: Shape) {
    switch (shape) {
        case 1:
            return 'one';
        case 2:
            return 'two;'
        default:
            const _exhaustiveCheck: never = shape; // error
            return _exhaustiveCheck
    }
}


// Example 2 ======================================================================================
function fn(x: string | number) {
    if (typeof x === 'string') {
        // ...
    } else if (typeof x === 'number') {
        // ...
    } else {
        x // типом `x` является `never`!
    }
}

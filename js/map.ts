/*
Map —  это коллекция ключ/значение
Основное отличие в том, что Map позволяет использовать ключи любого типа.

Хотя map[key] также работает, в этом случае map рассматривался бы как обычный JavaScript объект,
таким образом это ведёт ко всем соответствующим ограничениям (только строки/символьные ключи и
так далее).

В отличие от обычных объектов Object, в Map перебор происходит в том же порядке, в каком
происходило добавление элементов.
*/


// Number map =====================================================================================
const numberMap: Map<number, string> = new Map([
    [1, 'one'],
    [2, 'two'],
]);

numberMap.set(122, 'test');
numberMap.has(122);      // true
numberMap.get(122);      // test
numberMap.get('122')     // error

numberMap.delete(122);
numberMap.size;          // 0

numberMap['122'];        // very bad practice
numberMap[122];          // undefined
numberMap[-312] = 12;    // very bad practice

numberMap.set(NaN, 'not a number').set(Math.PI, 'pi');
numberMap.get(NaN);      // 13
numberMap.clear();

numberMap.keys();        // итерируемый объект по ключам
numberMap.values();      // итерируемый объект по значениям
numberMap.entries();     // возвращает итерируемый объект по парам вида [ключ, значение]

for (let item of numberMap) { // entries
    console.log(item);
}


// Boolean map ====================================================================================
const booleanMap: Map<boolean, number> = new Map();
booleanMap.set(false, 0);
booleanMap.set(true, 1);
booleanMap.get(true); // 1


// Object map =====================================================================================
interface User {
    name: string;
}
const stoic: User = { name: 'Stoic' };

const userRoles: Map<User, string> = new Map([
    [stoic, 'admin'],
]);

userRoles.get(stoic); // admin


// Transformation =================================================================================
let user: User = { name: 'Kent' };

const userMap: Map<string, string> = new Map(Object.entries(user));
userMap.get('name'); // Kent
userMap.set('name', 'Alex');

user = Object.fromEntries(userMap);



/*
Отличия WeakMap от Map:
1) ключи в WeakMap должны быть объектами, а не примитивами
2) если больше нет ссылок на этот объект, то он будет удалён из памяти (и из объекта WeakMap)
3) WeakMap не поддерживает clear, size
4) WeakMap не поддерживает перебор и методы keys(), values(), entries()
*/


// Number map =====================================================================================
interface User {
    name: string;
}
let user: User | null = { name: 'Stoic' };

const userRoles: WeakMap<User, string> = new WeakMap([
    [user, 'admin'],
]);

userRoles.get(user); // admin

user = null; // объект будет удалён из памяти и из WeakMap

userRoles.size;       // error
userRoles.clear();    // error
userRoles.keys();     // error
userRoles.values();   // error
userRoles.entries();  // error

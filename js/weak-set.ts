/*
Отличия WeakSet от Set:
1) мы можем добавлять в WeakSet только объекты (не примитивы)
2) если больше нет ссылок на этот объект, то он будет удалён из памяти (и из объекта WeakSet)
3) WeakSet не поддерживает clear, size
4) WeakSet не поддерживает перебор и методы keys(), values(), entries()
*/


// User set =======================================================================================
interface User {
    name: string;
}

let user: User | null = { name: 'Stoic' };

const userSet: WeakSet<User> = new WeakSet();

userSet.add(user);

user = null; // объект будет удалён из памяти и из WeakSet

userSet.size;       // error
userSet.clear();    // error
userSet.keys();     // error
userSet.values();   // error
userSet.entries();  // error

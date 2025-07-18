/*
Set – это коллекция, где каждое значение может появляться только один раз
*/


// User set =======================================================================================
interface User {
    name: string;
}

const user1: User = { name: 'Stoic' };
const user2: User = { name: 'Kent' };

const userSet: Set<User> = new Set([user1]);

userSet.add(user2);
userSet.has(user2); // true

userSet.add(user2);
userSet.add(user2);
userSet.size;       // 2

userSet.delete(user2);
userSet.clear();

userSet.values();     // итерируемый объект со значениями
userSet.keys();       // то же самое, что и values
userSet.entries();    // возвращает итерируемый объект по парам вида [значение, значение]

for (let user of userSet) {
    console.log(user);
}

userSet.forEach((value, valueAgain, set) => {
    // value === valueAgain
    console.log(value);
});

// Example ========================================================================================

interface User {
    name: string;
    age: number;
    log: (id: number) => string;
}

interface Role {
    roleId: number;
}

interface UserWithRole extends User, Role {
    createdAt: Date;
}

let user: UserWithRole = {
    name: 'John',
    age: 30,
    roleId: 1,
    createdAt: new Date(),
    log: (id: number) => 'log'
}

// Extending ======================================================================================

interface Test {
  title: string
}

interface Test {
  ts: number;
}

const x: Test = { // error
    ts: 2,
}


## Определения

*Паттерн* — шаблон или образец решения типовых проблем при проектировании программ
`Предназначение паттернов — помощь в решении архитектурных проблем, которые либо уже обнаружились,
либо, вероятнее всего, обнаружатся в ходе развития проекта.`



## Порождающие паттерны

### Prototype
*Польза* 2/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/prototype
*Проблема* — нужно скопировать объект, но часть его свойств приватна, либо имеет множество свойств и экземпляров
```js
class Cat {
    constructor({ color, race }) {
        this.color = color;
        this.race = race;
    }
}

const catsArmy = [
    new Cat({ color: 'white', race: 'Persian' }),
    new Cat({ color: 'white', race: 'Persian' }),
    new Cat({ color: 'white', race: 'Persian' }),
];
```
*Решение* — добавить в интерфейс объекта метод клонирования
```js
class Cat {
    constructor({ color, race }) {
        this.color = color;
        this.race = race;
    }
    clone() {
        return new Cat({ color: this.color, race: this.race });
    }
}

const catsSolder = new Cat({ color: 'white', race: 'Persian' });
const catsArmy = [
    catsSolder.clone(),
    catsSolder.clone(),
    catsSolder.clone(),
];
```
*Альтернатива* — создание подклассов, использование классических методов клонирования



### Singleton
*Польза* 3/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/singleton
*Проблема* — создания нескольких экземпляров, что при водит к дублирование, сложности управления, утечкам данных, багам
```js
class Cat {
    constructor({ name, energy }) {
        this.name = name;
        this.energy = 0;
    }

    feed() {
        this.energy += 10;
    }
}

const cat1 = new Cat({ name: 'Barsik', energy: 0 });
const cat2 = new Cat({ name: 'Barsik', energy: 0 });

cat1.feed(); // Покормили Барсика 2 раза, состояние разрознено
cat2.feed();
```
*Решение* — гарантия единственного экземпляра класса
```js
class Cat {
    constructor({ name, energy}) {
        if (Cat.instance) {
            return Cat.instance;
        }

        this.name = name;
        this.energy = 0;
        Cat.instance = this;
    }

    feed() {
        this.energy += 10;
    }
}

const cat1 = new Cat({ name: 'Barsik', energy: 0 });
const cat2 = new Cat();

cat1.feed();
cat2.feed(); // 20!
```
*Альтернатива* — модуль как singleton, `module.exports = new Logger()`



### Factory
// TODO



## Структурные паттерны

### Proxy
*Польза* 5/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/proxy
*Проблема* — хотим контролировать доступ к объекту (проверка прав, кэша, изменение поведения)
```js
const cat = new Cat({ owner: 'Ivan' });
const person = new Person({ name: 'Oleg' });

cat.stroke(person); // You not owner!
```
*Решение* — создать proxy обёртку над объектом для перехвата вызовов к оригинальному объекту
```ts
class ProxyCat {
    constructor(cat) {
        this.cat = cat;
    }
    stroke({ name }) {
        if (name === this.cat.owner) {
            this.cat.stroke();
        } else {
            console.log('You not owner!');
        }
    }
}

const cat = new Cat({ owner: 'Ivan' });
const proxyCat = new ProxyCat(cat);
const person = new Person({ name: 'Oleg' });
cat.stroke(person);
```



### Decorator
*Польза* 5/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/decorator
*Проблема* — хотим добавлять функциональность(кэширование, логирование и т. д.) не меняя объект и не дублируя эту функциональность и не перегружая объект.
```js
const myCat = new Cat();
let catEnergy = 0;
myCat.feed();
catEnergy += 10;

myCat.feed();
catEnergy += 10;

myCat.feed();
catEnergy += 10;
```
*Решение* — создать proxy обёртку над объектом, добавляя необходимую функциональность
```ts
const myCat = new Cat();
const catWithEnergy = new CatWithEnergy(catLib);

catWithEnergy.feed();
catWithEnergy.feed();
catWithEnergy.feed();
```


### Flyweight
// TODO



### Adapter
*Польза* 5/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/adapter
*Проблема* — есть функционал с определённым интерфейсом и есть данные, которые мы хотим обработать, но не поддерживающие этот интерфейс
```js
class Person {
    constructor(animal) {
        this.animal = animal;
    }

    feedAnimal() {
        this.animal.feed();
    }
}

const cat = new Cat();
cat.eat();
```
*Решение* — создать адаптер для класса, чтобы адаптировать его интерфейс под требуемый формат
```js
class CatAdapter {
    constructor() {
        this.cat = new Cat();
    }

    feed() {
        this.cat.eat();
    }
}
```



## Поведенческие паттерны

### Observer
*Польза* 5/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/observer
*Проблема* — в коде есть событие, на которое другие объекты должны реагировать, при этом событий очень много и ручной вызов усложняет код
```js
class Cat {
    constructor({ owner, dog, child }) {
        this.owner = owner;
        this.dog = dog;
        this.child = child;
    }

    meow() {
        console.log('Meow!');
        this.owner.checkCat();
        this.dog.lie();
        this.child.payAttention();
    }
}

const owner = new Person();
const dog = new Dog();
const child = new Child();
const cat = new Cat({ owner, dog, child });

cat.meow();
```
*Решение* — сделать систему подписок, субъект не знает, кто именно его слушает, а наблюдатели могут подписываться и отписываться динамически
```js
class Cat {
    constructor() {
        this.observers = [];
    }

    subscribeOnMeow(observer) {
        this.observers.push(observer);
    }

    meow() {
        console.log('Meow!');
        this.observers.forEach(observer => observer());
    }
}

const owner = new Person();
const dog = new Dog();
const child = new Child();
const cat = new Cat();
cat.subscribeOnMeow(owner.checkCat);
cat.subscribeOnMeow(dog.lie);
cat.subscribeOnMeow(child.payAttention);
cat.meow();
```



### State
*Польза* 4/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/state
*Проблема* — код сильно зависит от состояния, из-за чего его поддержка усложняется и разрастается
```js
class Cat {
    meow() {
        if (this.isHungry) return 'MEOW!!!';
        if (this.isSleeping) return null;
        if (this.isPlaying) return 'meow meow';
        return 'meow';
    }
}

```
*Решение* — создать отдельные классы для каждого состояния, в котором может пребывать объект, а затем вынести туда поведения, соответствующие этим состояниям
```js
class CatState {
    meow(cat) { throw new Error; }
}

class HungryState extends CatState {
    meow() { return 'MEOW!!!'; }
}

class SleepingState extends CatState {
    meow() { return null; }
}

class PlayingState extends CatState {
    meow() { return 'meow meow'; }
}

class Cat {
    constructor() {
        this.state = new SleepingState();
    }

    setState(state) {
        this.state = state;
    }

    meow() {
        console.log(this.state.meow(this));
    }
}
```



### Strategy
*Польза* 4/5
*Ссылка* — https://refactoring.guru/ru/design-patterns/strategy
*Проблема* — жёстко зашитые условные конструкции внутри одного класса, и будем устанавливать его в зависимости от задач
```js
class Cat {
    constructor(name) {
        this.name = name;
        this.energy = 0;
    }

    feed() {
        if (name === 'Barsik') {
            this.energy += 10;
        }
        else if (name === 'Tom') {
            this.energy += 8;
        }
        else if (name === 'Simba') {
            this.energy += 12;
        }
        else {
            throw new Error('Unknown cat!!!');
        }
    }
}
```
*Решение* — создадим отдельные классы для каждого поведения, а затем вынесем поведение в отдельный класс
```js
import { KittenFeeding, WeightLossFeeding, SeniorFeeding } from 'feeding-strategies';

class Cat {
    constructor() {
        this.energy = 0;
    }

    setFeedingStrategy(strategy) {
        this.feedingStrategy = strategy;
    }

    feed() {
        if (!this.feedingStrategy) {
            throw new Error('Feeding strategy not set!');
        }
        const energy = this.feedingStrategy.calculatePortion(this);
        this.energy += energy;
    }
}

const cat1 = new Cat();
cat1.setFeedingStrategy(new KittenFeeding());

const cat2 = new Cat();
cat2.setFeedingStrategy(new WeightLossFeeding());

const cat3 = new Cat();
cat3.setFeedingStrategy(new SeniorFeeding());
```


### Visitor
// TODO

## Антипаттерны

*Золотoй молотoк* — антипаттерн проектирования, заключающийся в использовании одного и того же решения везде, в том
числе путём искусственной подгонки условий, требований, ограничений задачи под данное решение



enum StatusCode {
    SUCCESS, // 0
    ERROR,   // 1
    WARNING, // 2
}

enum StatusCode2 {
    SUCCESS = 1,
    ERROR = 2,
    WARNING = 3,
}

enum StatusCode3 {
    SUCCESS = 1,
    ERROR = '435',
    WARNING = 123,
}

interface Result {
    message: string;
    statusCode: StatusCode;
}

const res: Result = {
    message: 'success',
    statusCode: 1,
};

if (res.statusCode == StatusCode.SUCCESS) {

}

function action(statusCode: StatusCode3) {

}

action(StatusCode3.SUCCESS);
action(1);
// action('435'); but you can't do this

// Enum с const: если сделать компиляцию, то его не будет.
// Компилятор найдёт все места, где используется enum и заменит его на примитивное значение
const enum StatusCode4 {
    SUCCESS = 1,
    ERROR = 2,
    WARNING = 3,
}

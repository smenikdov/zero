function makeDate(timestamp: number): Date // Сигнатура перегрузки

function makeDate(d: number, m: number, y: number): Date  // Сигнатура перегрузки

function makeDate(dOrTimestamp: number, m?: number, y?: number): Date {  // Сигнатура реализации
    if (m !== undefined && y !== undefined) {
        return new Date(y, m, dOrTimestamp)
    } else {
        return new Date(dOrTimestamp)
    }
}

const d1 = makeDate(12345678)
const d2 = makeDate(5, 5, 5)
const d3 = makeDate(1, 3) // error

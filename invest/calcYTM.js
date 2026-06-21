import { calcPeriodPayment } from './calcPeriodPayment.js';

/**
 * Расчет текущая рыночной цены облигации
 * @param {number} periodPayment — купонный платеж за период (в деньгах)
 * @param {number} YTM — доходность к погашению (YTM) за период
 * @param {number} nominal — номинал облигации
 * @param {number} periodCount — количество оставшихся купонных периодов до погашения
 * @param {number} paymentFrequency — количество выплат за год
 * @param {number}
 */
function calcBondPrice(periodPayment, YTM, nominal, periodCount, paymentFrequency) {
    let P = 0;

    for (let i = 1; i <= periodCount; i++) {
        P += periodPayment / Math.pow(1 + YTM / paymentFrequency, i)
    }

    P += nominal / Math.pow(1 + YTM / paymentFrequency, periodCount);

    return P;
}

function getDaysInPeriodByPaymentFrequency(paymentFrequency) {
    if (paymentFrequency === 1) {
        return 365;
    }

    if (paymentFrequency === 2) {
        return 182;
    }

    if (paymentFrequency === 4) {
        return 91;
    }

    if (paymentFrequency === 12) {
        return 30;
    }

    throw new Error('Unknown payment frequency');
}


/**
 * Простейший расчет YTM методом бисекции
 * @param {number} nominal
 * @param {number} price
 * @param {number} nkd
 * @param {number} rate
 * @param {number} periodCount
 * @param {number} paymentFrequency
 */
function calcYTM({ nominal, price, nkd, rate, periodCount, paymentFrequency }) {
    const MAX_ITERATIONS = 1000;

    const daysInPeriod = getDaysInPeriodByPaymentFrequency(paymentFrequency);
    const periodPayment = calcPeriodPayment(nominal, rate, daysInPeriod);
    let low = 0;
    let high = 1;
    const tolerance = 1e-6;

    // Поиск методом бисекции
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const mid = (low + high) / 2;
        const calculatedPrice = calcBondPrice(periodPayment, mid, nominal, periodCount, paymentFrequency);

        if (Math.abs(calculatedPrice - (price + nkd)) < tolerance) {
            return mid * 100;
        }

        if (calculatedPrice > price + nkd) {
            low = mid;
        } else {
            high = mid;
        }
    }

    return ((low + high) / 2) * 100;
}


// ISIN RU000A0ZYQY7 15.7
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1008.4,
//     nkd:              39.5,
//     rate:             19.5,
//     paymentFrequency: 2,
//     periodCount:      3, // не факт, что 3
// }));

// ISIN RU000A10C5L7 15.13
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1047.5,
//     nkd:              9.9,
//     rate:             19,
//     paymentFrequency: 12,
//     periodCount:      22,
// }));

// ISIN RU000A10B933 15.19
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1100.6,
//     nkd:              2.6,
//     rate:             23.25,
//     paymentFrequency: 12,
//     periodCount:      18,
// }));

// ISIN RU000A1055Y4 15.5 (к оферте)
// console.log(calcYTM({
//     nominal:          1000,
//     price:            910,
//     nkd:              8.6,
//     rate:             9.25,
//     paymentFrequency: 2,
//     periodCount:      3,
// }));



// ISIN RU000A107W48 13.47
// console.log(calcYTM({
//     nominal:          1000,
//     price:            991.6,
//     nkd:              15.2,
//     rate:             14.25,
//     paymentFrequency: 4,
//     periodCount:      4,
// }));

// ISIN SU26233RMFS5 13.55
// console.log(calcYTM({
//     nominal:          1000,
//     price:            595.8,
//     nkd:              11.53,
//     rate:             6.1,
//     paymentFrequency: 2,
//     periodCount:      19,
// }));



// ISIN SU26230RMFS1 13.96
// console.log(calcYTM({
//     nominal:          1000,
//     price:            626.37,
//     nkd:              1.27,
//     rate:             7.7,
//     paymentFrequency: 2,
//     periodCount:      26,
// }));


// ISIN RU000A10DA41 19 оч условно
// console.log(calcYTM({
//     nominal:          1000,
//     price:            965,
//     nkd:              5.7,
//     rate:             18,  // примерно
//     paymentFrequency: 12,
//     periodCount:      31,
// }));

// ISIN RU000A10EA08 16.36
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1052.3,
//     nkd:              12.3,
//     rate:             19.5,
//     paymentFrequency: 12,
//     periodCount:      34,
// }));


// ISIN RU000A10EES4 15.50
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1027.2,
//     nkd:              2.3,
//     rate:             17,
//     paymentFrequency: 12,
//     periodCount:      35,
// }));

// ISIN SU26245RMFS9 14.09
// console.log(calcYTM({
//     nominal:          1000,
//     price:            888,
//     nkd:              2.3,
//     rate:             12,
//     paymentFrequency: 2,
//     periodCount:      19,
// }));

// ISIN RU000A10EMU3 15.73 (с амортизацией)
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1006.4,
//     nkd:              2.3,
//     rate:             16.25,
//     paymentFrequency: 12,
//     periodCount:      48,
// }));

// ISIN RU000A10DYG9 13.5
// console.log(calcYTM({
//     nominal:          1000,
//     price:            1045.7,
//     nkd:              11.2,
//     rate:             15.15,
//     paymentFrequency: 4,
//     periodCount:      21,
// }));

// ISIN RU000A10DTF1 15.01
console.log(calcYTM({
    nominal:          1000,
    price:            1045.7,
    nkd:              3,
    rate:             18,
    paymentFrequency: 12,
    periodCount:      26,
}));

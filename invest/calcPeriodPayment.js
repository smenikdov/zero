export const calcPeriodPayment = (investAmount, rate, daysInPeriod) => {
    return investAmount * rate / 100 * (daysInPeriod / 365);
}

// console.log(calcPeriodPayment(1000, 16.5, 30));
// console.log(calcPeriodPayment(1000, 8.5, 182));

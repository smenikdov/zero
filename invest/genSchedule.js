import { calcPeriodPayment } from './calcPeriodPayment.js';

const genSchedule = ({ investAmount, rate, daysInPeriod, periodCount }) => {
    let investAmountCurrent = investAmount;
    let totalIncome = 0;

    for (let i = 1; i <= periodCount; i++) {
        const periodPayment = calcPeriodPayment(investAmountCurrent, rate, daysInPeriod);
        totalIncome += periodPayment;

        investAmountCurrent += periodPayment;

        console.log(`period ${ i } | ${ periodPayment } | ${ investAmountCurrent }`);
    }

    const totalPercent = totalIncome / investAmount * 100;
    const totalYearPercent = totalPercent * 365 / (daysInPeriod * periodCount);

    console.log(`\nTotal income: ${ totalIncome }`);
    console.log(`Total percent: ${ totalPercent }%`);
    console.log(`Total year percent: ${ totalYearPercent }%`);
};

genSchedule({
    investAmount: 1000,
    rate:         16.5,
    daysInPeriod: 30,
    periodCount:  3,
});

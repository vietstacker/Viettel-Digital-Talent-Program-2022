export const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND'
});

export function numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function round(num, base = 3) {
    return Math.round((num + Number.EPSILON) * 10 ** base) / 10 ** base;
}

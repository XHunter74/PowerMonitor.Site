export function daysInMonth(year: number, month: number) {
    const days = new Date(year, month, 0).getDate();
    return days;
}

export function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : (a === b ? 0 : 1)) * (isAsc ? 1 : -1);
}

export class StringUtils {
    public static formatNumber(value: number): string {
        let strValue = (Math.round(value * 100) / 100).toString();
        if (!strValue.includes('.')) {
            strValue = `${strValue}.00`;
        } else {
            const parts = strValue.split('.');
            if (parts[1].length !== 2) {
                strValue = `${strValue}0`;
            }
        }
        return strValue;
    }
}

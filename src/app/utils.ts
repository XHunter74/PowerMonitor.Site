export function daysInMonth(year: number, month: number) {
    const days = new Date(year, month, 0).getDate();
    return days;
}

export function isCurrentMonth(currentDate: Date) {
    const today = new Date();
    const isCurrentMonthResult = currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth();
    return isCurrentMonthResult;
}

export function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : (a === b ? 0 : 1)) * (isAsc ? 1 : -1);
}

export function getStringDate(val: Date) {
    const dateStr = val.getFullYear().toString() + '-' + (val.getMonth() + 1).toString() +
        '-' + val.getDate().toString();
    return dateStr;
}

export function formatDurationWithDays(duration: number): string {
    let sec_num = Math.floor(duration / 1000);
    const days = Math.floor(sec_num / 24 / 3600);
    sec_num -= days * 24 * 3600;
    const hours = Math.floor(sec_num / 3600);
    sec_num -= hours * 3600;
    const minutes = Math.floor(sec_num / 60);
    sec_num -= minutes * 60;
    const seconds = sec_num;

    const daysS = days > 0 ? days.toString() + 'd ' : '';
    const hoursS = hours.toString().padStart(2, '0');
    const minutesS = minutes.toString().padStart(2, '0');
    const secondsS = seconds.toString().padStart(2, '0');

    return daysS + hoursS + ':' + minutesS + ':' + secondsS;
}

export function formatNumber(value: number): string {
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

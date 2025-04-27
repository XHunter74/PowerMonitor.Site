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

export function getStringDate(val: Date) {
    const dateStr = val.getFullYear().toString() + '-' + (val.getMonth() + 1).toString() +
        '-' + val.getDate().toString();
    return dateStr;
}

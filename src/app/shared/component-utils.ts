import { Direction } from '../models/app.enums';
import { Constants } from './constants';

export class ComponentUtils {
    public static isHourlyChangeDayButtonDisabled(
        currentDate: Date,
        direction: Direction,
    ): boolean {
        const nextDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
        );
        if (direction === Direction.Up) {
            const today = new Date();
            today.setHours(23, 59, 59, 0);
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate > today;
        } else {
            nextDate.setDate(nextDate.getDate() - 1);
            return nextDate < Constants.systemStartDate;
        }
    }

    public static isDailyChangeDayButtonDisabled(currentDate: Date, direction: Direction): boolean {
        const nextDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
        );
        if (direction === Direction.Up) {
            nextDate.setMonth(nextDate.getMonth() + 1);
            const today = new Date();
            return (
                nextDate.getFullYear() * Constants.MonthsInYear + nextDate.getMonth() >
                today.getFullYear() * Constants.MonthsInYear + today.getMonth()
            );
        } else {
            nextDate.setMonth(nextDate.getMonth() - 1);
            return (
                nextDate.getFullYear() * Constants.MonthsInYear + nextDate.getMonth() <
                Constants.systemStartDate.getFullYear() * Constants.MonthsInYear +
                    Constants.systemStartDate.getMonth()
            );
        }
    }
}

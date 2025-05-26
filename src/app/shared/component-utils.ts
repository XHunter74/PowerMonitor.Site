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
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate > new Date();
        } else {
            nextDate.setDate(nextDate.getDate() - 1);
            return nextDate < Constants.systemStartDate;
        }
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Intervals } from '../shared/constants';

@Pipe({
    name: 'formatDuration',
})
export class FormatDurationPipe implements PipeTransform {
    transform(duration: number): string {
        if (duration <= 0 || isNaN(duration)) {
            return '00:00:00';
        }
        let sec_num = Math.floor(duration / Intervals.OneSecond);
        const hours = Math.floor(sec_num / Intervals.OneHourInSeconds);
        sec_num -= hours * Intervals.OneHourInSeconds;
        const minutes = Math.floor(sec_num / Intervals.OneMinuteInSeconds);
        sec_num -= minutes * Intervals.OneMinuteInSeconds;
        const seconds = sec_num;

        const hoursS = hours.toString().padStart(2, '0');
        const minutesS = minutes.toString().padStart(2, '0');
        const secondsS = seconds.toString().padStart(2, '0');

        return `${hoursS}:${minutesS}:${secondsS}`;
    }
}

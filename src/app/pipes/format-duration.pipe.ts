import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatDuration',
})
export class FormatDurationPipe implements PipeTransform {
    transform(duration: number): string {
        let sec_num = Math.floor(duration / 1000);
        const hours = Math.floor(sec_num / 3600);
        sec_num -= hours * 3600;
        const minutes = Math.floor(sec_num / 60);
        sec_num -= minutes * 60;
        const seconds = sec_num;

        const hoursS = hours.toString().padStart(2, '0');
        const minutesS = minutes.toString().padStart(2, '0');
        const secondsS = seconds.toString().padStart(2, '0');

        return hoursS + ':' + minutesS + ':' + secondsS;
    }
}

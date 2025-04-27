import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDurationWithDays'
})
export class FormatDurationWithDaysPipe implements PipeTransform {
  transform(duration: number): string {
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
}
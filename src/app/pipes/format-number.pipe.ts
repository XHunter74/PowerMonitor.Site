import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number): string {
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
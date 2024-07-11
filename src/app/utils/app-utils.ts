export class AppUtils {
    static formatDuration(duration: number): string {
        const sec_num = Math.floor(duration / 1000); // don't forget the second param
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        const seconds = sec_num - (hours * 3600) - (minutes * 60);
        let hoursS = hours.toString();
        let minutesS = minutes.toString();
        let secondsS = seconds.toString();

        if (hours < 10) { hoursS = '0' + hoursS; }
        if (minutes < 10) { minutesS = '0' + minutesS; }
        if (seconds < 10) { secondsS = '0' + secondsS; }
        return hoursS + ':' + minutesS + ':' + secondsS;
    }
}
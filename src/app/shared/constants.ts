export class Constants {
    static systemStartDate = new Date(2019, 1, 18);
    static shortMonthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    static monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    static AppLanguage = 'app-language';
    static RequestTimeout = 5000;
    static PingApiDelay = 20000;
    static RetryCount = 3;
    static RefreshToken = 'refresh_token';
    static TokenExpiresIn = 'token_expires_in';
    static AuthToken = 'auth_token';
    static CheckSocketConnectionInterval = 1000;
    static AdminRole = 'admin';
    static PongResponse = 'pong';
    static MinutesImHours = 60;
    static HoursInDay = 24;
    static MonthsInYear = 12;
}

export class ChartsConstants {
    static voltageChart = {
        maxVoltage: 300,
        nominalMin: 207,
        nominalMax: 253,
        defaultVoltage: 230,
    };
    static amperageChart = {
        maxAmperage: 30,
        nominalMax: 20,
        defaultAmperage: 0,
    };
    static powerChart = {
        maxPower: 8,
        nominalMax: 5,
        defaultPower: 0,
    };
}

export class Intervals {
    public static OneSecond = 1000;
    public static OneMinute = 60 * 1000;
    public static OneMinuteInSeconds = 60;
    public static OneHourInSeconds = 60 * 60;
    public static OneDayInSeconds = 24 * this.OneHourInSeconds;
}

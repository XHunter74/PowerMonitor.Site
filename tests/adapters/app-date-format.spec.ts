import {
    APP_DATE_FORMATS,
    MONTH_DATE_FORMATS,
    YEAR_DATE_FORMATS,
} from '../../src/app/adapters/app-date-format';

describe('APP_DATE_FORMATS', () => {
    it('parse.dateInput should be "DD.MM.YYYY"', () => {
        expect(APP_DATE_FORMATS.parse.dateInput).toBe('DD.MM.YYYY');
    });

    it('display.dateInput should be "DD.MM.YYYY"', () => {
        expect(APP_DATE_FORMATS.display.dateInput).toBe('DD.MM.YYYY');
    });

    it('display.monthYearLabel should be "MMM YYYY"', () => {
        expect(APP_DATE_FORMATS.display.monthYearLabel).toBe('MMM YYYY');
    });
});

describe('MONTH_DATE_FORMATS', () => {
    it('parse.dateInput should be "MM.YYYY"', () => {
        expect(MONTH_DATE_FORMATS.parse.dateInput).toBe('MM.YYYY');
    });

    it('display.dateInput should be "MM.YYYY"', () => {
        expect(MONTH_DATE_FORMATS.display.dateInput).toBe('MM.YYYY');
    });

    it('display.monthYearLabel should be "MMM YYYY"', () => {
        expect(MONTH_DATE_FORMATS.display.monthYearLabel).toBe('MMM YYYY');
    });
});

describe('YEAR_DATE_FORMATS', () => {
    it('parse.dateInput should be "YYYY"', () => {
        expect(YEAR_DATE_FORMATS.parse.dateInput).toBe('YYYY');
    });

    it('display.dateInput should be "YYYY"', () => {
        expect(YEAR_DATE_FORMATS.display.dateInput).toBe('YYYY');
    });

    it('display.monthYearLabel should be "MMM YYYY"', () => {
        expect(YEAR_DATE_FORMATS.display.monthYearLabel).toBe('MMM YYYY');
    });
});

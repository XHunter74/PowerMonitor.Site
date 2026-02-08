import { getStringDate, isCurrentMonth } from '../../src/app/shared/utils';

describe('getStringDate', () => {
    it('should return YYYY-M-D for a regular date', () => {
        const date = new Date(2025, 4, 9); // May 9, 2025
        expect(getStringDate(date)).toBe('2025-5-9');
    });

    it('should return YYYY-M-D for a date with single-digit month and day', () => {
        const date = new Date(2025, 0, 1); // Jan 1, 2025
        expect(getStringDate(date)).toBe('2025-1-1');
    });

    it('should return YYYY-M-D for a date with double-digit month and day', () => {
        const date = new Date(2025, 10, 15); // Nov 15, 2025
        expect(getStringDate(date)).toBe('2025-11-15');
    });

    it('should handle leap year dates', () => {
        const date = new Date(2024, 1, 29); // Feb 29, 2024
        expect(getStringDate(date)).toBe('2024-2-29');
    });
});

describe('isCurrentMonth', () => {
    let now: Date;
    let currentYear: number;
    let currentMonth: number;

    beforeEach(() => {
        now = new Date();
        jest.useFakeTimers();
        jest.setSystemTime(now);
        currentYear = now.getFullYear();
        currentMonth = now.getMonth();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return true if the date is in the current month and year', () => {
        const date = new Date(currentYear, currentMonth, 1);
        expect(isCurrentMonth(date)).toBe(true);
    });

    it('should return false if the date is in a different month but same year', () => {
        const differentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const date = new Date(currentYear, differentMonth, 1);
        expect(isCurrentMonth(date)).toBe(false);
    });

    it('should return false if the date is in a different year but same month', () => {
        const date = new Date(currentYear - 1, currentMonth, 1);
        expect(isCurrentMonth(date)).toBe(false);
    });

    it('should return false if the date is in a different month and year', () => {
        const differentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const date = new Date(currentYear - 1, differentMonth, 1);
        expect(isCurrentMonth(date)).toBe(false);
    });
});

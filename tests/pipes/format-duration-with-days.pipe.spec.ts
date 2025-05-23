import { FormatDurationWithDaysPipe } from '../../src/app/pipes/format-duration-with-days.pipe';

describe('FormatDurationWithDaysPipe', () => {
    let pipe: FormatDurationWithDaysPipe;

    beforeEach(() => {
        pipe = new FormatDurationWithDaysPipe();
    });

    it('should format duration less than a day', () => {
        // 1 hour, 2 minutes, 3 seconds = 3723000 ms
        expect(pipe.transform(3723000)).toBe('01:02:03');
    });

    it('should format duration with days', () => {
        // 2 days, 3 hours, 4 minutes, 5 seconds = (2*24*3600 + 3*3600 + 4*60 + 5) * 1000 ms
        const ms = (2 * 24 * 3600 + 3 * 3600 + 4 * 60 + 5) * 1000;
        expect(pipe.transform(ms)).toBe('2d 03:04:05');
    });

    it('should pad hours, minutes, and seconds with zeros', () => {
        // 0 days, 1 hour, 2 minutes, 3 seconds = 3723000 ms
        expect(pipe.transform(3723000)).toBe('01:02:03');
    });

    it('should return 00:00:00 for zero duration', () => {
        expect(pipe.transform(0)).toBe('00:00:00');
    });

    it('should handle negative durations as zero', () => {
        expect(pipe.transform(-1000)).toBe('00:00:00');
    });
});

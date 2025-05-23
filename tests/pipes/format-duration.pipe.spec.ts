import { FormatDurationPipe } from '../../src/app/pipes/format-duration.pipe';

describe('FormatDurationPipe', () => {
    let pipe: FormatDurationPipe;

    beforeEach(() => {
        pipe = new FormatDurationPipe();
    });

    it('should format duration less than an hour', () => {
        // 2 minutes, 3 seconds = 123000 ms
        expect(pipe.transform(123000)).toBe('00:02:03');
    });

    it('should format duration with hours', () => {
        // 1 hour, 2 minutes, 3 seconds = 3723000 ms
        expect(pipe.transform(3723000)).toBe('01:02:03');
    });

    it('should pad hours, minutes, and seconds with zeros', () => {
        // 9 hours, 8 minutes, 7 seconds = 32887000 ms
        expect(pipe.transform(32887000)).toBe('09:08:07');
    });

    it('should return 00:00:00 for zero duration', () => {
        expect(pipe.transform(0)).toBe('00:00:00');
    });

    it('should handle negative durations as zero', () => {
        expect(pipe.transform(-1000)).toBe('00:00:00');
    });
});

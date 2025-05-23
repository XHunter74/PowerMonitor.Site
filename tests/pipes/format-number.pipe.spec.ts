import { FormatNumberPipe } from '../../src/app/pipes/format-number.pipe';

describe('FormatNumberPipe', () => {
    let pipe: FormatNumberPipe;

    beforeEach(() => {
        pipe = new FormatNumberPipe();
    });

    it('should format integer values with two decimals', () => {
        expect(pipe.transform(5)).toBe('5.00');
        expect(pipe.transform(0)).toBe('0.00');
        expect(pipe.transform(-3)).toBe('-3.00');
    });

    it('should format values with one decimal to two decimals', () => {
        expect(pipe.transform(2.1)).toBe('2.10');
        expect(pipe.transform(-7.5)).toBe('-7.50');
    });

    it('should round and format values with more than two decimals', () => {
        expect(pipe.transform(3.456)).toBe('3.46');
        expect(pipe.transform(1.2345)).toBe('1.23');
        expect(pipe.transform(-2.999)).toBe('-3.00');
    });

    it('should handle zero correctly', () => {
        expect(pipe.transform(0)).toBe('0.00');
    });
});

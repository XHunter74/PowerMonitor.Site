import { Direction } from '../../src/app/models/app.enums';
import { ComponentUtils } from '../../src/app/shared/component-utils';
import { Constants } from '../../src/app/shared/constants';

describe('ComponentUtils', () => {
    describe('isHourlyChangeDayButtonDisabled', () => {
        beforeEach(() => {
            // Set a known system start date for all tests
            Constants.systemStartDate = new Date(2020, 0, 1);
        });

        it('should disable the up button if next day is in the future', () => {
            const today = new Date(2025, 4, 26); // May 26, 2025
            const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            expect(ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Up)).toBe(
                true,
            );
        });

        it('should not disable the up button if next day is not in the future', () => {
            const currentDate = new Date(2025, 4, 25); // May 25, 2025
            expect(ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Up)).toBe(
                false,
            );
        });

        it('should disable the down button if previous day is before systemStartDate', () => {
            const currentDate = new Date(2020, 0, 1); // Jan 1, 2020
            expect(
                ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Down),
            ).toBe(true);
        });

        it('should not disable the down button if previous day is after systemStartDate', () => {
            const currentDate = new Date(2025, 4, 26); // May 26, 2025
            expect(
                ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Down),
            ).toBe(false);
        });

        it('should handle edge case: currentDate is exactly systemStartDate and direction is up', () => {
            const currentDate = new Date(2020, 0, 1);
            expect(ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Up)).toBe(
                false,
            );
        });

        it('should handle edge case: currentDate is exactly systemStartDate and direction is down', () => {
            const currentDate = new Date(2020, 0, 1);
            expect(
                ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Down),
            ).toBe(true);
        });

        it('should handle edge case: currentDate is today and direction is up', () => {
            const today = new Date(2025, 4, 26);
            const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            expect(ComponentUtils.isHourlyChangeDayButtonDisabled(currentDate, Direction.Up)).toBe(
                true,
            );
        });
    });
});

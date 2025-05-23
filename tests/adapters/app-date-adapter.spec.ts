import { AppDateAdapter } from '../../src/app/adapters/app-date.adapter';

describe('AppDateAdapter', () => {
    let adapter: AppDateAdapter;

    beforeEach(() => {
        // Initialize the adapter with a locale (e.g., 'en-US')
        adapter = new AppDateAdapter('en-US');
    });

    it('should return 1 (Monday) as the first day of the week', () => {
        expect(adapter.getFirstDayOfWeek()).toBe(1);
    });
});

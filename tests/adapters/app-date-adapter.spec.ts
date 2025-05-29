import { TestBed } from '@angular/core/testing';
import { AppDateAdapter } from '../../src/app/adapters/app-date.adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

describe('AppDateAdapter', () => {
    let adapter: AppDateAdapter;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
                { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {} },
                AppDateAdapter,
            ],
        });
        adapter = TestBed.inject(AppDateAdapter);
    });

    it('should return 1 (Monday) as the first day of the week', () => {
        expect(adapter.getFirstDayOfWeek()).toBe(1);
    });
});

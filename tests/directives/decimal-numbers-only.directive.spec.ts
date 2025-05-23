import { DecimalNumbersOnlyDirective } from '../../src/app/directives/decimal-numbers-only-directive';
import { ElementRef } from '@angular/core';

describe('DecimalNumbersOnlyDirective', () => {
    let directive: DecimalNumbersOnlyDirective;
    let elementRef: ElementRef;
    let nativeElement: { value: string; selectionStart: number };
    let event: KeyboardEvent;

    beforeEach(() => {
        nativeElement = { value: '', selectionStart: 0 };
        elementRef = { nativeElement } as unknown as ElementRef;
        directive = new DecimalNumbersOnlyDirective(elementRef);
    });

    function createKeyEvent(key: string): KeyboardEvent {
        const evt = new KeyboardEvent('keydown', { key });
        // Override preventDefault to spy
        jest.spyOn(evt, 'preventDefault');
        return evt;
    }

    it('should allow digits and special keys', () => {
        // digit
        nativeElement.value = '';
        nativeElement.selectionStart = 0;
        event = createKeyEvent('5');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();

        // special key Backspace
        event = createKeyEvent('Backspace');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should allow decimal input up to two decimals', () => {
        nativeElement.value = '12.3';
        nativeElement.selectionStart = 4;
        event = createKeyEvent('4');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();

        // typing another decimal beyond two places
        nativeElement.value = '12.34';
        nativeElement.selectionStart = 5;
        event = createKeyEvent('5');
        directive.onKeyDown(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should convert Decimal key to dot and allow as decimal point', () => {
        nativeElement.value = '1';
        nativeElement.selectionStart = 1;
        event = createKeyEvent('Decimal');
        directive.onKeyDown(event);
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should strip invalid character in onInput', () => {
        // simulate invalid input, last char should be removed
        nativeElement.value = '12.3a';
        directive.onInput();
        expect(nativeElement.value).toBe('12.3');

        // valid value remains unchanged
        nativeElement.value = '99.99';
        directive.onInput();
        expect(nativeElement.value).toBe('99.99');
    });
});

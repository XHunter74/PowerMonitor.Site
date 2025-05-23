import { AutofocusDirective } from '../../src/app/directives/autofocus.directive';
import { ElementRef } from '@angular/core';

describe('AutofocusDirective', () => {
    let elementRef: ElementRef;
    let directive: AutofocusDirective;
    let nativeElement: { focus: jest.Mock };

    beforeEach(() => {
        jest.useFakeTimers();
        nativeElement = { focus: jest.fn() };
        elementRef = { nativeElement } as unknown as ElementRef;
        directive = new AutofocusDirective(elementRef);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should focus element after 500ms on init', () => {
        directive.ngOnInit();
        expect(nativeElement.focus).not.toHaveBeenCalled();
        jest.advanceTimersByTime(500);
        expect(nativeElement.focus).toHaveBeenCalled();
    });

    it('should not focus element when autofocus input is false', () => {
        directive.autofocus = false;
        directive.ngOnInit();
        jest.advanceTimersByTime(500);
        expect(nativeElement.focus).not.toHaveBeenCalled();
    });
});

import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

global.console = {
    ...console,
    // uncomment to ignore a specific log level
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
};

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// Mock the Web Animations API for Angular Material in Jest/JSDOM
if (!Element.prototype.animate) {
    Element.prototype.animate = function () {
        return {
            play: () => { },
            pause: () => { },
            finish: () => { },
            cancel: () => { },
            reverse: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            onfinish: null,
            currentTime: 0,
            playState: 'finished',
        };
    };
}

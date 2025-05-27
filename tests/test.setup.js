// Suppress console.error globally for all tests (Jest only)
import '@angular/localize/init';
import 'zone.js';
import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';



// Suppress all console output globally for all tests

// Suppress all console output globally for all tests, but filter out only the jsdom navigation error for error()

// Suppress all console output globally for all tests, including jsdom navigation errors
const nullFn = () => { };
global.console = {
    log: nullFn,
    debug: nullFn,
    info: nullFn,
    warn: nullFn,
    error: nullFn,
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

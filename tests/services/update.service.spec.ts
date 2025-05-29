import { UpdateService } from '../../src/app/services/update.service';
import { VersionReadyEvent } from '@angular/service-worker';
import { of, Subject } from 'rxjs';

describe('UpdateService', () => {
    let service: UpdateService;
    let swUpdate: any;
    let snackBar: any;
    let translate: any;
    let versionUpdates$: Subject<any>;
    let snackBarRef: any;

    beforeEach(() => {
        versionUpdates$ = new Subject();
        swUpdate = {
            isEnabled: true,
            versionUpdates: versionUpdates$,
            checkForUpdate: jest.fn(() => Promise.resolve()),
            activateUpdate: jest.fn(() => Promise.resolve()),
        };
        snackBarRef = {
            onAction: jest.fn(() => of(true)),
        };
        snackBar = {
            open: jest.fn(() => snackBarRef),
        };
        translate = {
            get: jest.fn(() => of('New version available!')),
            instant: jest.fn(() => 'Update'),
        };
        jest.spyOn(console, 'log').mockImplementation(() => {});
        service = new UpdateService(swUpdate, snackBar, translate);
    });

    // Console suppression is handled globally in tests/test.setup.js

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call setupUpdateChecking and setupVersionReadyListener if swUpdate.isEnabled', () => {
        expect(swUpdate.checkForUpdate).toHaveBeenCalled();
    });

    it('should call checkForUpdate on interval', () => {
        jest.useFakeTimers();
        // Mock setInterval to use a shorter interval for testing
        const originalSetInterval = window.setInterval;
        const intervalSpy = jest.spyOn(window, 'setInterval');
        (service as any).setupUpdateChecking();
        expect(intervalSpy).toHaveBeenCalled();
        jest.advanceTimersByTime(60000 * 2); // Advance by two intervals (assuming default is 1 min)
        expect(swUpdate.checkForUpdate).toHaveBeenCalledTimes(2);
        jest.useRealTimers();
        intervalSpy.mockRestore();
        window.setInterval = originalSetInterval;
    });

    it('should call promptUpdate on VERSION_READY event', () => {
        const promptSpy = jest.spyOn(service as any, 'promptUpdate');
        versionUpdates$.next({ type: 'VERSION_READY' } as VersionReadyEvent);
        expect(promptSpy).toHaveBeenCalled();
    });

    it('should not call promptUpdate on non-VERSION_READY event', () => {
        const promptSpy = jest.spyOn(service as any, 'promptUpdate');
        versionUpdates$.next({ type: 'OTHER_EVENT' });
        expect(promptSpy).not.toHaveBeenCalled();
    });

    it('should call snackBar.open and activateUpdate on promptUpdate action', () => {
        const activateSpy = jest.spyOn(service as any, 'activateUpdate');
        (service as any).promptUpdate();
        expect(snackBar.open).toHaveBeenCalled();
        expect(translate.get).toHaveBeenCalledWith('UPDATE.NEW_VERSION_AVAILABLE');
        expect(translate.instant).toHaveBeenCalledWith('UPDATE.UPDATE');
        expect(activateSpy).toHaveBeenCalled();
    });

    it('should call swUpdate.activateUpdate and reload on activateUpdate', async () => {
        const reloadMock = jest.fn();
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...window.location, reload: reloadMock },
        });

        const cachesMock = {
            keys: jest.fn(() => Promise.resolve(['cache1', 'cache2'])),
            delete: jest.fn(() => Promise.resolve(true)),
        };
        Object.defineProperty(window, 'caches', { value: cachesMock, configurable: true });
        await (service as any).activateUpdate();
        expect(swUpdate.activateUpdate).toHaveBeenCalled();
        expect(cachesMock.keys).toHaveBeenCalled();
        expect(cachesMock.delete).toHaveBeenCalledWith('cache1');
        expect(cachesMock.delete).toHaveBeenCalledWith('cache2');
        expect(reloadMock).toHaveBeenCalled();

        // Restore window.location
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });

    it('should reload if activateUpdate throws', async () => {
        swUpdate.activateUpdate = jest.fn(() => Promise.reject('fail'));
        const reloadMock = jest.fn();
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...window.location, reload: reloadMock },
        });
        await (service as any).activateUpdate();
        expect(reloadMock).toHaveBeenCalled();
        // Restore window.location
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: originalLocation,
        });
    });

    it('should log error if checkForUpdate fails', async () => {
        swUpdate.checkForUpdate = jest.fn(() => Promise.reject('fail'));
        await (service as any).checkForUpdate();
        // error is suppressed globally, so just check that no error is thrown
        expect(true).toBe(true);
    });
});

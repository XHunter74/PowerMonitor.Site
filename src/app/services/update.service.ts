import { Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, interval } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {
    private readonly checkInterval = 5 * 60 * 1000; // Check every 10 minutes

    constructor(
        private swUpdate: SwUpdate,
        private snackBar: MatSnackBar,
        private translate: TranslateService
    ) {
        if (swUpdate.isEnabled) {
            this.setupUpdateChecking();
            this.setupVersionReadyListener();
        }
    }

    private setupUpdateChecking(): void {
        // Check for updates when the service is initialized
        this.checkForUpdate();

        // Check for updates periodically
        interval(this.checkInterval).subscribe(() => {
            this.checkForUpdate();
        });
    }

    private setupVersionReadyListener(): void {
        this.swUpdate.versionUpdates
            .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
            .subscribe(() => {
                this.promptUpdate();
            });
    }

    private checkForUpdate(): void {
        this.swUpdate.checkForUpdate().catch(err => {
            console.error('Failed to check for updates:', err);
        });
    }

    private promptUpdate(): void {
        this.translate.get('UPDATE.NEW_VERSION_AVAILABLE').subscribe(message => {
            console.log('New version available');
            const updateText = this.translate.instant('UPDATE.UPDATE');

            this.snackBar.open(message, updateText, {
                duration: 60000, // Show for 30 seconds
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            }).onAction().subscribe(() => {
                this.activateUpdate();
            });
        });
    }

    private activateUpdate(): void {
        this.swUpdate.activateUpdate().then(() => {
            document.location.reload();
        });
    }
}

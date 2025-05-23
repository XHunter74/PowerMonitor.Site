import { MomentDateAdapter } from '@angular/material-moment-adapter';

export class AppDateAdapter extends MomentDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    }
}

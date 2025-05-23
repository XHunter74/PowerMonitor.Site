import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RoleGuard {
    constructor(private readonly authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const requiredRole = route.data['role'] as string;
        const userRole = this.authService.userRole;

        if (userRole && userRole.toLowerCase() === requiredRole) {
            return true;
        }

        return false;
    }
}

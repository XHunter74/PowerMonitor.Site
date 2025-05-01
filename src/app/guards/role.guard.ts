import { Injectable } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class RoleGuard {
    constructor(
        private readonly authService: AuthService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiredRole = route.data['role'] as string;
        const userRole = this.authService.userRole;

        if (userRole && userRole.toLowerCase() === requiredRole) {
            return true;
        }

        return false;
    }
}
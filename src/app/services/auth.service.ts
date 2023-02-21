import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserTokenDto } from '../models/user-token.dto';

@Injectable()
export class AuthService {

    private isSignedInSubject = new Subject<boolean>();

    get isAuthenticated(): Observable<boolean> {
        return this.isSignedInSubject.asObservable();
    }

    isSignedIn(): boolean {
        const loggedIn = !!localStorage.getItem('auth_token');
        return loggedIn;
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        this.isSignedInSubject.next(false);
    }

    processLogin(userToken: UserTokenDto) {
        localStorage.setItem('auth_token', userToken.token);
        localStorage.setItem('refresh_token', userToken.refreshToken);
    }
}

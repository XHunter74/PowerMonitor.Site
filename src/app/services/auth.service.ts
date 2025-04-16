import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserTokenDto } from '../models/user-token.dto';
import { Constants } from '../constants';

@Injectable()
export class AuthService {

    private isSignedInSubject = new Subject<boolean>();

    get isAuthenticated(): Observable<boolean> {
        return this.isSignedInSubject.asObservable();
    }

    isSignedIn(): boolean {
        const loggedIn = !!localStorage.getItem(Constants.AuthToken);
        return loggedIn;
    }

    logout() {
        localStorage.removeItem(Constants.AuthToken);
        localStorage.removeItem(Constants.RefreshToken);
        localStorage.removeItem(Constants.TokenExpiresIn);
        this.isSignedInSubject.next(false);
    }

    processLogin(userToken: UserTokenDto) {
        localStorage.setItem(Constants.AuthToken, userToken.token);
        localStorage.setItem(Constants.RefreshToken, userToken.refreshToken);

        // Store token expiration time
        if (userToken.expiresIn) {
            const expirationTime = Date.now() + (userToken.expiresIn * 1000);
            localStorage.setItem(Constants.TokenExpiresIn, expirationTime.toString());
        }

        this.isSignedInSubject.next(true);
    }
}

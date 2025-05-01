import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserTokenDto } from '../models/user-token.dto';
import { JwtTokenDto } from '../models/jwt-token.dto';
import { Constants } from '../constants';

@Injectable()
export class AuthService {

    private isSignedInSubject = new Subject<boolean>();
    private jwtToken: JwtTokenDto | null = null;
    private authTokenInt: string | null = null;
    private refreshTokenInt: string | null = null;
    private tokenExpiresInInt: number | null = null;

    get isAuthenticated(): Observable<boolean> {
        return this.isSignedInSubject.asObservable();
    }

    public get isSignedIn(): boolean {
        const loggedIn = this.authToken ? true : false;
        return loggedIn;
    }

    get userRole(): string {
        if (this.jwtToken) {
            return this.jwtToken.role || 'guest';
        } else if (this.authToken) {
            this.jwtToken = this.decodeToken(this.authToken);
            return this.jwtToken ? this.jwtToken.role : null;
        }
        return null
    }

    public get authToken(): string | null {
        if (!this.authTokenInt) {
            this.authTokenInt = localStorage.getItem(Constants.AuthToken);
        }
        return this.authTokenInt;
    }

    private set authToken(token: string | null) {
        this.authTokenInt = token;
        if (token) {
            localStorage.setItem(Constants.AuthToken, token);
        } else {
            localStorage.removeItem(Constants.AuthToken);
        }
    }

    public get refreshToken(): string | null {
        if (!this.refreshTokenInt) {
            this.refreshTokenInt = localStorage.getItem(Constants.RefreshToken);
        }
        return this.refreshTokenInt;
    }

    private set refreshToken(token: string | null) {
        this.refreshTokenInt = token;
        if (token) {
            localStorage.setItem(Constants.RefreshToken, token);
        }
        else {
            localStorage.removeItem(Constants.RefreshToken);
        }
    }

    public get tokenExpiresIn(): number | null {
        if (!this.tokenExpiresInInt) {
            const expiresInStr = localStorage.getItem(Constants.TokenExpiresIn);
            this.tokenExpiresInInt = expiresInStr ? parseInt(expiresInStr, 10) : null;
        }
        return this.tokenExpiresInInt;
    }

    private set tokenExpiresIn(expiresIn: number | null) {
        this.tokenExpiresInInt = expiresIn;
        if (expiresIn) {
            localStorage.setItem(Constants.TokenExpiresIn, expiresIn.toString());
        } else {
            localStorage.removeItem(Constants.TokenExpiresIn);
        }
    }


    public logout() {
        this.jwtToken = null;
        this.authToken = null;
        this.refreshToken = null;
        this.tokenExpiresIn = null;
        this.isSignedInSubject.next(false);
    }

    public processLogin(userToken: UserTokenDto) {
        var jwtToken = this.decodeToken(userToken.token);
        if (jwtToken) {
            this.authToken = userToken.token;
            this.refreshToken = userToken.refreshToken;

            // Store token expiration time
            if (userToken.expiresIn) {
                const expirationTime = Date.now() + (userToken.expiresIn * 1000);
                this.tokenExpiresIn = expirationTime;
            }

            this.isSignedInSubject.next(true);
        }
    }

    private decodeToken(token: string): JwtTokenDto {
        try {
            const payload = token.split('.')[1];
            const decodedPayload = atob(payload);
            return JSON.parse(decodedPayload) as JwtTokenDto;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
}

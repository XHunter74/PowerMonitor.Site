import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { UserTokenDto } from '../models/user-token.dto';
import { Observable, tap } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class UsersService extends HttpService {

  constructor(
    http: HttpClient, @Optional() @SkipSelf() parentModule: UsersService,
    authService: AuthService
  ) {
    super(http, parentModule, authService);
  }

  login(userName: string, password: string): Observable<UserTokenDto> {
    const user = {
      username: userName,
      password: password
    };
    return this.post<UserTokenDto>('auth/login', user, null, false).pipe(
      tap(token => this.authService.processLogin(token))
    );
  }

  changePassword(newPassword: string): Observable<UserTokenDto> {
    const passwordModel = {
      newPassword: newPassword
    };
    return this.post<UserTokenDto>('auth/change-password', passwordModel);
  }

  refreshToken(token: string): Observable<UserTokenDto> {
    const actionUrl = `auth/refresh-token?token=${token}`;
    return this.post<UserTokenDto>(actionUrl, null);
  }

}


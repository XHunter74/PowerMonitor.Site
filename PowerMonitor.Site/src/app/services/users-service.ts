import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';
import { UserTokenDto } from '../models/user-token.dto';



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

  async login(userName: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const user = {
      username: userName,
      password: password
    };
    const token = await this.post<UserTokenDto>('auth/login', user);
    this.authService.processLogin(token);
  }

  async changePassword(newPassword: string) {
    const passwordModel = {
      newPassword: newPassword
    };
    await this.post<UserTokenDto>('auth/change-password', passwordModel);
  }

  refreshToken(token: string) {
    const actionUrl = `auth/refresh-token?token=${token}`;
    return this.post<UserTokenDto>(actionUrl, null);
  }

}


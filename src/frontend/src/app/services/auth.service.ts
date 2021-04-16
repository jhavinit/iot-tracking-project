import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
import { AESEncryptDecryptService } from './aes-encrypt-decrypt.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' }) export class AuthService {
  /**
   * `notifier`
   * notification service
   */
  private readonly notifier: NotifierService;

  /**
   * `constructor`
   * @param notifierService notifier service
   * @param router routing service
   * @param http http service
   * @param _AESEncryptDecryptService aes encrypt decrypt service
   */
  constructor(
    notifierService: NotifierService,
    private router: Router,
    private http: HttpClient,
    private _AESEncryptDecryptService: AESEncryptDecryptService) {
    this.notifier = notifierService;
  }

  /**
   * `auth`
   * auth details
   */
  auth = {
    token: undefined,
    data: undefined,
    encryptionKey: environment.encryptionKey,
  };

  /**
   * `api`
   * api details
   */
  api = {
    url: environment.url,
    authPort: environment.authPort,
  };

  /**
   * `registerUser`
   * register user
   * @param options
   */
  registerUser(options) {
    const headers = new HttpHeaders({ 'x-source': 'web' });
    return this.http.post(`${this.api.url}:${this.api.authPort}/api/v1/register`, options, { headers: headers })
      .pipe(map(
        (res) => {
          return res;
        }
      ));
  }

  /**
   * `authenticateUser`
   * authenticate user credentials
   * @param options
   */
  authenticateUser(options) {
    const headers = new HttpHeaders({ 'x-source': 'web' });
    return this.http.post(`${this.api.url}:${this.api.authPort}/api/v1/authenticate`, options, { headers: headers })
      .pipe(map(
        (res) => {
          return res;
        }
      ));
  }

  /**
 * `unsetLoginFlag`
 * unset login flag after logout
 * @param options
 */
  unsetLoginFlag() {
    if (!this.loggedIn()) {
      this.notifier.notify('error', 'Session timed out! Please login again');
      this.logout();
    }
    const headerOptions = {
      'x-source': 'web',
      'x-auth-token': this.auth.token,
    };
    const headers = new HttpHeaders(headerOptions);
    return this.http.post(`${this.api.url}:${this.api.authPort}/api/v1/logout`, null, { headers: headers })
      .pipe(map(
        (res) => {
          return res;
        }
      ));
  }

  /**
   * `storeUserData`
   * store data to local storage
   * @param options
   */
  storeUserData(options) {
    const data = options.data;
    const token = options.token;
    localStorage.setItem('id_token', this._AESEncryptDecryptService.encryptString(token));
    localStorage.setItem('data', this._AESEncryptDecryptService.encryptObj(data));
    this.auth.token = token;
    this.auth.data = data;
  }

  /**
   * `loadToken`
   * load token for localstorage to local variable
   */
  loadToken() {
    if (!this.auth.token) {
      const token = localStorage.getItem('id_token');
      if (token !== null) {
        this.auth.token = this._AESEncryptDecryptService.decryptString(token);
      }
    }
  }

  /**
   * `loggedIn`
   * @returns whether token has expired or not
   */
  loggedIn() {
    this.loadToken();
    return tokenNotExpired(null, this.auth.token);
  }

  /**
   * `getProfile`
   * get user profile
   */
  getProfile() {
    if (!this.auth.data) {
      const data = localStorage.getItem('data');
      this.auth.data = this._AESEncryptDecryptService.decryptObj(data);
    }
    return this.auth.data;
  }

  /**
   * `logout`
   * clear local storage
   */
  logout() {
    this.auth.token = null;
    this.auth.data = null;
    localStorage.clear();
  }

}

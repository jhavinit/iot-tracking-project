import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifierService } from 'angular-notifier';
import * as io from 'socket.io-client';
import { tokenNotExpired } from 'angular2-jwt';
import { AESEncryptDecryptService } from './aes-encrypt-decrypt.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' }) export class LiveDataService {
  /**
   * notifier
   * notifier container
   */
  private readonly notifier: NotifierService;

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
    liveDataPort: environment.liveDataPort,
  };

  /**
   * `socket`
   * socket details
   */
  socket = {
    socketIdList: [],
    socket: undefined,
    liveDataConnStr: 'dataUpdate',
    serverConnErrWarn: true,
  };

  /**
   * `constructor`
   * @param notifierService notifier service
   * @param router routing service
   * @param authService auth service
   * @param _AESEncryptDecryptService aes encrypt decrypt service
   */
  constructor(
    notifierService: NotifierService,
    private router: Router,
    private _AESEncryptDecryptService: AESEncryptDecryptService
  ) {
    this.notifier = notifierService;
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
   * `logout`
   * clear local storage
   */
  logout() {
    this.auth.token = null;
    this.auth.data = null;
    localStorage.clear();
  }

  /**
   * `listen`
   * connect to socket connection for live data of device
   * @param deviceId device id
   * @returns stream live data values
   */
  listen(deviceId: string) {
    if (!this.loggedIn()) {
      this.notifier.notify('error', 'Session timed out! Please login again');
      this.logout();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }
    const params = {
      deviceId: deviceId,
      authToken: this.auth.token,
    };

    /**
     * connect to socket server
     */
    if (environment.production === false) {
      this.socket.socket = io.connect(`${this.api.url}:${this.api.liveDataPort}`, { query: params });
    } else {
      /**
       * connect to reverse proxy server in case of production
       */
      this.socket.socket = io.connect(`${this.api.url}:${this.api.liveDataPort}`, { path: '/app1socket', query: params });
    }

    /**
     * on connected
     */
    this.socket.socket.on('connect', () => {
      /***
       * add to socket array list
       */
      this.socket.socketIdList.push(this.socket.socket);
    });

    /**
    * on disconnected
    * ! when connected connection breaks
    * ! it can be because of server restart or device has gone offline
    */
    this.socket.socket.on('disconnect', (err) => {
      const index = this.socket.socketIdList.indexOf(this.socket.socket);
      if (index > -1) {
        this.socket.socketIdList.splice(index, 1);
      }
      this.socket.socket.off();
      this.socket.socket.disconnect();
    });

    /**
     * on connection error
     * ! initial check
     * ! when unable to connect to live data server
     */
    this.socket.socket.on('connect_error', (err) => {
      if (this.socket.serverConnErrWarn) {
        this.socket.serverConnErrWarn = false;
        this.notifier.notify('error', 'Oops something went wrong. Please refresh and try again');
      }
      const index = this.socket.socketIdList.indexOf(this.socket.socket);
      if (index > -1) {
        this.socket.socketIdList.splice(index, 1);
      }
      this.socket.socket.off();
      this.socket.socket.disconnect();
    });

    /**
     * on connection failed
     * ? does not get fired
     */
    this.socket.socket.on('connect_failed', (err) => {
      const index = this.socket.socketIdList.indexOf(this.socket.socket);
      if (index > -1) {
        this.socket.socketIdList.splice(index, 1);
      }
      this.socket.socket.off();
      this.socket.socket.disconnect();
    });

    /**
     * return live data from socket server
     */
    // this.socket.liveDataConnStr
    return new Observable((subscriber) => {
      this.socket.socket.on(this.socket.liveDataConnStr, (res) => {
        if (res.success) {
          subscriber.next(res.data);
        } else {
          /**
           * if server under maintenance
           */
          if (res.maintenance === true) {
            this.router.navigate(['maintenance']);
            return false;
          }

          /**
           * if internal server error
           */
          if (res.code === 500) {
            this.router.navigate(['/error/500']);
          } else {
            this.notifier.notify('error', res.msg);
          }

          const index = this.socket.socketIdList.indexOf(this.socket.socket);
          if (index > -1) {
            this.socket.socketIdList.splice(index, 1);
          }
          this.socket.socket.off();
          this.socket.socket.disconnect();
        }
      });
    });
  }

  /**
   * `disconnectAllLiveDataServices`
   * disconnect all live data socket requests
   */
  disconnectAllLiveDataServices(): void {
    if (this.socket.socketIdList.length !== 0) {
      this.socket.socketIdList.forEach((element) => {
        const index = this.socket.socketIdList.indexOf(element);
        if (index > -1) {
          this.socket.socketIdList.splice(index, 1);
        }
        element.off();
        element.disconnect();
      });
    }
  }

  /**
   * `loadToken`
   * load token
   */
  loadToken(): void {
    if (!this.auth.token) {
      const token = localStorage.getItem('id_token');
      if (token !== null) {
        this.auth.token = this._AESEncryptDecryptService.decryptString(token);
      }
    }
  }
}

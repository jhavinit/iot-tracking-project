

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit {
  /**
   * notifier service
   */
  private readonly notifier: NotifierService;

  /**
   * `component`
   */
  component: object;

  /**
   * `authCredentials`
   * auth credentials
   */
  authCredentials: object;

  /**
   * `registerUserDetails`
   * register user details
   */
  registerUserDetails: object;

  /**
   * `constructor`
   * @param validateService validate service
   * @param authService auth service
   * @param router routing
   * @param notifierService notifier service
   * @param title title service
   */
  constructor(
    private router: Router,
    notifierService: NotifierService,
    private authService: AuthService,
    private validateService: ValidateService,
    private title: Title,
  ) {
    this.title.setTitle('DIC IOT DASHBOARD - TRAFFIC SENSING AND IT');
    this.notifier = notifierService;
  }

  /**
   * `login`
   * on login submit
   */
  login() {
    /**
     * create credentials
     */
    const user = {
      username: this.authCredentials['username'],
      password: this.authCredentials['password'],
    };

    const validate = this.validateService.validateLogin(user);
    if (validate) {
      this.notifier.notify('warning', validate);
      return false;
    }

    /**
     * show loading
     */
    this.authCredentials['loading'] = true;

    /**
     * send request
     */
    this.authService.authenticateUser(user).subscribe(data => {
      this.authCredentials['loading'] = false;
      if (data['success']) {
        const response = data['content'];
        this.authService.storeUserData({
          token: response.token,
          data: response.data,
        });
        this.router.navigate(['dashboard']);
      }
    }, error => {
      this.authCredentials['loading'] = false;
    });
  }


  /**
   * `registerUser`
   * on register submit
   */
  registerUser() {
    /**
     * create credentials
     */
    const user = {
      name: this.registerUserDetails['name'],
      username: this.registerUserDetails['username'],
      password: this.registerUserDetails['password'],
    };

    const validate = this.validateService.validateRegister(user);
    if (validate) {
      this.notifier.notify('warning', validate);
      return false;
    }

    /**
     * show loading
     */
    this.registerUserDetails['loading'] = true;

    /**
     * send request
     */
    this.authService.registerUser(user).subscribe(data => {
      this.registerUserDetails['loading'] = false;
      if (data['success']) {
        this.notifier.notify('success', data['msg']);
        this.component['register'] = false;
      }
    }, error => {
      this.registerUserDetails['loading'] = false;
    });
  }

  /**
   * `ngOnInit`
   */
  ngOnInit() {
    /**
     * navigate to dashboard if user already logged in
     */
    this.router.navigate(['dashboard']);

    this.component = {
      register: false,
    };
    this.registerUserDetails = {
      name: undefined,
      username: undefined,
      password: undefined,
    }
    this.authCredentials = {
      username: undefined,
      password: undefined,
      loading: false,
    };
  }
}

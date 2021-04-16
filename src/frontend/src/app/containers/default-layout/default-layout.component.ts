import { Component, ViewChild, ElementRef, SecurityContext, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotifierService } from 'angular-notifier';
import { map } from 'rxjs/operators';
import { navItems } from '../../_nav';
import { AuthService } from '../../services/auth.service';
import { ValidateService } from '../../services/validate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['default-layout.component.css']
})

export class DefaultLayoutComponent implements OnInit {
  /**
  * `component`
  * component details
  */
  component: object;

  /**
   * `notifier`
   * notifier module
   */
  private readonly notifier: NotifierService;

  /**
   * user profile
   */
  user: object;

  /**
   * `sidebarMinimized`
   * side bar toggles
   */
  public sidebarMinimized = true;

  /**
   * `navItems`
   * nav items for sidebar
   */
  public navItems = navItems;

  /**
   * `constructor`
   * @param sanitizer dom sanitizer
   * @param router routing
   * @param authService auth service
   * @param notifierService toastr notification service
   */
  constructor(
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private router: Router,
    public authService: AuthService,
    public validateService: ValidateService,
    notifierService: NotifierService,
  ) {
    this.notifier = notifierService;
  }

  /**
   * `createOnline$`
   * check online/offline internet state
   */
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  /**
   * toggle sidebar
   * @param e event
   */
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  /**
   * `onLogoutClick`
   * on click on logout btn
   */
  onLogoutClick() {
    const confirmLogout = confirm('Are you sure want to logout?');
    if (confirmLogout === true) {
      if (this.component['logoutLoad'] === true) {
        return false;
      }
      this.authService.unsetLoginFlag().subscribe(data => {
        if (data['success']) {
          this.router.navigate(['/login']);
          this.authService.logout();
          return false;
        }
      }, (error) => {
        this.component['logoutLoad'] = false;
      });
    }
  }

  /**
   * `hideSidebarLogo`
   * hide sidebar logo on click
   */
  hideSidebarLogo() {
    const element = document.getElementById('logo-sidebar');
    if (element.style.visibility === 'hidden') {
      /**
       * show logo
       */
      element.style.visibility = 'visible';
    } else {
      /**
       * hide logo
       */
      element.style.visibility = 'hidden';
    }
  }

  /**
   * `ngOnInit`
   */
  ngOnInit() {
    this.component = {
      version: undefined,
      copyYear: new Date().getFullYear(),
      stopLogoutMultipleCall: false,
      internetConn: undefined,
      logoutLoad: false,
    };
    this.user = {
      name: undefined,
      shortName: undefined,
    };
    const user = this.authService.getProfile();
    this.user['name'] = user['name'];
    this.user['shortName'] = this.user['name'].split(' ').map(n => n[0]).join('');
    this.component['version'] = user['dashboardVersionWeb'];
    /**
     * internet connection check
     */
    this.component['internetConn'] = this.sanitizer.sanitize(SecurityContext.HTML, this.component['internetConn']);
    this.createOnline$().subscribe(isOnline => {
      if (isOnline === true) {
        this.component['internetConn'] = '<small class="my-secondary-color"><b>DIC - TRAFFIC SENSING AND IT</b></small>';
      } else {
        this.component['internetConn'] = '<small class="my-red-color"><b>Internet connection lost</b></small>';
      }
    });
  }
}

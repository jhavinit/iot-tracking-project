import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: 'error.component.html'
})

export class ErrorPageComponent implements OnInit {
  /**
   * `component`
   * component object
   */
  component: object;

  /**
   * `constructor`
   * @param router routing service
   * @param _location location service
   * @param titleService title service
   */
  constructor(
    private router: Router,
    private _location: Location,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Something went wrong · DIC - TRAFFIC SENSING AND IT');
  }

  /**
   * `backClicked`
   * on back page clicked
   */
  backClicked() {
    this._location.back();
  }

  /**
   * `ngOnInit`
   */
  ngOnInit() {
    /**
     * populate globals
     */
    this.component = {
      errMsg: undefined,
      copyYear: new Date().getFullYear(),
    };

    /**
     * handle routes based on message
     */
    const msg = this.router.url.split('/').pop();
    if (msg === '500') {
      this.component['errMsg'] = 'Oops something went wrong';
    } else if (msg === 'invalid-request') {
      this.component['errMsg'] = 'Invalid request';
    } else if (msg === 'report') {
      this.component['errMsg'] = 'Please try again! If you are still getting this error then please report this issue';
    } else {
      this.router.navigate(['/404']);
    }
  }
}

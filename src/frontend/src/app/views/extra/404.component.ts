import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: '404.component.html'
})

export class P404Component implements OnInit {
  /**
  * `component`
  * component object
  */
  component: object;

  /**
   * `constructor`
   * @param title title service
   */
  constructor(
    private title: Title,
  ) {
    this.title.setTitle('Page not found · DIC - TRAFFIC SENSING AND IT');
  }

  /**
   * `ngOnInit`
   */
  ngOnInit() {
    this.component = {
      copyYear: new Date().getFullYear(),
    };
  }
}


import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  /**
   * `notifier`
   * notification service
   */
  private readonly notifier: NotifierService;

  /**
   * `component`
   * component variables
   */
  component: object;

  /**
   * `dashboardsList`
   * list of dashboards from DIC - TRAFFIC SENSING AND IT store
   */
  dashboardsList: Array<object>;

  /**
   * `dashboards`
   * total dashboards available in store
   */
  dashboards: object;

  /**
   * `addedDashboards`
   * already added dashboards details
   */
  addedDashboards: object;

  /**
   * `constructor`
   * @param notifierService notification service
   * @param authService authentication service
   * @param router routing service
   * @param title title service
   */
  constructor(
    notifierService: NotifierService,
    private router: Router,
    public authService: AuthService,
    private title: Title,
  ) {
    this.title.setTitle('DIC IoT Dashboard - TRAFFIC SENSING AND IT');
    this.notifier = notifierService;
  }


  openSolution(path) {
    this.router.navigate([path]);
  }

  /**
   * `ngOnInit`
   */
  async ngOnInit() {
    /**
     * populate globals
     */
    this.component = {
      loading: true,
    };
    this.dashboards = {};
    this.dashboardsList = [];
    this.addedDashboards = {
      list: {},
      length: 0,
      searchDashboards: undefined,
    };

    /**
     * load already added dashboards
     */
    const size = this.dashboardsList.length;
    let counter = 0;
    if (size !== 0) {
      this.dashboardsList.forEach(async (element) => {
        this.dashboards[element['dashboardId']] = {
          name: element['name'],
          description: element['description'],
          tutorialLink: element['tutorialLink'],
          iconClass: element['iconClass'],
          appDownloadLink: element['appDownloadLink'],
        };
        counter += 1;
        if (counter >= size) {
          this.component['loading'] = false;
        }
      });
    } else {
      this.component['loading'] = false;
    }
  }
}

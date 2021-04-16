

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    DashboardRoutingModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    Ng2SearchPipeModule,
    TooltipModule.forRoot(),
    JoyrideModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    LeafletModule,
  ],
  declarations: [DashboardComponent]
})

export class DashboardModule {
}

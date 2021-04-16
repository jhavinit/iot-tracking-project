import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
// import { JoyrideModule, JoyrideService } from 'ngx-joyride';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ParticlesModule } from 'angular-particle';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ValidateService } from './services/validate.service';
import { AESEncryptDecryptService } from './services/aes-encrypt-decrypt.service';
import { AuthService } from './services/auth.service';
import { CommonContentService } from './services/common-content.service';
import { UtlityService } from './services/utility.service';
import { ErrorInterceptor } from '../app/interceptors/error.interceptor';
import { LiveDataService } from './services/live-data.service';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/extra/404.component';
import { ErrorPageComponent } from './views/extra/error.component';
import { LoginComponent } from './views/login/login.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';
import { AppRoutingModule } from './app.routing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { NgxGaugeModule } from 'ngx-gauge';

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
    NgxGaugeModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    CarouselModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    HttpClientModule,
    FormsModule,
    ModalModule.forRoot(),
    ParticlesModule,
    AlertModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    Ng2SearchPipeModule,
    LeafletModule,
    // JoyrideModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    RecaptchaModule,
    RecaptchaFormsModule,
    FileUploadModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    ErrorPageComponent,
    LoginComponent,
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
    ValidateService,
    AESEncryptDecryptService,
    AuthService,
    CommonContentService,
    UtlityService,
    LiveDataService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

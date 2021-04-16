import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from './containers';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { P404Component } from './views/extra/404.component';
import { ErrorPageComponent } from './views/extra/error.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'error/:token',
    component: ErrorPageComponent,
    data: {
      title: 'Error'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'animal-tracking',
        loadChildren: () => import('./views/animal-tracking/animal-tracking.module').then(m => m.AnimalTrackingModule)
      },
      {
        path: 'air-pollution',
        loadChildren: () => import('./views/air-pollution/air-pollution.module').then(m => m.AirPollutionModule)
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    AuthGuard
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AirPollutionComponent } from './air-pollution.component';

const routes: Routes = [
  {
    path: '',
    component: AirPollutionComponent,
    data: {
      title: 'Air pollution device'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirPollutionRoutingModule { }

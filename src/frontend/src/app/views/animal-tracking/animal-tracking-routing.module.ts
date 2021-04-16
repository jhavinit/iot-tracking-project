import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnimalTrackingComponent } from './animal-tracking.component';

const routes: Routes = [
  {
    path: '',
    component: AnimalTrackingComponent,
    data: {
      title: 'Animal tracking device'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalTrackingRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventStreamComponent } from 'src/app/components/event-stream/event-stream.component';

const routes: Routes = [
  {
    path: '',
    component: EventStreamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

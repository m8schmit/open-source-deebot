import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventStreamComponent } from './components/event-stream/event-stream.component';
import { IonicModule } from '@ionic/angular';
import { BatteryStateComponent } from './components/battery-state/battery-state.component';

const config: SocketIoConfig = { url: environment.socket, options: {} };

@NgModule({
  declarations: [AppComponent, EventStreamComponent, BatteryStateComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    IonicModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

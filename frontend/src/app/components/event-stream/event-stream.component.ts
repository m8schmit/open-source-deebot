import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'event-stream',
  templateUrl: './event-stream.component.html',
  styleUrls: ['./event-stream.component.scss'],
})
export class EventStreamComponent implements OnInit {
  public data!: any;

  constructor(public socketService: SocketService) {}

  ngOnInit() {
    this.socketService.dispatch('getName', {});
  }

  ngOnDestroy(): void {}

  public listenToEvent(messageType: string): Observable<any> {
    return this.socketService.listenToEvent(messageType);
  }

  public startCleaning(): void {
    this.socketService.dispatch('Clean', {});
  }

  public returnToHome(): void {
    this.socketService.dispatch('Charge', {});
  }
}

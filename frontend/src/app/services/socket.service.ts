import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  public listenToEvent(messageType: string): Observable<any> {
    return this.socket.fromEvent(messageType)
    // .pipe(
    //   map((payload) => {
    //     console.log('receive', payload, ' for ', messageType);
    //     return payload;
    //   })
    // );
  }

  public dispatch(messageType: string, payload: any) {
    console.log('dispatch', messageType, ' with ', payload);
    this.socket.emit(messageType, payload);
  }
}

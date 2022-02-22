import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-battery-state',
  templateUrl: './battery-state.component.html',
  styleUrls: ['./battery-state.component.scss']
})
export class BatteryStateComponent implements OnInit {
  @Input()
  public isCharging = 'idle';

  @Input()
  public batteryLevel = 100;

  constructor() { }

  ngOnInit(): void {
  }

}

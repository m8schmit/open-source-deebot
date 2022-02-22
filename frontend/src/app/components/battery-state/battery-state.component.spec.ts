import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryStateComponent } from './battery-state.component';

describe('BatteryStateComponent', () => {
  let component: BatteryStateComponent;
  let fixture: ComponentFixture<BatteryStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatteryStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

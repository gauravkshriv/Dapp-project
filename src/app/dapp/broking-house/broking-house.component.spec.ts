import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokingHouseComponent } from './broking-house.component';

describe('BrokingHouseComponent', () => {
  let component: BrokingHouseComponent;
  let fixture: ComponentFixture<BrokingHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokingHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokingHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

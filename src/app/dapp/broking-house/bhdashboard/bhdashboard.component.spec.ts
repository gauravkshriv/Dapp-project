import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BhdashboardComponent } from './bhdashboard.component';

describe('BhdashboardComponent', () => {
  let component: BhdashboardComponent;
  let fixture: ComponentFixture<BhdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BhdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BhdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

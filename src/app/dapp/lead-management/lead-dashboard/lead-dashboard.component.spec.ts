import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadDashboardComponent } from './lead-dashboard.component';

describe('LeadDashboardComponent', () => {
  let component: LeadDashboardComponent;
  let fixture: ComponentFixture<LeadDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

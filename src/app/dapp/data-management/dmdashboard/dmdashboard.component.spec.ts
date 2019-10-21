import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DmdashboardComponent } from './dmdashboard.component';

describe('DmdashboardComponent', () => {
  let component: DmdashboardComponent;
  let fixture: ComponentFixture<DmdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DmdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DmdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TmdashboardComponent } from './tmdashboard.component';

describe('TmdashboardComponent', () => {
  let component: TmdashboardComponent;
  let fixture: ComponentFixture<TmdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TmdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TmdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

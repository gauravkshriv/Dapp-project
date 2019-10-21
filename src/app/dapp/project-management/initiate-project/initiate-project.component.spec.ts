import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateProjectComponent } from './initiate-project.component';

describe('InitiateProjectComponent', () => {
  let component: InitiateProjectComponent;
  let fixture: ComponentFixture<InitiateProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiateProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

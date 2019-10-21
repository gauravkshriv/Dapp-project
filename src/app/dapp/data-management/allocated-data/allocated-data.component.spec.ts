import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedDataComponent } from './allocated-data.component';

describe('AllocatedDataComponent', () => {
  let component: AllocatedDataComponent;
  let fixture: ComponentFixture<AllocatedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocatedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

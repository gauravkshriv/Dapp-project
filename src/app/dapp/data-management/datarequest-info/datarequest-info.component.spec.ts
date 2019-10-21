import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatarequestInfoComponent } from './datarequest-info.component';

describe('DatarequestInfoComponent', () => {
  let component: DatarequestInfoComponent;
  let fixture: ComponentFixture<DatarequestInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatarequestInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatarequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

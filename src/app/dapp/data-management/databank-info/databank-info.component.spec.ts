import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabankInfoComponent } from './databank-info.component';

describe('DatabankInfoComponent', () => {
  let component: DatabankInfoComponent;
  let fixture: ComponentFixture<DatabankInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabankInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabankInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

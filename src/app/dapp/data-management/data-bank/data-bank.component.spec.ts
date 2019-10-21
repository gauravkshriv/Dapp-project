import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataBankComponent } from './data-bank.component';

describe('DataBankComponent', () => {
  let component: DataBankComponent;
  let fixture: ComponentFixture<DataBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

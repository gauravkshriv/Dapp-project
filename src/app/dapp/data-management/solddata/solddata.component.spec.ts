import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolddataComponent } from './solddata.component';

describe('SolddataComponent', () => {
  let component: SolddataComponent;
  let fixture: ComponentFixture<SolddataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolddataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

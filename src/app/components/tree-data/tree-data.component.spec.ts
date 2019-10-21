import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDataComponent } from './tree-data.component';

describe('TreeDataComponent', () => {
  let component: TreeDataComponent;
  let fixture: ComponentFixture<TreeDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

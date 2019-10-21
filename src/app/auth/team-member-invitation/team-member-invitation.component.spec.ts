import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberInvitationComponent } from './team-member-invitation.component';

describe('TeamMemberInvitationComponent', () => {
  let component: TeamMemberInvitationComponent;
  let fixture: ComponentFixture<TeamMemberInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

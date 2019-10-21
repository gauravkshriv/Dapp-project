import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TeamMemberInvitationComponent } from './auth/team-member-invitation/team-member-invitation.component';

@NgModule({
  declarations: [
    AppComponent,TeamMemberInvitationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamMemberInvitationComponent } from './auth/team-member-invitation/team-member-invitation.component';
// import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
{ path: '', redirectTo: 'dapp' ,pathMatch:'full'},

{ path: 'dapp', loadChildren: './dapp/dapp.module#DappModule' },
{ path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
{ path: 'member/approval', component: TeamMemberInvitationComponent },
//   { path: '', loadChildren: 'app/home/home.module#HomeModule' },
  // { path: '', redirectTo: 'dapp', pathMatch: 'full' },
// { path: '**', redirectTo: 'dapp' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}


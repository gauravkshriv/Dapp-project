import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamManagementComponent } from './team-management.component';
import { TmdashboardComponent } from './tmdashboard/tmdashboard.component';
import { AuthGuard } from 'src/app/_guard/auth.guard';
import { MyTeamComponent } from './my-team/my-team.component';
import { AddTeamComponent } from './add-team/add-team.component';
import { TeamDepartmentComponent } from './team-department/team-department.component';
import { DepartmentComponent } from './department/department.component';

const routes: Routes = [
    {
        path: '',
        component: TeamManagementComponent, canActivate :[AuthGuard],
        children :[
            {path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: TmdashboardComponent },
            { path: 'add', component: AddTeamComponent },
            { path: 'my-team', component: MyTeamComponent },
            { path: 'add-team', component: AddTeamComponent },
            { path: 'team-department', component: TeamDepartmentComponent },
            { path: 'team-department/:department', component: DepartmentComponent },
        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamManagementRoutingModule {
}
export const teamManagementRoutedComponents =[
    TeamManagementComponent,
    TmdashboardComponent,
    MyTeamComponent,
    AddTeamComponent,
    TeamDepartmentComponent,
    DepartmentComponent,

]

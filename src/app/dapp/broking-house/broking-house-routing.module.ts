import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../../_guard/auth.guard';
import { BrokingHouseComponent } from './broking-house.component';
import { BhdashboardComponent } from './bhdashboard/bhdashboard.component';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TeamBuildingComponent } from './team-building/team-building.component';

const routes: Routes = [
    {
        path: '',
        component: BrokingHouseComponent, canActivate :[AuthGuard],
        children :[
            {
                path: '',
                pathMatch: 'full',
                redirectTo:'dashboard'
            },
            {
                path: 'dashboard',
                component: BhdashboardComponent,
            },
            {
                path: 'teambuilding',
                component: TeamBuildingComponent,
            },
            {
                path: 'projectmanagement',
                component: ProjectManagementComponent,
            },
           
        ]
    },   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrokingHouseRoutingModule {
}
export const brokingHouseRoutedComponents =[
    BrokingHouseComponent,
    BhdashboardComponent,
    TeamBuildingComponent,
    ProjectManagementComponent,

]

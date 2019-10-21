import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DappComponent } from './dapp.component';
import { AuthGuard } from '../_guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: DappComponent,
        children :[
            {path: '', pathMatch: 'full', redirectTo:'dashboard',canActivate: [AuthGuard] },
            { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
            { path: 'datamanagement', loadChildren: './data-management/data-management.module#DataManagementModule',canActivate: [AuthGuard] },
            { path: 'team-management', loadChildren: './team-management/team-management.module#TeamManagementModule',canActivate: [AuthGuard] },
            { path: 'lead-management', loadChildren: './lead-management/lead-management.module#LeadManagementModule',canActivate: [AuthGuard] },
            { path: 'project-management', loadChildren: './project-management/project-management.module#ProjectManagementModule',canActivate: [AuthGuard] },

        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DappRoutingModule {
}
export const dappRoutedComponents =[
    DappComponent,
    DashboardComponent,
]

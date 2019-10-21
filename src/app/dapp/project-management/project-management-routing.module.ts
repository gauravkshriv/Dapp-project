import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProjectManagementComponent } from './project-management.component';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewAllProjectComponent } from './view-all-project/view-all-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { PlotInfoComponent } from './plot-info/plot-info.component';
import { InitiateProjectComponent } from './initiate-project/initiate-project.component';
import { AuthGuard } from 'src/app/_guard/auth.guard';
import { TreeDataComponent } from 'src/app/components/tree-data/tree-data.component';



const routes: Routes = [
    {
        path: '',
        component: ProjectManagementComponent,canActivate :[AuthGuard],
        children :[
            {path: '', pathMatch: 'full', redirectTo:'dashboard' },
            { path: 'dashboard', component: PmDashboardComponent },
            { path: 'add-project', component: AddProjectComponent },
            { path: 'edit-project', component: AddProjectComponent },
            { path: 'my-project/:projectId', component: ViewProjectComponent },
            { path: 'my-project/:projectId/:plotId', component: PlotInfoComponent },
            { path: 'my-project', component: ViewAllProjectComponent },
            { path: 'initiate-project', component: InitiateProjectComponent },

        ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectManagementRoutingModule {
}
export const projectManagementRoutedComponents =[
    TreeDataComponent,
    ProjectManagementComponent,
    PmDashboardComponent,
    AddProjectComponent,
    ViewAllProjectComponent,
    ViewProjectComponent,
    PlotInfoComponent,
    InitiateProjectComponent
]

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DataBankComponent } from './data-bank/data-bank.component';
import { DataManagementComponent } from './data-management.component';
import { DataRequestComponent } from './data-request/data-request.component';
import { SharedDataComponent } from './shared-data/shared-data.component';
import { DatabankInfoComponent } from './databank-info/databank-info.component';
import { FileInfoComponent } from './file-info/file-info.component';
import { FileListComponent } from './file-list/file-list.component';
import { AuthGuard } from '../../_guard/auth.guard';
import { SolddataComponent } from './solddata/solddata.component';
import { DatarequestInfoComponent } from './datarequest-info/datarequest-info.component';
import { DmdashboardComponent } from './dmdashboard/dmdashboard.component';
import { AllocatedDataComponent } from './allocated-data/allocated-data.component';


const routes: Routes = [
    {
        path: '',
        component: DataManagementComponent, canActivate :[AuthGuard],
        children :[
            {
                path: '',
                pathMatch: 'full',
                redirectTo:'dashboard'
            },
            {
                path: 'dashboard',
                component: DmdashboardComponent,
            },
            {
                path: 'databank',
                component: DataBankComponent,
            },
            {
                path: 'databank/:dataBankName/allocated-data',
                component: AllocatedDataComponent,
            },
            {
                path: 'databank/:dataBankName',
                component: DatabankInfoComponent,
            },
            {
                path: 'databank/:dataBankName/:folder',
                component: FileListComponent,
            },
            {
                path: 'databank/:dataBankName/:folder/:dataTag',
                component: FileInfoComponent,
            },
            {
                path: 'datarequest',
                component: DataRequestComponent,               
            },
            {
                path: 'datarequest/:requestId',
                component: DatarequestInfoComponent,
            },
            {
                path: 'shareddata',
                component: SharedDataComponent,
            },
        ]
    },
    // {
    //     path: 'databank',
    //     component: DataBankComponent,
    // },
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagementRoutingModule {
}
export const dataManagementRoutedComponents =[
    DataManagementComponent,
    DataBankComponent,
    DmdashboardComponent,
    DataRequestComponent,
    SharedDataComponent,
    DatabankInfoComponent,
    FileListComponent,
    FileInfoComponent,
    SolddataComponent,
    DatarequestInfoComponent,
    AllocatedDataComponent
]

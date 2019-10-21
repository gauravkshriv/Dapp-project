import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectManagementRoutingModule, projectManagementRoutedComponents } from './project-management-routing.module';
import { AgmCoreModule } from '@agm/core';
import { MaterialModule } from 'src/app/components/material-module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NodeTree } from './pm-dashboard/tree-node';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectManagementRoutingModule,
    MaterialModule,
    Ng2SmartTableModule,
    AgmCoreModule.forRoot({
        apiKey: "AIzaSyC0tkxpZTxUS3iQKYqq7ACJOHY8Wca6c9w",
        libraries: ["places"]
      }),
      NgxMatSelectSearchModule
  ],
  declarations: [
    ...projectManagementRoutedComponents, NodeTree
  ],
  schemas : [NO_ERRORS_SCHEMA],
  // providers : [{
  //   provide: STEPPER_GLOBAL_OPTIONS,
  //   useValue: { showError: true }
  // }]
})
export class ProjectManagementModule { }

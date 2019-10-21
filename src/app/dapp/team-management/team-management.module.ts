import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { teamManagementRoutedComponents,
   TeamManagementRoutingModule } from './team-management-routing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MaterialModule } from 'src/app/components/material-module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    Ng2SmartTableModule,
    TeamManagementRoutingModule
  ],
  declarations: [
    teamManagementRoutedComponents,
  ],
  schemas : [NO_ERRORS_SCHEMA],  
})
export class TeamManagementModule { }

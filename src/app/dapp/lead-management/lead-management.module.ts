import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA }   from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadManagementRoutingModule, leadManagementRoutedComponents } from './lead-management-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MaterialModule } from 'src/app/components/material-module';

@NgModule({
  imports: [     
      CommonModule,
      ReactiveFormsModule,
      MaterialModule,
      LeadManagementRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      Ng2SmartTableModule
  ], 
  declarations: [
       ...leadManagementRoutedComponents
  ],
  providers: [],
  schemas : [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],  
})
export class LeadManagementModule { }
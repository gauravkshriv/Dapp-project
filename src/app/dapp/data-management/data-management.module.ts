import { NgModule } from '@angular/core';
import {DataManagementRoutingModule, dataManagementRoutedComponents } from './data-management-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2SmartTableModule,
    DataManagementRoutingModule,
  ],
  declarations: [
    ...dataManagementRoutedComponents,
  ],
})
export class DataManagementModule { }

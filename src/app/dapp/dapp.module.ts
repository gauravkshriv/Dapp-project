import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {DappRoutingModule, dappRoutedComponents } from './dapp-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NavbarComponent } from '../layout/navbar/navbar.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { StatusViewComponent, LinkViewComponent, LoaderViewComponent,
   MemberStatusViewComponent, ImageViewComponent, ViewMoreLessComponent, ChangeInvStatusComponent, LinkListComponent } from '../components/table-components';
import { LeadManagementComponent } from './lead-management/lead-management.component';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    DappRoutingModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ...dappRoutedComponents,
     LoaderViewComponent,
    LinkViewComponent,
    StatusViewComponent,
    MemberStatusViewComponent,
    ImageViewComponent,
    ViewMoreLessComponent,
    ChangeInvStatusComponent,
    LinkListComponent,
    LeadManagementComponent,
  ],
  exports: [
  NavbarComponent,
  SidebarComponent,
],
schemas : [NO_ERRORS_SCHEMA],
entryComponents: [LoaderViewComponent, LinkViewComponent, ViewMoreLessComponent,
  StatusViewComponent, MemberStatusViewComponent, ImageViewComponent, ChangeInvStatusComponent,
  LinkListComponent,]
})
export class DappModule { }

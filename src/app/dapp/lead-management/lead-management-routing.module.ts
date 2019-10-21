import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadDashboardComponent } from './lead-dashboard/lead-dashboard.component';
import { LeadsComponent } from './leads/leads.component';
import { ReadMoreComponent } from 'src/app/components/more-less.component';
const authRoutes: Routes = [
	{ 
	  path: '', redirectTo: 'dashboard'
	},
	{ 
	  path: 'dashboard',
		component: LeadDashboardComponent,
	},
	{ 
		path: 'leads',
		component: LeadsComponent,
	},
];
@NgModule({
  imports: [ RouterModule.forChild(authRoutes) ],
  exports: [ RouterModule ]
})
export class LeadManagementRoutingModule{ }
export const leadManagementRoutedComponents =[
	ReadMoreComponent,
   LeadDashboardComponent,
   LeadsComponent
]

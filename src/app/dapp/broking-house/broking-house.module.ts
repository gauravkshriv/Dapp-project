import { NgModule } from '@angular/core';
import {BrokingHouseRoutingModule,brokingHouseRoutedComponents  } from './broking-house-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamBuildingComponent } from './team-building/team-building.component';
import { CreateTeamComponent } from './create-team/create-team.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrokingHouseRoutingModule,
  ],
  declarations: [
    ...brokingHouseRoutedComponents,
    TeamBuildingComponent,
    CreateTeamComponent,
  ],
  exports: [
],
})
export class BrokingHouseModule { }

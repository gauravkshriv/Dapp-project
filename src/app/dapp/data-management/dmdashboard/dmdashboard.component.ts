import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_services';

@Component({
  selector: 'app-dmdashboard',
  templateUrl: './dmdashboard.component.html',
  styleUrls: ['./dmdashboard.component.scss']
})
export class DmdashboardComponent implements OnInit {
  // isDMC = true;
  constructor(
    private appService : AppService
  ) { }

  ngOnInit() {
    // if(this.appService.isLoggedIn())
      // this.isDMC = this.appService.isDMC()
  }
}

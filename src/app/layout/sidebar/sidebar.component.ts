import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AppService } from 'src/app/_services';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl:'./sidebar.component.html',
  styleUrls:['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isDMC = true;
  constructor(
    private appServices : AppService
  ) { }

  ngOnInit() {
    if(this.appServices.isLoggedIn())
      this.isDMC = this.appServices.isDMC()
  }

  letSee(){
    $('#sidenav-overlay').click()
    $(".button-collapse").click()
  }
  addProject(){
    this.appServices.setProjectId(null)
    this.letSee()
  }
}

import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_services';
import { Url } from 'src/app/_constants/urls';

@Component({
  selector: 'app-navbar',
 templateUrl:'./navbar.component.html',
 styleUrls:['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
user:any;
appList : Array<any> =[]; 
_ct:any;
  constructor(
      private appService : AppService,
  ) { }

  ngOnInit() {
     let user = this.appService.getUser()
     this.user =JSON.parse(user)
     this._ct = localStorage.getItem('_ct')
     this.appService.logout
     this.appList = [
       {name:'Community', imgSrc: 'assets/images/rmicon.png',route:this.appService.COMMUNITY_URL+'/login?_ct='+this._ct},
       {name:'Academy', imgSrc: 'assets/images/rmicon2.png',route:this.appService.ACADEMY_URL+'/login?_ct='+this._ct},
       {name:'Retail', imgSrc: 'assets/images/retail.png',route:this.appService.RETAIL_URL+'/login?_ct='+this._ct},
       {name:'RMEBHUB', imgSrc: 'assets/images/rmicon4.png',route:this.appService.RMEHUB_URL},
       {name:'Account', imgSrc: 'assets/images/rmicon3.png',route:this.appService.ACCOUNT_URL},
     ]
  }
  logout(){
    this.appService.logout(false)
  }
  goProfile(){
    this.appService.goForProfile(this._ct)
  }
}

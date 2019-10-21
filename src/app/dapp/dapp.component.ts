import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { MenuService, ApiService, AppService } from '../_services';
import swal from 'sweetalert2';
import {map} from 'rxjs/operators';
declare var $: any;


@Component({
  selector: 'app-dapp',
  templateUrl: './dapp.component.html',
  styleUrls: ['./dapp.component.scss']
})
export class DappComponent implements OnInit {

  userName:any;
  posts:any;
  album:any;




  breadcrumbs: any;
  name: string;
  menu: Array<any> = [];
  breadcrumbList: Array<any> = [];
  folder =["RAW","SMS","Email","Segrregated"]
  previousUrl: string | boolean;
  invtId : any;
  constructor(
    private router: Router,
    private menuService: MenuService,
    private appServices : AppService,
    private apiServices : ApiService
  ) { 
    console.log('inside dapp const');
    this.listenRouting();
  }
  
  listenRouting() {
    let routerUrl: string, routerList: Array<any>, target: any;

    this.router.events.subscribe((router: any) => {
      
      routerUrl = router.urlAfterRedirects;
      if (routerUrl && typeof routerUrl === 'string') {
        target = this.menuService.getMenu();
        this.breadcrumbList.length = 0;
        routerList = routerUrl.slice(1).split('/');
        routerList.forEach((router, i) => {
          console.log('target',target);
          
          target = target.find(page => page.route === router);
          this.breadcrumbList.push({
            name: target.name, path: (i === 0) ? target.path : `${this.breadcrumbList[i-1].path}/${target.path.slice(2)}`
          });
          if (i+1 !== routerList.length)  target = target.children;
        });
      }
    });
    console.log('breadcrumb',this.breadcrumbList);
    
  }


  ngOnInit() {
    
    $(".button-collapse").sideNav();
    this.getSession()
    this.checkSession()
  }

 
  ngOnDestroy(){
    clearTimeout(this.invtId)
  }
  checkSession() {
   this.invtId = setInterval(() => {
      this.getSession()
    }, 30000);
  }
  goBack(){
    this.appServices.goBack()
  }
  goForward(){
    this.appServices.goForward()
  }
  getSession(){
    let user = this.appServices.getUserInfo()
    if(user !== null){
      let body = {
        uuid:user.uuid,
        sessionToken:user.sessiontoken
      }
      this.apiServices.getSessionStatus(body)
      .then(res=>{
        console.log(res.data);
        if(!res.data.status || res.data.statusCode !== 200){
          localStorage.removeItem("userInfo");
          swal({
            title: "Your session Logged out !",
            text: "Click Login To Continue in one step.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#ff386a',
            confirmButtonText: 'Login',
            cancelButtonText: "Skip",
            allowEscapeKey:false,
            allowOutsideClick:false,
            showLoaderOnConfirm:true,
            preConfirm : ()=>{}
          }).then(result=>{
            if(result.value){
              this.appServices.logout(true);
            } else {
              this.appServices.goLogin()
            }
          })
        }
      })
    } else{
      swal({
        title: "You are Logged out !",
        text: "Click Login To Continue in one step.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#ff386a',
        confirmButtonText: 'Login',
        cancelButtonText: "Skip",
        allowEscapeKey:false,
        allowOutsideClick:false,
        showLoaderOnConfirm:true,
        preConfirm : ()=>{}
      }).then(result=>{
        if(result.value){
          this.appServices.logout(true);
        } else {
          this.appServices.goLogin()
        }
      })
    } 
    
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppService } from '../_services/app.service';
import swal from 'sweetalert2';
const swalmsg={
  LOG_TITLE:"You are Logged out !",
  LOG_TEXT:"Click Login To Continue in one step.",
  KYC_UND_TITLE:"KYC is Under Review",
  KYC_UND_TEXT:"Your KYC is under review Please wait for Approval",
  KYC_REJ_TITLE:"KYC is Rejected",
  KYC_REJ_TEXT:"Your KYC is Rejected Please complete your KYC with valid information",
}
@Injectable({
  providedIn:'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private appService: AppService,
    private router: Router
    ){
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.appService.isLoggedIn()){
      if(this.appService.getKYCStatus == "APPROVED"){
        return true;
      } else if(this.appService.getKYCStatus == "UNDERREVIEW") {
        this.appService.retutnUrl = state.url;
        console.log(this.appService.retutnUrl);
        
        this.showSwal('KYC_UND_TITLE','KYC_UND_TEXT')
        this.appService.retutnUrl = state.url;
        console.log(this.appService.retutnUrl);
        return false;
      } else { // Rejected
        this.showSwal('KYC_REJ_TITLE','KYC_REJ_TEXT')
        this.appService.retutnUrl = state.url;
        console.log(this.appService.retutnUrl);
        return false;
      }
    }else{
      this.showSwal('LOG_TITLE','LOG_TEXT')
      this.appService.retutnUrl = state.url;
      console.log(this.appService.retutnUrl);
      return false;
    }
  }
  showSwal(title,text){
    swal({
      title: swalmsg[title],
      text: swalmsg[text],
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: '#ff386a',
      showConfirmButton:title == 'LOG_TITLE',
      confirmButtonText: 'Login',
      cancelButtonText: "Skip",
      allowEscapeKey:false,
      allowOutsideClick:false,
      showLoaderOnConfirm:true,
      preConfirm : ()=>{}
    }).then(result=>{
      if(result.value){
        this.appService.logout(true);
      } else {
        this.appService.goLogin()
      }
    })
  }
}

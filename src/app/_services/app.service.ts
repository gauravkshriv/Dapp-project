import { Injectable } from '@angular/core';
import { Router,  NavigationEnd } from '@angular/router';
import swal from 'sweetalert2';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models';
import { Location } from '@angular/common';
import { rmeOccEnum } from './enum.service';
import { Url } from '../_constants/urls';
const ACC = Url.ACC_TEST;
const DAPP = Url.DAPP_TEST;

const exc = {
  JWT_EXPIRED:'JWT Expired',
  SESSION_DEAD:'Session Dead',
  SESSION_NOT_FOUND:'Session Not Found',
  SESSION_EXPIRED:'Session Expired',
  USER_NOT_FOUND:'User Not Found',
  JWT_NOT_VALID : 'JWT Not Valid'
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  allDataBankFiles:any=[];
  allDataRequest:any=[];
  dataRequestChild:any;
  currentDataTag:any;
  currentDataBank:any;
  currentDepartment:any;
  currentFolder:any;
  requestId : any;
  goToStep : number;
  userKYT:any;
  retutnUrl:any;


  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  constructor(
    private router: Router,
    private apiServices : ApiService,
    private location : Location

  ) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userInfo')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get ACCOUNT_URL() : string { return this.apiServices.ACCOUNT_URL;}
  public get COMMUNITY_URL() : string { return this.apiServices.COMMUNITY_URL;}
  public get ACADEMY_URL() : string { return this.apiServices.ACADEMY_URL;}
  public get RETAIL_URL() : string { return  this.apiServices.RETAIL_URL;}
  public get RMEHUB_URL() : string { return  this.apiServices.RMEHUB_URL;}
  getProjectId(){ 
    let pid = localStorage.getItem('projectId');    
    if(pid != "null") return pid;
    return false;
  }
  setProjectId(projectId){localStorage.setItem('projectId',projectId);}
  getRouterURL(){
    return this.router.url;
  }

  setplotVarId(plotVarId){localStorage.setItem('plotVarId',plotVarId);}
  getplotVarId() {
    let pid = localStorage.getItem('plotVarId');
    if(pid) return pid; return false;
  }
  setInventoryId(inventoryId){localStorage.setItem('inventoryId',inventoryId);}
  getInventoryId() {
    let invId = localStorage.getItem('inventoryId');
    if(invId) return invId; return false;
  }
  goForProfile(_ct){
    this.goToLocation(ACC+'/user/viewprofile?_ct='+_ct)
  }
  goForPersonalInfo(_ct) {
		this.goToLocation(ACC+'/personalinformation?referral=datamanagement&&redirect='+DAPP+'/auth/login&&_ct='+_ct)
  }
  goForKYC(_ct) {
		this.goToLocation(ACC+'/kycdetails?referral=datamanagement&&redirect='+DAPP+'/auth/login&&_ct='+_ct)
	}
  routTo(url){
    this.router.navigate([url]);
  }
  getPrevUrl(){
    let currentUrl = this.router.url;
    this.router.events.subscribe(event=>{
      if (event instanceof NavigationEnd) {        
        let previousUrl = currentUrl;
        currentUrl = event.url;
       return previousUrl;
      };
    })
  }
  goBack() {
    this.location.back()
  }
  goForward() {
    this.location.forward()
  }
  setUser(userInfo) {
    // localStorage.setItem("userInfo", userInfo)
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    this.currentUserSubject.next(userInfo);
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  
  getUser() {
    return localStorage.getItem("userInfo")
  }
  get getKYCStatus(){
    return this.kycStatus() !== null ? this.kycStatus(): false;
  }
  kycStatus(){
    return localStorage.getItem("_kyc")
  }
  getUserInfo(){
    if(this.getUser())
      return JSON.parse(this.getUser())
    return null;
  }
  isLoggedIn() {
    return this.getUser() !== null;
  }
  isDMC(){
    let user;
    user = this.getUserInfo()
    if(user){
      if(user.occ && user.occ.includes('DATA_MANAGEMENT_CONSULTANT'))
        return true;
      return false;
    } else return false;
      
  }
  get getReturnUrl(){
    if(this.retutnUrl) return this.retutnUrl;
    else return this.router.url
  }
  clearRedirect(){
    localStorage.removeItem('_ct')
    localStorage.removeItem("userInfo")
    this.goToLocation(Url.ACC_TEST+'/?referral=datamanagement&returnUrl='+this.getReturnUrl)
    // this.goToLocation(Url.ACC+'/?referral=datamanagement&returnUrl='+this.router.url);
  }
  /**
   * pass true for remove session and redirect to login portal, 
   * pass false for remove session an redirect to login page
   * @param redirect 
   * @param callback function is optional
   */
  logout(redirect, callback?:any) {
    let _user = this.getUserInfo();
    if(_user !== null){
      let body = {
        "uuid":_user.uuid,
        "sessionToken":_user.sessiontoken
      }      
      swal({
        text:'Your Session is getting Logged Out.',
        onBeforeOpen:()=>{
          swal.showLoading()
          this.apiServices.logout(body)
          .then(res=>{
            let data = res.data;
            console.log(data);
            localStorage.removeItem("userInfo");
            callback(data);
            if(redirect)
            this.clearRedirect()
            else
            this.goLogin()
          }).catch(err=>{
              if(redirect)
              this.clearRedirect()
              else
              this.goLogin()
          })  
        }
      })
    } else { 
      if(redirect)
      this.clearRedirect()
      else
      this.goLogin()
    }
  }
  goToLocation(loc){
    window.location.href = loc;
  }
  getUserKYTs(callback){
    if(this.userKYT){
      callback(this.userKYT)
      return;
    } else {
      let _kyts = localStorage.getItem('_kyts')
      if(_kyts != null){
        this.userKYT = JSON.parse(_kyts)
        callback(this.userKYT)
        return;
      }
      else {
        let user = this.getUserInfo()
        this.apiServices.allKYTStatus({'uuid':user.uuid})
        .then(res=>{
          console.log(res.data);
          if(res.data.status && res.data.statusCode == 200){
            this.userKYT = res.data.extraData.dto;
            localStorage.setItem('_ukyt',JSON.stringify(res.data.extraData.dto))
            callback(this.userKYT)
          }else {
            callback(false)
            this.handleOtheException(res.data.exception)
          }  
        }).catch(err=>{
          this.handleNetworkException(err)
        })
      }
    }
   
  }
  goLogin(){this.router.navigate(['/auth/login'])}
  goHome(){this.router.navigate(['/'])}
  handleOtheException(ex){
    console.log('????????????????????????????????????',ex);
    if(ex === "JWT_EXPIRED" || ex == "SESSION_DEAD" || ex == "JWT_NOT_VALID" ||
    ex == "USER_NOT_FOUND" || ex == "SESSION_NOT_FOUND" || ex == "SESSION_EXPIRED"){
      swal({
        title: exc[ex],
        text: exc[ex]+" , Click Login To Continue in one step.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#ff386a',
        confirmButtonText: 'Login',
        cancelButtonText: "Skip",
        allowEscapeKey:false,
        allowOutsideClick:false,
        showLoaderOnConfirm:true,
      }).then(result=>{
        if(result.value){
          this.logout(true)
        } else {
          this.goLogin()
        }
      })
    } 
  }
  handleNetworkException(error){    
    if(!error.response){
      swal({
        title:'Network Error',
        text:'Check the network cables, modem, and router',
        confirmButtonText:'Got It'
      })
    }
  }
  getRMEOccEnum(occ:Array<any>){
   return occ.map(x=>rmeOccEnum[x])
  }

}

import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {ActivatedRoute, Params} from '@angular/router';
import {Encryptor} from '../../_services/encryption.service';
import { AppService, ApiService } from 'src/app/_services';
import { Location } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	isLoading = false;
	returnUrl:any;
	peronalInfoCompleted = true;
	kycStatus : any;
	_user:any;
	// @Output() onLogin = new EventEmitter<boolean>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private encryptor:Encryptor,
	private appService : AppService,
	private apiService : ApiService,
	private location : Location
	
    ) 
  	{ 
		this.accountPortalLogin()
	}
  
ngOnInit() {
}
goLogin(){
	this.appService.clearRedirect()
}
accountPortalLogin(){
  this.activatedRoute.queryParams.subscribe( (params: Params) => {
		this.returnUrl = params['returnUrl'];
		let _ct = params['_ct'];		
		this.location.replaceState('auth/login')
		if(_ct){
			localStorage.setItem('_ct',_ct)
			let byte = this.encryptor.decrypt(atob(unescape(_ct)));
			let decryptedData = (JSON.parse(byte.toString(CryptoJS.enc.Utf8)));
			let res = JSON.parse(decryptedData[0].Userdetails)
			this.validateUser(decryptedData,res.data, _ct)
		} else if(this.appService.isLoggedIn()){
			console.log('okkkk');
			
			this._user =this.appService.getUserInfo()
			if(this.appService.getKYCStatus){
				this.kycStatus =this.appService.getKYCStatus;
				this.handleKYC()
			}
		} else {			
			swal({
				title: "You are Logged out !",
				text: "Click Login To Continue in one step.",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: '#ff386a',
				confirmButtonText: 'Login',
				cancelButtonText: "Not Now",
				allowEscapeKey:false,
				allowOutsideClick:false,
				showLoaderOnConfirm:true,
				preConfirm : ()=>{}
			  }).then(result=>{
				if(result.value){
				  this.appService.clearRedirect();
				} else {
				//   this.appService.goLogin()
				}
			  })
			this.peronalInfoCompleted = true;
			this.kycStatus = undefined;
		}
	});
	}	
	validateUser(decryptedData, data: any, _ct) {
		this._user = {
			Userdetails : data,
			occ : data._occ,
			username : data.username,
			userLoginStatus : true,
			uuid : decryptedData[6].uuid,
			sessiontoken : decryptedData[2].sessiontoken,
			jwttoken : decryptedData[3].jwttoken,
			fullname :  data.fullname
		}
		localStorage.setItem("userInfo", JSON.stringify(this._user));
		if(data.fullname){
			this.kycStatus = data._kst;
			localStorage.setItem('_kyc',this.kycStatus)
			this.handleKYC()
		} else {
			this.peronalInfoCompleted = false;
			console.log(this.peronalInfoCompleted);
		}
	}
	handleKYC() {
		if(this.kycStatus == "APPROVED"){
			if(this.returnUrl)this.appService.routTo(this.returnUrl)
			else this.appService.goHome()
		}
	}
	getKYTs() {
		let user = this.appService.getUserInfo()
		this.apiService.allKYTStatus({'uuid':user.uuid})
		.then(res=>{
			console.log(res.data);
			if(res.data.status && res.data.statusCode == 200){
				this.appService.userKYT = res.data.extraData.dto;
				localStorage.setItem('_ukyt',JSON.stringify(res.data.extraData.dto))
				if(this.returnUrl)this.appService.routTo(this.returnUrl)
				else this.appService.goHome()
			} else this.appService.handleOtheException(res.data.exception)
		}).catch(err=>{
			this.appService.handleNetworkException(err)
		})
	}
	getEncriptedData(){
		let user = this.appService.getUserInfo()
		if(user){
			var dataencript = [
				{ jwttoken: user.jwttoken },
				{ uuid: user.uuid},
				{ sessiontoken: user.sessiontoken }
			  ]
			  var ciphertext = (this.encryptor.encrypt(JSON.stringify(dataencript)));
			  return btoa(ciphertext);
		} else this.appService.logout(false)
	}
	goForPersonalInfo(){
		this.appService.goForPersonalInfo(this.getEncriptedData())
	}
	goForKYC(){
		this.appService.goForKYC(this.getEncriptedData())
	}
	logOut(){
		this.appService.logout(false,()=>{
			console.log('user logged....out');
			
			this.accountPortalLogin()
		})
	}
}


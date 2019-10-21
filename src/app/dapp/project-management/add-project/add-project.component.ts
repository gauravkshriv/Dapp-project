import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import {  FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AppService, ApiService, userRoleEnum, UtlService } from 'src/app/_services';
import { ReplaySubject, } from 'rxjs';
import * as $ from 'jquery';
import * as _ from 'lodash';
import { MapsAPILoader } from '@agm/core';
import { MatStepper } from '@angular/material';
import swal from 'sweetalert2';
declare let google: any;
declare var $: any;
export function optionalValidator(validators?: (ValidatorFn | null | undefined)[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
      return control.value ? Validators.compose(validators)(control) : null;
  };
}
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {

  rmeOcc :Array<any> = []
  ////////////////////////////////////////////////////////////////////////      Step 1   
  projectId : any; 
  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;
  step4FormGroup: FormGroup;

  projectSubtype : any;
  projectType : any;
  maxpStartDate = new Date()
  minpEndDate = new Date()
  searching: boolean = false;
  otherFacilitySelected: boolean  = false;
  isFileUploaded: boolean = true;
  isDocUploaded: boolean = false;
  step1Completed: boolean = false;
  step2Completed: boolean = false;
  step3Completed: boolean = false;
  step4Completed: boolean = false;

  isLoading :boolean = false;
  zoomStep1:any =15;
  locationStep1 = {
    latitude:'',
		longitude:'',
		mapLocation:'',
		country:'',
		state:'',
		city:'',
		addressLineOne:'',
		addressLinetwo:'',
		district:'',
		tehsil:'',
		village:'',
		pincode:'',
		landmark:''
  }
  latitudeStep1:Number = 30.375936;
  longitudeStep1:Number =78.09024;
  
  public projectInfo = {
    projectName:'',
		projectDesc:'',
		// pStartDate:'',
		// pEndDate:'',
  }
  ////////////////////////////////////////////////////////////////////////      Step 2  
  inventoryId: any;
  selectedUnit = 'Unit Area';
  propertyInfo = {
    propertyType: "0",
    brokerDiscount : "",
    loanStatus : true,
  }

  nearByLoc :Array<any> = [];
  allSelectedNearByLoc :Array<any> = [];
 
  facility :Array<any> = [];
  allSelectedFacility :Array<any> = [];
  otherFacility: string  = "";

  approvalType : Array<any> =[];
  // selectedApprovalType :'0';

  projectSizeUnits : Array<any> = [];
  lengthUnit : Array<any> = []
  roadSizeUnit:any;
  architectureReq = {
		projectSizeValue: "",
    projectSizeUnit : "" ,
		serviceRoadSize :{
			serviceRoadSizeValue:"",
			serviceRoadSizeUnit:""
		},
		mainEntryRoadSize: {
			mainEntryRoadSizeValue:"",
			mainEntryRoadSizeUnit:""
		},
    approvalType : "" ,
    OtherLayoutApproval : "",
		minimumPlotSize: "",
		maximumPlotSize: "",
    layoutPreparedBy: "",
    projectGallery : []
  } 
  inventoryRequest={
		totalInventoryCount: "",
		availableInventoryCount: ""
  }
  totalInventoryCount:number=0;
  plottingVariationRequestList : Array<any> = [];
  pricing = {
		circleRate: '',
		premiumRate: '',
		developmentCharge: '',
		primeLocationCharge: ''
	}
  facingSide:Array<any>=[];
  projectGallery : Array<any> = [];
  ///////////////////////////////////////////////////////////////////////////       Step 3

  incentive={
		incentiveIn:"",
		incentiveOut:"",
		incentiveType:""
	}
	target={
		invcount:"",
		enddate:"",
		roi:""
  }
  

  ////////////////////////////////////////////////////////////////////        Step  4

  sBrokingConsultant : Array<any> = [];
  sLegalConsultant : Array<any> = [];
  sDigitalMarketingExpert : Array<any> = [];

  selectedBrokingConsultant : Array<any> = [];
  selectedLegalConsultant : Array<any> = [];
  selectedDigitalMarketingExpert : Array<any> = [];

  selectedDataAdmin : Array<any> = [];
  selectedDataManagConsultant : Array<any> = [];
  teamMember :Array<any> = [];

  isDeptTeamFound = false;
  myTeam : ReplaySubject<Array<any>> = new ReplaySubject<Array<any>>();
  documentList : Array<any> = [];
  @ViewChild("mapLocation1",{static:false}) searchElementRefStep1: ElementRef;
  @ViewChild("stepper",{static:false}) stepper: MatStepper;
  userRoles : Array<any> = [];
  totalFaceCount = 0;
  requiredFacing :number = -1;
  departmentList: Array<any> = [];
  constructor(
    private _formBuilder: FormBuilder,
    private utlServices : UtlService,
    private appServices : AppService,
    private apiServices : ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }
  ngOnInit(){
    this.step1FormGroup = this._formBuilder.group({
      projectName: ['', Validators.required],
      projectDesc: ['', ],
      mapLocation: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', Validators.required],
      tehsil: ['', Validators.required],
      district: ['', Validators.required],
      addressLineOne: ['', Validators.required],
      ngxSearchsh: ['',],
      ngxSearchben: ['',],
      ngxSearchpar: ['', ],
    });
    this.step2FormGroup = this._formBuilder.group({
      projectSizeValue: ['', Validators.required],
      serviceRoadSize: ['', Validators.required],
      roadSizeUnit: ['', Validators.required],
      mainEntryRoadSize: ['', Validators.required],
      layoutPreparedBy: ['', Validators.required],
      developmentCharge: ['', Validators.required],
      totalInventoryCount: ['', Validators.required],
      availableInventoryCount: ['', Validators.required],
      circleRate: ['', Validators.required]
    });
    this.step3FormGroup = this._formBuilder.group({
      incentiveIn: ['', Validators.required],
      incentiveOut: ['', Validators.required],
      invcount: ['', Validators.required],
      roi: ['', Validators.required],
    })
    this.step4FormGroup = this._formBuilder.group({
      selectedBrokingConsultant:[[optionalValidator()]],
    })
    this.initiateMap()
    this.getPendingProject()
    this.facility = this.utlServices.facility
   
    this.facingSide = this.utlServices.facingSide;
    this.rmeOcc = this.utlServices.rmeOcc;
    this.nearByLoc = this.utlServices.nearByLocation
    this.projectSizeUnits = this.utlServices.areaUnit
    this.lengthUnit = this.utlServices.lengthUnit
    this.approvalType = this.utlServices.approvalType;
    this.userRoles = this.utlServices.userRoles;
    this.departmentList = this.utlServices.department;
  }
  setStepperAt(step) {
    setTimeout(() => {
      this.stepper.selectedIndex = step-1; 
    }, 500);
  }
  pEndDateChange(){
    this.minpEndDate = this.maxpStartDate;
  }
  async getMyDeptTeam(){
    this.isLoading = true;
    try {
      let teamRes = await this.apiServices.viewAllTeamMember()
      let deptRes = await this.apiServices.getDepartmentList()
      this.isLoading = false;
      if(teamRes.data.status && teamRes.data.statusCode){
        this.isDeptTeamFound= true;
        this.teamMember = teamRes.data.extraData.TeamInfo.teamMember
        this.formatAndPushInMyTeam()
      } else this.appServices.handleOtheException(teamRes.data.exception)
      if(deptRes.data.status && deptRes.data.statusCode){
        if(deptRes.data.status && deptRes.data.statusCode == 200){
          deptRes.data.extraData.Team.forEach(d=> this.pushOneDepartment(d));
        }
      } else this.appServices.handleOtheException(deptRes.data.exception)
    } catch (error) {
      this.isLoading = false;
      this.appServices.handleNetworkException(error)
    }
  }
  pushOneDepartment(dept){
    let route = dept.departmentName.toLocaleLowerCase().split(' ').join('-');
    this.departmentList.push({ name: dept.departmentName.toLocaleLowerCase(), value: dept.departmentName, route: route, editable:true})
  }
  formatAndPushInMyTeam(){
    let myTeam = [];
    let allTeam = this.selectedBrokingConsultant.concat(this.selectedLegalConsultant.concat(this.selectedDataAdmin))
    this.teamMember.forEach((m,i)=>{
      if(m.invitationStatus == "ACCEPTED"){
        m["id"]= "";
        m["doj"]= "";
        m["memberStatus"]= "NaN";
        m["projectTaskId"]="";
        m["_occupation"] = "NaN";
        m["occupation"] = m.occupation.map(x=>this.utlServices.rmeOcc.find(o=>o.value == x))
        m["roles"] = [];
        m["incentiveType"]="NaN";
        m["incentiveValue"]="";
        m["startDate"]="";
        m["endDate"]="";
        m["docRequired"]=[];
        m["departmentName"]="";
        if(!allTeam.some(u=>u.uuid == m.uuid))
          myTeam.push(m);
      }
    })
    this.myTeam.next(myTeam)
  }
  
  initiateMap(){
    this.mapsAPILoader.load().then(() => {      
     let autocompleteStep1 = new google.maps.places.Autocomplete(this.searchElementRefStep1.nativeElement, {
       types: []
     });
      autocompleteStep1.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place = google.maps.places.PlaceResult = autocompleteStep1.getPlace()
          this.latitudeStep1 = place.geometry.location.lat();
          this.longitudeStep1 = place.geometry.location.lng();
          this.zoomStep1 = 15;
          this.setLocation(place)
        });
      }, {passive: true});
    });
  }
  getCurrentLocation() {
    this.mapsAPILoader.load().then(() => {
      let geocoder = new google.maps.Geocoder;
      let latlng;
      latlng = {lat: this.latitudeStep1, lng: this.longitudeStep1}
      geocoder.geocode({'location': latlng},(results)=>{
         this.setLocation(results[0])
      });
    });
    console.log(this.locationStep1);
  }
  setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.latitudeStep1  = position.coords.latitude;
          this.longitudeStep1 = position.coords.longitude;
          // this.locationStep1.latitude =  this.latitudeStep1.toString()
          // this.locationStep1.longitude = this.longitudeStep1.toString()
          this.zoomStep1 = 15;
        this.getCurrentLocation();
      });
    }
  }
  
  setLocation(location : any){
    this.locationStep1.latitude = this.latitudeStep1.toString()
    this.locationStep1.longitude = this.longitudeStep1.toString()
    this.locationStep1.mapLocation = location.formatted_address;   
      location.address_components.forEach(addr => {
        if(addr.types.includes("locality"))
          this.locationStep1.city = addr.long_name;  
        if(addr.types.includes("administrative_area_level_1"))
          this.locationStep1.state = addr.long_name; 
        if(addr.types.includes("country"))
          this.locationStep1.country = addr.long_name; 
        if(addr.types.includes("postal_code"))
          this.locationStep1.pincode = addr.long_name; 
        else {
          this.locationStep1.pincode = ''; this.pinCodeNotFound()
        }
      });
      if(this.locationStep1.pincode && this.locationStep1.pincode.length == 6){
        this.setTalukDist(this.locationStep1.pincode)
      }
  }
  pinKeyup(){
      if(this.locationStep1.pincode.trim().length == 6)
        this.setTalukDist(this.locationStep1.pincode)
      else this.pinCodeNotFound()
  }
  setTalukDist(pin){
    this.searching = true;
    this.apiServices.pinCodeInfo(pin)
    .then(res=>{
      console.log(res.data);
      this.searching = false;
      if(res.data.status && res.data.statusCode ==200){
        let info = res.data.extraData.PinInfo[0];
        if(info){
            this.locationStep1.district = info.district;
            this.locationStep1.tehsil = info.taluka;
        } else {
          this.pinCodeNotFound()
        } 
      } else if(res.data.exception === "DATA_NOT_FOUND") {
        this.pinCodeNotFound()
      } else this.appServices.handleOtheException(res.data.exception)
    }).catch(err=>{
      this.searching = false;
      console.log(err); 
      this.appServices.handleNetworkException(err)
    })
   
  }

  pinCodeNotFound(){
      this.locationStep1.tehsil = "";
      this.locationStep1.district = "";
  }
  getUserWithOcc(user : Object, userInfo){
    let occ = []    
    userInfo._occ.forEach(oc => {
      let row = this.utlServices.rmeOcc.find(o=>o.value == oc)
      if(row) occ.push(row)
    });
    user["occ"]=occ;
    return user;
  }

  ngOnDestroy() {
    this.myTeam.next()
  }
  projectSubTypeClick(v){
    if(v) this.propertyInfo.propertyType = "0"
    else this.propertyInfo.propertyType = "1"
  }

  getAddProjectStep1Body(){
    let user = this.appServices.getUserInfo()
    let projectGallery = this.projectGallery.map(u=>u.fileUrl)
    if(user){
      let body = {
        "uuid":user.uuid,
        "projectName":this.projectInfo.projectName,
        "projectDesc":this.projectInfo.projectDesc,
        "projectGallery":projectGallery,
        "location":this.locationStep1,
        "projectType":this.projectType,
        "projectSubtype":this.projectSubtype
      }
      return body;
    } else return null;
  }
  projectSizeUnitsChange(unit){
    this.selectedUnit = unit.name;
  }
  getAddProjectStep2Body(){
    let user = this.appServices.getUserInfo()
    let facilitySpecification = this.allSelectedFacility.map(e=>e.enum);
    if(user){
      let body = {
        "uuid": user.uuid,
        "propertyType": this.propertyInfo.propertyType,
        "loan": this.propertyInfo.loanStatus,
        "brokerDiscount": this.propertyInfo.brokerDiscount,
        "location":this.locationStep1,
        "nearby":this.allSelectedNearByLoc,
        "otherFacilities":this.otherFacility.split(' '),
        "facilitySpecification": facilitySpecification,
        "architectureRequestDto":this.architectureReq,
        "inventoryDocumentRequestDto":this.inventoryRequest,
        "facingRequestDto":this.getFacingStruacture(),
        "plottingVariationRequestDto":this.getPlottingVariationRequestDto(),
        "pricing" : this.pricing
      }
      return body;
    } else return null;
  }
  roadSizeUnitChng(unitValue){
    this.architectureReq.mainEntryRoadSize.mainEntryRoadSizeUnit = unitValue;
    this.architectureReq.serviceRoadSize.serviceRoadSizeUnit = unitValue;
  }
  getPlottingVariationRequestDto() {
    return this.plottingVariationRequestList
    // .map(x=>{
     
    // })
  }
  getAddProjectStep3Body(){
    let user = this.appServices.getUserInfo()
    if(user){
      let body = {
        "uuid":user.uuid,
        "projectId":this.projectId,
        "incentive":{
          "incentiveIn":this.incentive.incentiveIn,
          "incentiveOut":this.incentive.incentiveOut,
          "incentiveType":this.incentive.incentiveType
        },
        "target":{
          "invcount":this.target.invcount,
          "enddate":this.target.enddate,
          "roi":this.target.roi
        }
      }
      return body;
    } else return false;
  }
  getAddProjectStep4Body(){
    let user = this.appServices.getUserInfo()    
    if(user){
      let body = {
        "uuid":user.uuid,
        "projectId":this.projectId,
        "brokingConsTeamTask":this.getbrokingConsTeamTask(),
        "legalConsTeamTask":this.getlegalConsTeamTask(),
        "digitalMarketConsTeamTask":this.getdigitalMarketConsTeamTask(),
      }
      return body;
    } else return false;
  }
  getUpdateProjectBody(){
    let user = this.appServices.getUserInfo()
    let projectGallery = this.projectGallery.map(u=>u.fileUrl)
    if(user){
      let body = {
        "uuid":user.uuid,
        "projectId":this.projectId,
        "projectName":this.projectInfo.projectName,
        // "startDate":this.projectInfo.pStartDate,
        // "endDate":this.projectInfo.pEndDate,
        "location":this.locationStep1,
        "projectDesc":this.projectInfo.projectDesc,
        "projectGallery":projectGallery,
        "projectType":this.projectType,
        "projectSubtype":this.projectSubtype,
        "incentive":this.incentive,
        "target":this.target,
        "brokingConsTeamTask":this.getbrokingConsTeamTask(),
        "legalConsTeamTask":this.getlegalConsTeamTask(),
        "digitalMarketConsTeamTask":this.getdigitalMarketConsTeamTask(),
      } ; return body;
    }; return null;
  }
  getUpdateInvtBody(){
    let user = this.appServices.getUserInfo()
    let facilitySpecification = this.allSelectedFacility.map(e=>e.enum);
    this.architectureReq.projectGallery = this.projectGallery.map(u=>u.fileUrl)
    if(user){
      let body={
        "uuid": user.uuid,
        "inventoryId":this.inventoryId,
        "propertyType": this.propertyInfo.propertyType,
        "loan": this.propertyInfo.loanStatus,
        "brokerDiscount": this.propertyInfo.brokerDiscount,
        "location":this.locationStep1,
        "nearby":this.allSelectedNearByLoc,
        "otherFacilities":this.otherFacility.split(' '),
        "facilitySpecification": facilitySpecification,
        "architectureRequestDto":this.architectureReq,
        "inventoryDocumentRequestDto":this.inventoryRequest,
        "facingRequestDto":this.getFacingStruacture(),
        "plottingVariationRequestDto":this.getPlottingVariationRequestDto(),
        "pricing" : this.pricing
      }; return body;
    }; return null;
  }
  addProjectStep1(){    
    if(this.step1FormGroup.valid){
      if(this.isfileUploaded()){
        if(!this.step1Completed){
          if(this.getAddProjectStep1Body()){
            this.isLoading = true;
            this.apiServices.addProjectStep1(this.getAddProjectStep1Body())
            .then(res=>{
            this.isLoading = false;
              console.log(res.data);
              if(res.data.status && res.data.statusCode == 200){
                this.step1Completed = true;
                this.projectId = res.data.extraData.Step1.projectID;
                swal({
                  title :'Success',
                  text : 'Step 1 Completed successfully',
                  type  : 'success',
                  confirmButtonText : 'Got It'
                })
              } else {
                this.stepper.previous()
                this.appServices.handleOtheException(res.data.exception)
              }
            }).catch(err=>{
              console.log(err);
              this.stepper.previous()
              this.appServices.handleNetworkException(err)
            })
          }
        } else this.updateProject()
      } else {
        this.stepper.previous()
        $('#uploadFile').click()
        this.animateStepAt('bottom')
      }
    } else $('#formError').click()
  }
  addProjectStep2(){
    if(this.step2FormGroup.valid){
      if(this.isValidFaceSelection()){
        if(this.isValidInventory()){
          if(this.otherFacilitySelected && this.otherFacility == ""){
            this.stepper.previous()
            $('#otherfac').click()
          } else if(!this.isValidNearLocation()){
            this.stepper.previous()
            $('#invalidNearByLoc').click()
            this.animateStepAt('bottom')
          } else {
            if(!this.step2Completed){
              if(this.getAddProjectStep2Body()){
                console.log('this.getAddProjectStep2Body()',this.getAddProjectStep2Body());
                this.isLoading = true;
                this.apiServices.bulkInventoryUpload(this.getAddProjectStep2Body())
                .then(res=>{
                  console.log(res.data);
                  if(res.data.status && res.data.statusCode == 200){
                    let body = {
                      "uuid":this.appServices.getUserInfo().uuid,
                      "projectId":this.projectId,
                      "invClassName":res.data.extraData.plot.className,
                      "invUniqueId":res.data.extraData.plot.uniqueId
                    }
                    this.apiServices.addProjectStep2(body)
                    .then(res=>{
                      this.isLoading = false;
                      console.log(res.data);
                      if(res.data.status && res.data.statusCode == 200){
                        this.step2Completed = true;
                        swal({
                          title :'Success',
                          text : 'Step 2 Completed',
                          type  : 'success',
                          confirmButtonText : 'Got It'
                        })
                      } else {
                        this.stepper.previous()
                        this.appServices.handleOtheException(res.data.exception)
                      }
                    }).catch(err=>{
                  console.log(err);
                  this.stepper.previous()
                  this.appServices.handleNetworkException(err)
                })
                  } else {
                    this.stepper.previous()
                    this.appServices.handleOtheException(res.data.exception)
                  }
                }).catch(err=>{
                  console.log(err);
                  this.stepper.previous()
                  this.appServices.handleNetworkException(err)
                })
              }
          } else this.updateInventory()
          }
        } else {
          this.stepper.previous()
          this.animateStepAt('bottom')
          $('#inventoryError').click()
        }
      } else {
        this.stepper.previous()
        this.animateStepAt('middle')
        $('#faceSelectionError').click()
      }
    } else {
      $('#formError').click()
    }
  }
  isValidNearLocation() {
    let flag = true;
    if(!this.allSelectedNearByLoc.length) return false;
    this.allSelectedNearByLoc.forEach(loc=>{
      if(loc.nearByLocation == "") flag = false;
    })
    return flag;
  }
  addProjectStep3(){
    if(this.step3FormGroup.valid){
      if(this.step3Completed){
        this.updateProject()
        this.stepper.next()
      } else {
       if(this.getAddProjectStep3Body()){
         this.isLoading = true;
        this.apiServices.addProjectStep3(this.getAddProjectStep3Body())
        .then(res=>{
          console.log(res.data);
         this.isLoading = false;
          if(res.data.status && res.data.statusCode == 200){
            swal({
              title :'Success',
              text : 'Step 3 Completed',
              type  : 'success',
              confirmButtonText : 'Got It'
            })
          } else this.appServices.handleOtheException(res.data.exception)
        })
       }
      }
    } else $('#formError').click()
  }
  addProjectStep4(){
    if(this.isValidUserSelection()){
      if(this.isValidStep4()){
       if(this.isdocUploaded()){
        if(!this.step4Completed){
          // console.log(this.getAddProjectStep4Body());
          if(this.getAddProjectStep4Body()){
            this.isLoading = true;
            this.apiServices.addProjectStep4(this.getAddProjectStep4Body())
            .then(res=>{
              this.isLoading = false;
              console.log(res.data);
              if(res.data.status && res.data.statusCode == 200){
                swal({
                  title:'Successfull',
                  type:'success',
                  text: 'Step 4 Added Successfully',
                  confirmButtonColor: '#ff386a',
                  showConfirmButton:true,
                  confirmButtonText: "Let's See",
                  allowEscapeKey:false,
                  allowOutsideClick:false,
                  showLoaderOnConfirm:true,
                  preConfirm : ()=>{}
                }).then(()=>{
                  this.appServices.setProjectId(this.projectId);
                  this.appServices.routTo('/dapp/project-management/my-project/'+this.appServices.getProjectId())
                })
              } else if(res.data.exception == "ALREADY_COMPLETE") this.updateProject()
               else this.appServices.handleOtheException(res.data.exception)
            }).catch(err=>{
              console.log('errrrrrrr',err);
              this.appServices.handleNetworkException(err)
            })
          }
          } else this.updateProject()
       } else {
         
          $('#uploadFile').click()
        }
      } else $('#formError').click()
    } else {
      this.setStep(0)
      $('#minUser').click()
    }
  }
  isdocUploaded() {
    let flag = true;
    // this.selectedBrokingConsultant.forEach(m=>{ m.docRequired.forEach(file => {if(!file.fileUrl) flag = false})})
    // this.selectedDataManagConsultant.forEach(m=>{m.docRequired.forEach(file => {if(!file.fileUrl) flag = false})})
    // this.selectedLegalConsultant.forEach(m=>{m.docRequired.forEach(file => {if(!file.fileUrl) flag = false})})
    // this.selectedDataAdmin.forEach(m=>{ m.docRequired.forEach(file => {if(!file.fileUrl) flag = false})})
    // this.selectedDigitalMarketingExpert.forEach(m=>{m.docRequired.forEach(file => {if(!file.fileUrl) flag = false})    })
    return flag;
  }
  updateInventory(){
    this.isLoading = true;
    if(this.getUpdateInvtBody()){
      this.apiServices.updateInventory(this.getUpdateInvtBody())
      .then(res=>{
        this.isLoading = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200) $('#pupdate').click()
        else this.appServices.handleOtheException(res.data.exception)
      }).catch(err=>{
        console.log('errrr',err);
        this.appServices.handleNetworkException(err)
      })
    }
  }
  updateProject(){
    this.isLoading = true;
    if(this.getUpdateProjectBody()){
      this.apiServices.updateProject(this.getUpdateProjectBody())
      .then(res=>{
        this.isLoading = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200) $('#pupdate').click()
        else this.appServices.handleOtheException(res.data.exception)
      }).catch(err=>{
        console.log('errrr',err);
        this.appServices.handleNetworkException(err)
      })
    }
  }
  isValidUserSelection(){
    let minUser = 0;
    this.selectedBrokingConsultant.forEach(u=> minUser++)
    this.selectedDataManagConsultant.forEach(u=> minUser++)
    this.selectedLegalConsultant.forEach(u=> minUser++)
    this.selectedDataAdmin.forEach(u=> minUser++)
    this.selectedDigitalMarketingExpert.forEach(u=> minUser++)
    return minUser;
  }
  isValidUserInfo(m){
    let flag = true;
    if( m["_occupation"] == "NaN" || (!m["roles"].length) || m["incentiveType"]=="NaN" || m["incentiveValue"]=="" 
    || m["departmentName"]=="") flag = false;
    return flag;
  }
  isValidStep4() {    
    let flag = true;
    this.selectedBrokingConsultant.forEach(m=>{flag = this.isValidUserInfo(m) })
    this.selectedLegalConsultant.forEach(m=>{flag = this.isValidUserInfo(m) })
    this.selectedDigitalMarketingExpert.forEach(m=>{flag = this.isValidUserInfo(m) })
    return flag;
  }
  getFacingStruacture(){
    let facing = []
    let selectedFacingSide = this.facingSide.filter(s=>s.isSelected === true)
    selectedFacingSide.forEach(face => {
      facing.push({facingSide:face.enum,facingCount:face.count})
    });
    return facing;
  }
  isValidUserForProject(user){
    if(user){
      if(user.participationType =="" || user._occupation =="")
        return false;
      return true;
    } else return false;
  }
  getPendingProject(){
    this.projectId = this.appServices.getProjectId();
    if(this.projectId){      
      this.isLoading = true;
      this.apiServices.viewProjectByProjectId(this.projectId)
      .then(res=>{
        this.isLoading = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          let project = res.data.extraData.ProjectInfo;
          if(project.step >= 1){
            this.step1Complete(project)
          }
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err=>{
        console.log(err);
        this.appServices.handleNetworkException(err)
      })
    }
  }
  step1Complete(project){
    this.locationStep1.city = project.location.city;
    this.locationStep1.state = project.location.state;
    this.locationStep1.country = project.location.country;
    this.locationStep1.district = project.location.district;
    this.locationStep1.tehsil = project.location.tehsil;
    this.locationStep1.pincode = project.location.pincode;
    this.locationStep1.village = project.location.village;
    this.locationStep1.landmark = project.location.landmark;
    this.locationStep1.addressLineOne = project.location.addressLineOne;
    this.locationStep1.addressLinetwo = project.location.addressLinetwo;
    this.locationStep1.mapLocation = project.location.mapLocation;
    this.locationStep1.latitude = project.location.latitude;
    this.locationStep1.longitude = project.location.longitude;
    this.latitudeStep1 =  parseFloat(project.location.latitude)
    this.longitudeStep1 =  parseFloat(project.location.longitude)
    this.projectInfo.projectName = project.projectName;
    this.projectInfo.projectDesc = project.projectDesc;
    project.projectGallery.forEach(pic_url => {
      this.projectGallery.push({fileUrl:pic_url})
    });
    this.projectType = this.utlServices.projectType[project.projectType]
    this.projectSubtype = this.utlServices.projectSubType[project.projectSubType]
    if( this.projectSubtype !== "0") this.propertyInfo.propertyType = "0"
    else this.propertyInfo.propertyType = "1";
    this.step1Completed = true;
    setTimeout(() => { this.stepper.next() }, 500);
    if(this.appServices.goToStep && (project.step == 1)){
      this.setStepperAt(this.appServices.goToStep)
    }
    if(project.step >=2) this.getPojectStep2(project)
  }
  getPojectStep2(project){
    this.isLoading = true;
    this.apiServices.getBulkInventory(project.inventoryMapper.uniqueId)
    .then(res=>{
    this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode == 200){
        let invt = res.data.extraData.AllInv;
        this.inventoryId = invt.inventoryId;
        this.step2Complete(project,invt)
      }
    }).catch(err=>{
      console.log(err);
      this.appServices.handleNetworkException(err)
    })
  }
  step2Complete(project, invt){
    this.propertyInfo.brokerDiscount = invt.brokerDiscount;
    this.propertyInfo.loanStatus = invt.loan;
    this.propertyInfo.propertyType = invt.propertyType == "PREBUILT_ASSET" ? "0":"1";    
    this.pricing.circleRate = invt.pricingCriteria.circleRate;
    this.pricing.developmentCharge = invt.pricingCriteria.developmentCharge;
    this.pricing.premiumRate = invt.pricingCriteria.premiumRate;
    this.pricing.primeLocationCharge = invt.pricingCriteria.primeLocationCharge;

    this.architectureReq.approvalType = this.approvalType.find(v=>v.value == invt.layoutDocument.approvalType).enum;
    let unit = this.utlServices.areaUnit.find(v=>v.value == invt.layoutDocument.projectSizeUnit)
    this.architectureReq.projectSizeUnit = unit.enum.toString();
    this.selectedUnit = unit.name;
      
    this.architectureReq.layoutPreparedBy = invt.layoutDocument.layoutPreparedBy;
    // this.architectureReq.maximumPlotSize = invt.layoutDocument.maximumPlotSize;
    // this.architectureReq.minimumPlotSize = invt.layoutDocument.minimumPlotSize;
    this.architectureReq.OtherLayoutApproval = invt.layoutDocument.otherLayoutApproval;
    this.architectureReq.projectSizeValue = invt.layoutDocument.projectSizeValue;
    this.architectureReq.mainEntryRoadSize = invt.layoutDocument.mainEntryRoadSize;
    this.architectureReq.serviceRoadSize = invt.layoutDocument.serviceRoadSize;
    this.roadSizeUnit = this.architectureReq.serviceRoadSize.serviceRoadSizeUnit;
    this.allSelectedFacility = []
    invt.facilites.forEach(fac => {
      this.allSelectedFacility.push(this.utlServices.facility.find(v=>v.value == fac))
    });
    this.otherFacility = invt.otherFacilities.join()    
    this.facilityCilck()
    this.allSelectedNearByLoc =[]
    let LocKeys = Object.keys(invt.nearByLocation)
    LocKeys.forEach(loc => {
      let data = this.utlServices.nearByLocation.find(v=>v.value == loc)
      data.nearByLocation = invt.nearByLocation[loc]
      this.allSelectedNearByLoc.push(data)
    });
    let faceKeys = Object.keys(invt.inventory.propertyFacingCount)
   
    faceKeys.forEach(face => {
      let data = this.utlServices.facingSide.find(v=>v.value == face)
      let i = this.facingSide.indexOf(data)
      if(i> -1){
        this.facingSide[i].isSelected = true;
        this.facingSide[i].count = invt.inventory.propertyFacingCount[face]
        this.totalFaceCount += this.facingSide[i].count;
        $('#'+this.facingSide[i].value).click()
      }
    });
    this.plottingVariationRequestList = []
    invt.inventory.plottingVariations.forEach(plot => {
      this.plottingVariationRequestList.push({
        id:plot.id,
        plottingVarationId:plot.plottingVariationId,
        availableVariationCount:plot.availableVariationCount,
        dimension: plot.dimension,
        plc:plot.plc,
        isPlc:plot.plc?true:false,
        estimatedPrice : plot.estimatedPrice,
        variationCount:plot.variationCount,
        inventoryMapper:{
          salePrice:plot.inventoryMapper[0].salePrice,
          discountType:plot.inventoryMapper[0].discountType == "FIXED_PRICE" ? "1": "0",
          discountValue:plot.inventoryMapper[0].discountValue
        }
      })
    });
    this.inventoryRequest.availableInventoryCount = invt.inventory.availableInventoryCount;
    this.totalInventoryCount = this.inventoryRequest.totalInventoryCount = invt.inventory.totalInventoryCount;
    this.projectGallery = []
    if(invt.layoutDocument.projectGallery)
    invt.layoutDocument.projectGallery.forEach(pic_url => {
      this.projectGallery.push({fileUrl:pic_url})
    });
    this.step2Completed = true;
    setTimeout(() => { this.stepper.next() }, 500);
    if(this.appServices.goToStep && (2 ==project.step)){
      this.setStepperAt(this.appServices.goToStep)
    }
    if(project.step >= 3) this.step3Complete(project)
   
  }
  step3Complete(project){
    this.incentive.incentiveIn = project.incentive.incentiveIn;
    this.incentive.incentiveOut = project.incentive.incentiveOut;
    this.incentive.incentiveType = project.incentive.incentiveType == "PERCENTAGE" ? "0":"1";
    this.target.invcount = project.target.invcount;
    this.target.roi = project.target.roi;
    this.target.enddate = project.target.enddate;
    this.step3Completed = true;
    setTimeout(() => { this.stepper.next() }, 500);
    if(this.appServices.goToStep && (3 ==project.step)){
      this.setStepperAt(this.appServices.goToStep)
    }
    if(project.step >= 4) this.step4Complete(project)
    
  }
  getUserRolesEnum(roles : Array<any>){
    let _roles = []
    roles.forEach(role => {
      _roles.push(userRoleEnum[role])
    });
    _roles = _roles.map(x=>x.toString())
    return _roles;
  }
  step4Complete(project){
    project.projectTeamTask.brokingConsultant.forEach((user,i) =>{      
      this.selectedBrokingConsultant.push({
        uuid:user.uuid,
        id: user.id,
        doj: user.doj,
        fullName:user.fullname,
        memberStatus: user.memberStatus == "ACTIVE"? "1": (user.memberStatus == "INACTIVE" ? "0" : "2"),
        projectTaskId:user.projectTask.projectTaskId,
        _occupation: this.utlServices.rmeOcc.find(v=>v.value == user.occupation).enum,
        occupation:this.utlServices.rmeOcc.filter(v=>v.value == user.occupation),
        roles: this.getUserRolesEnum(user.roles),
        departmentName:this.departmentList.find(x=>x.value == user.teamDepartment).value,
        incentiveType:user.projectTask.incentiveType == "PERCENTAGE"? "0":"1",
        incentiveValue:user.projectTask.incentiveValue,
      })
    });

    project.projectTeamTask.legalConsultant.forEach((user,i) => {
      this.selectedLegalConsultant.push({
        uuid:user.uuid,
        id: user.id,
        doj: user.doj,
        fullName:user.fullname,
        memberStatus: user.memberStatus == "ACTIVE"? "1": (user.memberStatus == "INACTIVE" ? "0" : "2"),
        projectTaskId:user.projectTask.projectTaskId,
        _occupation: this.utlServices.rmeOcc.find(v=>v.value == user.occupation).enum,
        occupation:this.utlServices.rmeOcc.filter(v=>v.value == user.occupation),
        roles: this.getUserRolesEnum(user.roles),
        incentiveType:user.projectTask.incentiveType == "PERCENTAGE"? "0":"1",
        incentiveValue:user.projectTask.incentiveValue,
      })
    });
    project.projectTeamTask.digitalMarketing.forEach((user,i) => {
      this.selectedDigitalMarketingExpert.push({
        uuid:user.uuid,
        id: user.id,
        doj: user.doj,
        fullName:user.fullname,
        memberStatus: user.memberStatus == "ACTIVE"? "1": (user.memberStatus == "INACTIVE" ? "0" : "2"),
        projectTaskId:user.projectTask.projectTaskId,
        _occupation: this.utlServices.rmeOcc.find(v=>v.value == user.occupation).enum,
        occupation:this.utlServices.rmeOcc.filter(v=>v.value == user.occupation),
        roles: this.getUserRolesEnum(user.roles),
        incentiveType:user.projectTask.incentiveType == "PERCENTAGE"? "0":"1",
        incentiveValue:user.projectTask.incentiveValue,
      })
    });

    this.sBrokingConsultant =  this.selectedBrokingConsultant;
    this.sLegalConsultant =  this.selectedLegalConsultant;
    this.sDigitalMarketingExpert =  this.selectedDigitalMarketingExpert;

    this.step4Completed = true;
    if(this.appServices.goToStep && (4 == project.step)){
      this.setStepperAt(this.appServices.goToStep)
    }
  }

  loanStatus(status){
    this.propertyInfo.loanStatus = status;
  }
  toggleFacing(face){
    let i = this.facingSide.indexOf(face)
    if(i>-1){
      this.facingSide[i].isSelected = face.isSelected ? false :true;
      this.facingSide[i].count = 1;
      if(!this.isValidSelection()){
        $('#'+face.value).click()
        this.facingSide[i].isSelected = false;
        $('#overFace').click()
      }
    } 
  }
  isValidSelection(){
    let invCount = this.getCount()[0]
    let totalCount = this.getCount()[1]
    if(totalCount <= invCount)
        return true;
     return false;
  }
  getCount(){
    let invCount = parseInt(this.inventoryRequest.totalInventoryCount)
    if(invCount !== NaN){
      let selectedI = this.facingSide.filter(s=>s.isSelected == true)
      let countArr = selectedI.map(c=>c.count)
      let totalCount = countArr.reduce((a, b) => a + b, 0)
      this.requiredFacing = invCount - totalCount;
      console.log(this.requiredFacing);
      return [invCount, totalCount]
    }
  }
  isValidFaceSelection(){
    let invCount = this.getCount()[0]
    let totalCount = this.getCount()[1]
    if(totalCount == invCount)
        return true;
     return false;
  }
  isValidCount(){
    let invCount = this.getCount()[0]
    let totalCount = this.getCount()[1]
    if(totalCount < invCount)
      return true;
    return false;
  }
  addCount(face){
    let i = this.facingSide.indexOf(face)
      if(i>-1){       
          if(this.isValidCount())
            this.facingSide[i].count = face.count+1;
      }
  }
  subCount(face){
    let i = this.facingSide.indexOf(face)
      if(i>-1){
        if(face.count>1)
          this.facingSide[i].count = face.count-1;
      }
    this.isValidCount()

  }
 doubleKeyPress(e){
  let length = e.target.value.trim().length;
  if(length >10)
    e.preventDefault();
  var k = e.which;
  var ok = (k >= 48 && k <= 57) ||  // 0-9
      k == 8 ||  // Backspaces
      k == 9 ||  //H Tab
      k == 0 ||  //H Tab
      k == 11 ||  //V Tab
      k == 32 ||  // Space
      k == 127 ||   //Delete
      k == 46;   //Dot
  if (!ok) e.preventDefault()
 }
  numKeyPress(e){
    let length = e.target.value.trim().length;
    if(length >10)
      e.preventDefault();
    var k = e.which;
    var ok = (k >= 48 && k <= 57) ||  // 0-9
        k == 8 ||  // Backspaces
        k == 9 ||  //H Tab
        k == 0 ||  //H Tab
        k == 11 ||  //V Tab
        k == 32 ||  // Space
        k == 127;   //Delete
    if (!ok) e.preventDefault()
  }
  totalInventoryCountKeyUp(e){
    let totalInventoryCount = parseInt(this.inventoryRequest.totalInventoryCount);
    if(this.inventoryRequest.totalInventoryCount.length == 0) totalInventoryCount =0;
    this.requiredFacing =  this.totalInventoryCount = totalInventoryCount;
    this.plottingVariationRequestList = [];
    if(this.totalInventoryCount > 0){
      this.pushOnePloting()
    } else this.requiredFacing = -1;
      this.resetFacing()
  }
  returnNth(n) {
    if (n > 3 && n < 21) return 'th'; 
    switch (n % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  resetFacing() {
    this.facingSide.filter(s=>s.isSelected).forEach(face=>$('#'+face.value).click())
    this.facingSide.forEach((face,i) =>{ this.facingSide[i].isSelected = false}) 
  }
  
  totalAvailableInventoryCountKeyUp(value){
    let totalInventoryCount = parseInt(this.inventoryRequest.totalInventoryCount);
    let availableInventoryCount = parseInt(this.inventoryRequest.availableInventoryCount);
    if(this.inventoryRequest.totalInventoryCount.length == 0) totalInventoryCount =0;
    if(this.inventoryRequest.availableInventoryCount.length == 0) availableInventoryCount =0;
    if(!(totalInventoryCount >= availableInventoryCount)){
      this.inventoryRequest.availableInventoryCount = value.substring(0, value.length - 1);
      $('#inValidTotalInvt').click()
    }
    this.plottingVariationRequestList.forEach((invt,i)=>{
      this.plottingVariationRequestList[i].variationCount = "";
      this.plottingVariationRequestList[i].availableVariationCount = "";
    })
  }
  getTotalVatiationCount(){
    let count = 0;
    this.plottingVariationRequestList.forEach((invt,i)=>{
     if(invt.variationCount.length > 0){
      count += parseInt(invt.variationCount)
     }
    })
    return count;
  }
  getTotalAvailableCount(){
    let count = 0;
    this.plottingVariationRequestList.forEach((invt,i)=>{
     if(invt.availableVariationCount.length > 0){
      count += parseInt(invt.availableVariationCount)
     }
    })
    return count;
  }
  availableCountKeyUp(plotting){
    let i = this.plottingVariationRequestList.indexOf(plotting)
    if(plotting.variationCount.length>0 && (parseInt(plotting.availableVariationCount)>parseInt(plotting.variationCount))){
      $('#availvariationError').click()
      this.plottingVariationRequestList[i].availableVariationCount = plotting.availableVariationCount.substring(0, plotting.availableVariationCount.length - 1);
      return;
    }
    let totalAvailInvtCount = parseInt(this.inventoryRequest.availableInventoryCount);
    let totalSubAvailInvtCount = this.getTotalAvailableCount()
    if(totalSubAvailInvtCount >totalAvailInvtCount){
      $('#subAvailCountError').click()
      this.plottingVariationRequestList[i].availableVariationCount = plotting.availableVariationCount.substring(0, plotting.availableVariationCount.length - 1);
    }
  }
  variationCountKeyUp(plotting){
    let i = this.plottingVariationRequestList.indexOf(plotting)
    let totalVatiationCount = this.getTotalVatiationCount()
    if(this.inventoryRequest.totalInventoryCount.length > 0){
      let totalInvtCount = parseInt(this.inventoryRequest.totalInventoryCount)
      console.log(totalVatiationCount,totalInvtCount);
      if(plotting.variationCount.length > 0){
        // totalVatiationCount += parseInt(e.target.value)
        if(totalVatiationCount >  totalInvtCount){
          this.plottingVariationRequestList[i].variationCount = plotting.variationCount.substring(0, plotting.variationCount.length - 1);
          $('#variationCountError').click()
        }
      }
    }
  }
  serviceRoadSizeKeyUp(e){
    let _mainEntryRoadSize = this.architectureReq.mainEntryRoadSize.mainEntryRoadSizeValue
    let _serviceRoadSize = this.architectureReq.serviceRoadSize.serviceRoadSizeValue
    let mainEntryRoadSize = parseInt(_mainEntryRoadSize);
    let serviceRoadSize = parseInt(this.architectureReq.serviceRoadSize.serviceRoadSizeValue);
    if(_mainEntryRoadSize.length == 0) mainEntryRoadSize =0;
    if(_serviceRoadSize.length == 0) serviceRoadSize =0;
    if(!(mainEntryRoadSize > serviceRoadSize)){
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
      $('#inValidService').click()
    }
  }
  getTotalVariationCount(){
    let variationCount = 0;
    this.plottingVariationRequestList.forEach(plot => {
      if(plot.variationCount.length)
        variationCount+=parseInt(plot.variationCount);
    });
    return variationCount == NaN ? 0 : variationCount;
  }
  addMoreInvt(){    
    if(this.totalInventoryCount > this.plottingVariationRequestList.length){
    this.pushOnePloting()
    } else $('#overInventory').click()
  }
  pushOnePloting(){
    this.plottingVariationRequestList.push({
      id: Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000,
      dimension: '',
      dimensionTwo: '',
      estimatedPrice: '',
      variationCount: '',
      availableVariationCount: '',
      isPlc:false,
      plc:'Front',
      plcCount: '',
      cornerCount:'',
      inventoryMapper:{
        salePrice:"",
        discountType:"0",
        discountValue:""
      }
    })
  }
  
  isValidInventory(){
    // return true;
    let flag = true;
    this.plottingVariationRequestList.forEach((d,i)=>{
      if(d.dimension == "" || d.variationCount == "" || d.availableVariationCount == "") flag = false;
    })
   return flag;
  }
  validateDocument(files,user, selected){
    if(selected == "bc"){
      let k = this.selectedBrokingConsultant.indexOf(user)
      if(k > -1){
        this.selectedBrokingConsultant[k].docRequired =[]
        for (let i = 0; i < files.length; i++) {
          if(i<10){
            let file  = files[i];
            if(file.size >5242880){
              $('#fileSizeError').click()
            } else {
              if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
                this.selectedBrokingConsultant[k].docRequired.push(file)
              } else  $('#fileTypeError').click()
            }
          } else $('#maxFileLimit').click()
        }
      }
    } else if(selected == "dmc"){
      let k = this.selectedDataManagConsultant.indexOf(user)
      if(k > -1){
        this.selectedDataManagConsultant[k].docRequired =[]
        for (let i = 0; i < files.length; i++) {
          if(i<10){
            let file  = files[i];
            if(file.size >5242880){
              $('#fileSizeError').click()
            } else {
              if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
                this.selectedDataManagConsultant[k].docRequired.push(file)
              } else  $('#fileTypeError').click()
            }
          } else $('#maxFileLimit').click()
        }
      }
    } else if(selected == "lc"){
      let k = this.selectedLegalConsultant.indexOf(user)
      if(k > -1){
        this.selectedLegalConsultant[k].docRequired =[]
        for (let i = 0; i < files.length; i++) {
          if(i<10){
            let file  = files[i];
            if(file.size >5242880){
              $('#fileSizeError').click()
            } else {
              if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
                this.selectedLegalConsultant[k].docRequired.push(file)
              } else  $('#fileTypeError').click()
            }
          } else $('#maxFileLimit').click()
        }
      }
    } else if(selected == "da"){
      let k = this.selectedDataAdmin.indexOf(user)
      if(k > -1){
        this.selectedDataAdmin[k].docRequired =[]
        for (let i = 0; i < files.length; i++) {
          if(i<10){
            let file  = files[i];
            if(file.size >5242880){
              $('#fileSizeError').click()
            } else {
              if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
                this.selectedDataAdmin[k].docRequired.push(file)
              } else  $('#fileTypeError').click()
            }
          } else $('#maxFileLimit').click()
        }
      }
    } else if(selected == "dme"){
      let k = this.selectedDigitalMarketingExpert.indexOf(user)
      if(k > -1){
        this.selectedDigitalMarketingExpert[k].docRequired =[]
        for (let i = 0; i < files.length; i++) {
          if(i<10){
            let file  = files[i];
            if(file.size >5242880){
              $('#fileSizeError').click()
            } else {
              if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
                this.selectedDigitalMarketingExpert[k].docRequired.push(file)
              } else  $('#fileTypeError').click()
            }
          } else $('#maxFileLimit').click()
        }
      }
    } 
  }
  validateProjectFile(files){
   this.projectGallery = []
    for (let i = 0; i < files.length; i++) {
      if(i<10){
        let file  = files[i];
        if(file.size >5242880){
          $('#fileSizeError').click()
        } else {
          if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
            this.projectGallery.push(file)
          } else  $('#fileTypeError').click()
        }
      } else $('#maxFileLimit').click()
    }
    return true;
  }
  removeFile(file, user, selected){
    if(user){
      if(selected == "bc"){
        let i = this.selectedBrokingConsultant.indexOf(user)
        if(i > -1){
          let j = this.selectedBrokingConsultant[i].docRequired.indexOf(file)
          if(j> -1){
            this.selectedBrokingConsultant[i].docRequired.splice(j,1)
          }
        }
      } else if(selected == "dmc"){
        let i = this.selectedDataManagConsultant.indexOf(user)
        if(i > -1){
          let j = this.selectedDataManagConsultant[i].docRequired.indexOf(file)
          if(j> -1){
            this.selectedDataManagConsultant[i].docRequired.splice(j,1)
          }
        }
      } else if(selected == "lc"){
        let i = this.selectedLegalConsultant.indexOf(user)
        if(i > -1){
          let j = this.selectedLegalConsultant[i].docRequired.indexOf(file)
          if(j> -1){
            this.selectedLegalConsultant[i].docRequired.splice(j,1)
          }
        }
      } else if(selected == "da"){
        let i = this.selectedDataAdmin.indexOf(user)
        if(i > -1){
          let j = this.selectedDataAdmin[i].docRequired.indexOf(file)
          if(j> -1){
            this.selectedDataAdmin[i].docRequired.splice(j,1)
          }
        }
      } else if(selected == "dme"){
        let i = this.selectedDigitalMarketingExpert.indexOf(user)
        if(i > -1){
          let j = this.selectedDigitalMarketingExpert[i].docRequired.indexOf(file)
          if(j> -1){
            this.selectedDigitalMarketingExpert[i].docRequired.splice(j,1)
          }
        }
      }
     
    } else {
      let i = this.projectGallery.indexOf(file)
      if(i > -1){
        this.projectGallery.splice(i,1)
      }
    }
  }
  fileUploadDoc(e,user, selected){
    if(e.target.files.length){
      this.validateDocument(e.target.files,user, selected)
      if(selected == "bc"){
        let i = this.selectedBrokingConsultant.indexOf(user)
        if(i > -1){
          if(this.selectedBrokingConsultant[i].docRequired.length){
            this.selectedBrokingConsultant[i].docRequired.forEach((file,j) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.selectedBrokingConsultant[i].docRequired[j]["url"]=e.target.result
              }
              reader.readAsDataURL(file);
            });        
          }
        }
      } else if(selected == "dmc"){
        let i = this.selectedDataManagConsultant.indexOf(user)
        if(i > -1){
          if(this.selectedDataManagConsultant[i].docRequired.length){
            this.selectedDataManagConsultant[i].docRequired.forEach((file,j) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.selectedDataManagConsultant[i].docRequired[j]["url"]=e.target.result
              }
              reader.readAsDataURL(file);
            });        
          }
        }
      }else if(selected == "lc"){
        let i = this.selectedLegalConsultant.indexOf(user)
        if(i > -1){
          if(this.selectedLegalConsultant[i].docRequired.length){
            this.selectedLegalConsultant[i].docRequired.forEach((file,j) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.selectedLegalConsultant[i].docRequired[j]["url"]=e.target.result
              }
              reader.readAsDataURL(file);
            });        
          }
        }
      }else if(selected == "da"){
        let i = this.selectedDataAdmin.indexOf(user)
        if(i > -1){
          if(this.selectedDataAdmin[i].docRequired.length){
            this.selectedDataAdmin[i].docRequired.forEach((file,j) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.selectedDataAdmin[i].docRequired[j]["url"]=e.target.result
              }
              reader.readAsDataURL(file);
            });        
          }
        }
      }else if(selected == "dme"){
        let i = this.selectedDigitalMarketingExpert.indexOf(user)
        if(i > -1){
          if(this.selectedDigitalMarketingExpert[i].docRequired.length){
            this.selectedDigitalMarketingExpert[i].docRequired.forEach((file,j) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.selectedDigitalMarketingExpert[i].docRequired[j]["url"]=e.target.result
              }
              reader.readAsDataURL(file);
            });        
          }
        }
      }
    }
  }
  fileUpload(e){
    if(e.target.files.length){
      this.isFileUploaded = false;
      this.validateProjectFile(e.target.files)
        if(this.projectGallery.length){
          this.projectGallery.forEach((file,i) => {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.projectGallery[i]["url"]=e.target.result
            }
            reader.readAsDataURL(file);
          });        
        }
    }
    
  }
  uploadDocFiles(user,type){
      if(!this.userFileUploaded()){
        let body = new FormData()
        if(type == 'bc' ){
          let i = this.selectedBrokingConsultant.indexOf(user)
          if(i>-1 && this.selectedBrokingConsultant[i].docRequired.length){
            this.selectedBrokingConsultant[i].docRequired.forEach(file => {
              body.append('file',file)
            });
            this.uploadFileToS3(body,(err, urlArr)=>{
              urlArr.forEach((url,j) => {
                this.selectedBrokingConsultant[i].docRequired[j]["fileUrl"]= url;
              });
            })
          }
        } else if(type == 'dmc'){
          let i = this.selectedDataManagConsultant.indexOf(user)
          if(i>-1 && this.selectedDataManagConsultant[i].docRequired){
            this.selectedDataManagConsultant[i].docRequired.forEach(file => {
              body.append('file',file)
            });
            this.uploadFileToS3(body,(err, urlArr)=>{
              urlArr.forEach((url,j) => {
                this.selectedDataManagConsultant[i].docRequired[j]["fileUrl"]= url;
              });
            })
          }
        } else if(type == 'lc'){
          let i = this.selectedLegalConsultant.indexOf(user)
          if(i>-1 && this.selectedLegalConsultant[i].docRequired){
            this.selectedLegalConsultant[i].docRequired.forEach(file => {
              body.append('file',file)
            });
            this.uploadFileToS3(body,(err, urlArr)=>{
              urlArr.forEach((url,j) => {
                this.selectedLegalConsultant[i].docRequired[j]["fileUrl"]= url;
              });
            })
          }
        } else if(type == 'da'){
          let i = this.selectedDataAdmin.indexOf(user)
          if(i>-1 && this.selectedDataAdmin[i].docRequired){
            this.selectedDataAdmin[i].docRequired.forEach(file => {
              body.append('file',file)
            });
            this.uploadFileToS3(body,(err, urlArr)=>{
              urlArr.forEach((url,j) => {
                this.selectedDataAdmin[i].docRequired[j]["fileUrl"]= url;
              });
            })
          }
        } else if(type == 'dme'){
          let i = this.selectedDigitalMarketingExpert.indexOf(user)
          if(i>-1 && this.selectedDigitalMarketingExpert[i]){
            this.selectedDigitalMarketingExpert[i].docRequired.forEach(file => {
              body.append('file',file)
            });
            this.uploadFileToS3(body,(err, urlArr)=>{
              urlArr.forEach((url,j) => {
                this.selectedDigitalMarketingExpert[i].docRequired[j]["fileUrl"]= url;
              });
            })
          }
        }
      } else {
        $('#fileAlreadyUp').click()
      }
  }
  isfileUploaded(){
    let flag  = true;
    this.projectGallery.forEach(file => {
      if(!file.fileUrl) flag = false;
    });
    return flag;
  }
  uploadFileToS3(body: FormData, arrCB) {
    this.isLoading = true;
    this.apiServices.uploadprojectGallery(body)
    .then(res=>{
      this.isLoading = false;
      if(res.data.status && res.data.statusCode == 200){
        $('#fileUpSuss').click()
        arrCB(null,res.data.extraData.FileUrl)
      } else {
        arrCB(null,res.data.extraData.FileUrl)
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      console.log('errr',err);
      this.appServices.handleNetworkException(err)
    })
  }
  userFileUploaded() {
    let flag = true;
    this.selectedBrokingConsultant.forEach(_user => {
      _user.docRequired.forEach(doc => {
        if(!doc.fileUrl) flag = false;
      });
    });
    this.selectedDataManagConsultant.forEach(_user => {
      _user.docRequired.forEach(doc => {
        if(!doc.fileUrl) flag = false;
      });
    });
    this.selectedLegalConsultant.forEach(_user => {
      _user.docRequired.forEach(doc => {
        if(!doc.fileUrl) flag = false;
      });
    });
    this.selectedDataAdmin.forEach(_user => {
      _user.docRequired.forEach(doc => {
        if(!doc.fileUrl) flag = false;
      });
    });
    this.selectedDigitalMarketingExpert.forEach(_user => {
      _user.docRequired.forEach(doc => {
        if(!doc.fileUrl) flag = false;
      });
    });
    return flag;
  }
  uploadFiles(){
    if(this.projectGallery.length){
      if(!this.isFileUploaded){
        let body = new FormData()
        this.projectGallery.forEach( file=> {
          body.append('file',file)
        });
        this.isLoading = true;
        
        this.apiServices.uploadprojectGallery(body)
        .then(res=>{
          this.isLoading = false;
          
          console.log(res.data);
          if(res.data.status && res.data.statusCode == 200){
            $('#fileUpSuss').click()
            this.isFileUploaded = true;
            let fileUrl = res.data.extraData.FileUrl;
            this.projectGallery.forEach( (file,i)=> {
              this.projectGallery[i]["fileUrl"] = fileUrl[i]
            });
          } else {
            this.appServices.handleOtheException(res.data.exception)
          }
        }).catch(err=>{
          console.log('errr',err);
          this.appServices.handleNetworkException(err)
        })
      } else {
        $('#fileAlreadyUp').click()
      }
    } else {
      $('#chooseFile').click()
    }
  }
  facilityCilck(){
    if(this.allSelectedFacility.some(x=>x.enum == 22))
      this.otherFacilitySelected = true;
    else this.otherFacilitySelected = false;   
  }
  removeInvt(plotting){
    let i = this.plottingVariationRequestList.indexOf(plotting)
    if(i>-1)this.plottingVariationRequestList.splice(i,1);
  }
  public onStepChange(event): void{
    if(event.selectedIndex == 3){
      if(!this.isDeptTeamFound)
        this.getMyDeptTeam()
    }
    if(event.selectedIndex == 1){
      if(!this.step2Completed){
        this.resetFacing()
      }
    }
  }
  teamSelectChange(e, type){
    if(type == 'bc'){
      this.sBrokingConsultant.forEach(u=>this.selectedBrokingConsultant.push(u))
    } else if(type == 'lc'){
      this.sBrokingConsultant.forEach(u=>this.selectedBrokingConsultant.push(u))
    } else if(type == 'dme'){
      this.sBrokingConsultant.forEach(u=>this.selectedBrokingConsultant.push(u))
    } 
  }

  async removeTeam(user,type){
    let valid = false;
     if(type == 'bc'){
      let i = this.selectedBrokingConsultant.indexOf(user)
      if(i> -1 ){
        if(this.sBrokingConsultant.length == 1){
          $('#minOneUser').click()
        } else {
          let res = await this.apiServices.deleteTeamFromProject(this.projectId,user.id,user.projectTaskId)
          console.log(res);
          if(res){
            this.selectedBrokingConsultant.splice(i,1)
            valid = true;
          }
        }
        
        
      }
    } else if(type == 'lc'){
      let i = this.selectedLegalConsultant.indexOf(user)
      if(i> -1 ){
        this.selectedLegalConsultant.splice(i,1)
        valid = true;
      }
    } else if(type == 'dme'){
      let i = this.selectedDigitalMarketingExpert.indexOf(user)
      if(i> -1 ){
        this.selectedDigitalMarketingExpert.splice(i,1)
        valid = true;
      }
    } 
    if(valid) this.formatAndPushInMyTeam()

  }

  getTeamTask(user){
    return {
      "projectTeam":{
				"id": user.id ,
				"doj":user.doj,
        "memberCode":user.memberCode,
        "occupation":user._occupation,
        "roles":user.roles.map(x=>parseInt(x)),
			},
			"projectTask":	{
				"projectTaskId":user.projectTaskId,
				"incentiveType":parseInt(user.incentiveType),
				"roles":user.roles.map(x=>parseInt(x)),
				"incentiveValue":parseInt(user.incentiveValue),
				"startDate":user.startDate,
				"endDate":user.endDate,
				"docRequired":[]
      },
      "departmentName":user.departmentName
    }
  }
  getbrokingConsTeamTask(){
    let brokingConsultant=[]
     this.selectedBrokingConsultant.forEach(u=>{
      brokingConsultant.push(this.getTeamTask(u))
     }); return brokingConsultant;
  }
  getlegalConsTeamTask(){
    let legalConsProjectTask=[]
     this.selectedLegalConsultant.forEach(u=>{
      legalConsProjectTask.push(this.getTeamTask(u))
   }); return legalConsProjectTask;
  }
  getdigitalMarketConsTeamTask(){
    let digitalConsProjectTask=[]
     this.selectedDigitalMarketingExpert.forEach(u=>{
      digitalConsProjectTask.push(this.getTeamTask(u))
    });return digitalConsProjectTask;
  }
  step1Accrstep= 0;
  setStep1Accr(index: number) {
    this.step = index;
  }
  step2Accrstep= 0;
  setStep2Accr(index: number) {
    this.step = index;
  }
  step = 0;
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  /**
   * top, middle, bottom
   * @param location 
   */
  animateStepAt(location){
    var theHeight = $('body,html').height();
    if(location == "top"){
      $('body,html').animate({
        scrollTop: 0  
      },1000);
    } else if(location == "middle"){
        $('body,html').animate({
          scrollTop: theHeight/4
       },1000);
    } else {
      $('body,html').animate({
        scrollTop: theHeight/2,
      },1000);
    }
  }
}

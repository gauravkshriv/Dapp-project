import { Component, OnInit } from '@angular/core';
import { AppService, ApiService, UtlService } from 'src/app/_services';
import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent implements OnInit {
  facingSide:Array<any>;
  counts:any;
  isLoading: boolean = false;
  inventoryId: any;
  projectId: any;
  incentive:any;
  projectTeam:any;
  target:any;
  imgUrl : any;
  plottingVariations : Array<any> = [];
  projectInfo: any;
  inventoryInfo:any;
  selectedIndex= 0;
  constructor(
    private utlServices : UtlService,
    private appServices : AppService,
    private apiServices : ApiService
  ) { 
    this.checkRouter()
  }

  ngOnInit() {
    this.facingSide = this.utlServices.facingSide;
    this.getProject()
  }
  checkRouter(){
    if(this.appServices.getProjectId()) this.projectId = this.appServices.getProjectId();
    else {
      let url = this.appServices.getRouterURL();
      let urlArray = url.split('/');
      this.projectId =urlArray[urlArray.length -1]
      this.appServices.setProjectId(this.projectId) 
    }
  }
  getProject() {
    let pid  = this.appServices.getProjectId()
    if(pid){
      this.isLoading = true;
      this.apiServices.viewProjectByProjectId(pid)
      .then(res=>{
        this.isLoading = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          this.getInventory(res.data.extraData.ProjectInfo)
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err=>{
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
    }
  }
  getInventory(project){
    this.setProject(project)
    if(project.inventoryMapper){
      this.isLoading = true;
      this.apiServices.getBulkInventory(project.inventoryMapper.uniqueId)
      .then(res=>{
      this.isLoading = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          let invt = res.data.extraData.AllInv;
          this.inventoryId = invt.inventoryId;
          this.formateInvt(invt)
          this.formatePlotting(invt.inventory.plottingVariations);
          console.log(invt);
        }
      }).catch(err=>{
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
    }
  }
  viewTab(i){
    $('#projectInfo').modal('show')
    this.selectedIndex = i;
  }
  setProject(project: any) {
    project.startDate = new Date(project.startDate).toLocaleString()
    project.endDate = new Date(project.endDate).toLocaleString() 
    project.created = new Date(project.created).toLocaleString() 
    project.updated = new Date(project.updated).toLocaleString()
    if(project.projectTeamTask){
      this.addTeamAndTask(project.projectTeamTask)
    }
    this.projectInfo = project;
    if(this.projectInfo.incentive && this.projectInfo.target){
      this.incentive = this.projectInfo.incentive
      this.incentive.incentiveType = this.getIncentiveType(this.incentive.incentiveType)
      this.target = this.projectInfo.target
      this.target.enddate = new Date(this.target.enddate).toLocaleString()
    }
  }
  addTeamAndTask(projectTeamTask) {
    let teamCount = 0;
    let users = '';

    projectTeamTask.brokingConsultant.forEach((user,i) => { 
      console.log('user,user',user);
      
      if(i === 0) users += user.fullname;
      else users += ', '+user.fullname;
      teamCount++;
      projectTeamTask.brokingConsultant[i]["occ"] = this.utlServices.rmeOcc.find(v=>v.value == user.occupation).name
      projectTeamTask.brokingConsultant[i]["incentiveType"] = this.getIncentiveType(user.projectTask.incentiveType)
      projectTeamTask.brokingConsultant[i]["incentiveValue"] = user.projectTask.incentiveValue
      projectTeamTask.brokingConsultant[i]["docRequired"] = user.projectTask.docRequired
      projectTeamTask.brokingConsultant[i]["doj"] = new Date(user.doj).toLocaleString()
      projectTeamTask.brokingConsultant[i]["roles"] = this.getUserRoles(user.roles)
    });
    projectTeamTask.digitalMarketing.forEach((user,i) => {
      teamCount++;
      users += ', '+user.fullname
      projectTeamTask.digitalMarketing[i]["occ"] = this.utlServices.rmeOcc.find(v=>v.value == user.occupation).name
      projectTeamTask.digitalMarketing[i]["incentiveType"] = this.getIncentiveType(user.projectTask.incentiveType)
      projectTeamTask.digitalMarketing[i]["incentiveValue"] = user.projectTask.incentiveValue
      projectTeamTask.digitalMarketing[i]["docRequired"] = user.projectTask.docRequired
      projectTeamTask.digitalMarketing[i]["doj"] = new Date(user.doj).toLocaleString()
      projectTeamTask.digitalMarketing[i]["roles"] = this.getUserRoles(user.roles)
    });
    projectTeamTask.legalConsultant.forEach((user,i) => {
      teamCount++;
      users += ', '+user.fullname
      projectTeamTask.legalConsultant[i]["occ"] = this.utlServices.rmeOcc.find(v=>v.value == user.occupation).name
      projectTeamTask.legalConsultant[i]["incentiveType"] = this.getIncentiveType(user.projectTask.incentiveType)
      projectTeamTask.legalConsultant[i]["incentiveValue"] = user.projectTask.incentiveValue
      projectTeamTask.legalConsultant[i]["docRequired"] = user.projectTask.docRequired
      projectTeamTask.legalConsultant[i]["doj"] = new Date(user.doj).toLocaleString()
      projectTeamTask.legalConsultant[i]["roles"] = this.getUserRoles(user.roles)
    });

    projectTeamTask.teamCount = teamCount;
    projectTeamTask.users = users;
    this.projectTeam = projectTeamTask;
  }
  getUserRoles(roles: any): any {
    return roles.map(x=>this.utlServices.userRoles.find(v=>v.value == x).name).join(', ')
  }

  getIncentiveType(incentiveType: any): any {
    return incentiveType == "PERCENTAGE" ? "Percentage": "Fixed Price";
  }
  formatePlotting(plottingVariations: any) {
    plottingVariations.forEach((ploting,i) => {
      plottingVariations[i]['alvblCount'] = 0;
      plottingVariations[i]['bookedCount'] = 0;
      plottingVariations[i]['delvCount'] = 0;
      plottingVariations[i]['canceledCount'] = 0;
      ploting.inventoryMapper.forEach((_invt,j) => {
        if(_invt.availabilityStatus == "AVAILABLE")
          plottingVariations[i]['alvblCount'] = j+1;
        if(_invt.availabilityStatus == "BOOKED")
          plottingVariations[i]['bookedCount'] = j+1;
        if(_invt.availabilityStatus == "DELIVERED")
          plottingVariations[i]['delvCount'] = j+1;
        if(_invt.availabilityStatus == "CANCELLED")
          plottingVariations[i]['canceledCount'] = j+1;
      });
    });
    this.plottingVariations = plottingVariations;
  }
  formateInvt(invt: any) {
    this.appServices.setInventoryId(invt.inventoryId)
    invt["_nearByLocation"] = [];
    invt.propertyType = invt.propertyType == "PREBUILT_ASSET" ? "Prebuild Assets":"Raw Assets";
    invt.layoutDocument.projectSizeUnit = this.utlServices.areaUnit.
    find(x=>x.value == invt.layoutDocument.projectSizeUnit).name;
    let otherAppr = this.utlServices.approvalType.find(v=>v.value == invt.layoutDocument.approvalType)
    if(otherAppr) invt.layoutDocument.approvalType = otherAppr.name;
    invt.facilites = this.getFacilityString(invt.facilites)
    let keys = Object.keys(invt.nearByLocation)
    keys.forEach(key => {
      let name = this.utlServices.nearByLocation.find(x=>x.value == key).name;
      invt["_nearByLocation"].push(name +' '+invt.nearByLocation[key] )
    })
    this.inventoryInfo  = invt;   
    this.facilityMoreLess(40)
  }
  getFacilityString(facilites: Array<string>): any {
    let i = facilites.indexOf("OTHERS")
    if(i>-1) facilites.splice(i,1)
    return facilites.map(f=> this.utlServices.facility.find(x=>x.value == f).name).join(', ')
  }
  getArrar(c:number){
    return Array(c).fill(0).map((x,i)=>i)
  }
  opemLightBox(url){
    this.imgUrl = url;
    $('#lightBox').modal('show')
  }
  viewPlot(plot){
    $('#projectInfo').modal('hide')
    this.appServices.setplotVarId(plot.plottingVariationId)
    this.appServices.routTo('/dapp/project-management/my-project/'+this.appServices.getProjectId()+'/'+plot.plottingVariationId)
  }
  completeProjectStep(){
    $('#projectInfo').modal('hide')
    this.appServices.setProjectId(this.projectInfo.projectID);
    this.appServices.routTo('/dapp/project-management/add-project')
  }
  projectInfoEdit(step : number){
    console.log(step);
    this.appServices.goToStep = step;
    this.appServices.setProjectId(this.projectId)
    this.appServices.routTo('/dapp/project-management/edit-project')
  }
  moreLessValue = "Less";
  isMore = false;
  facilityMoreLess(n){
    let fac = this.inventoryInfo.facilites;
    if(fac.length > n){
      this.isMore = true;
      this.moreLessValue = this.moreLessValue == "More" ? "Less" : "More";
      if(this.moreLessValue == "More")
        this.inventoryInfo._facilites = (fac.length > n) ? fac.substr(0, n-1) + '...' : fac;
      else this.inventoryInfo._facilites = fac;
    } else {
      this.isMore = false;
      this.inventoryInfo._facilites = fac;
    }
    
  }
}

import { Injectable } from '@angular/core';
import Axios from 'axios';
import { Url } from '../_constants/urls';
/**
 * BACK END URLs
 */
const BASE_URL= Url.BASE;
const PIN_URL =  Url.PIN
const LAND_URL = Url.NEED 
const AUTH_URL = Url.AUTH_TEST 
const NEED_URL = Url.NEED
/**
 * FRONT END URLs
 */
const ACCOUNT_URL = Url.ACC_TEST
const COMMUNITY_URL = Url.COMMUNITY
const ACADEMY_URL = Url.ACADEMY
const RETAIL_URL = Url.RETAIL_TEST
const RMEHUB_URL = Url.REMHUB

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    _user:any;
  constructor() {
    let data = localStorage.getItem("userInfo")
    if(data !== null) this._user = JSON.parse(data);
    else {
    //  appService.logout()
    }
    Axios.defaults.baseURL = BASE_URL;
  }
  get AxiosAPI(){
    let data = localStorage.getItem("userInfo")
    if( !this._user && data !== "null"){
       this._user = JSON.parse(data)
    }
    return Axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token '+this._user.jwttoken
      }
    })
  }

  public get ACCOUNT_URL() : string { return ACCOUNT_URL;}
  public get COMMUNITY_URL() : string { return COMMUNITY_URL;}
  public get ACADEMY_URL() : string { return ACADEMY_URL;}
  public get RETAIL_URL() : string { return RETAIL_URL;}
  public get RMEHUB_URL() : string { return RMEHUB_URL;}

  logout(body){
    return this.AxiosAPI.post(AUTH_URL+'/api/logout',body);
  }
  
  getUser(){
    return this.AxiosAPI.post(AUTH_URL+'/api/getuser',{uuid:this._user.uuid,sessionToken:this._user.sessiontoken})
  }

  getSessionStatus(body){
    return this.AxiosAPI.post(AUTH_URL+'/api/user/getSession',body)
  }

  allKYTStatus(body){
    return this.AxiosAPI.post(AUTH_URL+'/api/kyt/status',body)
  }

  getMyReferral(){
    return this.AxiosAPI.get(AUTH_URL+'/api/getreferralcode/user/list?uuid='+this._user.uuid+'&sessionToken='+this._user.sessiontoken)
  }
  searchUser(userName){
    return this.AxiosAPI.get(AUTH_URL+'/api/userlist?userName='+userName+'&uuid='+this._user.uuid)
  }
  pinCodeInfo(pin){
    return Axios.get(PIN_URL+pin)
  }
  getUserByUuidOrEmailOrUserName(uuid,email,userName){
    let body = { email:email,  username:userName, uuid:uuid }
    if(email) return Axios.post(AUTH_URL+'/getuserdetails',body)
    else if(uuid) return Axios.post(AUTH_URL+'/getuserdetails',body)
    else if(userName) return Axios.post(AUTH_URL+'/getuserdetails',body)
  }

  getMultipleUserByUuidOrEmailOrUserName(uuidList, emailList, userNameList){
    let body = {  uuid:uuidList, email:emailList, username:userNameList }
    if(emailList && emailList.length) return Axios.post(AUTH_URL+'/getvalid/invalid/user',body)
    else if(uuidList && uuidList.length) return Axios.post(AUTH_URL+'/getvalid/invalid/user',body)
    else if(userNameList && userNameList.length) return Axios.post(AUTH_URL+'/getvalid/invalid/user',body)
  }

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////        LAND UPLOAD        //////////////////////
  ////////////////////////////////////////////////////////////////////////////
  bulkInventoryUpload(body){
    return this.AxiosAPI.post(LAND_URL+'/api/product/raw/bulk',body)
  }

  getBulkInventory(uniqueId){
    return this.AxiosAPI.get(LAND_URL+'/api/product/raw/view/inv/uniqueId?uniqueId='+uniqueId+'&uuid='+this._user.uuid)
  }

  updateInventory(body){
    return this.AxiosAPI.put(LAND_URL+'/api/product/raw/edit/inventory',body)
  }

  updateInventoryStatus(body){
    return this.AxiosAPI.put(LAND_URL+'/api/product/raw/inventory/status',body)
  }

  viewPlotByVariationId(plotId){
    return this.AxiosAPI.get(LAND_URL+'/api/product/raw/view/plot?uuid='+this._user.uuid+'&plotVariationId='+plotId  )
  }

  allUsersByPageSize(pageNo,dataSize){
    return Axios.get(AUTH_URL+'/alluser?pageNo='+pageNo+'&dataSize='+dataSize)
  }

  showNeedAnalysis(refCode,page,size){
    return this.AxiosAPI.post(NEED_URL+'/api/user/ref-code/need-analysis?uuid='+this._user.uuid+'&refCode='+refCode+'&page='+page+'&size='+size)
  }
  
  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////     DATA   MANAGEMENT     //////////////////////
  ////////////////////////////////////////////////////////////////////////////

  getAllDataBank(){ return  this.AxiosAPI.get('/api/dm/view/all/dataBank?userUuid='+this._user.uuid); }
  viewSoldDataByReqId(reqId,pageNo,dataSize){
     return  this.AxiosAPI.get('/api/dm/view/solddata?dmUuid='+this._user.uuid+'&requestId='+reqId+'&pageNo='+pageNo+'&dataSize='+dataSize);
   }
   viewAllSoldData(pageNo,dataSize){
     return this.AxiosAPI.get('/api/dm/view/all/solddata?dmUuid='+this._user.uuid+'&pageNo='+pageNo+'&dataSize='+dataSize);
   }
  createDataBank(bdName){
    let body = {
      dataBankName:bdName,
      ownerUuid:this._user.uuid
    }
    return  this.AxiosAPI.post('/api/dm/databank',body);
  }
  
  getAllFileByUUID(){
    return this.AxiosAPI.get('/api/dm/view/fileInfo?uuid='+this._user.uuid
    +'&pageNo=0&dataSize=10');
  }
  getAllFileByDBNameFolder(dbName,folder){
    return this.AxiosAPI.get('/api/dm/folder/data/info?uuid='+this._user.uuid+'&bankName='+dbName+'&foldeName='+folder);
  }
  getFileByDataTag(dataTag){
    return this.AxiosAPI.get('/api/dm/view/dataTag/info?dataTag='+dataTag
    +'&uuid='+this._user.uuid);
  }
  getUserByOccAndPagging(occ){
    return this.AxiosAPI.get(AUTH_URL+'/usersInfo?firstName=&lastName=&email=&occ='+occ+'&page=&size=');
  }
  getUserByFullName(firstName,lastName){
    return this.AxiosAPI.get(AUTH_URL+'/usersInfo?firstName='+firstName+'&lastName='+lastName+'&email=&occ=&page=&size=');
  }
  
  getFileInfoByDataTag(dataTag,page,size){
    return this.AxiosAPI.get('/api/dm/fileops/show/filedata?datatag='+dataTag+'&uuid='+this._user.uuid+'&page='+page+'&size='+size);
  } 

  getAllDataRequest(page,size){
    return this.AxiosAPI.get('/api/dm/view/alldatarequest?dmUuid='+this._user.uuid+'&pageNo='+page+'&dataSize='+size);
  }

  viewDataRequestByRequestId(reqId){
    return this.AxiosAPI.get('/api/dm/view/datarequest?userUuid='+this._user.uuid+'&requestId='+reqId);
  } 

  uploadFileandDataParsing(databankId, body){
    return this.AxiosAPI.post('/api/dm/uploadfile/'+databankId,body)
  }

  dataRequest(body){
    return this.AxiosAPI.post('/api/dm/dataRequest',body)
  }


  updateDataBankName(newDBName,oldDBName){
    return this.AxiosAPI.put('/api/dm/dataBank/updateName?uuid='+this._user.uuid
    +'&oldDataBankName='+oldDBName+'&newDataBankName='+newDBName);
  }
  updateDataBankFileName(dataTag,fileName){
    let body= {
      "dataTag":dataTag,
      "fileName":fileName,
      "ownerUuid":this._user.uuid
    }
    return this.AxiosAPI.put('/api/dm/fileops/updateName',body);
  }
  updateComment(reqId,msg){
    let body= {
      "uuid":this._user.uuid,
      "requestId":reqId,
      "comment":[ { "msg":msg }]
    }
    return this.AxiosAPI.put('/api/dm/request/comment',body);
  }
  //    /selldata
  sellData(body){
    return this.AxiosAPI.post('/api/dm/selldata',body)
  }
  approveRejectDataRequest(body){
    return this.AxiosAPI.put('/api/dm/datarequest/change/status',body);
  }
  deleteDataBankName(dataBankName){
    return this.AxiosAPI.delete('/api/dm/dataBank/delete?uuid='+this._user.uuid
    +'&dataBankName='+dataBankName);
  }
  deleteDataFile(dataTag){
    return this.AxiosAPI.delete('/api/dm/fileops/delete?uuid='+this._user.uuid+'&datatag='+dataTag);
  }


  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////////        BROKING HOUSE      //////////////////////
  ////////////////////////////////////////////////////////////////////////////
  viewAllTeamMember() {
    return this.AxiosAPI.get('/api/bh/view/brokingHouse/or/brokingConsultant?uuid='+this._user.uuid);
  }
  projectStepTrack(){
    return this.AxiosAPI.get('/api/bh/view/project/step?uuid='+this._user.uuid)
  }
  viewProjectByProjectId(projectId){
    return this.AxiosAPI.get('/api/bh/view/project?uuid='+this._user.uuid+'&projectId='+projectId)
  }
  viewAllProject(pageNo,dataSize){
    return this.AxiosAPI.get('/api/bh/view/all/projects?uuid='+this._user.uuid+'&pageNo='+pageNo+'&dataSize='+dataSize)
  }
  teamMemberApproveOrReject(invitationStatus,memberCode,senderUuid){
    return Axios.get('/api/member/approval?invitationStatus='+invitationStatus+'&memberCode='+memberCode+'&senderUuid='+senderUuid)
  }
  myInvitation(pageNo, dataSize){
    return this.AxiosAPI.get('/api/invitation?uuid='+this._user.uuid+'&pageNo='+pageNo+'&dataSize='+dataSize)
  }
  changeInvitation(invStatus,memberCode){
    return this.AxiosAPI.put('/api/change/invitationStatus?uuid='+this._user.uuid+'&memberCode='+memberCode+'&invitationStatus='+invStatus)
  }
  createTeam(team){
    let body = {
      uuid :this._user.uuid,
      teamMember:team
    }
    return this.AxiosAPI.post('/api/bh/add/brokingHouse/or/brokingConsultant',body)
  }
  addProjectStep1(body){
    return this.AxiosAPI.post('/api/bh/add/project', body)
  }
  addProjectStep2(body){
    return this.AxiosAPI.post('/api/bh/add/inventory', body)
  }
  addProjectStep3(body){
    return this.AxiosAPI.post('/api/bh/add/incentive/target', body)
  }
  addProjectStep4(body){
    return this.AxiosAPI.post('/api/bh/add/project/team', body)
  }

  editTeamMember(memberInfo){
    let body = {
      uuid:this._user.uuid,
	    teamMeber:memberInfo
    }
    return this.AxiosAPI.put('/api/bh/edit/teamMember',body)
  }
  updateProject(body){
    return this.AxiosAPI.put('/api/bh/edit/project',body)
  }
  deleteProject(projectId){
    return this.AxiosAPI.put('/api/hb/delete/project?uuid='+this._user.uuid+'&projectId='+projectId)
  }
  deleteTeamMember(memberCode){
    return this.AxiosAPI.delete('/api/bh/delete/teamMember?uuid='+this._user.uuid+'&memberCode='+memberCode)
  }
  deleteTeamFromProject(projectId,teamId,taskid){
    return this.AxiosAPI.delete('/api/projectTeam/remove/user?uuid='+this._user.uuid+'&projectTaskId='+taskid+
    '&projectTeamId='+teamId+'&projectId='+projectId)
  }
  uploadprojectGallery(body){
    return Axios.post('/upload/inv/layout',body)
  }
  addDepartment(deptName:string){
    return this.AxiosAPI.post(`/api/bh/team/department?uuid=${this._user.uuid}&departmentName=${deptName}`)
  }
  getDepartmentList(){
    return this.AxiosAPI.get(`/api/bh/view/team/department?uuid=${this._user.uuid}`)
  }
  allocateDataTONaRaSc(body){
    return this.AxiosAPI.post('/api/bh/allocate/data',body)
  }
  renameDept(oldDeptName:string, newDeptName:string){
    return this.AxiosAPI.put(`/api/bh/rename/team/department?uuid=${this._user.uuid}&oldDepartmentName=${oldDeptName}&newDepartmentName=${newDeptName}`)
  }
  getTeamByDept(deptName,projectId,pageNo,dataSize){
    return this.AxiosAPI.get(`/api/bh/view/team/info?uuid=${this._user.uuid}&departmentName=${deptName}&projectId=${projectId}&pageNo=${pageNo}&dataSize=${dataSize}`)
  }
  allocateData(body){
    return this.AxiosAPI.post('/api/bh/allocate/data',body);
  }
  getAllocatedData(pageNo,dataSize){
    return this.AxiosAPI.get(`/api/member/view/allocate/data?uuid=${this._user.uuid}&pageNo=${pageNo}&dataSize=${dataSize}`)
  }
}  




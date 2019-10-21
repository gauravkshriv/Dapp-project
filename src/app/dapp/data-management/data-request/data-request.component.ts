import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LocalDataSource } from 'ng2-smart-table';
import { LinkViewComponent, ChangeInvStatusComponent } from 'src/app/components/table-components';
import swal from 'sweetalert2';
import { ApiService, AppService } from 'src/app/_services';
declare var $: any;

const dataStatus ={
  REJECT:'Rejected',
  ACCEPT:'Accepted',
  PENDING:'Pending'
}
const soldStatus = {
  NOT_SELL:'Not Sold',
  SOLD:'Sold'
}
const col_sett =  {
  requestId: {
    title: 'Request ID',
    type: 'custom',
    filter: false,
    renderComponent: LinkViewComponent,
    onComponentInitFunction(instance) {
      instance.save.subscribe(row => {
          $('#def').val(JSON.stringify(row))
          $('#def').click()
      });
    }
  },
  requestPrice: {
    title: 'Request Price',
    filter: false,
  },
  sharePercent: {
    title: 'Share Percent',
    filter: false,
  },
  
  dataCount: {
    title: 'Data Count',
    filter: false,
  },
  shareType: {
    title: 'Share Type',
    filter: false,
  },
 
  dataType: {
    title: 'Data Type',
    filter: false,
  },
  dataPurpose:{
    title: 'Data Purpose',
    filter: false,
  },
  soldStatus:{
    title: 'Data Sell Status',
    filter: false,
  },
  dataReqStatus:{
    title: 'Data Request Status',
    type: 'custom',
    filter: false,
    renderComponent: ChangeInvStatusComponent,
    onComponentInitFunction(instance) {
      instance.save.subscribe(row => {
          $('#accreg').val(JSON.stringify(row))
          $('#accreg').click()
      });
    }
  },
  createdAt:{
    title: 'Created',
    filter: false,
  }
}

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.scss']
})
export class DataRequestComponent implements OnInit {
  requestPrice: string ="";
  sharePercent: string ="0";
  btnDisabled :Boolean =true;
  dataCount : string ="" ;
  shareType:any;
  requestToUuid:any;
  occ:Array<any>= [];
  requestType:any;
  requestPurpose:any;
  isLoading=false;
  isDataReqTab = true;
  requsetbtnValue = "Request";
  cunsultants : any =[];
  dataReqPageNo = 0;
  dataReqPageSize = 20;
  soldDataPageNo = 0;
  soldDataPageSize = 20;
  soldDataViewPageNo = 0;
  soldDataViewPageSize = 20;
  viewSoldDataReqId:any;
  requsetInfo:any;
  soldDataInfo:any;

  isCunsultant = false;
  dataReqSettings :any;
  tableData = [];
  dataReqTableSource: LocalDataSource = new LocalDataSource();
  soldDataTableSource :  LocalDataSource = new LocalDataSource();
  soldDataViewTableSource : LocalDataSource = new LocalDataSource();
  soldDataViewSettings = {
    actions: {
      add: false,
      edit:false,
      delete:false,
    },
    columns: {
      name: {
        title: 'Name',
        filter: false,
      },
      contect: {
        title: 'Contact',
        filter: false,
      },
      email: {
        title: 'Email',
        filter: false,
      },
      city: {
        title: 'City',
        filter: false,
      },
      state: {
        title: 'State',
        filter: false,
      },
      pin: {
        title: 'PIN',
        filter: false,
      },
      rowId: {
        title: 'RowId',
        filter: false,
      },
      income: {
        title: 'Income',
        filter: false,
      },
      occupation: {
        title: 'Occupation',
        filter: false,
      },
    },
    pager:
    {
      perPage: 10
    }
  }
  soldDataSettings =  {
    actions: {
      add: false,
      edit:false,
      delete:false,
    },
    columns: {
      requestId: {
        title: 'Request ID',
        type: 'custom',
        filter: false,
        renderComponent: LinkViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
              $('#def').val(JSON.stringify(row))
              $('#def').click()
          });
        }
      },
      createdAt: {
        title: 'Created',
        filter: false,
      },
      dataCount: {
        title: 'Data Count',
        filter: false,
      },
    },
    pager:{
      perPage: 10
    }
  };
  memberData: any;
  constructor(
    private apiServices : ApiService,
    private appServices : AppService
  ) {  }
  ngOnInit() {
    this.tsbleSetting()
    this.getDataRequest()
    $('.mdb-select').materialSelect();
  }
  checkUser(){
    let uuid = this.apiServices._user.uuid;
    if(uuid){
     this.getCunsultants()
    } else {
      this.appServices.logout(true)
    }
  }
  getCunsultants(){
    let uuid = this.apiServices._user.uuid;
    this.isLoading=true;
    this.apiServices.getUserByOccAndPagging(21)
    .then(res=>{
      console.log(res.data);
      this.isLoading=false;
     if(res.data.status && res.data.statusCode == 200){
      this.cunsultants = res.data.extraData.userInfo;
      let _user = this.cunsultants.find(u=>u.uuid == uuid);
      if(_user){
       this.cunsultants.splice(this.cunsultants.indexOf(_user),1)        
      }
      if(!this.cunsultants.length){
       $('#noCunsultantAval').click()
       } else {
         $('#newRequestDBModal').modal('show');
       }
     } else {
       this.appServices.handleOtheException(res.data.exception)
     }
    }).catch(err=>{
      console.log('errr=>',err)
      this.appServices.handleNetworkException(err);
    })
  }
  tsbleSetting(){
    this.dataReqTableSource.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.dataReqPageChange(change.paging.page);
      }
    });
    this.soldDataTableSource.onChanged().subscribe((change) => {
      console.log('this.soldTableSource.onChanged().subscribe');
      if (change.action === 'page') {
        this.SoldDataPageChange(change.paging.page);
      } 
    });
    this.soldDataViewTableSource.onChanged().subscribe((change) => {
      console.log('this.soldTableSource.onChanged().subscribe');
      if (change.action === 'page') {
        this.SoldDataViewPageChange(change.paging.page);
      }
    });
    this.occ = JSON.parse(this.appServices.getUser()).occ || [];
   if(this.occ.length && this.occ.includes("DATA_MANAGEMENT_CONSULTANT")){
    this.dataReqSettings =  {
      actions: {
        custom: [
          { name: 'SELL', title: '<i class="fa fa-share-square" data-toggle="tooltip" title="Sell"></i>',id:'SELL' },
        ],
        add: false,
        edit:false,
        delete:false,
        position: 'right',
      },
      columns:col_sett
    };
   } else {      
    this.dataReqSettings =  {
        actions: {
          add: false,
          edit:false,
          delete:false,
          position: 'right',
        },
        columns:col_sett
      };
    }
  }
  SoldDataViewPageChange(pageIndex){
    const loadedRecordCount = this.soldDataViewTableSource.count();
    const lastRequestedRecordIndex = pageIndex * (this.soldDataViewPageSize/2);
    if (loadedRecordCount <= lastRequestedRecordIndex){
      this.soldDataViewPageNo++;
      this.soldDataView()
    }
  }
  SoldDataPageChange(pageIndex) {
    const loadedRecordCount = this.soldDataTableSource.count();
    const lastRequestedRecordIndex = pageIndex * (this.soldDataPageSize/2);
    if (loadedRecordCount <= lastRequestedRecordIndex){
      this.soldDataPageNo++;
      this.viewSoldData()
    }
  }
  dataReqPageChange(pageIndex) {
    const loadedRecordCount = this.dataReqTableSource.count();
    const lastRequestedRecordIndex = pageIndex *(this.dataReqPageSize/2);
    if (loadedRecordCount <= lastRequestedRecordIndex){
      this.dataReqPageNo++;
      this.getDataRequest()
    }
  }
  getDataRequest(){
    this.isLoading = true;
    this.apiServices.getAllDataRequest(this.dataReqPageNo,this.dataReqPageSize)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode === 200){
        let buyData = res.data.extraData.DataRequestInfo.buyData;
        let shareData = res.data.extraData.DataRequestInfo.shareData;
        this.formatDataReq([...buyData, ...shareData]);
      } else {
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      console.log('errrrrrrrrrr',err)
      this.appServices.handleNetworkException(err);
    })
  }
  formatDataReq(content){
   if(content.length){
    content.forEach((d,i) => {
      content[i]['dataPurpose'] = d.dataPurpose.dataPurpose;
      content[i]['dataType'] = d.dataType.dataType;
      content[i]['dataReqStatus'] = dataStatus[d.dataRequestStatus];
      content[i]['soldStatus'] = soldStatus[d.sellDataStatus];
      content[i]['createdAt'] = new Date(d.created).toLocaleString();
    })
    console.log(content);
    if (this.dataReqTableSource.count() > 0 && this.dataReqPageNo)
      content.forEach(d => this.dataReqTableSource.add(d));
    else
      this.dataReqTableSource.load(content);
   }
  }

  dataInf(value) {
    this.soldDataInfo = undefined;
    this.requsetInfo = JSON.parse(value);
    console.log(this.requsetInfo);
    if(this.requsetInfo.requestType){
      this.soldDataViewPageNo = 0;
      this.viewSoldDataReqId = this.requsetInfo.requestId;
      this.soldDataView()
    } else {
      this.appServices.requestId = this.requsetInfo.requestId;
      this.appServices.routTo('dapp/datamanagement/datarequest/'+this.requsetInfo.requestId)
    }
  }
  soldDataView(){
    this.isLoading = true;
    this.apiServices.viewSoldDataByReqId(this.viewSoldDataReqId,this.soldDataViewPageNo,this.soldDataViewPageSize)
    .then(res=>{
      console.log(res.data);
    this.isLoading = false;
      if(res.data.status && res.data.statusCode == 200){
        this.requsetInfo = undefined;
        this.soldDataInfo = res.data.extraData.DataRequestInfo
        this.formatSoldDataView(this.soldDataInfo.dto)
      } else {
        this.appServices.handleOtheException(res.data.exception);
      }
    }).catch(err=>{
      this.appServices.handleNetworkException(err);
    })
  }
  numKeyup(){
    this.validateForm()
  }
  numKeyPress(e){
    var k = e.which;
    let length = e.target.value.trim().length;
    if(length >5)
      e.preventDefault();
    var ok = (k >= 48 && k <= 57) ||  // 0-9
        k == 8 ||  // Backspaces
        k == 9 ||  //H Tab
        k == 0 ||  //H Tab
        k == 11 ||  //V Tab
        k == 32 ||  // Space
        k == 127;   //Delete
    if (!ok) {
        e.preventDefault();
    }
  }
  numDotKeyPress(e){
    // console.log(e.which);
    var k = e.which;
    let length = e.target.value.trim().length;
    if(length >5)
      e.preventDefault();
    var ok = (k >= 48 && k <= 57) ||  // 0-9
        k == 8 ||  // Backspaces
        k == 9 ||  //H Tab
        k == 0 ||  //H Tab
        k == 11 ||  //V Tab
        k == 32 ||  // Space
        k == 46 ||  // Dot
        k == 127;   //Delete
    if (!ok) {
        e.preventDefault();
    }
  }
  validateForm(){    
    if(this.requestPrice && this.requestPrice !== "" 
     && this.dataCount  && this.dataCount!== ""
     && this.requestToUuid && this.requestToUuid !==""
     && this.requestType && this.requestType !== ""
     && this.requestPurpose && this.requestPurpose !== ""
     )
       this.btnDisabled = false;
    else this.btnDisabled = true;
  }
  requestApi(){
    let ownerUuid = JSON.parse(this.appServices.getUser()).uuid;
    this.btnDisabled =true;
    this.requsetbtnValue ="Requesting..";
    let body = {
      "requestByUuid":ownerUuid,
      "requestType":this.requestType,
      "requestPurpose":this.requestPurpose,
      "requestToUuid":this.requestToUuid,
      "shareType":parseInt(this.shareType),
      "requestPrice":parseInt(this.requestPrice,10),
      "sharePercent": isNaN(parseInt(this.sharePercent))==true? 0 : parseInt(this.sharePercent),
      "dataCount":parseInt(this.dataCount)
    };
    console.log(body);
    this.apiServices.dataRequest(body)
    .then(res=>{
      console.log(res.data);
      this.btnDisabled =false;
      this.requsetbtnValue ="Request";
      if(res.data.status && res.data.statusCode ==200 && res.data.successCode == "API_SUCCESS"){
        this.getDataRequest()
        $('#requestInfo').click();
      } else if(res.data.exception ==  "DATA_TYPE_AND_DATA_PURPOSE_NOT_FOUND"){
        swal({
          type:'error',
          text:'Data type and Data Purpose Not Found',
          title:'Requested Data Not Found'
        })
      } else if(res.data.exception == "DATA_MANAGEMENT_CONSULTANT_NOT_EXIST"){
        swal({
          type:'error',
          text:'Requested User do not have data',
          title:'Requested Data Not Found'
        })
      }
     
      $('#newRequestDBModal').modal('hide');
    
    }).catch(err=>{
      console.log(err)
      this.appServices.handleNetworkException(err);
    })
  }

  openNewRequestModal(){
    this.requestPrice="";
    this.sharePercent="";
    this.dataCount="";
    this.getCunsultants()

  }
  onDataReqSearch(query: string = '') {
    if(query === ''){
      this.dataReqTableSource.reset()
    }
    else {
      this.dataReqTableSource.setFilter([
        {
          field: 'requestId',
          search: query,
        },
        {
          field: 'requestPrice',
          search: query,
        },
        {
          field: 'sharePercent',
          search: query,
        },
        {
          field: 'shareType',
          search: query,
        },
        {
          field: 'dataType',
          search: query,
        },
        {
          field: 'dataPurpose',
          search: query,
        },
        {
          field : 'soldStatus',
          search: query,
        },
        {
          field : 'dataReqStatus',
          search: query,
        }
      
      ], false);
    }
  }
  onDataSoldSearch(query: string = ''){
    if(query === ''){
      this.soldDataTableSource.reset()
      }
      else {
        this.soldDataTableSource.setFilter([
          {
            field: 'requestId',
            search: query,
          },
          {
            field: 'created',
            search: query,
          },
          {
            field: 'dataCount',
            search: query,
          },
        ], false);
      }
  }
  onSearchSoldDataView(query: string = '') {
    if(query === ''){
    this.soldDataViewTableSource.reset()
    }
    else {
      this.soldDataViewTableSource.setFilter([
        {
          field: 'name',
          search: query,
        },
        {
          field: 'email',
          search: query,
        },
        {
          field: 'contect',
          search: query,
        },
        {
          field: 'city',
          search: query,
        },
        {
          field: 'state',
          search: query,
        },
        {
          field: 'pin',
          search: query,
        },
        {
          field: 'rowId',
          search: query,
        },
        {
          field: 'income',
          search: query,
        },
        {
          field: 'occupation',
          search: query,
        },
      
      ], false);
    }
  }
  onCustom(e){
    console.log(e);
    if(e.action === "SELL"){
      if(e.data.dataRequestStatus == "ACCEPT"){
        if( e.data.sellDataStatus == "SOLD"){
          $('#alreadySold').click()
        } else {
          swal({
            title:'Sell Confirmation',
            text:'Are you sure want to sell?',
            type:'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Sell it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            showLoaderOnConfirm:true,
            allowOutsideClick: () => !swal.isLoading(),
            preConfirm:()=>{
              let body ={
                "soldToUuid":e.data.requestByUuid,
                "soldByUuid":e.data.requestToUuid,
                "requestId":e.data.requestId
              }
            return  this.apiServices.sellData(body)
            }
          }).then(result=>{
            console.log('swal responce',result);
            swal.close()
            if(result.value){
              let data = result.value.data;
              if(data.status && data.statusCode ==200 && data.successCode == "API_SUCCESS"){
                this.dataReqTableSource.update(e.data,{sellDataStatus:"SOLD",soldStatus:"Sold"})
                $('#sellInfo').click()
              } else if(data.exception === "DATA_SELL_ONCE_ON_ONE_REQUEST_ID"){
                swal({
                  title:'Data Already Sold',
                  text:'The Data You are trying to sold has been already sold.',
                  confirmButtonText:'Got IT'
                })
              } 
              else if(data.exception === "NOT_ENOUGH_DATA") {
                swal({
                  title:'No Enough Data',
                  text:'The Data You are trying to sold are not enough, '+data.msg[0],
                  confirmButtonText:'Got IT'
                })
              }else  {
                this.appServices.handleOtheException(result.value.data.exception)
              }
            }
          }).catch(err=>{
            console.log('errrr',err)
            this.appServices.handleNetworkException(err);
          })
        }
      } else {
        $('#notAcc').click()
      }
    } else {
      $('#alreadyAR').click()
    }
  }
  dataReqTab(){
    if(!this.isDataReqTab){
      this.refreshDataRequest()
    }
  }
  soldDataTab(){
    this.soldDataInfo = 0;
    if(this.isDataReqTab){
      this.refreshSoldData()
    }
  }
  refreshDataRequest(){
    this.dataReqPageNo = 0;
    this.isDataReqTab = true;
    this.getDataRequest()
  }
  refreshSoldData(){
    this.isDataReqTab = false;
    this.viewSoldData()
  }
  viewSoldData(){
    this.isLoading = true;
    console.log('this.pageNo,this.pageSize',this.soldDataPageNo,this.soldDataPageSize);
    this.apiServices.viewAllSoldData(this.soldDataPageNo,this.soldDataPageSize)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode === 200){
        this.formatSoldData(res.data.extraData.DataRequestInfo);
      } else {
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      console.log('errrrrrrrrrr',err)
      this.appServices.handleNetworkException(err);
    })
  }
  formatSoldDataView(content){
    console.log('formatSoldDataView content',content);
    if (this.soldDataViewTableSource.count()>0 && this.soldDataViewPageNo)
      content.forEach(d => this.soldDataViewTableSource.add(d));
    else{
      this.soldDataViewTableSource.load(content);
      $('#modalInfo').modal('show');
    }    
  }
  formatSoldData(content){
    content.forEach((d,i) => {
      content[i]['dataCount'] = d.rowId.length;
      content[i]['requestType'] = 'soldData';
      content[i]['createdAt'] = new Date(d.id.date).toLocaleString();
    });
    console.log(content);
      if (this.soldDataTableSource.count()>0 && this.soldDataPageNo)
        content.forEach(d => this.soldDataTableSource.add(d));
      else
        this.soldDataTableSource.load(content);
  }
  onUserRowSelect(e){
    this.memberData  =e.data;
  }
  accregVal(data : any){
    data = JSON.parse(data)
    $('#accreg').val('')
    console.log(data);
    let user = this.appServices.getUserInfo()
    if(user){
      if(data.rowData.requestByUuid == user.uuid){
        $('#yourselfAction').click()
      } else {
        if(data.status == "Accept"){
          swal({
            title:'Accept Confirmation',
            text:'Are you sure want to accept?',
            type:'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Accept it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            showLoaderOnConfirm:true,
            allowOutsideClick: () => !swal.isLoading(),
            preConfirm:()=>{
              let body ={
                "dmUuid":JSON.parse(this.appServices.getUser()).uuid,
                "dataRequestStatus":1,
                "dataRequestId":data.rowData.requestId
              }
              return this.apiServices.approveRejectDataRequest(body)
            }
          }).then(result=>{
            console.log('swal responce',result);
            swal.close()        
            if(result.value){
              let data = result.value.data;
              if(data.status && data.statusCode ==200 && data.successCode == "API_SUCCESS"){
                this.dataReqTableSource.update(this.memberData,{dataRequestStatus:"ACCEPT",dataReqStatus:"Accepted"})
                $('#approveSucc').click()
              } else {
                this.appServices.handleOtheException(result.value.data.exception)
              }
            }
          }).catch(err=>{
            console.log('errrr',err)
            this.appServices.handleNetworkException(err);
          })
        } else {
          swal({
            title:'Reject Confirmation',
            text:'Are you sure want to reject?',
            type:'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Reject it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true,
            showLoaderOnConfirm:true,
            allowOutsideClick: () => !swal.isLoading(),
            preConfirm:()=>{
              let body ={
                "dmUuid":JSON.parse(this.appServices.getUser()).uuid,
                "dataRequestStatus":2,
                "dataRequestId":data.rowData.requestId
              }
              return this.apiServices.approveRejectDataRequest(body)
            }
          }).then(result=>{
            console.log('swal responce',result);
            swal.close()        
            if(result.value){
              let data = result.value.data;
              if(data.status && data.statusCode ==200 && data.successCode == "API_SUCCESS"){
                this.dataReqTableSource.update(this.memberData,{dataRequestStatus:"REJECT",dataReqStatus:"Rejected"})
                $('#rejectSucc').click()
              } else {
                this.appServices.handleOtheException(result.value.data.exception)
              }
            }
          }).catch(err=>{
            console.log('errrr',err)
            this.appServices.handleNetworkException(err);
          })
        }
      }
    } else this.appServices.logout(true)  
  }

}

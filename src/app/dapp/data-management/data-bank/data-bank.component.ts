import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { ApiService, AppService } from 'src/app/_services';
declare var $: any;

@Component({
  selector: 'app-data-bank',
  templateUrl: './data-bank.component.html',
  styleUrls: ['./data-bank.component.scss']
})
export class DataBankComponent implements OnInit {
  databanks=[];
  dataBankName: String = "";
  loading = true;
  craeteOrRenameDataBankbtn ="Create";
  errorName : String = "";
  oldDBName :String = "";
  isLoading = false;
  constructor(
    private apiServices : ApiService,
    private appServices : AppService,
    // private router : Router,
    // private ref: ChangeDetectorRef
  ) { 
    // $('[data-toggle="tooltip"]').tooltip()
  }

  ngOnInit() {
    $("#createDBModal").on('hidden.bs.modal', ()=>{
      this.errorName = "";
      this.dataBankName ="";
      this.loading = true;
    });
    this.isLoading = true;
    this.getAllDataBank()
    $(".mdb-select").materialSelect();
    // $('[data-toggle="tooltip"]').tooltip();
   
  }
  async getAllDataBank() {
    // try {
      this.isLoading = true; 
        let dbRes = await this.apiServices.getAllDataBank()
        let aData = await this.apiServices.getAllocatedData(0,999999999)
        this.isLoading = false; 
        if(dbRes.data.status && dbRes.data.statusCode === 200){
          let dataRequestInfo = dbRes.data.extraData.DataRequestInfo;
          dataRequestInfo.forEach((item,i) => {
            dataRequestInfo[i].created = new Date(item.createDate).toLocaleString();
            dataRequestInfo[i].updated = new Date(item.updateDate).toLocaleString();
          });
          this.databanks=dataRequestInfo;
        } else if(dbRes.data.exception == "DATA_BANK_NOT_FOUND"){

        } else this.appServices.handleOtheException(dbRes.data.exception);
        if(aData.data.status && aData.data.statusCode === 200){
          let data = aData.data.extraData.Data;
          data.forEach((item,i) => {
            console.log(item);
            data[i].dataBank.created = new Date(item.dataBank.created).toLocaleString();
            data[i].dataBank.updated = new Date(item.dataBank.updated).toLocaleString();
          });
          data.forEach(d=>this.databanks.push(d.dataBank));
        } else if(dbRes.data.exception == "DATA_ALLOCATION_NOT_FOUND"){

        } else this.appServices.handleOtheException(aData.data.exception);
    // } catch (error) {
    //   this.isLoading = false;
    //   this.appServices.handleNetworkException(error)
    // }
   
  }

  formatAndPush(extraData){
    let databank = {
      objectId:       extraData.ObjectId,
      uuid:           extraData.Data.uuid,
      dataBankName:   extraData.Data.dataBankName,
      dataCount:      extraData.Data.dataCount,
      created:        new Date(extraData.Data.created).toLocaleString(),
      updated:        new Date(extraData.Data.updated).toLocaleString()
    }
    this.databanks.push(databank);
  }
  craeteOrRenameDataBank(){
    this.loading  =true;
    if(this.craeteOrRenameDataBankbtn === 'Create'){
    this.craeteOrRenameDataBankbtn = "Loading..";
      this.apiServices.createDataBank(this.dataBankName)
      .then(apiResult=>{
        console.log('apiResult',apiResult.data);
        this.loading  =false;
        this.craeteOrRenameDataBankbtn = "Create"
        if(apiResult.data.status && apiResult.data.statusCode === 200){
          this.formatAndPush(apiResult.data.extraData);
          $('#renameOrCreateModal').modal('hide');
          $('#createInfo').click();
        } else if(apiResult.data.exception === 'DATA_BANK_NAME_EXIST' ){
          this.errorName = 'Data Bank Name already Taken, Try another name';
        } else if(apiResult.data.exception === 'DATA_BANK_NAME_NOT_VALID_FORMATE' ){
          this.errorName = 'Data Bank Name is not valid format.';
        } else {
        this.appServices.handleOtheException(apiResult.data.exception);
        }
      }).catch(err=>{
        this.isLoading = false;
        console.log('eeerrrorrrr',err);
       this.appServices.handleNetworkException(err)
      })
    } else {
      if(this.dataBankName == this.oldDBName)
        this.errorName = 'Old Data Bank Name and New Data Bank Name Should not be same.';
      else{
        this.craeteOrRenameDataBankbtn = "Loading..";
        console.log('this.dataBankName,this.oldDBName',this.dataBankName,this.oldDBName);
        this.apiServices.updateDataBankName(this.dataBankName,this.oldDBName)
        .then(apiResult=>{
          let data = apiResult.data;
          console.log(data);
          this.loading  =false;
          this.craeteOrRenameDataBankbtn = "Rename"
          if(data.status && data.statusCode === 200 ){
            this.databanks.forEach((db,i)=>{
              if(this.oldDBName === db.dataBankName){
                this.databanks[i].dataBankName = this.dataBankName;
                // return;
              }
            })
            $('#renameOrCreateModal').modal('hide');
            $('#renameInfo').click();
          }  else if(apiResult.data.exception === 'DATA_BANK_NAME_NOT_VALID_FORMATE' ){
            this.errorName = 'Data Bank Name is not valid format.';
          } else {
           this.appServices.handleOtheException(apiResult.data.exception);           
          }
        }).catch(err=>{
          console.log('errrororroror',err)
          this.isLoading = false;
          this.appServices.handleNetworkException(err)
        })
      }
    }
    
      
  }
  dataBankNameKeyPress(e){
    this.errorName = '';
    var k = e.which;
    let value = e.target.value.trim().length;
    if(value.length == 0){
      console.log('irst char');
      if((k >= 48 && k <= 57))
          e.preventDefault();
    }
    if(value.length >20)
      e.preventDefault();
    var ok = (k >= 65 && k <= 90) || // A-Z(capital letter alpahabets)
        k >= 97 && k <= 122 || // a-z(small letter alpahabets)
        (k >= 48 && k <= 57) ||  // 0-9
        k == 8 ||  // Backspaces
        k == 9 ||  //H Tab
        k == 0 ||  //H Tab
        k == 11 ||  //V Tab
        k == 32 ||  // Space
        k == 127;   //Delete
    if (!ok) {
    // prevent user to press key 
        e.preventDefault();
    }
  }
  dataBankNameKeyUp(e){
    if(e.target.value.length >4)
      this.loading = false;
    else 
      this.loading = true;
  }
  renameDBModal(oldDBName){
    this.craeteOrRenameDataBankbtn = "Rename";
    this.oldDBName = oldDBName;
    this.dataBankName = oldDBName;
    this.errorName = "";
    $('#renameOrCreateModal').modal('show');
    $("#inputdm").focus();
  }
  createDBModal(){
    this.craeteOrRenameDataBankbtn = "Create";
    this.errorName = "";
    $('#renameOrCreateModal').modal('show');

  }
  deleteDBModal(dataBankName){
    this.craeteOrRenameDataBankbtn = "Delete";
    this.errorName = "";
    this.oldDBName = dataBankName;
    this.loading = false;
    $('#deleteDBModal').modal('show');
  }
  deleteConfirm(){
    if( this.oldDBName != ""){
    this.loading = true;
    this.craeteOrRenameDataBankbtn = "Deleteing..";
      this.apiServices.deleteDataBankName(this.oldDBName)
      .then(res=>{
        console.log('res',res.data);
        if(res.data.status && res.data.statusCode === 200){
          this.databanks.forEach((db,i)=>{
            if(db.dataBankName === this.oldDBName){
              this.databanks.splice(i,1);
              return; 
            }
          })
          this.loading = false;
          $('#deleteDBModal').modal('hide');
          $('#deleteInfo').click();
        } else{
          this.appServices.handleOtheException(res.data.exception)           
        }
      }).catch(err=>{
        this.isLoading = false;
        console.log('errrrrrrrrrrrrrrr',err)
      this.appServices.handleNetworkException(err)
      })
    }
  }
  openDataBank(dataBank){
    console.log(dataBank);
    this.appServices.currentDataBank = dataBank.dataBankName;
    if(dataBank.project){
      this.appServices.setProjectId(dataBank.projectId)
      this.appServices.routTo('dapp/datamanagement/databank/'+dataBank.dataBankName+'/allocated-data');
    } else {
      this.appServices.routTo('dapp/datamanagement/databank/'+dataBank.dataBankName);
    }
  }
}

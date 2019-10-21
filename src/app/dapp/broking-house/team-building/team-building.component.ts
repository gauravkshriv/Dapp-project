import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { ApiService, AppService } from 'src/app/_services';
declare var $: any;

@Component({
  selector: 'app-team-building',
  templateUrl: './team-building.component.html',
  styleUrls: ['./team-building.component.scss']
})
export class TeamBuildingComponent implements OnInit {
  AllTeamMember=[];
  dataBankName: String = "";
  loading = true;
  editOrCreateTeambtn ="Create";
  errorName : String = "";
  oldDBName :String = "";
  isLoading = false;
  constructor(
    private apiServices : ApiService,
    private appServices : AppService,
    // private router : Router,
    // private ref: ChangeDetectorRef
  ) { 
  }

  ngOnInit() {
    
    $("#createDBModal").on('hidden.bs.modal', ()=>{
      this.errorName = "";
      this.dataBankName ="";
      this.loading = true;
    });
    this.isLoading = true;
    this.apiServices.viewAllTeamMember()
    .then(apiResult=>{
      this.isLoading = false;
      console.log('apiResult',apiResult.data);
      if(apiResult.data.status && apiResult.data.statusCode === 200){
        let dataRequestInfo = apiResult.data.extraData.DataRequestInfo;
        dataRequestInfo.forEach((item,i) => {
          dataRequestInfo[i].created = new Date(item.createDate).toLocaleString();
          dataRequestInfo[i].updated = new Date(item.updateDate).toLocaleString();
        });
        this.AllTeamMember=dataRequestInfo;
        // console.log('data banks found',this.AllTeamMember);
      } else {
        this.appServices.handleOtheException(apiResult.data.exception);
      }
      
    }).catch(err=>{
      this.isLoading = false;
      console.log('EEEEEERRROOOOORRRRRRR', err);
      this.appServices.handleNetworkException(err)
    })
    $(".mdb-select").materialSelect();
    // $('[data-toggle="tooltip"]').tooltip();

   
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
    this.AllTeamMember.push(databank);
  }
  craeteOrRenameDataBank(){
    this.loading  =true;
    if(this.editOrCreateTeambtn === 'Create'){
    this.editOrCreateTeambtn = "Loading..";
      this.apiServices.createDataBank(this.dataBankName)
      .then(apiResult=>{
        console.log('apiResult',apiResult.data);
        this.loading  =false;
        this.editOrCreateTeambtn = "Create"
        if(apiResult.data.status && apiResult.data.statusCode === 200){

          this.formatAndPush(apiResult.data.extraData);
          $('#editOrCreateModal').modal('hide');
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
        this.editOrCreateTeambtn = "Loading..";
        console.log('this.dataBankName,this.oldDBName',this.dataBankName,this.oldDBName);
        this.apiServices.updateDataBankName(this.dataBankName,this.oldDBName)
        .then(apiResult=>{
          let data = apiResult.data;
          console.log(data);
          this.loading  =false;
          this.editOrCreateTeambtn = "Rename"
          if(data.status && data.statusCode === 200 ){
            this.AllTeamMember.forEach((db,i)=>{
              if(this.oldDBName === db.dataBankName){
                this.AllTeamMember[i].dataBankName = this.dataBankName;
                // return;
              }
            })
            $('#editOrCreateModal').modal('hide');
            $('#renameInfo').click();
          }  else if(apiResult.data.exception === 'DATA_BANK_NAME_NOT_VALID_FORMATE' ){
            this.errorName = 'Data Bank Name is not valid format.';
          } else {
           this.appServices.handleOtheException(apiResult.data.exception);           
          }
        }).catch(err=>{
          this.isLoading = false;
          console.log('errrororroror',err)
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
  changeCreatButtonName(name){
    document.getElementById('createDBbtn')
  }
  dataBankNameKeyUp(e){
    if(e.target.value.length >4)
      this.loading = false;
    else 
      this.loading = true;
  }
  renameDBModal(oldDBName){
    // console.log('dsfffffffffffffffff');
    this.editOrCreateTeambtn = "Rename";
    this.oldDBName = oldDBName;
    this.dataBankName = oldDBName;
    this.errorName = "";
    $('#editOrCreateModal').modal('show');
    $("#inputdm").focus();
  }
  createDBModal(){
    console.log('///////////////////////////////');
    this.editOrCreateTeambtn = "Create";
    this.errorName = "";
    $('#editOrCreateModal').modal('show');

  }
  deleteDBModal(dataBankName){
    this.editOrCreateTeambtn = "Delete";
    this.errorName = "";
    this.oldDBName = dataBankName;
    console.log('this.oldDBName',this.oldDBName);
    this.loading = false;
    $('#deleteDBModal').modal('show');

  }
  deleteConfirm(){
    if( this.oldDBName != ""){
    this.loading = true;
    this.editOrCreateTeambtn = "Deleteing..";
      this.apiServices.deleteDataBankName(this.oldDBName)
      .then(res=>{
        console.log('res',res.data);
        if(res.data.status && res.data.statusCode === 200){
          this.AllTeamMember.forEach((tm,i)=>{
            if(tm.dataBankName === this.oldDBName){
              this.AllTeamMember.splice(i,1);
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
  openDataBank(dbName){
    this.appServices.currentDataBank = dbName;
    this.appServices.routTo('dapp/datamanagement/databank/'+dbName);
  }

}

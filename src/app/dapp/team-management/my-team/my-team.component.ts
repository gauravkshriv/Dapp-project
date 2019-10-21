import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
import { AppService, ApiService } from 'src/app/_services';
import { LocalDataSource } from 'ng2-smart-table';
import { StatusViewComponent, MemberStatusViewComponent, ChangeInvStatusComponent, LinkListComponent } from 'src/app/components/table-components';
import swal from 'sweetalert2';
const invStatus ={
  REJECTED:'Rejected',
  ACCEPTED:'Accepted',
  PENDING:'Pending'
}
const mbrStatus ={
  INACTIVE:'Inactive',
  ACTIVE:'Active',
  SUSPENDED:'Suspended'
}
const invStatusO ={
  "Pending":"0",
  "Accept":"1",
  "Reject":"2"
}
const mbrStatusCode ={
  Inactive:"0",
  Active:"1",
  Suspended:"2"
}
const mbrStatusCodeO ={
  "0":"Inactive",
  "1":"Active",
  "2":"Suspended"
}
@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements AfterViewInit {
  isLoading :Boolean =false;
  memberStatusCode :any;
  createBtnValue : String = "Update";
  btnDisabled : Boolean = false;
  viewedMyInvitation : Boolean = false;
  memberData : any;
  doj:any;
  pageNo:number = 0;
  dataSize:number = 20;

  memberTableSource : LocalDataSource = new LocalDataSource();
  invitationTableSource : LocalDataSource = new LocalDataSource();
  settings = {
    // selectMode: 'multi', // single|multi
    actions: {
      custom: [
        { name: 'EDIT', title: '<i class="fa fa-pencil-square-o" title="Edit"></i>' },
        { name: 'DELETE', title: '<i class="fa fa-trash" title="Delete"></i>' },
      ],
      add: false,
      edit:false,
      delete:false,
      position: 'right',
    },
    columns: {
      fullName: {
        title: 'Full Name',
        filter: false,
      },
      email: {
        title: 'Email',
        filter: false,
      },
      memberCode: {
        title: 'Member Code',
        filter: false,
      },
      memberStatus: {
        title: 'Member Status',
        type: 'custom',
        filter: false,
        renderComponent: MemberStatusViewComponent
      },
      invitationStatus: {
        title: 'Invitation Status',
        type: 'custom',
        filter: false,
        renderComponent: StatusViewComponent
      },
      doj: {
        title: 'Date Of Join',
        filter: false,
      },
    },
    pager:
    {
      perPage: 10
    }
  }
  settings_inv = {
    // selectMode: 'multi', // single|multi
    actions: {
      // custom: [
      //   { name: 'EDIT', title: '<i class="fa fa-pencil-square-o" title="Edit"></i>' },
      //   { name: 'DELETE', title: '<i class="fa fa-trash" title="Delete"></i>' },
      // ],
      add: false,
      edit:false,
      delete:false,
      position: 'right',
    },
    columns: {
      _ownerFullName: {
        title: 'Invited By',
        filter: false,
      },
      _projectId: {
        title: 'Project ID',
        type: 'custom',
        filter: false,
        renderComponent: LinkListComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
              $('#pid').val(JSON.stringify(row))
              $('#pid').click()
          });
        }
      },
      memberCode: {
        title: 'Member Code',
        filter: false,
      },
      _invitationStatus: {
        title: 'Invitation Status',
        type: 'custom',
        filter: false,
        renderComponent: ChangeInvStatusComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
              $('#def').val(JSON.stringify(row))
              $('#def').click()
          });
        }
      },
    },
    pager:
    {
      perPage: 10
    }
  }
  constructor(
    private appServices : AppService,
    private apiServices : ApiService,
  ) { }

  ngOnInit() {
    console.log('chage detected.........in ngOnInit');
    this.viewTeamMember()
    $('.mdb-select').materialSelect()
    $('.datepicker').pickadate({
      holder: 'picker__holder',
      clear: false,
    })
  }
  ngAfterViewInit() {
    console.log('chage detected......... in ngAfterViewInit');
    
  }
  refreshInvitation(){
    this.pageNo= 0;
    this.dataSize  =20;
    this.viewMyInvitation()
  }
  viewMyInvitation(){
    this.isLoading = true;
    this.apiServices.myInvitation(this.pageNo, this.dataSize)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data)
      if(res.data.status && res.data.statusCode){
        this.formatInvitation(res.data.extraData.myInvitation)
      } else if(res.data.exception == "TEAM_MEMBER_NOT_FOUND"){
        console.log('TEAM_MEMBER_NOT_FOUND');
      } else this.appServices.handleOtheException(res.data.exception)
    }).catch(err=>{
      console.log('errrrr',err);
      this.appServices.handleNetworkException(err)
    })
  }
  formatInvitation(myInvitation: Array<any>) {
    myInvitation.forEach((inv,i) => {
      myInvitation[i]["_ownerFullName"]= inv.projectTeamStatus.ownerFullName
      myInvitation[i]["_invitationStatus"]= invStatus[inv.projectTeamStatus.invitationStatus]
      myInvitation[i]["_projectId"]= inv.projectTeamStatus.projectId
    });
    this.invitationTableSource.load(myInvitation)
  }
  viewTeamMember(){
    this.isLoading = true;
    this.apiServices.viewAllTeamMember()
    .then(res=>{
    this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode == 200){
        this.formatTeamMember(res.data.extraData.TeamInfo.teamMember)
      } else if(res.data.exception == "TEAM_MEMBER_NOT_FOUND"){
        console.log('TEAM_MEMBER_NOT_FOUND');
      } else {
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err);    
    })
  }
  formatTeamMember(team : Array<any>){
    team.forEach((m,i)=>{
      team[i].doj = new Date(m.doj).toLocaleDateString()
      team[i].invitationStatus = invStatus[team[i].invitationStatus]
      team[i].memberStatus = mbrStatus[team[i].memberStatus]
    })
    this.memberTableSource.load(team).then(()=>{
      this.memberTableSource.setSort([{
          field: 'memberStatus',
          direction: 'asc',}
      ])
    })
  }
  defClick(data){
  data = JSON.parse(data)
  let invStatusCode = invStatusO[data.status] 
  let _invStatus = data.status == "Accept" ? 'ACCEPTED' : 'REJECTED';
  swal({
    title: "Are you sure?",
    text: "Want want to "+data.status+"? You will not be able to recover this.",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: '#ff386a',
    confirmButtonText: 'Yes, I am sure!',
    cancelButtonText: "No, cancel it!",
    allowEscapeKey:false,
    showLoaderOnConfirm: true,
    preConfirm: () => {
      return this.apiServices.changeInvitation(invStatusCode,data.rowData.memberCode)
    }
  }).then(result=>{
    if(result.value){
      swal.close()
      let data = result.value.data;
      if(data.status && data.statusCode == 200 && data.successCode == "API_SUCCESS"){
        $('#invStatus').click()
        this.invitationTableSource.update(this.memberData,{_invitationStatus:invStatus[_invStatus]})
      } else {
        this.appServices.handleOtheException(result.value.data.exception)
      }
    }
  }).catch(err=>{
    this.appServices.handleNetworkException(err);
  })
  $('#def').val('');
  }
  projectIdClick(data){
    data = JSON.parse(data)
    $('#pid').val('')
    this.appServices.setProjectId(data.projectId);
    this.appServices.routTo('/dapp/project-management/my-project/'+this.appServices.getProjectId())
  }
  onUserRowSelect(e){
    this.memberData  =e.data;
  }
  onSearch(query: string = '') {
    // console.log(query);
    if(query === ''){
      console.log('zhjkjhcvbnm,',);
      this.memberTableSource.reset()
    } 
    else {
      this.memberTableSource.setFilter([
        {
          field: 'fullName',
          search: query,
        },
        {
          field: 'email',
          search: query,
        },
        {
          field: 'memberCode',
          search: query,
        },
        {
          field: 'invitationStatus',
          search: query,
        },
        {
          field: 'memberStatus',
          search: query,
        },
        {
          field: 'doj',
          search: query,
        }
      ], false);
    }
  }
  onSearchinv(query: string = '') {
    if(query === ''){
      this.invitationTableSource.reset()
    } 
    else {
      this.memberTableSource.setFilter([
        {
          field: '_invitationStatus',
          search: query,
        },
        {
          field: '_ownerFullName',
          search: query,
        },
        {
          field: 'memberCode',
          search: query,
        },
        {
          field: 'projectId',
          search: query,
        }
      ], false);
    }
  }
  onCustom(e){
    console.log(e);
    if(e.action == 'EDIT'){
      this.memberStatusCode = mbrStatusCode[e.data.memberStatus]
      this.doj = new Date(e.data.doj);
      this.memberData = e.data;
      $('#editUserModal').modal('show')
    } else if(e.action == 'DELETE'){
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#ff386a',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
        allowEscapeKey:false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.apiServices.deleteTeamMember(e.data.memberCode)
        }
      }).then(result=>{
        if(result.value){
          swal.close()
          let data = result.value.data;
          if(data.status && data.statusCode ==200 && data.successCode == "API_SUCCESS"){
            $('#deleteInfo').click()
            this.memberTableSource.remove(e.data)
          } else {
            this.appServices.handleOtheException(result.value.data.exception)
          }
        }
      }).catch(err=>{
        this.appServices.handleNetworkException(err);
      })
    }
    
  }
  onCustomInv(e){
    console.log(e);
  }
  check(e){
    if(!this.viewedMyInvitation && e === 1){
      this.viewedMyInvitation = true;
      this.viewMyInvitation()
    }
  }
  UpdateTM(){
    this.btnDisabled = true;
    this.createBtnValue = "Updating.."
    let memberInfo = {
      memberCode:this.memberData.memberCode,
      doj:this.doj,
      memberStatus:this.memberStatusCode
    }
    this.apiServices.editTeamMember(memberInfo)
    .then(res=>{
      console.log(res.data);
      this.btnDisabled = false;
    this.createBtnValue = "Update"
      if(res.data.status && res.data.statusCode == 200){   
        this.memberTableSource.update(this.memberData,{memberStatus:mbrStatusCodeO[this.memberStatusCode],doj:new Date(this.doj).toLocaleDateString()})
        $('#editUserModal').modal('hide')
        $('#updateinfo').click()
      }else {
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err);    
    })
  }
  addNewMember(){
    this.appServices.routTo('/dapp/team-management/add')
  }
}

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AppService, ApiService, UtlService } from 'src/app/_services';
import swal from 'sweetalert2';
import { LocalDataSource } from 'ng2-smart-table';
import { ImageViewComponent, ViewMoreLessComponent } from 'src/app/components/table-components';
declare var $: any;

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {
  selectedRef = "0";
  filterMemberBy = "0";
  selectedOcc = 0;
  userInfo:any
  isLoading :Boolean = false;
  isSearching :Boolean = false;

  isSelected : Boolean = false;
  isAllSelected : Boolean = false;

  myTeam : Array<any> = [];
  rmeOcc : Array<any> = [];
  allSelectedUser: Array<any> = [];
  memberTableSource : LocalDataSource = new LocalDataSource();
  settings = {
    selectMode: 'multi', // single | multi
    actions: {
      custom: [
        { name: 'ADD', title: 'Add<i class="fas fa-plus-circle" title="Add to Team"></i>' },
      ],
      add: false,
      edit:false,
      delete:false,
      position: 'right',
    },
    columns: {
      fillName: {
        title: 'Full Name',
        type: 'custom',
        filter: false,
        renderComponent: ImageViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
              $('#def').val(JSON.stringify(row))
              $('#def').click()
          });
        }
      },
      email: {
        title: 'Email',
        filter: false,
      },
      myMember: {
        title: 'My Member',
        filter: false,
      },
      occ: {
        title: 'Occupation',
        type: 'custom',
        filter: false,
        renderComponent: ViewMoreLessComponent,
      }
    },
    pager:
    {
      perPage: 10
    }
  }
  pageNo = 0;
  dataSize = 20;
  
  constructor(
    private utlServices : UtlService,
    private apiServices : ApiService,
    private appServices : AppService
  ) {   this.getMyMember()
  }

  ngOnInit() {
    this.userInfo = this.appServices.getUserInfo()
    this.rmeOcc = this.utlServices.rmeOcc;
    this.memberTableSource.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.memberTablePageChange(change.paging.page, change.paging.perPage);
      }
    });
  }
  memberTablePageChange(page: any, perPage) {
    const loadedRecordCount = this.memberTableSource.count();
    const lastRequestedRecordIndex = page * perPage;
    if (loadedRecordCount <= lastRequestedRecordIndex){
      this.pageNo++;
      if(this.filterMemberBy == "0")
        this.getAllUser()
      // else this.getUserByOccupation()
    }
  }
  getMyMember() {
    this.apiServices.viewAllTeamMember()
    .then(res=>{
      this.isLoading = false;
        console.log('res',res.data)
        if(res.data.status && res.data.statusCode == 200){
          this.myTeam = res.data.extraData.TeamInfo.teamMember;
          this.getMyReferral()
        }else if(res.data.exception === "TEAM_MEMBER_NOT_FOUND"){
          this.getMyReferral()
        } else {
          this.appServices.handleOtheException(res.data.exception)
        } 
      }).catch(err=>{
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  getMyReferral(){
    this.isLoading = true;
    this.apiServices.getMyReferral()
    .then(res => {
    this.isLoading = false;
      console.log('res',res.data)
      if(res.data.status && res.data.statusCode == 200){
        this.formatmyRefMember(res.data.extraData.myreferral)
      } else {
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err)
    })
  }
  formatmyRefMember(myreferral: Array<any>) {
    let members = []
    myreferral.forEach(mem => {
      if(mem.uuid !==this.userInfo.uuid){
        let _myTeam = this.myTeam.find(u=>u.uuid == mem.uuid)
        if((mem._occ && mem._occ.length) || (mem.occ && mem.occ.length)){
          if(mem.occ){
            mem["occupation"] = mem.occ
            mem["occ"] = this.getOccString(mem.occ)
          } 
          if(mem._occ){
            mem["occupation"] = mem._occ
            mem["occ"] = this.getOccString(mem._occ)
          }
          mem["myMember"] = _myTeam && _myTeam.invitationStatus == "ACCEPTED" ? 'Yes' : 'No';
          if(mem.email){
            if(mem.firstname) mem["fullName"] = mem.firstname+' '+mem.lastname;
            if(mem.firstName) mem["fullName"] = mem.firstName+' '+mem.lastName;
            members.push(mem)
          }
        }
      }
    });
    if (this.memberTableSource.count() > 0 && this.pageNo)
    members.forEach(d => this.memberTableSource.add(d));
  else
    this.memberTableSource.load(members)
  }
  getOccString(_occ: any): any {    
    return _occ.map(_v=>this.utlServices.rmeOcc.find(v=>v.value == _v).name).join(', ');
  }
  onUserRowSelect(e){
    if(e.selected.length){
      this.isSelected  = true;
      this.allSelectedUser = e.selected;
    } else {
      this.isSelected  = false;
    }
    // if(e.isSelected !== null){
    //   if(e.isSelected){
    //     console.log('single select ....');
    //   } else {
    //     console.log('single unselect ....');
    //   }
      
    // } else {
    //   if(e.selected.length){
    //     console.log('multi select');
    //   } else {
    //     console.log('multi unselect');
    //   }
    // }
  }
  onCustom(e){
    console.log(e);
    if(!this.isSelected){
      if(e.action == "ADD"){
        if(e.data.myMember == 'No'){
          let team = {
            "uuid":e.data.uuid,
            "email":e.data.email,
            "fullName":e.data.fullName,
            "occupation": this.appServices.getRMEOccEnum(e.data.occupation)
            }
          this.addToTeam([team])
        } else $('#alreadyMyTeam').click()
      }
    } else $('#invalidAction').click()
  }
  addToTeam(team) {
    this.isLoading = true;
    this.apiServices.createTeam(team)
    .then(res => {
      this.isLoading = false;
      console.log('res',res.data)
      if(res.data.status && res.data.statusCode == 200){
        let alreadyAddedFullName = res.data.extraData.MyTeamInfo.alreadyAddedFullName;
        if(alreadyAddedFullName.length){
          swal({
            title:'Member Added',
            html : 'Member Added To Team Successfully, but <b>'+alreadyAddedFullName.join(', ') + '</b> already added',
            type:'success',
            confirmButtonText :"Let's See",
            showCancelButton:true,
            cancelButtonText:'No',
            cancelButtonColor:'#ff386a',
          }).then(res=>{
            if(res.value)
              this.appServices.routTo('/dapp/team-management/my-team')
          })
        } else {
          swal({
            title:'Member Added',
            text : 'Member Added To Team Successfully',
            type:'success',
            confirmButtonText :"Let's See",
            showCancelButton:true,
            cancelButtonText:'No',
            cancelButtonColor:'#ff386a',
          }).then(res=>{
            if(res.value)
              this.appServices.routTo('/dapp/team-management/my-team')
          })
        }
      } else this.appServices.handleOtheException(res.data.exception)
    }).catch(err=>{
      this.appServices.handleNetworkException(err)
    })
  }
  viewImage(data){
    console.log(JSON.parse(data));
  }
  checkIfSelected(){
    this.isSelected = false;
    this.allSelectedUser = [];
    if($('th>.ng-untouched.ng-pristine.ng-valid:checked').length > 0){
      $('th>.ng-untouched.ng-pristine.ng-valid').click()
    }
  }
  refChange(){
    this.checkIfSelected()
    this.pageNo = 0;
    this.dataSize = 20;
    if(this.selectedRef == "0"){
      this.getMyMember()
    } else {
      if(this.filterMemberBy == "0"){
        this.getAllUser()
      } else if(this.filterMemberBy == "1") {
        this.getUserByOccupation()
      }
    }
  }
  
  filterChange(){
    this.checkIfSelected()
    this.pageNo = 0;
    this.dataSize = 20;
    if(this.filterMemberBy == "0"){
      this.getAllUser()
    } else if(this.filterMemberBy == "1"){
      this.getUserByOccupation()
    }
  }
  occChange(){
    this.checkIfSelected()
    this.getUserByOccupation()
  }
  getAllUser() {
   this.isLoading  =true;
   this.apiServices.allUsersByPageSize(this.pageNo, this.dataSize)
   .then(res=>{
     this.isLoading = false;
     console.log(res.data);
      if(res.data.status && res.data.statusCode){
        this.formatmyRefMember(res.data.extraData.userInfo)
        } else {
          this.appServices.handleOtheException(res.data.exception)
        }
   }).catch(err=>{
    this.isLoading = false;
     this.appServices.handleNetworkException(err)
   })
  }

  getUserByOccupation() {
    this.isLoading = true;
    this.apiServices.getUserByOccAndPagging(this.selectedOcc)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
       if(res.data.status && res.data.statusCode){
         this.formatmyRefMember(res.data.extraData.userInfo)
         } else {
           this.appServices.handleOtheException(res.data.exception)
         }
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err)
    })
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
          field: 'occ',
          search: query,
        }
      ], false);
    }
  }
  onsearchFullName(fullName:string){
    let firstName,lastName='';
    let fn = fullName.trim().split(' ');
    if(fn.length>1){
      firstName = fn[0];lastName = fn[1]
    } else firstName = fn[0]
    if(firstName.length >=2){
      this.isSearching = true;
      this.apiServices.getUserByFullName(firstName,lastName)
      .then(res=>{
        this.isSearching = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          this.pageNo = 0;
          this.dataSize = 20;
          this.formatmyRefMember(res.data.extraData.userInfo)
        } else if(res.data.exception == "USER_NOT_FOUND_WITH_THIS_FULL_NAME"){
          $('#userNotFound').click()
          this.memberTableSource.empty();
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err=>{
        this.isSearching = false;
        this.appServices.handleNetworkException(err)
      })
    }
  }
  onSearchByUserName(userName){
    if(userName.trim().length >2 && userName.trim().length <20){
      this.isSearching = true;
      this.apiServices.searchUser(userName)
      .then(res=>{
        this.isSearching = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          if(!res.data.extraData.User.length)$('#userNotFound').click()
          this.pageNo = 0;
          this.dataSize = 20;
          this.formatmyRefMember(res.data.extraData.User)
          
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err=>{
        this.isSearching = false;
        this.appServices.handleNetworkException(err)
      })
    }
  }
  addUsersToTeam(){
    if(this.allSelectedUser.length){
      let team = [];
      this.allSelectedUser.forEach(user => {
        if(user.myMember == 'No'){
          team.push({
            "uuid":user.uuid,
            "email":user.email,
            "fullName":user.fullName,
            "occupation": this.appServices.getRMEOccEnum(user.occupation)
          })
        }
      })
      if(team.length)
        this.addToTeam(team)
      else {
        swal({
          title:'Member Already Added',
          html : 'Selected members are already added in your team',
          type:'info',
          confirmButtonText :"GOT IT",
        })
      }
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { AppService, ApiService, UtlService } from 'src/app/_services';
import { LocalDataSource } from 'ng2-smart-table';
import { ViewMoreLessComponent } from 'src/app/components/table-components';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  department:any;
  pageNo:number = 0;
  dataSize:number = 20;
  settings = {
    // selectMode: 'multi', // single|multi
    actions: {
      custom: [
        // { name: 'EDIT', title: '<i class="fa fa-pencil-square-o" title="Edit"></i>' },
        // { name: 'DELETE', title: '<i class="fa fa-trash" title="Delete"></i>' },
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
        filter: false,
      },
      invitationStatus: {
        title: 'Invitation Status',
        filter: false,
      },
      doj: {
        title: 'Date Of Join',
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
  memberTableSource:LocalDataSource = new LocalDataSource()
  constructor(
    private appServices:AppService,
    private apiServices:ApiService,
    private utlServices:UtlService

  ) {
    this.checkRouter()
   }


  ngOnInit() {
    this.getdepartment()
    this.memberTableSource.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.pageChange(change.paging.page);
      }
    });
  }
  pageChange(pageIndex){
    const loadedRecordCount = this.memberTableSource.count();
    const lastRequestedRecordIndex = (pageIndex) * this.dataSize;
    if (loadedRecordCount <= lastRequestedRecordIndex) {
      this.pageNo++; 
      this.getdepartment() 
    }
  }

  async getdepartment() {
    // try {
      let dRes = await this.apiServices.getTeamByDept(this.department,"",this.pageNo,this.dataSize)
      if(dRes.data.status && dRes.data.statusCode == 200){
        this.formateMember(dRes.data.extraData.TeamDepartmentInfo)
      }
    // } catch (error) {
    //   this.appServices.handleNetworkException(error)
    // }
  }

  getTableData(m){
    let _m = {
      fullName:m.teamMember.fullName,
      memberCode:m.teamMember.memberCode,
      memberStatus:m.teamMember.memberStatus,
      invitationStatus:m.teamMember.invitationStatus,
      email:m.teamMember.email,
      doj:new Date(m.teamMember.doj).toLocaleDateString(),
      occ:this.getOccString(m.teamMember.occupation)
    };
    return _m;
  }

  
  formateMember(teamDept: Array<any>) {
    let teamList = [];
    if (this.memberTableSource.count() > 0)
      teamDept.forEach(d => this.memberTableSource.add(this.getTableData(d)));
    else{
      teamDept.forEach(d=>teamList.push(this.getTableData(d)))
      this.memberTableSource.load(teamList)
    }
  }
  
  getOccString(_occ: any): any {    
    return _occ.map(_v=>this.utlServices.rmeOcc.find(v=>v.value == _v).name).join(', ');
  }
  checkRouter(){
    let dept :string;
    if(this.appServices.currentDepartment){
      dept = this.appServices.currentDepartment;
    } else {
      let url = this.appServices.getRouterURL();
      let urlArray = url.split('/');
      dept = this.appServices.currentDepartment = urlArray[urlArray.length -1]
    }
    this.department = dept.toUpperCase().split('-').join(' ');
  }
}

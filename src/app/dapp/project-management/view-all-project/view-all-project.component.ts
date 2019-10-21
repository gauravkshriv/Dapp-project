import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import swal from 'sweetalert2';
import { LinkViewComponent, LinkListComponent, ChangeInvStatusComponent } from 'src/app/components/table-components';
import { AppService, ApiService } from 'src/app/_services';
const invStatus = {
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
  PENDING: 'Pending'
}
@Component({
  selector: 'app-view-all-project',
  templateUrl: './view-all-project.component.html',
  styleUrls: ['./view-all-project.component.scss']
})
export class ViewAllProjectComponent implements OnInit {
  isLoading = false;
  projectPageNo = 0;
  projectPageSize = 20;
  invtProjPageNo = 0;
  invtProjPageSize = 20;

  settings = {
    actions: {
      custom: [
        { name: 'INFO', title: '<i class="fa fa-info-circle" title="More Info"></i>' },
        { name: 'EDIT', title: '<i class="fa fa-edit" title="edit & update"></i>' },
        { name: 'DELETE', title: '<i class="fa fa-trash" title="Delete"></i>' },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },
    columns: {
      projectName: {
        title: 'Project Name',
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
      step: {
        title: 'Step',
        filter: false,
      },
      projectType: {
        title: 'Project Type',
        filter: false,
      },
      projectSubType: {
        title: 'Project Subtype',
        filter: false,
      },
      location: {
        title: 'Location',
        filter: false,
      },
      status: {
        title: 'Status',
        filter: false,
      },

    }
  };
  settings_inv = {
    // selectMode: 'multi', // single|multi
    actions: {
      // custom: [
      //   { name: 'EDIT', title: '<i class="fa fa-pencil-square-o" title="Edit"></i>' },
      //   { name: 'DELETE', title: '<i class="fa fa-trash" title="Delete"></i>' },
      // ],
      add: false,
      edit: false,
      delete: false,
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
  myProjTableSource: LocalDataSource = new LocalDataSource();
  invProjTableSource: LocalDataSource = new LocalDataSource();
  viewedMyInvitation: boolean = false;

  constructor(
    private appServices: AppService,
    private apiServices: ApiService,
  ) { }


  ngOnInit() {
    this.viewAllProject()
    this.myProjTableSource.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.tableageChange(change.paging.page);
      }
    });
  }
  tableageChange(pageIndex: any) {
    const loadedRecordCount = this.myProjTableSource.count();
    const lastRequestedRecordIndex = pageIndex * (this.projectPageSize / 2);
    if (loadedRecordCount <= lastRequestedRecordIndex) {
      this.projectPageNo++;
      this.viewAllProject()
    }
  }
  testReset() {
    this.myProjTableSource.reset()
  }
  refreshAllProject() {
    this.projectPageNo = 0
    this.projectPageSize = 20
    this.viewAllProject()
  }
  viewAllProject() {
    this.isLoading = true;
    this.apiServices.viewAllProject(this.projectPageNo, this.projectPageSize)
      .then(res => {
        this.isLoading = false;
        console.log(res.data);
        if (res.data.status && res.data.statusCode == 200) {
          this.formatAllFiles(res.data.extraData.ProjectInfo)
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  ngOnDestroy() {
  }

  formatAllFiles(dataList) {
    if (dataList.length) {
      dataList.forEach((d, i) => {
        dataList[i]['location'] = d.location.city;
        dataList[i]["status"] = d.projectStatus ? d.projectStatus : 'Incomplete';
        dataList[i]['createdAt'] = new Date(d.created).toLocaleString();
      })
      if (this.myProjTableSource.count() > 0 && this.projectPageNo)
        dataList.forEach(d => this.myProjTableSource.add(d));
      else
        this.myProjTableSource.load(dataList);
    }
  }
  formatAllInvProj(dataList) {
    if (dataList.length) {
      dataList.forEach((d, i) => {
        dataList[i]['location'] = d.location.city;
        dataList[i]["status"] = d.projectStatus ? d.projectStatus : 'Incomplete';
        dataList[i]['createdAt'] = new Date(d.created).toLocaleString();
      })
      if (this.myProjTableSource.count() > 0 && this.projectPageNo)
        dataList.forEach(d => this.myProjTableSource.add(d));
      else
        this.myProjTableSource.load(dataList);
    }
  }
  onCustom(e) {
    console.log(e);
    if (e.action === 'DELETE') {
      swal({
        title: "Are you sure?",
        text: "You will not be able to recover this.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#ff386a',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
        allowEscapeKey: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.apiServices.deleteProject(e.data.projectID)
        }
      }).then(result => {
        if (result.value) {
          swal.close()
          let data = result.value.data;
          if (data.status && data.statusCode == 200 && data.successCode == "API_SUCCESS") {
            $('#deleteInfo').click()
            this.myProjTableSource.remove(e.data)
          } else {
            this.appServices.handleOtheException(result.value.data.exception)
          }
        }
      }).catch(err => {
        console.log('errrr', err)
        this.appServices.handleNetworkException(err);
      })
    } else if (e.action === 'INFO') {
      this.appServices.setProjectId(e.data.projectID);
      this.appServices.routTo('/dapp/project-management/my-project/' + this.appServices.getProjectId())
    } else {
      this.appServices.goToStep = undefined;
      this.appServices.setProjectId(e.data.projectID);
      if (e.data.step != 4) this.appServices.routTo('/dapp/project-management/add-project')
      else this.appServices.routTo('/dapp/project-management/edit-project')
    }
  }

  onSearch(query: string = '') {
    if (query === '') {
      this.myProjTableSource.reset()
    }
    else {
      this.myProjTableSource.setFilter([
        {
          field: 'projectName',
          search: query,
        },
        {
          field: 'step',
          search: query,
        },
        {
          field: 'projectType',
          search: query,
        },
        {
          field: 'dataQuality',
          search: query,
        },
        {
          field: 'location',
          search: query,
        },
        {
          field: 'status',
          search: query,
        },
        {
          field: 'projectSubType',
          search: query,
        },
      ], false);
    }
  }
  onSearchinv(query: string = '') {
    if (query === '') {
      this.invProjTableSource.reset()
    }
    else {
      this.invProjTableSource.setFilter([
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
  viewProject(v) {
    this.appServices.setProjectId(JSON.parse(v).projectID);
    this.appServices.routTo('/dapp/project-management/my-project/' + this.appServices.getProjectId())
  }
  check(e) {
    if (!this.viewedMyInvitation && e === 1) {
      this.viewedMyInvitation = true;
      this.viewMyInvitation()
    }
  }
  addNewProject() {
    this.appServices.setProjectId(null)
    this.appServices.routTo('/dapp/project-management/add-project')
  }
  refreshInvitation() {
    this.invtProjPageNo = 0;
    this.invtProjPageSize = 20;
    this.viewMyInvitation()
  }
  viewMyInvitation() {
    this.isLoading = true;
    this.apiServices.myInvitation(this.invtProjPageNo, this.invtProjPageSize)
      .then(res => {
        this.isLoading = false;
        console.log(res.data)
        if (res.data.status && res.data.statusCode) {
          this.formatInvitation(res.data.extraData.myInvitation)
        } else if (res.data.exception == "TEAM_MEMBER_NOT_FOUND") {
          console.log('TEAM_MEMBER_NOT_FOUND');
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  formatInvitation(myInvitation: Array<any>) {
    myInvitation.forEach((inv, i) => {
      myInvitation[i]["_ownerFullName"] = inv.projectTeamStatus.ownerFullName
      myInvitation[i]["_invitationStatus"] = invStatus[inv.projectTeamStatus.invitationStatus]
      myInvitation[i]["_projectId"] = inv.projectTeamStatus.projectId
    });
    this.invProjTableSource.load(myInvitation)
  }
  projectIdClick(data) {
    data = JSON.parse(data)
    $('#pid').val('')
    this.appServices.setProjectId(data.projectId);
    this.appServices.routTo('/dapp/project-management/my-project/' + this.appServices.getProjectId())
  }
  onCustomInv(e) {
    console.log(e);

  }
}

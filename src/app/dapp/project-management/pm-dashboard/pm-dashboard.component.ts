import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ApiService, AppService } from 'src/app/_services';


@Component({
  selector: 'app-pm-dashboard',
  templateUrl: './pm-dashboard.component.html',
  styleUrls: ['./pm-dashboard.component.scss']
})
export class PmDashboardComponent implements OnInit {
  isLoading: boolean = false;
  public pendingProjectInfo: Array<any> = []
  myTeam: Array<any> = [];
  myTeam1: Array<any> = [];

  selectedDataManagConsultant: any;
  selectedBrokingConsultant: any;

  allSelectedDataManagConsultant: Array<any> = [];
  allSelectedBrokingConsultant: Array<any> = [];

  constructor(
    private appServices: AppService,
    private apiServices: ApiService,
  ) { }
  data = {};
  receiveMessage(data) {
    console.log(data);

  }
  ngOnInit() {
    // this.getMyTeam()
    this.getPendingProject()
    this.data = {
      id: 1, name: 'root', children: [
        { id: 2, name: 'a', children: [] },
        {
          id: 3, name: 'b', children: [
            { id: 4, name: 'b-1', children: [] },
            {
              id: 5, name: 'b-2', children: [
                { id: 6, name: 'b-2-1', children: [] },
                { id: 7, name: 'b-2-2', children: [] },
                { id: 8, name: 'b-2-3', children: [] }
              ]
            }
          ]
        },
        {
          id: 1, name: 'c', children: [
            { id: 1, name: 'c-1', children: [] },
            { id: 1, name: 'c-2', children: [] }
          ]
        },
      ]
    }
  }
  someMethod(v: Array<any>, type) {
    if (type == 'b') {
      this.selectedBrokingConsultant = []
      for (let index = 0; index < v.length; index++) {
        v[index]["_id"] = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        this.selectedBrokingConsultant.push(v[index])
      }
    } else {
      this.selectedDataManagConsultant = []
      for (let index = 0; index < v.length; index++) {
        v[index]["_id"] = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 10000;
        this.selectedDataManagConsultant.push(v[index])
      }
    }
    // console.log(this.selectedBrokingConsultant,this.selectedDataManagConsultant);
  }
  someMethod22(v) {
    console.log('AFTER=============>', this.selectedDataManagConsultant);

    this.selectedDataManagConsultant = v;
    console.log('BEFORE=============>', this.selectedDataManagConsultant);
  }
  getMyTeam() {
    // this.myTeam = this.appServices.facility;
    this.isLoading = true;
    this.apiServices.viewAllTeamMember()
      .then(res => {
        this.isLoading = false;
        console.log('teamdata', res.data);
        if (res.data.status && res.data.statusCode) {
          let TeamInfo = res.data.extraData.TeamInfo;
          this.myTeam = TeamInfo.teamMember;
          setTimeout(() => {
            this.myTeam1 = TeamInfo.teamMember;
          }, 10);
        } else if (res.data.exception == "TEAM_MEMBER_NOT_FOUND") {
          console.log('TEAM_MEMBER_NOT_FOUND');
        } else this.appServices.handleOtheException(res.data.exception);
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  getPendingProject() {
    this.isLoading = true;
    this.apiServices.projectStepTrack()
      .then(res => {
        this.isLoading = false;
        console.log(res.data);
        if (res.data.status && res.data.statusCode == 200) {
          this.pendingProjectInfo = res.data.extraData.ProjectInfo;
        } else if (res.data.exception == "PROJECT_NOT_FOUND") {
          console.log('No pending Project');
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  pendingProject(project) {
    console.log(project);
    this.appServices.goToStep = undefined;
    this.appServices.setProjectId(project.projectId)
    this.appServices.routTo('/dapp/project-management/add-project')
  }
  routToAddproject() {
    this.appServices.setProjectId(null)
    this.appServices.routTo('/dapp/project-management/add-project')
  }
  routToViewAllproject() {
    this.appServices.routTo('/dapp/project-management/my-project')
  }
  clickTo() {
    // this.selectedBrokingConsultant.forEach(d=>this.allSelectedBrokingConsultant.push(d))
    // this.allSelectedBrokingConsultant = _.unionWith(this.allSelectedBrokingConsultant,_.isEqual);
  }

  array = [];
  otherSelected = false;
  i = 89;
  toggle() {
    this.otherSelected = this.otherSelected ? false : true;
    if (this.otherSelected) this.pushData()
  }
  pushData() {
    this.i++;
    this.array.push({
      id: this.i,
      value: ""
    })
    console.log(this.array.map(x => x.value));


  }
  addMore() {
    this.pushData()
  }
  remove(obj) {
    let index = this.array.indexOf(obj)
    if (index > -1) {
      this.array.splice(index, 1)
    }
  }
}

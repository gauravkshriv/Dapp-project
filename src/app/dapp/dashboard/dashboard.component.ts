import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as _ from 'lodash';
import { AppService, ApiService } from 'src/app/_services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [2, 4, 6], label: 'Projects' },
    { data: [1, 3, 5], label: 'Team' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        // {
        //   // id: 'y-axis-1',
        //   // position: 'right',
        //   // gridLines: {
        //   //   color: 'rgba(255,0,0,0.3)',
        //   // },
        //   // ticks: {
        //   //   fontColor: 'gray',
        //   // }
        // }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // primary
      backgroundColor: ' rgba(0, 195, 255, 0.3)',
      borderColor: 'rgb(0, 110, 255)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  dappCard: Array<any> = [];
  userKYTs: any;
  constructor(
    private appService: AppService,
    private apiService: ApiService,

  ) {

  }


  ngOnInit() {
    this.getKYTs()
    // this.getAllData()

  }
  getKYTs() {
    this.appService.getUserKYTs((kyts) => {
      if (kyts) {
        this.userKYTs = kyts;
        this.validateUserDap()
      }
    })
  }
  async getAllData() {
    try {
      let resTeam = await this.apiService.viewAllTeamMember()
      let resPro = await this.apiService.viewAllProject(0, 100000)
      this.getChatrDataByAllData(resTeam.data.extraData.TeamInfo.teamMember, resPro.data.extraData.ProjectInfo)
    } catch (error) {
      console.log('errrr', error)
    }
  }
  getChatrDataByAllData(teamMember: any, ProjectInfo: any) {
    let minMaxDate = this.getMinMaxDate(teamMember, ProjectInfo)
    let projectData = [];
    let teamData = [];
    console.log(teamMember,ProjectInfo)

    minMaxDate.p_dates.forEach(date => {
      let projects = ProjectInfo.filter(x=>new Date(x.created).getTime() <= new Date(date).getTime())
      if (projects && projects.length) projectData.push(projects.length)
    });
    minMaxDate.t_dates.forEach(date => {
      let team = teamMember.filter(x=>new Date(x.created).getTime() <= new Date(date).getTime())
      if (team && team.length) teamData.push(team.length)
    });
    this.lineChartData = [
      { data: projectData, label: 'Projects' },
      { data: teamData, label: 'Team' },
    ]
  }
  getMinMaxDate(teamMember: any, ProjectInfo: any) {
    let p_dates = ProjectInfo.map(x => x.created)
    let t_dates = teamMember.map(x => x.created)
    let _date = p_dates.concat(t_dates)
    let dates = _date.map(x => new Date(x).toLocaleDateString())
    dates = _.unionWith(dates,_.isEqual);
    dates = dates.sort((a,b)=>{return new Date(a).getTime() - new Date(b).getTime()});
    this.lineChartLabels = dates;
    return {p_dates,t_dates};
  }
  getKYTStatusByOcc(occ: string) {
    let kytStatus = "";
    if (this.userKYTs._occ.includes(occ)) {
      if (this.userKYTs.approved.includes(occ)) kytStatus = "APPROVED";
      else if (this.userKYTs.underreview.includes(occ)) kytStatus = "UNDERREVIEW";
      else if (this.userKYTs.declined.includes(occ)) kytStatus = "DECLINED";
      else kytStatus = "PENDING";
    } else kytStatus = "NOKYT";
    return kytStatus;
  }
  validateUserDap() {
    this.dappCard = [
      { name: 'Data Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '/dapp/datamanagement', imgSrc: 'assets/images/databank.png' },
      { name: 'Project Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '/dapp/project-management', imgSrc: 'assets/images/project.png' },
      { name: 'Team Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '/dapp/team-management', imgSrc: 'assets/images/team.png' },
      { name: 'Task Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/task.png' },
      { name: 'Product Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/product.png' },
      { name: 'Inventory Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/inventory.png' },
      { name: 'Lead Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '/dapp/lead-management', imgSrc: 'assets/images/lead.png' },
      { name: 'Billing And Payments', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/bill.png' },
      { name: 'Legal Management', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/legal.png' },
      { name: 'Reporting', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/report.png' },
      { name: 'Digital Marketing', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/digital.png' },
      { name: 'Transactions', kytStatus: this.getKYTStatusByOcc('DATA_MANAGEMENT_CONSULTANT'), rout: '', imgSrc: 'assets/images/transaction.png' },
    ]
    console.log(this.dappCard);

  }
  doKYT() {
    let _ct = localStorage.getItem('_ct');
    this.appService.goToLocation(this.appService.ACCOUNT_URL + '/user/kyt?_ct=' + _ct)
  }
  underDev() {
    swal({
      type: 'info',
      title: 'Under Development',
      text: 'We are doing some work, we will be back soon',
      confirmButtonText: 'GOT IT',
      confirmButtonColor: '#4285F4',
    })
  }





  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }

  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    // console.log(event, active);
  }

  public hideOne() {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

  public pushOne() {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  }

  public changeColor() {
    this.lineChartColors[2].borderColor = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel() {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
    this.chart.update();
  }
}

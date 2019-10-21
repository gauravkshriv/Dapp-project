import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, AppService } from 'src/app/_services';

@Component({
  selector: 'app-databank-info',
  templateUrl: './databank-info.component.html',
  styleUrls: ['./databank-info.component.scss']
})
export class DatabankInfoComponent implements OnInit {
  dataBankName:any;
  folders=[ {
    title:'RAW',
    code:'RAW'
  },{
    title:'SMS',
    code:'SMS'
  },{
    title:'Email',
    code:'EMAIL'
  },{
    title:'Segregated',
    code:'SEGREGATED'
  },
]
  constructor(
    private appServices : AppService,
  ) {
    this.checkRouter()
   }

  ngOnInit() {
    
  }
  checkRouter(){
    if(this.appServices.currentDataBank) this.dataBankName = this.appServices.currentDataBank;
    else {
      let url = this.appServices.getRouterURL();
      let urlArray = url.split('/');
      this.dataBankName = this.appServices.currentDataBank =urlArray[urlArray.length -1]
    }
  }
  openFolder(folderCode){
    this.appServices.currentFolder = folderCode;
    this.appServices.routTo('dapp/datamanagement/databank/'+this.dataBankName+'/'+folderCode);
  }
}

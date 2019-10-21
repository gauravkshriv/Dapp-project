import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { AppService, ApiService } from 'src/app/_services';

@Component({
  selector: 'app-solddata',
  templateUrl: './solddata.component.html',
  styleUrls: ['./solddata.component.scss']
})
export class SolddataComponent implements OnInit {
    settings =  {
      actions: {
        add: false,
        edit:false,
        delete:false,
        position: 'right',
      },
      columns: {
        requestId: {
          title: 'Request ID',
          filter: false,
        },
        processingStatus: {
          title: 'Processing Status',
          filter: false,
        },
        dataCount: {
          title: 'Data Count',
          filter: false,
        },
      }
      
    };
  pageNo= 0;
  pageSize = 20;
  isLoading = false;
  tableSource  = new LocalDataSource()
  constructor(
    private appServices :AppService,
    private apiServices :ApiService,

  ) {
    let url = appServices.getRouterURL();
    let urlArray = url.split('/');
    let requestId =urlArray[urlArray.length -1];
    this.appServices.dataRequestChild = requestId;
    this.viewSoldData();
  }

  ngOnInit() {
    console.log('sold data component s///////////////////');
    
    this.tableSource.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.pageChange(change.paging.page);
      }
    });
  }
  pageChange(pageIndex) {
    const loadedRecordCount = this.tableSource.count();
    const lastRequestedRecordIndex = (pageIndex) * this.pageSize;
    console.log('loadedRecordCount',loadedRecordCount,'pageIndex',pageIndex,'lastRequestedRecordIndex',lastRequestedRecordIndex,'his.pageSize',this.pageSize);
    
    if (loadedRecordCount <= lastRequestedRecordIndex){
      this.pageNo++;
      this.viewSoldData()
    }
  }
  viewSoldData(){
    this.isLoading = true;
    console.log('this.pageNo,this.pageSize',this.pageNo,this.pageSize);
    this.apiServices.viewAllSoldData(this.pageNo,this.pageSize)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode === 200){
        this.formatSoldData(res.data.extraData.DataRequestInfo);
      }
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err);
    })
  }
  formatSoldData(content){
    content.forEach((d,i) => {
      content[i]['dataCount'] = d.rowId.length;
    });
    console.log(content);
    
    if (this.tableSource.count() > 0)
      content.forEach(d => this.tableSource.add(d));
    else
      this.tableSource.load(content);
  }

}

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { LocalDataSource } from 'ng2-smart-table';
import { ApiService, AppService } from 'src/app/_services';
declare var $: any;



@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnInit {
  isRowSelected = false;
  dataTag: any;
  folder: any;
  dataBankName: any;
  dataInfo: any;
  isLoading = false;
  changeClicked = false;
  fileName: String = '';
  pageSize = 20;
  pageNo = 0;
  total: number;
  settings = {
    selectMode: 'multi', // single | multi
    actions: {
      // custom: [
      //   { name: 'INFO', title: '<i class="fa fa-info-circle" title="More Info"></i>' },
      //   { name: 'DOWNLOAD', title: '<i class="fa fa-download" title="Download"></i>' },
      // ],
      add: false,
      edit: false,
      delete: false,
      // position: 'right',
    },
    // delete: {
    //   deleteButtonContent: '<i class="fa fa-trash" title="Delete"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      name: {
        title: 'Name',
        filter: false,
      },
      contact: {
        title: 'Contact',
        filter: false,
      },
      email: {
        title: 'Email',
        filter: false,
      },
      city: {
        title: 'City',
        filter: false,
      },
      state: {
        title: 'State',
        filter: false,
      },
      pin: {
        title: 'Pin',
        filter: false,

      },
      occupation: {
        title: 'Occupation',
        filter: false,
      },
      income: {
        title: 'Income',
        filter: false,
      },
    }
  };
  tableData = [];
  tableSource: LocalDataSource = new LocalDataSource();
  constructor(
    private appServices: AppService,
    private apiServices: ApiService,
  ) {
    this.checkRouter()
  }
  ngOnInit() {
    // $('[data-toggle="tooltip"]').tooltip()
    this.isLoading = true;
    this.getFile()
    this.tableSource.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.pageChange(change.paging.page);
      }
    });
    this.checkSheatIn2ndSleeper([54, 18, 12, 5, 7])
    this.checkSheatInSleeper([54, 18, 12, 5, 7, 1])

  }
  checkSheatInSleeper(list: Array<any>) {
    console.log('checkSheatInSleeper=>', list.join(', '));

    list.forEach(seat => {
      switch (seat % 8) {
        case 1: console.log('LB ', seat, '<==>', seat + 3); break;
        case 2: console.log('MB ', seat, '<==>', seat + 3); break;
        case 3: console.log('UB ', seat, '<==>', seat + 3); break;
        case 4: console.log('LB ', seat, '<==>', seat - 3); break;
        case 5: console.log('MB ', seat, '<==>', seat - 3); break;
        case 6: console.log('UB ', seat, '<==>', seat - 3); break;
        case 7: console.log('SL ', seat, '<==>', seat + 1); break;
        case 0: console.log('SU ', seat, '<==>', seat - 1); break;
        default: console.log('Invalid seat'); break;
      }
    });
  }
  checkSheatIn2ndSleeper(list: Array<any>) {
    console.log('checkSheatIn2ndSleeper=>', list.join(', '));

    list.forEach(seat => {
      switch (seat % 12) {
        case 1: console.log('WS ', seat, '<==>', seat + 11); break;
        case 2: console.log('MS ', seat, '<==>', seat + 9); break;
        case 3: console.log('AS ', seat, '<==>', seat + 7); break;
        case 4: console.log('AS ', seat, '<==>', seat + 5); break;
        case 5: console.log('MS ', seat, '<==>', seat + 3); break;
        case 6: console.log('WS ', seat, '<==>', seat + 1); break;
        case 7: console.log('WS ', seat, '<==>', seat - 1); break;
        case 8: console.log('MS ', seat, '<==>', seat - 3); break;
        case 9: console.log('AS ', seat, '<==>', seat - 5); break;
        case 10: console.log('AS ', seat, '<==>', seat - 7); break;
        case 11: console.log('MS ', seat, '<==>', seat - 9); break;
        case 0: console.log('WS ', seat, '<==>', seat - 11); break;
        default: console.log('Invalid seat'); break;
      }
    });
  }
  checkRouter() {
    if (this.appServices.currentDataBank && this.appServices.currentFolder && this.appServices.currentDataTag) {
      this.dataBankName = this.appServices.currentDataBank;
      this.folder = this.appServices.currentFolder;
      this.dataTag = this.appServices.currentDataTag;
    } else {
      let url = this.appServices.getRouterURL();
      let urlArray = url.split('/');
      this.dataTag = this.appServices.currentDataTag = urlArray[urlArray.length - 1]
      this.folder = this.appServices.currentFolder = urlArray[urlArray.length - 2]
      this.dataBankName = this.appServices.currentDataBank = urlArray[urlArray.length - 3]
    }
  }
  onUserRowSelect(e) {
    if (e.selected.length) {
      this.isRowSelected = true;
      // this.allSelectedUser = e.selected;
    } else {
      this.isRowSelected = false;
    }
  }
  getFile() {
    this.apiServices.getFileInfoByDataTag(this.dataTag, this.pageNo, this.pageSize)
      .then(res => {
        this.isLoading = false;
        console.log(res.data);
        if (res.data.status && res.data.statusCode === 200) {
          this.formatFileData(res.data.pageable.content)
        } else {
          this.appServices.handleOtheException(res.data.exception)
        }
      }).catch(err => {
        this.isLoading = false;
        console.log('errrrrrrrrrr', err)
        this.appServices.handleNetworkException(err);
      })
  }
  formatFileData(content) {
    if (this.tableSource.count() > 0)
      content.forEach(d => this.tableSource.add(d));
    else
      this.tableSource.load(content);

  }
  pageChange(pageIndex) {
    const loadedRecordCount = this.tableSource.count();
    const lastRequestedRecordIndex = (pageIndex) * this.pageSize;
    if (loadedRecordCount <= lastRequestedRecordIndex) {
      this.pageNo++;
      this.getFile()
    }
  }
  onSearch(query: string = '') {
    if (query === '') {
      this.tableSource.reset()
    }
    else {
      this.tableSource.setFilter([
        {
          field: 'name',
          search: query,
        },
        {
          field: 'contact',
          search: query,
        },
        {
          field: 'city',
          search: query,
        },
        {
          field: 'email',
          search: query,
        },
        {
          field: 'state',
          search: query,
        },
        {
          field: 'pin',
          search: query,
        },
        {
          field: 'occupation',
          search: query,
        },
        {
          field: 'income',
          search: query,
        },
      ], false);
    }
  }

}
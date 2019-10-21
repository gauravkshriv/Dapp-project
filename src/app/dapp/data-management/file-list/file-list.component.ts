import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var $: any;
import { LocalDataSource } from 'ng2-smart-table';
import swal from 'sweetalert2';
import { LinkViewComponent, LoaderViewComponent } from 'src/app/components/table-components';
import { AppService, ApiService, UtlService } from 'src/app/_services';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  selectedValue: string;
  selectedCar: string;
  btnDisabled: Boolean = true;
  uploadbtnValue: String = "Upload";
  dataLocation: any;
  dataPurpose: any;
  fileName: String = "";
  uploadedFileName: String = "";
  changeClicked = false;

  file: any;
  fileError: any;
  dataQuality: any = 0;
  dataInfo: any;
  perDataRate: any;
  dataAge: any;
  folder: any;
  dataBankID: any;
  dataBankName: any;
  isLoading = false;
  isRowSelected = false;
  projectList: Array<any> = [];
  underProcessFiles = [];
  intervalId: any;
  settings = {
    selectMode: 'multi', // single | multi
    actions: {
      custom: [
        { name: 'INFO', title: '<i class="fa fa-info-circle" title="More Info"></i>' },
        { name: 'DOWNLOAD', title: '<i class="fa fa-download" title="Download"></i>' },
        { name: 'DELETE', title: '<i class="fa fa-trash" title="Delete"></i>' },
      ],
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },
    columns: {
      dataTag: {
        title: 'Data Tag',
        type: 'custom',
        filter: false,
        renderComponent: LinkViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            $('#def').val(JSON.stringify(row))
            $('#def').click()
          })
        }
      },
      dataAge: {
        title: 'Data Age',
        filter: false,
      },
      dataPurpose: {
        title: 'Data Purpose',
        filter: false,
      },
      location: {
        title: 'Data Location',
        filter: false,
      },
      data_Quality: {
        title: 'Data Quality',
        filter: false,
      },
      processingStatus: {
        title: 'Processing Status',
        type: 'custom',
        filter: false,
        renderComponent: LoaderViewComponent,
      },
      allocatedTo: {
        title: 'Allocated To',
        filter: false,
      },
    }
  };
  tableData = [];
  tableSource: LocalDataSource = new LocalDataSource();
  selectedFile: any;
  constructor(
    private utlServices: UtlService,
    private appServices: AppService,
    private apiServices: ApiService,
  ) {
    if (this.appServices.currentDataBank && this.appServices.currentFolder) {
      this.dataBankName = this.appServices.currentDataBank;
      this.folder = this.appServices.currentFolder;
    } else {
      let url = this.appServices.getRouterURL();
      let urlArray = url.split('/');
      this.folder = this.appServices.currentFolder = urlArray[urlArray.length - 1]
      this.dataBankName = this.appServices.currentDataBank = urlArray[urlArray.length - 2]
    }
  }
  async ngOnInit() {

    this.getAllFileByUUID()
    $('.mdb-select').materialSelect();
    let resPro = await this.apiServices.viewAllProject(0, 100000)
    this.projectList = resPro.data.extraData.ProjectInfo.filter(x => x.step == 4)
    // this.allocateDataTo(this.projectList[0],1)
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  getAllFileByUUID() {
    this.isLoading = true;
    this.apiServices.getAllFileByDBNameFolder(this.dataBankName, this.folder)
      .then(res => {
        this.isLoading = false;
        console.log(res.data);
        if (res.data.status && res.data.statusCode === 200) {
          this.appServices.allDataBankFiles = res.data.extraData.DataInfo;
          this.formatAllFiles(res.data.extraData.DataInfo);
        } else {
          this.appServices.handleOtheException(res.data.exception)
        }
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  formatAllFiles(dataList) {
    this.tableData = [];
    if (dataList.length) {
      dataList.forEach((data, i) => {
        this.pushMethod(data);
        if (i == dataList.length - 1) {
          this.tableSource.load(this.tableData);
        }
      })
    }
  }
  pushMethod(data) {
    this.tableData.push({
      dataTag: data.dataInfo.dataTag,
      dataAge: data.dataInfo.dataAge,
      dataPurpose: data.dataInfo.dataPurpose.dataPurpose,
      data_Quality: data.dataInfo.dataQuality == "FRESH" ? "Fresh" : "Re-Cycled",
      dataQuality: data.dataInfo.dataQuality,
      dataCount: data.dataInfo.dataCount,
      ratePerData: data.dataInfo.ratePerData,
      dataType: data.dataInfo.dataType.dataType,
      location: this.utlServices.state.find(v => v.value == data.location).name,
      dataFileUrl: data.dataInfo.dataFileUrl,
      processingStatus: data.dataInfo.processingStatus,
      fileName: data.dataInfo.fileName,
      created: new Date(data.dataInfo.created).toLocaleString(),
      updated: new Date(data.dataInfo.updated).toLocaleString(),
      allocatedTo: 'N/A'
    })
  }
  checkFileProcessingStatus(dataTag) {
    console.log('going to check for', dataTag);
    this.intervalId = setInterval(() => {
      this.apiServices.getFileByDataTag(dataTag)
        .then(res => {
          console.log('getFileByDataTag response', res.data);
          if (res.data.status && res.data.statusCode === 200) {
            if (res.data.extraData.DataInfo.processingStatus) {
              // console.log('processingStatus    okkkkkkkkkkk',true);

              this.tableData.forEach((data, i) => {
                // console.log('data.dataTag',false);

                if (data.dataTag == dataTag) {
                  console.log('data.dataTag>>>>>>>>>>>>>>>>>>>>', true);
                  this.tableData[i].processingStatus = true;
                  this.tableSource.load(this.tableData);
                  $('#parseInfo').click();
                  clearInterval(this.intervalId)
                  return;
                }
              })
            }
            // else console.log('processingStatus',false);
          } else {
            clearInterval(this.intervalId)
            this.appServices.handleOtheException(res.data.exception)
          }
        }).catch(err => {
          this.isLoading = false;
          this.appServices.handleNetworkException(err);
        })
    }, 3000)
  }
  uploadFile() {
    let ownerUuid = JSON.parse(this.appServices.getUser()).uuid;
    this.btnDisabled = true;
    this.uploadbtnValue = "Uploading..";
    let body = new FormData();
    body.append('file', this.file)
    body.append('dataAge', this.dataAge)
    body.append('dataPurpose', this.dataPurpose)
    body.append('dataType', this.folder)
    body.append('perDataRate', this.perDataRate)
    body.append('dataQuality', this.dataQuality)
    body.append('dataLocation', this.dataLocation)
    body.append('ownerUuid', ownerUuid)
    this.apiServices.uploadFileandDataParsing(this.dataBankID, body)
      .then(apiResult => {
        let data = apiResult.data;
        console.log('apiResilfdffdfdf', data);
        if (data.status && data.statusCode === 200) {
          let dataTag = data.extraData.DataInfo.dataInfo.dataTag;
          this.appServices.allDataBankFiles.push(data.extraData.DataInfo);
          this.pushMethod(data.extraData.DataInfo)
          this.tableSource.load(this.tableData);
          this.checkFileProcessingStatus(dataTag)
          $('#newFileDBModal').modal('hide');
          $('#fileUploadInfo').click();
        } else if (data.exception == 'FATAL_EXCEPTION' || data.exception == 'FILE_NOT_VALID_FORMATE') {
          this.uploadbtnValue = "Upload";
          $('#invalidFileInfo').click()
        } else {
          this.appServices.handleOtheException(apiResult.data.exception)

        }
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err);
      })
    // console.log('going to send ',body);
    // setTimeout(() => {
    //   this.btnDisabled =false;
    // this.uploadbtnValue ="Upload";
    // }, 5000); 
  }

  numKeyup(e) {
    this.validateForm()
  }
  numKeyPress(e) {
    var k = e.which;
    let length = e.target.value.trim().length;
    if (length > 1)
      e.preventDefault();
    var ok = (k >= 48 && k <= 57) ||  // 0-9
      k == 8 ||  // Backspaces
      k == 9 ||  //H Tab
      k == 0 ||  //H Tab
      k == 11 ||  //V Tab
      k == 32 ||  // Space
      k == 127;   //Delete
    if (!ok) {
      e.preventDefault();
    }
  }

  inputFile(e) {
    this.fileError = '';
    if (e.target.value.length !== 0) {
      let file = e.target.files[0];
      if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        if (file.size > 10485760) {
          this.fileName = "";
          this.fileError = "File Size Should be less than 10 MB."
        } else {
          this.fileName = file.name;
          this.file = file;
          this.validateForm()
        }
      } else {
        this.fileName = "";
        this.fileError = "File Type Should be xlsx or xls only."
      }
      console.log(e.target.files[0]); //   application/vnd.ms-excel
    } else {
      this.fileName = "";
      this.fileError = "Please select file."
    }
  }
  slectChange(e) {
    this.validateForm()
  }
  validateForm() {
    if (this.dataAge && this.dataAge !== ""
      && this.dataPurpose && this.dataPurpose !== ""
      && this.dataLocation && this.dataLocation !== ""
      && this.perDataRate && this.perDataRate !== ""
      && this.fileName && this.fileName !== "")
      this.btnDisabled = false;
    else this.btnDisabled = true;
  }
  dataQualityChecked(data_Quality) {
    this.dataQuality = parseInt(data_Quality, 10)
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
          return this.apiServices.deleteDataFile(e.data.dataTag)
        }
      }).then(result => {
        if (result.value) {
          swal.close()
          let data = result.value.data;
          if (data.status && data.statusCode == 200 && data.successCode == "API_SUCCESS") {
            $('#deleteInfo').click()
            this.tableSource.remove(e.data)
          } else {
            this.appServices.handleOtheException(result.value.data.exception)
          }
        }
      }).catch(err => {
        this.appServices.handleNetworkException(err);
      })
    } else if (e.data.processingStatus) {
      if (e.action === 'DOWNLOAD') {
        window.open(e.data.dataFileUrl);
        $('#downloadInfo').click();
      } else {
        this.dataInfo = e.data;
        this.changeClicked = false;
        console.log('this.dataInfo', this.dataInfo);
        $('#modalInfo').modal('show');
        // this.router.navigate(['/datamanagement/databank/'+this.dataBankName+'/'+this.folder+'/'+e.data.dataTag])
      }
    } else {
      $('#processInfo').click()
    }
  }
  openNewFileModal() {
    this.updateDbObjectId();
  }
  updateDbObjectId() {
    this.isLoading = true;
    this.apiServices.getAllDataBank()
      .then(res => {
        console.log('res.data', res.data);
        this.isLoading = false;
        if (res.data.status && res.data.statusCode == 200) {
          let allDBs = res.data.extraData.DataRequestInfo;
          if (allDBs) {
            let row = allDBs.find(x => x.dataBankName == this.dataBankName)
            if (row) {
              this.dataBankID = row.objectId;
              this.dataAge = "";
              this.perDataRate = "";
              this.fileName = "";
              this.uploadbtnValue = 'Upload';
              this.btnDisabled = true;
              $('#newFileDBModal').modal('show');
            } else $('#dbnotfounderr').click()
          } else $('#dbnotfounderr').click()
        } else this.appServices.handleOtheException(res.data.exception)
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  changeFileName(dataInfo) {
    // this.dataInfo = dataInfo;
    this.uploadedFileName = dataInfo.fileName;
    // console.log(' dataInfo.fileName', dataInfo.fileName);
    this.changeClicked = true;
    // if (!$("#fn").is(":focus")) {
    //   console.log('??????????????????????????????????????????????????????????/');
    //   
    // }
    $("#fn").click()
  }
  updateName(dataInfo) {
    if (this.uploadedFileName == dataInfo.fileName) {
      $('#defInfo').click(); return;
    }
    this.isLoading = true;
    this.apiServices.updateDataBankFileName(dataInfo.dataTag, this.uploadedFileName)
      .then(res => {
        this.isLoading = false;
        console.log(res.data);
        if (res.data.status && res.data.statusCode === 200) {
          this.dataInfo.fileName = this.uploadedFileName;
          this.changeClicked = false;
          $('#renameInfo').click(); return;
        } else {
          this.appServices.handleOtheException(res.data.exception)
        }
      }).catch(err => {
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
  }
  onSearch(query: string = '') {
    // console.log(query);
    if (query === '') {
      console.log('zhjkjhcvbnm,');
      this.tableSource.reset()

    }
    else {
      this.tableSource.setFilter([
        {
          field: 'DataTag',
          search: query,
        },
        {
          field: 'dataAge',
          search: query,
        },
        {
          field: 'dataPurpose',
          search: query,
        },
        {
          field: 'data_Quality',
          search: query,
        },
        {
          field: 'location',
          search: query,
        },
      ], false);
    }
  }
  viewData(data) {
    let rowData = JSON.parse(data);
    let url = 'dapp/datamanagement/databank/' + this.appServices.currentDataBank + '/RAW/' + rowData.dataTag;
    this.appServices.currentDataTag = rowData.dataTag;
    this.appServices.routTo(url);
  }
  onUserRowSelect(e) {
    console.log('eeeeeeeeeeeeeee', e);
    if (e.selected.length) {
      this.isRowSelected = true;
      this.selectedFile = e.selected;
    } else {
      this.isRowSelected = false;
    }
  }
  project: any;
  naRaSc(team: Array<any>) {
    let NA = [], RA = [], SC = [];
    team.forEach(t => {
      
      if (t.roles.includes("NA")) {
        NA.push(t)
      } else if (t.roles.includes("RA")) {
        RA.push(t)
      } else if (t.roles.includes("SC")) {
        SC.push(t)
      }
    })
    return { NA, RA, SC }
  }
  getNaRaSc(projectTeamTask: any) {
    let NA = [], RA = [], SC = [];
    if (projectTeamTask.brokingConsultant.length) {
      let NaRaSc = this.naRaSc(projectTeamTask.brokingConsultant)
      NA = NaRaSc.NA; RA = NaRaSc.RA; SC = NaRaSc.SC;
    }
    if (projectTeamTask.digitalMarketing.length) {
      let NaRaSc = this.naRaSc(projectTeamTask.digitalMarketing)
      if (NaRaSc.NA.length) NA.push(...NaRaSc.NA)
      if (NaRaSc.RA.length) RA.push(...NaRaSc.RA)
      if (NaRaSc.SC.length) SC.push(...NaRaSc.SC)
    }
    if (projectTeamTask.legalConsultant.length) {
      let NaRaSc = this.naRaSc(projectTeamTask.legalConsultant)
      if (NaRaSc.NA.length) NA.push(...NaRaSc.NA)
      if (NaRaSc.RA.length) RA.push(...NaRaSc.RA)
      if (NaRaSc.SC.length) SC.push(...NaRaSc.SC)
    }
    return { NA, RA, SC }
  }
  allocateDataIn(project) {
    let naRaSc = this.getNaRaSc(project.projectTeamTask);

    project.NA = naRaSc.NA;
    project.RA = naRaSc.RA;
    project.SC = naRaSc.SC;

    this.project = project;
    console.log(naRaSc);

    $('#allocateData').modal('show')
  }
  async allocateDataTo(userList, teamRole){
    console.log(userList,this.project);
    let body = {
        "uuid":this.appServices.getUserInfo().uuid,
        "projectId":this.project.projectID,
        "projectTeamMember":[
          {
            "userMemberCode":userList.memberCode,
            "fullName":userList.fullname,
            "userUuid":userList.uuid
          }
        ],
        "dataTag":[this.selectedFile[0].dataTag],
        "rowId":[],
        "shareMode":0,
        "teamRole":teamRole
    }
    let res = await this.apiServices.allocateData(body)
    console.log(res.data);
    
  }
}


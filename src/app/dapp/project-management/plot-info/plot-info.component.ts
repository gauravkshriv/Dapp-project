import { Component, OnInit } from '@angular/core';
import { AppService, ApiService } from 'src/app/_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
declare var $:any;

@Component({
  selector: 'app-plot-info',
  templateUrl: './plot-info.component.html',
  styleUrls: ['./plot-info.component.scss']
})
export class PlotInfoComponent implements OnInit {
  ploting:any;
  plotId:any;
  plotVarId : any;
  inventoryId:any;
  bookingFiles : Array<any> = [];
  registryDocuments : Array<any> = [];

  bookedDataRecordFormGroup:FormGroup;
  deliveredDataRecordFormGroup:FormGroup;
  cancelledDateFormGroup:FormGroup;

  bookedDataRecord = {
    bookedBy: "",
    bookedTo: "",
    bookingDate: new Date(),
    bookingPrice: "",
    modeOfPayment: "",
    paymentRefId: "",
    expectedRegistryDate: "",
    bookingFiles: [],
    comments: ""
  };
  deliveredDataRecord = {
    mutationStatus:"",
    bookingDate:new Date(),
    modeOfPayment:"",
    paymentRefId:"",
    registryDate:"",
    registryDocuments:[],
    saleDeedPrice:"",
    deedPreparedBY:"",
    khataNumber:"",
    khesraNumber:"",
    rakwa:"",
    locationOnMap:""
  };
  cancelledDataRecord = {
    cancelledDate:new Date(),
    comments:""
  }
  isFileUploaded: boolean = false;
  isLoading: boolean = false;
  avStatus : number = 1;
  imgUrl: any;
  constructor(
    private appServices : AppService,
    private apiServices : ApiService,
    private formBuilder : FormBuilder,
  ) {
    this.checkRouter()
  }

  ngOnInit() {
    this.getPlotInfo()
    this.bookedDataRecordFormGroup = this.formBuilder.group({
      bookedBy: ['',Validators.required],
      bookedTo: ['',Validators.required],
      bookingDate: ['',Validators.required],
      bookingPrice: ['',Validators.required],
      modeOfPayment: ['',Validators.required],
      paymentRefId: ['',Validators.required],
      expectedRegistryDate: ['',Validators.required],
    })
    this.deliveredDataRecordFormGroup = this.formBuilder.group({
      bookingDate:['',Validators.required],
      modeOfPayment:['',Validators.required],
      paymentRefId:['',Validators.required],
      registryDate:['',Validators.required],
      saleDeedPrice:['',Validators.required],
      deedPreparedBY:['',Validators.required],
      khataNumber:['',Validators.required],
      khesraNumber:['',Validators.required],
      rakwa:['',Validators.required],
      locationOnMap:['',Validators.required]
    })
    this.cancelledDateFormGroup = this.formBuilder.group({
      cancelledDate : ['',Validators.required],
      comments : ['', Validators.required]
    })
  }
  checkRouter(){
    let invtId = this.appServices.getInventoryId()
    if(invtId){  
      this.inventoryId = invtId; 
      if(this.appServices.getplotVarId()) this.plotVarId = this.appServices.getplotVarId();
      else {
        let url = this.appServices.getRouterURL();
        let urlArray = url.split('/');
        this.plotVarId =urlArray[urlArray.length -1]
        this.appServices.setplotVarId(this.plotVarId)
      }
    } else {
      let url = this.appServices.getRouterURL();
      let urlArray = url.split('/');
      urlArray.splice(urlArray.length-1,1)
      url = urlArray.join('/')
      this.appServices.routTo(url)
    }
  }
  getPlotInfo() {
    this.isLoading = true;
    this.apiServices.viewPlotByVariationId(this.plotVarId)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode == 200){
        this.formatPlot(res.data.extraData.Status)
        $('#deliverModal').modal('hide');
        $('#bookModal').modal('hide');
        $('#cancelModal').modal('hide');
      } else this.appServices.handleOtheException(res.data.exception)
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err)
    })
  }
  formatPlot(plotting: any) {
    plotting.inventoryMapper.forEach((plot,i) => {
      if(plotting.inventoryMapper[i].bookedDataRecord){
        plotting.inventoryMapper[i].bookedDataRecord.bookingDate = new Date(plot.bookedDataRecord.bookingDate).toLocaleString()
        plotting.inventoryMapper[i].bookedDataRecord.expectedRegistryDate = new Date(plot.bookedDataRecord.expectedRegistryDate).toLocaleString()  
      } if(plotting.inventoryMapper[i].deliveredDataRecord){
          plotting.inventoryMapper[i].deliveredDataRecord.bookingDate = new Date(plot.deliveredDataRecord.bookingDate).toLocaleString()
          plotting.inventoryMapper[i].deliveredDataRecord.registryDate = new Date(plot.deliveredDataRecord.registryDate).toLocaleString()  
      } if(plotting.inventoryMapper[i].cancelledDataRecord)
          plotting.inventoryMapper[i].cancelledDataRecord.cancelledDate = new Date(plot.cancelledDataRecord.cancelledDate).toLocaleString()
  
    });
    this.ploting = plotting;
  }
  getChangeInvt(status){
    let user = this.appServices.getUserInfo()
    this.bookedDataRecord.bookingFiles = this.bookingFiles.map(f=>f.fileUrl)
    this.deliveredDataRecord.registryDocuments = this.registryDocuments.map(f=>f.fileUrl)
    if(user){
      let body = {
        "uuid": user.uuid,
        "avStatus": this.avStatus,
        "inventoryId": this.inventoryId,
        "plotId": this.plotId,
        "bookedDataRecord": status == 'book' ? this.bookedDataRecord : null,
        "deliveredDataRecord": status == 'delivered' ? this.deliveredDataRecord : null,
        "cancelledDataRecord": status == 'cancel' ? this.cancelledDataRecord : null
      }; return body;
    } ; return false;
  }
  bookPlot(){
    if(!this.isFileUploaded){
      console.log(this.getChangeInvt('book'),this.bookedDataRecordFormGroup)
      if(this.bookedDataRecordFormGroup.valid){
        this.isLoading = true;
        this.apiServices.updateInventoryStatus(this.getChangeInvt('book'))
        .then(res=>{
          this.isLoading = false;
          console.log(res.data);
          if(res.data.status && res.data.statusCode == 200){
            this.getPlotInfo() 
          } else this.appServices.handleOtheException(res.data.exception)
        }).catch(err=>{
          this.isLoading = false;
          this.appServices.handleNetworkException(err)
        })
      } else $('#formError').click()
    } else $('#uploadFileInfo').click()
  }
  deliverPlot(){
    if(!this.isFileUploaded){
      console.log(this.getChangeInvt('delivered'),this.deliveredDataRecord)
      if(this.deliveredDataRecordFormGroup.valid){
        this.isLoading = true;
        this.apiServices.updateInventoryStatus(this.getChangeInvt('delivered'))
        .then(res=>{
          this.isLoading = false;
          console.log(res.data);
          if(res.data.status && res.data.statusCode == 200){
            this.getPlotInfo() 
          } else this.appServices.handleOtheException(res.data.exception) 
        }).catch(err=>{
          this.isLoading = false;
          this.appServices.handleNetworkException(err)
        })
      } else $('#formError').click()
    } else $('#uploadFileInfo').click()
  }
  onFileSelected(e, type){
    if(e.target.files.length){
      this.validateProjectFile(e.target.files, type)
      if(type == 'book'){
        if(this.bookingFiles.length){
          this.bookingFiles.forEach((file,i) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
              this.bookingFiles[i]["url"]=e.target.result
            }
            reader.readAsDataURL(file);
          });        
        }
      } else {
        if(this.registryDocuments.length){
          this.registryDocuments.forEach((file,i) => {
              let reader = new FileReader();
              reader.onload = (e: any) => {
              this.registryDocuments[i]["url"]=e.target.result
            }
            reader.readAsDataURL(file);
          });        
        }
      }
    }
  }
  validateProjectFile(files: any, type) {
    if(type == 'book') this.bookingFiles = []
    else this.registryDocuments = []
    for (let i = 0; i < files.length; i++) {
      if(i<10){
        let file  = files[i];
        if(file.size >5242880){
          $('#fileSizeError').click()
        } else {
          if(file.type != "image/jpg" || file.type != "image/png" || file.type != "image/jpeg"){
            if(type == 'book') this.bookingFiles.push(file)
            else this.registryDocuments.push(file)
          } else  $('#fileTypeError').click()
        }
      } else $('#maxFileLimit').click()
    }
  }
  uploadFiles(type){
    if(type == 'book'){
      if(this.bookingFiles.length){
        if(!this.isFileUploaded){      
          let body = new FormData()
          this.bookingFiles.forEach( file=> {
            body.append('file',file)
          });
          this.uploadFilesToS3(body, type)
        } else {
          $('#fileAlreadyUp').click()
        }
      } else {
        $('#chooseFile').click()
      }
    } else {
      if(this.registryDocuments.length){
        if(!this.isFileUploaded){      
          let body = new FormData()
          this.registryDocuments.forEach( file=> {
            body.append('file',file)
          });
          this.uploadFilesToS3(body, type)
        } else {
          $('#fileAlreadyUp').click()
        }
      } else {
        $('#chooseFile').click()
      }
    }
    
  }
  uploadFilesToS3(body: FormData, type) {
    this.isLoading = true;
    this.apiServices.uploadprojectGallery(body)
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode == 200){
        $('#fileUpSuss').click()
        this.isFileUploaded = false;
        let fileUrl = res.data.extraData.FileUrl;
        fileUrl.forEach( (url,i)=> {
          if(type == 'book') this.bookingFiles[i]["fileUrl"] = url;
          else this.registryDocuments[i]["fileUrl"] = url;
        });
      } else {
        this.appServices.handleOtheException(res.data.exception)
      }
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err)
    })
  }
  removeFile(file, type){
    if(type == 'book'){
      let i = this.bookingFiles.indexOf(file)
      if(i > -1){
        this.bookingFiles.splice(i,1)
        if(!this.bookingFiles.length)
          this.isFileUploaded= false;
      }
    } else {
      let i = this.registryDocuments.indexOf(file)
      if(i > -1){
        this.registryDocuments.splice(i,1)
      }
    }
  }
  availablePlot(plot){
    this.plotId = plot.plotId;
    this.avStatus = 0;
    console.log(this.getChangeInvt('available'))
    this.isLoading = true;
    this.apiServices.updateInventoryStatus(this.getChangeInvt('available'))
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode == 200){
        this.getPlotInfo()  
      } else this.appServices.handleOtheException(res.data.exception) 
    }).catch(err=>{
      this.isLoading = false;
      this.appServices.handleNetworkException(err)
    })
  }
  cancelPlot(){
    if(this.cancelledDateFormGroup.valid){
      this.isLoading = true;
      this.apiServices.updateInventoryStatus(this.getChangeInvt('cancel'))
      .then(res=>{
        this.isLoading = false;
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          this.getPlotInfo() 
        } else this.appServices.handleOtheException(res.data.exception) 
      }).catch(err=>{
        this.isLoading = false;
        this.appServices.handleNetworkException(err)
      })
    } else $('#formError').click()
  }
  openBookingModal(plot){
    this.avStatus = 1;
    this.plotId = plot.plotId;
    // console.log(this.plotId);
    $('#bookModal').modal('show');
  }
  openDeliverModal(plot){
    this.avStatus = 2;
    this.plotId = plot.plotId;
    // console.log(this.plotId);
    $('#deliverModal').modal('show');
  }
  openCancelModal(plot){
    this.avStatus = 3;
    this.plotId = plot.plotId;
    // console.log(this.plotId);
    $('#cancelModal').modal('show');
  }
  opemLightBox(url){
    this.imgUrl = url;
    $('#lightBox').modal('show')
  }

}

import { Component, OnInit } from '@angular/core';
import { AppService, ApiService } from 'src/app/_services';

@Component({
  selector: 'app-datarequest-info',
  templateUrl: './datarequest-info.component.html',
  styleUrls: ['./datarequest-info.component.scss']
})
export class DatarequestInfoComponent implements OnInit {
  isLoading = false;
  requsetInfo:any;
  requestId:any;
  commentInput:String = "";
  sendBtnValue = "Send";
  intervalId :any;
  comments:Array<any> = [];
  myUuid:any;
  constructor(
    private appServices : AppService,
    private apiServices : ApiService
  ) { 
    this.checkRout()
  }

  ngOnInit() {
    this.isLoading = true;
    this.viewDataRequestByRequestId()
    this.startChat()
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
  startChat(){
    this.intervalId = setInterval(()=>{
      this.viewDataRequestByRequestId()
    },8000)
  }
  viewDataRequestByRequestId(){
    this.apiServices.viewDataRequestByRequestId(this.requestId)
    .then(res=>{
    this.isLoading = false;
      console.log(res.data);
      if(res.data.status){
        if(!this.requsetInfo){
          this.requsetInfo = res.data.extraData.DataRequestInfo;
        }
        this.comments = res.data.extraData.DataRequestInfo.comment;
        this.comments.forEach((c,i)=>{
          this.comments[i].created = new Date(c.created).toLocaleString()
        })
        this.comments.reverse();
      }
    }).catch(err=>{
      this.isLoading = false;
      console.log(err);
      this.appServices.handleNetworkException(err)
    })
  }
  checkRout(){
    this.myUuid = JSON.parse(this.appServices.getUser()).uuid;
    console.log('this.myUuid',this.myUuid);
    let url = this.appServices.getRouterURL();
    let urlArray = url.split('/');
    this.requestId =urlArray[urlArray.length -1];
    this.appServices.requestId =this.requestId;
  }
  sendComment(){
    if(!(this.commentInput.trim() === '')){
      this.commentInput = this.commentInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      this.sendBtnValue = 'Sending..'
      this.apiServices.updateComment(this.requestId,this.commentInput)
      .then(res=>{
        console.log(res.data);
        this.sendBtnValue = 'Send';
        if(res.data.status && res.data.statusCode == 200){
          this.commentInput = '';
          this.viewDataRequestByRequestId()
        } else {
          this.appServices.handleOtheException(res.data.exception)
        }
      }).catch(err=>{
        this.isLoading = false;
        console.log(err);
        this.appServices.handleNetworkException(err)
      })
      // console.log('this.commentInput.',this.commentInput);
      // setTimeout(() => {
      //   this.sendBtnValue = 'Send';
      // }, 3000);
     
    } else this.commentInput = "";
  }

}

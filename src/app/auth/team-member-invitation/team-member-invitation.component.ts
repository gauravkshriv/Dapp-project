import { Component, OnInit } from '@angular/core';
import { AppService, ApiService } from 'src/app/_services';
import { ActivatedRoute, Params } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-team-member-invitation',
  templateUrl: './team-member-invitation.component.html',
  styleUrls: ['./team-member-invitation.component.scss']
})
export class TeamMemberInvitationComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private appServices : AppService,
    private apiServices : ApiService
  ) { 
    this.getRoutData()
  }
  
  ngOnInit() {

  }
  getRoutData() {
    this.activatedRoute.queryParams.subscribe( (params: Params) => {
      let name = params['name'];
      let invitationStatus = params['invitationStatus'];
      let memberCode = params['memberCode'];
      let senderUuid = params['senderUuid'];
      if(name && invitationStatus && memberCode && senderUuid){
        swal({
          title: 'Please wait..',
          html: 'Processing data..',
          onBeforeOpen: () => {
            swal.showLoading()
          }
        })
        this.apiServices.teamMemberApproveOrReject(invitationStatus,memberCode,senderUuid)
        .then(res=>{
          if(res.data.status && res.data.statusCode == 200){
            let statusText = invitationStatus == "1" ? 'Accepted':'Rejected';
            swal({
              title : statusText,
              text : 'Team Member Invitation '+statusText+' Successfully',
              confirmButtonText : 'Go To Dashboard',
              showCancelButton:true,
              cancelButtonText : 'Not Now',
              cancelButtonColor:'#f31616',
              confirmButtonColor:'#0278e8',
              allowEscapeKey:false,
              type : 'success',
              allowOutsideClick : false,
            }).then(result=>{
              if(result.value) this.appServices.goHome()
              else this.appServices.goHome()
            })
          } else if(res.data.exception== "ALREADY_ACCEPT_REQUEST"){
            let statusText = invitationStatus == "1" ? 'Accepted':'Rejected';
            swal({
              title : 'Already '+ statusText,
              text : 'Team Member Invitation already '+statusText,
              confirmButtonText : 'Go To Dashboard',
              showCancelButton:true,
              cancelButtonText : 'Not Now',
              cancelButtonColor:'#f31616',
              confirmButtonColor:'#0278e8',
              allowEscapeKey:false,
              type : 'success',
              allowOutsideClick : false,
            }).then(result=>{
              if(result.value) this.appServices.goHome()
              else this.appServices.goHome()
            })
          }  else if(res.data.exception== "ALREADY_REJECT_REQUEST"){
            let statusText = invitationStatus == "1" ? 'Accepted':'Rejected';
            swal({
              title : 'Already '+ statusText,
              text : 'Team Member Invitation already '+statusText,
              confirmButtonText : 'Go To Dashboard',
              showCancelButton:true,
              cancelButtonText : 'Not Now',
              cancelButtonColor:'#f31616',
              confirmButtonColor:'#0278e8',
              allowEscapeKey:false,
              type : 'success',
              allowOutsideClick : false,
            }).then(result=>{
              if(result.value) this.appServices.goHome()
              else this.appServices.goHome()
            })
          } else if(res.data.exception== "TEAM_MEMBER_NOT_FOUND"){
            this.otherExc(res.data.exception)
          }  else if(res.data.exception== "SENDER_DETAILS_NOT_FOUND"){
            this.otherExc(res.data.exception)
          } 
        }).catch(err=>{
          console.log('errrr',err);
          this.appServices.handleNetworkException(err)
        })
      } else this.appServices.goHome()



    })
  }
  otherExc(exc){
    let EXC = {
      TEAM_MEMBER_NOT_FOUND:'Team Member Not Found',
      SENDER_DETAILS_NOT_FOUND:'User Details Not Found',
    }
    swal({
      title : EXC[exc],
      confirmButtonText : 'Go To Dashboard',
      showCancelButton:true,
      cancelButtonText : 'Not Now',
      cancelButtonColor:'#f31616',
      confirmButtonColor:'#0278e8',
      allowEscapeKey:false,
      type : 'error',
      allowOutsideClick : false,
    }).then(result=>{
      if(result.value) this.appServices.goHome()
      else this.appServices.goHome()
    })
  }
}

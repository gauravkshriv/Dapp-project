import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ViewCell } from "ng2-smart-table";

@Component({
    selector: 'loader-view',
    template: `
      <i *ngIf="renderValue === false" class= "_loader fas fa-sync fa-spin"></i>
      <span  *ngIf="renderValue === true">PARSED</span>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class LoaderViewComponent implements  OnInit {
    renderValue: any;
    @Input() value: string | number;
    ngOnInit() {
      this.renderValue = this.value;
      // console.log('this.renderValue',this.renderValue);
    }
  }
  @Component({
    selector: 'status-view',
    template: `
      <span *ngIf="renderValue == 'Accepted'" class="badge badge-success">Accepted</span>
      <span *ngIf="renderValue == 'Rejected'" class="badge badge-danger">Rejected</span>
      <span *ngIf="renderValue == 'Pending'" class="badge badge-warning">Pending</span>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class StatusViewComponent implements OnInit {
    renderValue: any;
    @Input() value: string | number;
    ngOnInit() {
      this.renderValue = this.value;
      // console.log('this.renderValue>>>>>>>>>>>>>>>',this.renderValue); 
    }
  }
  @Component({
    selector: 'link-list',
    template: `
    <span *ngIf="renderValue && renderValue.length == 0">Project Not Assigned</span>
    <a *ngIf="renderValue && renderValue.length == 1" class="dataTag" (click)="onClick(renderValue[0])">{{ renderValue[0] }}</a>
    <div class="dropdown" *ngIf="renderValue && renderValue.length > 1">
        <span class="dataTag dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">{{renderValue[0]}}</span>
        <div class="dropdown-menu dropdown-primary p-1">
          <b class="">Lest's See Project Information</b>
          <a *ngFor="let pid of renderValue" (click)="onClick(pid)" class="dropdown-item p-1">{{pid}}</a>
        </div>
      </div>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class LinkListComponent implements OnInit {
    renderValue: any;
    @Input() value: any;
    @Input() rowData: any;
    @Output() save: EventEmitter<any> = new EventEmitter();
    ngOnInit() {
      this.renderValue = this.value;
    }
    onClick(pid){
      this.save.emit({projectId:pid,rowData: this.rowData}) 
    }
  }
  @Component({
    selector: 'change-inv-status',
    template: `
    <span *ngIf="renderValue !== 'Pending'" class="badge p-2" [ngClass]="(renderValue=='Accepted')?'badge-success':'badge-danger'">{{renderValue}}</span>
    <div class="dropdown" *ngIf="renderValue == 'Pending'">
        <span class="badge badge-warning p-2 dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">{{renderValue}}</span>
        <div class="dropdown-menu dropdown-primary p-1">
          <a (click)="onClick('Accept')" class="dropdown-item p-1">Accept</a>
          <a (click)="onClick('Reject')" class="dropdown-item p-1">Reject</a>
        </div>
      </div>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class ChangeInvStatusComponent implements OnInit {
    renderValue: any;
    @Input() value: string | number;
    @Input() rowData: any;
    @Output() save: EventEmitter<any> = new EventEmitter();
    ngOnInit() {
      this.renderValue = this.value;
    }
    onClick(status){
      this.save.emit({status:status,rowData: this.rowData})
    }
  }
  @Component({
    selector: 'image-view',
    template: `
      <div class="image-name">
      <img (click)="onClick()" src="{{renderValue || defaultImage}}" alt="defaultImage" />
      <span>{{fullName}}</span>
    </div>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class ImageViewComponent implements OnInit {
    defaultImage = 'assets/images/img_avatar_he.png';
    renderValue: any;
    fullName :any;
    @Input() value: string | number;
    @Input() rowData: any;
    @Output() save: EventEmitter<any> = new EventEmitter();
    ngOnInit() {
      this.renderValue = this.rowData.profilePic;
      this.fullName = this.rowData.fullName;
    }
    onClick(){
      this.save.emit(this.rowData)
    }
  }
  @Component({
    selector: 'loader-view',
    template: `<a class="dataTag"  title="View Details" (click)="onClick()">{{ renderValue }}</a>`,
    styleUrls: ['./table-components.scss']
  })
  export class LinkViewComponent implements ViewCell, OnInit {
    renderValue: any;
    @Input() value: any;
    @Input() rowData: any;
    @Output() save: EventEmitter<any> = new EventEmitter();
    constructor(){ }
    ngOnInit() {
      this.renderValue = this.value;
      // console.log('this.renderValue',this.renderValue, this.rowData);
    }
    onClick() {
      this.save.emit(this.rowData)
    }
  }

  @Component({
    selector: 'member-status-view',
    template: `
      <span *ngIf="renderValue == 'Active'" class="badge badge-success">Active</span>
      <span *ngIf="renderValue == 'Suspended'" class="badge badge-danger">Suspended</span>
      <span *ngIf="renderValue == 'Inactive'" class="badge badge-warning">Inactive</span>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class MemberStatusViewComponent implements ViewCell, OnInit {
    renderValue: any;
  
    @Input() value: string | number;
    @Input() rowData: any;
  
    // @Output() save: EventEmitter<any> = new EventEmitter();
  
    ngOnInit() {
      this.renderValue = this.value;
      // console.log('this.renderValue>>>>>>>>>>>>>>>',this.renderValue); 
    }
  }
  
  @Component({
    selector: 'view-more-less',
    template: `
      <span >{{renderValue}}
      <a class="text-info" *ngIf="showViewMoreLess" (click)="moreLess(value)">{{moreLessValue}}</a></span>
    `,
    styleUrls: ['./table-components.scss']
  })
  export class ViewMoreLessComponent implements OnInit {
    isMore = true;
    showViewMoreLess = false;
    renderValue:any;
    moreLessValue: string = 'More';
    @Input() value: string | number;
    ngOnInit() {
      this.moreLess(this.value)
    }
    trun (str,n){
      return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }
    moreLess(value){      
      if(value.length>30){
        this.showViewMoreLess = true;
        this.isMore = !this.isMore;
        if(this.isMore){
          this.moreLessValue = "Less"
          this.renderValue = this.value;
        } else {
          this.moreLessValue = "More"
          this.renderValue = this.trun(this.value,30)
        }
      } else {
        this.showViewMoreLess = false;
        this.renderValue = this.value;
      }
    }
  }
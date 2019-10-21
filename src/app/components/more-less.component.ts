import { Component, Input, ElementRef, OnChanges} from '@angular/core';

@Component({    
    selector: 'read-more',
    template: `
    <span >{{renderValue}}
    <a class="text-info" *ngIf="showViewMoreLess" (click)="moreLess(value)">{{moreLessValue}}</a></span>
    `
})
export class ReadMoreComponent  {
    isMore = true;
    showViewMoreLess = false;
    renderValue:any;
    moreLessValue: string = 'More';
    @Input() value: string  = "";
    ngOnInit() {
      this.moreLess(this.value)      
    }
    trun (str,n){
      return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }
    moreLess(value){      
      if(value.length>25){
        this.showViewMoreLess = true;
        this.isMore = !this.isMore;
        if(this.isMore){
          this.moreLessValue = "Less"
          this.renderValue = this.value;
        } else {
          this.moreLessValue = "More"
          this.renderValue = this.trun(this.value,25)
        }
      } else {
        this.showViewMoreLess = false;
        this.renderValue = this.value;
      }
    }
}
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tree-data',
  templateUrl: './tree-data.component.html',
  styleUrls: ['./tree-data.component.scss']
})
export class TreeDataComponent implements OnInit {

  @Input() data;
  _daat = ['d1','d2',4,true];
  _daat1 = [];

  @Output() click = new EventEmitter();
  constructor() {

   }
  ngOnInit() {

  }

  onButtonClick(data){
    this.click.emit(data);
  }
 



}

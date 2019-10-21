import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
})
export class DataManagementComponent implements OnInit {
  constructor(
  ) { 
    console.log('inside data const');

  }

  ngOnInit() {
    console.log('inside data init');

  }
}

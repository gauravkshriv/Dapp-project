import { Component, OnInit } from '@angular/core';
import { AppService, ApiService, UtlService } from 'src/app/_services';
import * as $ from 'jquery';
declare var $;

@Component({
  selector: 'app-team-department',
  templateUrl: './team-department.component.html',
  styleUrls: ['./team-department.component.scss']
})
export class TeamDepartmentComponent implements OnInit {
  



  departmentList: Array<any> = [];
  renameOrCreateBtn: string = "Create";
  newDeptName: string = "";
  oldDeptName: string = "";

  isValidDeptName: boolean = false;
  errorName:any;
  constructor(
    private appServices: AppService,
    private apiServices: ApiService,
    private utlServices: UtlService,

  ) {
    this.initiateData()
  }
  initiateData() {
    this.departmentList = this.utlServices.department
    this.getAllDept()
  }
  
  ngOnInit() {

  }
  getAllDept() {
    this.apiServices.getDepartmentList()
    .then(res=>{
      if(res.data.status && res.data.statusCode == 200){
        res.data.extraData.Team.forEach(d=> this.pushOneDepartment(d));
      }
    })
  }
  updateDept(dept) {
    this.appServices.currentDepartment = dept.route;
    console.log('dept', dept.route);
  }
  addDept() {
    this.newDeptName = '';
    this.renameOrCreateBtn = "Create"
    $('#renameOrCreateModal').modal('show');
  }
  editDept(dept){
    this.renameOrCreateBtn = "Rename";
    this.newDeptName  = this.oldDeptName = dept.name;
    $('#renameOrCreateModal').modal('show');
  }
  craeteOrRenameDept() {
    if(!this.isValidDeptName) {
      this.errorName = "Enter valid department name.";
      return ;
    }
    if(this.renameOrCreateBtn == "Create"){
      this.renameOrCreateBtn = "Loading.."
      this.apiServices.addDepartment(this.newDeptName)
      .then(res=>{
        $('#renameOrCreateModal').modal('hide');
        this.renameOrCreateBtn = "Create";
        if(res.data.status && res.data.statusCode == 200){
          this.pushOneDepartment(res.data.extraData.Team)
        }
      })
    } else {
      this.renameOrCreateBtn = "Loading..";
      this.apiServices.renameDept(this.oldDeptName,this.newDeptName)
      .then(res=>{
        $('#renameOrCreateModal').modal('hide');
        this.renameOrCreateBtn = "Create";
        console.log(res.data);
        if(res.data.status && res.data.statusCode == 200){
          this.initiateData()
        }
      })
    }
    
     
   
  }
  pushOneDepartment(dept){
    let route = dept.departmentName.toLocaleLowerCase().split(' ').join('-');
    this.departmentList.push({ name: dept.departmentName.toLocaleLowerCase(), value: dept.departmentName, route: route, editable:true})
  }
  deptNameKeyPress(e){
    this.errorName = '';
    var k = e.which;
    let value = e.target.value.trim().length;
    if(value.length == 0){
      if((k >= 48 && k <= 57))
          e.preventDefault();
    }
    if(value.length >20)
      e.preventDefault();
    var ok = (k >= 65 && k <= 90) || // A-Z(capital letter alpahabets)
        k >= 97 && k <= 122 || // a-z(small letter alpahabets)
        (k >= 48 && k <= 57) ||  // 0-9
        k == 8 ||  // Backspaces
        k == 9 ||  //H Tab
        k == 0 ||  //H Tab
        k == 11 ||  //V Tab
        k == 32 ||  // Space
        k == 127;   //Delete
    if (!ok) {
    // prevent user to press key 
        e.preventDefault();
    }
  }
  deptNameKeyUp(e){
    if(e.target.value.trim().length >3){
      if(this.departmentList.some(x=>x.name.toLocaleLowerCase() == this.newDeptName.toLocaleLowerCase())){
        this.isValidDeptName = false;
        this.errorName = "This Department Name is already take, Please try another name.";
      } else {
        this.isValidDeptName = true;
        this.errorName = "";
      }
    }  else {
      this.isValidDeptName = false;
    }
  }
}

import { Injectable } from '@angular/core';
import { AppService } from './app.service';

@Injectable({
    providedIn:'root',
})
export class MenuService {
  constructor(
      private appServices : AppService, 
  ) {  }

  getMenu(): Array<any> {
      // console.log('men called...........');
      let dataBankChild = this.getDataBankChild();      
      let datarequestChild = this.getDataRequestChild();

    const menu = [
      {name:'DAPP', route:'dapp',path:'../dapp',
        children:[
          { name: 'Dashboard', route:'dashboard', path: '../dashboard', children: [] },
          
          { 
            name: 'Data Management', 
            route:'datamanagement',
            path: '../datamanagement', 
            children: [
              { 
                name: 'Dashboard',
                route:'dashboard',
                path: '../dashboard',
              },
              {
                name: 'Data Bank',
                route:'databank',
                path: '../databank',
                children: dataBankChild,
              },
              {
                name: 'Data Request',
                route:'datarequest',
                path: '../datarequest',
                children :[
                {
                  name: this.appServices.requestId,
                  route:this.appServices.requestId,
                  path: '../'+this.appServices.requestId
                }
                ]
              },
              {
                name: 'Share Data',
                route:'shareddata',
                path: '../shareddata',
              }
            ] 
          },

          {name: 'Lead Management', route : 'lead-management', path : '../lead-management',
            children : [
              {
                name: 'Dashboard',
                route:'dashboard',
                path: '../dashboard',
              },
              {
                name: 'leads',
                route:'leads',
                path: '../leads',
              },
            ]
        },

          {name : 'Project Management', route:'project-management', path : '../project-management',
            children:[
              {
                name: 'Dashboard',
                route:'dashboard',
                path: '../dashboard',
              },
              {
                name: 'Add Project',
                route:'add-project',
                path: '../add-project',
              },
              {
                name: 'Edit Project',
                route:'edit-project',
                path: '../edit-project',
              },
              {
                name: 'View Project',
                route:'view-project',
                path: '../view-project',
              },
              {
                name: 'My Project',
                route:'my-project',
                path: '../my-project',
                children :[
                  {
                    name: this.appServices.getProjectId(),
                    route:this.appServices.getProjectId(),
                    path: '../'+this.appServices.getProjectId(),
                    children :[
                      {
                        name: this.appServices.getplotVarId(),
                        route:this.appServices.getplotVarId(),
                        path: '../'+this.appServices.getplotVarId()
                      }
                    ]
                  }
                  ]
              },
              {
                name: 'Initiate Project',
                route:'initiate-project',
                path: '../initiate-project',
              },
            ]
          },
          {name : 'Team Management',route:'team-management', path : '../team-management',
          children:[
            {
              name: 'Dashboard',
              route:'dashboard',
              path: '../dashboard',
            },
            {
              name: 'Add Team',
              route:'add',
              path: '../add',
            },
            {
              name: 'My Team',
              route:'my-team',
              path: '../my-team',
            },
            {
              name: 'Team Department',
              route:'team-department',
              path: '../team-department',
              children:[
                {
                  name: this.appServices.currentDepartment,
                  route:this.appServices.currentDepartment,
                  path: '../'+this.appServices.currentDepartment,
                },
              ]
            },
                       
          ]
         }
        ]
      },
      {name:'Auth', route:'auth', path:'../auth',children:[
        {name:'Login', route:'login',path:'../login'}
      ]},
      // {name: 'member/approval',route: 'member/approval',path: 'member/approval'}
    ];
    return menu;
  }
  getDataBankChild(){
    
    if(this.appServices.currentDataBank){
      let newDB = [];
      let folderChild = []
      let fileChild = []
      // console.log('this.appServices.currentFolder',this.appServices.currentFolder);
      
      if(this.appServices.currentFolder){
        if(this.appServices.currentDataTag){
          fileChild.push({
            name:this.appServices.currentDataTag,
            route:this.appServices.currentDataTag,
            path:'../'+this.appServices.currentDataTag,
          })
        }
        folderChild.push({
          name:'Allocated Data',
          route:'allocated-data',
          path:'../allocated-data',
        })
        folderChild.push({
          name:this.appServices.currentFolder,
          route:this.appServices.currentFolder,
          path:'../'+this.appServices.currentFolder,
          children :fileChild
        })
        
      }
      newDB.push({
        name:this.appServices.currentDataBank,
        route:this.appServices.currentDataBank,
        path:'../'+this.appServices.currentDataBank,
        children :folderChild
      })
      console.log('newDB',newDB);

      return newDB;
    }
  }
  getDataRequestChild(){
    let dataReqChild = []
    if(this.appServices.dataRequestChild){
      dataReqChild=[({
        name: this.appServices.dataRequestChild,
        path: '../'+this.appServices.dataRequestChild,
      })]
    }
    return dataReqChild;
  }
}
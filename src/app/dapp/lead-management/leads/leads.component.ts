import { Component, OnInit } from '@angular/core';
import { LinkViewComponent, ViewMoreLessComponent } from 'src/app/components/table-components';
import * as $ from 'jquery';
import { AppService, ApiService, UtlService } from 'src/app/_services';
import { LocalDataSource } from 'ng2-smart-table';
declare var $: any;
@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  selectedIndex : number;
  settings = {
    // selectMode: 'multi', // single | multi
    actions: {
      // custom: [
      //   { name: 'ADD', title: 'Add<i class="fas fa-plus-circle" title="Add to Team"></i>' },
      // ],
      add: false,
      edit:false,
      delete:false,
      position: 'right',
    },
    columns: {
      name: {
        title: 'Full Name',
        type: 'custom',
        filter: false,
        renderComponent: LinkViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
              $('#def').val(JSON.stringify(row))
              $('#def').click()
          });
        }
      },
      email: {
        title: 'Email',
        filter: false,
      },
      contact: {
        title: 'Phone No',
        type: 'custom',
        filter: false,
        renderComponent: ViewMoreLessComponent,
      },
      budget: {
        title: 'Budget',
        type: 'custom',
        filter: false,
        renderComponent: ViewMoreLessComponent,
      }
    },
    pager:
    {
      perPage: 10
    }
  }
  pageNo = 0;
  dataSize = 200;
  leadTableSource : LocalDataSource = new LocalDataSource();
  isLoading = false;
  myRefCode:any;
  needInfo : any;
  constructor(
    private utlServices : UtlService,
    private apiServices : ApiService,
    private appServices : AppService
  ) { }

  ngOnInit() {
    this.getRefferCode()
  }
  getRefferCode() {
    this.isLoading = true;
    this.apiServices.getMyReferral()
    .then(res=>{
      this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode === 200){
        this.myRefCode = res.data.extraData.referralCode;
        this.getLeads()
      } else this.appServices.handleOtheException(res.data.exception)
    }).catch(err=>{
      this.isLoading = false;      
        this.appServices.handleNetworkException(err)
      })
  }
  getLeads() {
    this.isLoading = true;
    this.apiServices.showNeedAnalysis(this.myRefCode,this.pageNo,this.dataSize)
    .then(res=>{
    this.isLoading = false;
      console.log(res.data);
      if(res.data.status && res.data.statusCode === 200){
        this.formatLeads(res.data.extraData.NA.content)
      } else if(res.data.exception == "NO_RECORDS_FOUND"){
        console.log('NO_RECORDS_FOUND');
      } else this.appServices.handleOtheException(res.data.exception)
    }).catch(err=>{
    this.isLoading = false;      
    this.appServices.handleNetworkException(err)
    })
  }
  formatLeads(leads) {
    leads.forEach((lead,i) => {
      leads[i]["name"] = lead.userInformation.name;
      leads[i]["contact"] = lead.userInformation.contact;
      leads[i]["profession"] = lead.userInformation.name;
      leads[i]["budget"] = lead.budgetAndAreaDetails.maxPrice;
    });
    console.log(leads);
    
    this.leadTableSource.load(leads)
  }
  viewInfo(data){
    data = JSON.parse(data)
    // console.log(data);
    this.formatLeadInfo(data)    
  }
  formatLeadInfo(data: any) {
    let basicInfo = [];
    if(data.userInformation){
      let  uInfo= data.userInformation;
      if(uInfo.name) basicInfo.push({name:'Name',value:uInfo.name})
      if(uInfo.contact) basicInfo.push({name:'Contact',value:uInfo.contact})
      if(uInfo.profession) basicInfo.push({name:'Profession',value:uInfo.profession})
    }
    if(data.email) basicInfo.push({name:'Email',value:data.email})
    if(data.budgetAndAreaDetails){
      let budgetArea = data.budgetAndAreaDetails;
      if(budgetArea.maxBuiltUpArea) basicInfo.push({name:'Maximum Builtup Area',value:budgetArea.maxBuiltUpArea})
      if(budgetArea.minBuiltUpArea) basicInfo.push({name:'Minimum Builtup Area',value:budgetArea.minBuiltUpArea})

      if(budgetArea.maxCarpetArea) basicInfo.push({name:'Maximum Carpet Area',value:budgetArea.maxCarpetArea})
      if(budgetArea.minCarpetArea) basicInfo.push({name:'Minimum Carpet Area',value:budgetArea.minCarpetArea})

      if(budgetArea.maxPrice) basicInfo.push({name:'Maximum Price',value:budgetArea.maxPrice})
      if(budgetArea.minPrice) basicInfo.push({name:'Minimum Price',value:budgetArea.minPrice})
    }
    if(data.saleType.length) basicInfo.push({name:'Property For',value:data.saleType
    .map(x=>this.utlServices.propertyFor.find(y=>y.value == x).name).join(', '), more:true})
    if(data.marketPlace && data.marketPlace.length) basicInfo.push({name:'Market Place',value:data.marketPlace
    .map(x=> {if(x) return this.utlServices.marketCatgry.find(y=>y.value == x).name}).join(', '), more:true})
    basicInfo.push({name:'Assets Type',value:this.utlServices.assetsType.find(a=>a.value == data.assetType[0]).name})
    if(data.assetSubType && data.assetSubType.length)basicInfo.push({name:'Assets Sub Type',value:data.assetSubType
    .map(as=>this.utlServices.assetsSubType.find(x=>x.value == as).name).join(', '), more:true})
    let propertyLocationLayout = [];
    if(data.village.length) propertyLocationLayout.push({name:'Village',value:data.village.join(', ')})
    if(data.city.length) propertyLocationLayout.push({name:'City',value:data.city.join(', ')})
    if(data.district.length) propertyLocationLayout.push({name:'District',value:data.district.join(', ')})
    if(data.state.length) propertyLocationLayout.push({name:'State',value:data.state.join(', '), more:true})
    let pInfo = data.propertyDetailsNeedAnalysis;

    if(pInfo.propertyFacing.length) propertyLocationLayout.push({name:'Property Facing',value:pInfo.propertyFacing
    .map(x=>this.utlServices.facingSide.find(f=>f.value == x).name).join(', '), more:true})
    if(pInfo.nearByLocation){
      let _loc = []
      Object.keys(pInfo.nearByLocation).forEach((loc:any)=>{
        _loc.push(this.utlServices.nearByLocationK2V[loc]+": "+pInfo.nearByLocation[loc].nearByLocationName + " - "+pInfo.nearByLocation[loc].distance+" KM")
      })
      propertyLocationLayout.push({name:'Near By Location',value:_loc.join(', '), more:true})
    }
    if(data.dimensionSpecification.length)
    propertyLocationLayout.push({name:'Dimention Specification',value:this.utlServices.areaUnit
    .find(a=>a.value == data.dimensionSpecification[0]).name})


    let propertyDetails = [];
    if(pInfo.floorAndCeiling){
      if(pInfo.floorAndCeiling.ceiling) propertyDetails.push({name:'Ceiling', value:pInfo.floorAndCeiling.ceiling
        .map(x=>this.utlServices.ceilingType.find(c=>c.value == x).name).join(', '), more:true})
      if(pInfo.floorAndCeiling.flooring) propertyDetails.push({name:'Flooring', value:pInfo.floorAndCeiling.flooring
        .map(x=>this.utlServices.flooringTypes.find(c=>c.value == x).name).join(', '), more:true})
    }
    let parking = pInfo.parkingSpecification;
    if(parking){
      if(parking.reserved)propertyDetails.push({name:'Parking', value:'Reserved, Vehicle Capacity : '+parking.count})
      if(parking.shared)propertyDetails.push({name:'Parking', value:'Shared, Vehicle Capacity : '+parking.count})
    }
    if(pInfo.bedrooms && pInfo.bedrooms.length){
      let _room =[]
      pInfo.bedrooms.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Bedrooms',value:_room.join(', '), more:true})
    }
    if(pInfo.livingroom && pInfo.livingroom.length){
      let _room =[]
      pInfo.livingroom.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Livingroom',value:_room.join(', '), more:true})
    }
    if(pInfo.studyroom && pInfo.studyroom.length){
      let _room =[]
      pInfo.studyroom.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Studyroom',value:_room.join(', '), more:true})
    }
    if(pInfo.poojaroom && pInfo.poojaroom.length){
      let _room =[]
      pInfo.poojaroom.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Poojaroom',value:_room.join(', '), more:true})
    }
    if(pInfo.serventroom && pInfo.serventroom.length){
      let _room =[]
      pInfo.serventroom.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Serventroom',value:_room.join(', '), more:true})
    }
    if(pInfo.diningroom && pInfo.diningroom.length){
      let _room =[]
      pInfo.diningroom.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Diningroom',value:_room.join(', '), more:true})
    }
    if(pInfo.storeroom && pInfo.storeroom.length){
      let _room =[]
      pInfo.storeroom.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Storeroom',value:_room.join(', '), more:true})
    }
    if(pInfo.basement && pInfo.basement.length){
      let _room =[]
      pInfo.basement.forEach((room,i) => {
        if(room.length && room.breadth){
          _room.push('Room : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else _room.push('Room : '+(i+1)+' - area N/A')
      });
      if(_room.length)propertyDetails.push({name:'Basement',value:_room.join(', '), more:true})
    }
    if(pInfo.kitchen && pInfo.kitchen.length){
      let kitechen =[]
      pInfo.kitchen.forEach((_k,i) => {
        if(_k.length && _k.breadth){
          kitechen.push('Room : '+(i+1)+' - '+_k.length+' ft x '+_k.breadth+' ft')
        } else kitechen.push('Room : '+(i+1)+' - area N/A')
      });
      propertyDetails.push({name:'Kitchen',value:kitechen.join(', '), more:true})
      propertyDetails.push({name:'Kitchen Type',value:this.utlServices.kitchenStyleK2V[pInfo.kitchen[0].kitchencategory]})
    }
    if(pInfo.bathroom && pInfo.bathroom.length){
      let bathroom =[]
      pInfo.bathroom.forEach((b,i) => {
        if(b.length && b.breadth){
          bathroom.push('Room : '+(i+1)+' - '+b.length+' ft x '+b.breadth+' ft, style-'+this.utlServices.bathroomStyleK2V[b.bathroomStyle])
        } else bathroom.push('Room : '+(i+1)+' - area N/A, style-'+this.utlServices.bathroomStyleK2V[b.bathroomStyle])
      });
      propertyDetails.push({name:'Bathroom',value:bathroom.join(', '), more:true})
    }
    if(pInfo.frontyard && pInfo.frontyard.length){
      let frontyard =[]
      pInfo.frontyard.forEach((room,i) => {
        if(room.length && room.breadth){
          frontyard.push('Frontyard : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else frontyard.push('Frontyard : '+(i+1)+' - area N/A')
      });
      if(frontyard.length)propertyDetails.push({name:'Frontyard',value:frontyard.join(', '), more:true})
    }
    if(pInfo.backyard && pInfo.backyard.length){
      let backyard =[]
      pInfo.backyard.forEach((room,i) => {
        if(room.length && room.breadth){
          backyard.push('Backyard : '+(i+1)+' - '+room.length+' ft x '+room.breadth+' ft')
        } else backyard.push('Backyard : '+(i+1)+' - area N/A')
      });
      if(backyard.length)propertyDetails.push({name:'Backyard',value:backyard.join(', '), more:true})
    }
    


  




    let furnishingStatus = []
    if(data.furnishingStatus && data.furnishingStatus.length)
    furnishingStatus.push({name:'Furnishing Status',value:data.furnishingStatus
    .map(f=>this.utlServices.furnishingStatus.find(c=>c.value == f).name).join(', '), more:true})
    else furnishingStatus.push({name:'Furnishing Status',value:'Raw Land'})
    if(pInfo.furniture){ let _furniture = []
     Object.keys(pInfo.furniture).forEach((_furn:any)=>{
        _furniture.push(this.utlServices.furniture.find(h=>h.value == _furn).name+" - "+pInfo.furniture[_furn])
      }); if(_furniture.length) furnishingStatus.push({name:'Furnitures',value:_furniture.join(', '), more:true}) 
    }
    if(pInfo.roomtypes){ let rt = []
      Object.keys(pInfo.roomtypes).forEach((_room:any)=>{
       rt.push(this.utlServices.roomTypeK2V[_room]+" - "+pInfo.roomtypes[_room])
     });if(rt.length) furnishingStatus.push({name:'Room Types',value:rt.join(', '), more:true})
    }
    if(pInfo.homeAppliances){ let ha = []
      this.utlServices.homeAppliances.forEach(_ha => {
        if(Object.keys(pInfo.homeAppliances).find(x=>x == _ha.value)){
          ha.push(_ha.name+" - "+pInfo.homeAppliances[_ha.value])
        }
      }); if(ha.length) furnishingStatus.push({name:'Home Appliances',value:ha.join(', '), more:true})
    }
    furnishingStatus.push({name:'Facilities',value:pInfo.facilitySpecification
    .map(x=>this.utlServices.facility.find(f=>f.value == x).name).join(', '), more:true})
    let propertyPossesion = []
    propertyPossesion.push({name:'Construction Phase',value:this.utlServices
      .cnstrctPhase.find(c=>c.value == data.assetConstructionPhase).name})
    propertyPossesion.push({name:'Finalize Investment',value:this.utlServices.finalizeInv
      .find(x=>x.value == data.finalizeInvestment).name})
    propertyPossesion.push({name:'Approval Type',value:data.layoutApprovalType
      .map(y=>this.utlServices.approvalType.find(p=>p.value == y).name).join(', '), more:true})
    

    let needInfo = {
      assetType:data.assetType[0],
      basicInfo:basicInfo,
      propertyLocationLayout:propertyLocationLayout,
      propertyDetails : propertyDetails,
      furnishingStatus : furnishingStatus,
      propertyPossesion : propertyPossesion,
    }
    this.needInfo = needInfo;
    $('#leadInfo').modal('show')
    this.selectedIndex = 0;
  }
  onUserRowSelect(e){
    // console.log(e);
    
  }
  get_Leads(){
    this.pageNo = 0;
    this.dataSize = 20;
    this.getLeads()
  }
  onSearch(query: string = '') {
    // console.log(query);
    if(query === ''){
      this.leadTableSource.reset()
    } 
    else {
      this.leadTableSource.setFilter([
        {
          field: 'name',
          search: query,
        },
        {
          field: 'email',
          search: query,
        },
        {
          field: 'contact',
          search: query,
        },
        {
          field: 'budget',
          search: query,
        }
      ], false);
    }
  }
  onCustom(e){
    console.log(e);
    
  }
  tabChange(e){
    console.log(this.selectedIndex);
    
  }
}

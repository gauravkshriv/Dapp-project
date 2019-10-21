import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtlService {
  constructor() {}
  state = [
      {value:"Andaman and Nicobar Islands", name:"Andaman_and_Nicobar_Islands"},
      {value:"Andhra Pradesh", name:"Andhra_Pradesh"},
      {value:"Arunachal Pradesh", name:"Arunachal_Pradesh"},
      {value:"Assam", name:"Assam"},
      {value:"Bihar", name:"Bihar"},
      {value:"Chandigarh", name:"Chandigarh"},
      {value:"Chhattisgarh", name:"Chhattisgarh"},
      {value:"Dadra and Nagar Haveli", name:"Dadra_and_Nagar_Haveli"},
      {value:"Daman and Diu", name:"Daman_and_Diu"},
      {value:"Delhi", name:"Delhi"},
      {value:"Goa", name:"Goa"},
      {value:"Gujarat", name:"Gujarat"},
      {value:"Haryana", name:"Haryana"},
      {value:"Himachal Pradesh", name:"Himachal_Pradesh"},
      {value:"Jammu and Kashmir", name:"Jammu_and_Kashmir"},
      {value:"Jharkhand", name:"Jharkhand"},
      {value:"Karnataka", name:"Karnataka"},
      {value:"Kerala", name:"Kerala"},
      {value:"Lakshadweep", name:"Lakshadweep"},
      {value:"Madhya Pradesh", name:"Madhya_Pradesh"},
      {value:"Maharashtra", name:"Maharashtra"},
      {value:"Manipur", name:"Manipur"},
      {value:"Meghalaya", name:"Meghalaya"},
      {value:"Mizoram", name:"Mizoram"},
      {value:"Nagaland", name:"Nagaland"},
      {value:"Orissa", name:"Orissa"},
      {value:"Pondicherry", name:"Pondicherry"},
      {value:"Punjab", name:"Punjab"},
      {value:"Rajasthan", name:"Rajasthan"},
      {value:"Sikkim", name:"Sikkim"},
      {value:"Tamil Nadu", name:"Tamil_Nadu"},
      {value:"Tripura", name:"Tripura"},
      {value:"Uttaranchal", name:"Uttaranchal"},
      {value:"Uttar Pradesh", name:"Uttar_Pradesh"},
      {value:"West Bengal", name:"West_Bengal"}
  ]
  rmeOcc = [
    {name:'Land Owner', value:'LAND_OWNER', enum:0},
    {name:'Land Developer', value:'LAND_DEVELOPER', enum:1},
    {name:'Builder', value:'BUILDER', enum:2},
    {name:'Project Investor', value:'PROJECT_INVESTOR', enum:3},
    {name:'Broking Consultant', value:'BROKING_CONSULTANT', enum:4},
    {name:'Broking House', value:'BROKING_HOUSE', enum:5},
    {name:'Project Investment Consultant', value:'PROJECT_INVESTMENT_CONSULTANT', enum:6},
    {name:'Legal Consultant', value:'LEGAL_CONSULATANT', enum:7},
    {name:'IT Consultant', value:'IT_CONSULTANT', enum:8},
    {name:'Mortage Consultant', value:'MORTGAGE_CONSULTANT', enum:9},
    {name:'Architecture Consultant', value:'ARCHITECTURE_CONSULTANT', enum:10},
    {name:'Construction Consultant', value:'CONSTRUCTION_CONSULTANT', enum:11},
    {name:'Project Mentor', value:'PROJECT_MENTOR', enum:12},
    {name:'Project Head', value:'PROJECT_HEAD', enum:13},
    {name:'Trainer', value:'TRAINER', enum:14},
    {name:'Pool Mentor', value:'POOL_MENTOR', enum:15},
    {name:'Designing Consultant', value:'DESIGNING_CONSULTANT', enum:16},
    {name:'Other', value:'OTHER', enum:17},
    {name:'Vendor', value:'VENDOR', enum:18},
    {name:'End User Buyer', value:'END_USER_BUYER', enum:19},
    {name:'End User Investor', value:'END_USER_INVESTOR', enum:20},
    {name:'Data Management Consultant', value:'DATA_MANAGEMENT_CONSULTANT', enum:21},
    {name:'Data Management Admin', value:'DATA_MANAGEMENT_ADMIN', enum:22},
  ]
  facility = [
    {name:'Lifts',value:'LIFTS',enum:0},
    {name:'Escalators',value:'ESCALATORS',enum:1},
    {name:'House Keeping',value:'HOUSE_KEEPING',enum:2},
    {name:'Power Backup',value:'POWER_BACKUP',enum:3},
    {name:'Reserved Parking',value:'RESERVED_PARKING',enum:4},
    {name:'Shared Parking',value:'SHARED_PARKING',enum:5},
    {name:'GYM',value:'GYM',enum:6},
    {name:'Central Air Condition',value:'CENTRAL_AIR_CONDITION',enum:7},
    {name:'Park',value:'PARK',enum:8},
    {name:'Security Services',value:'SECURITY_SERVICES',enum:9},
    {name:'Solar Panels',value:'SOLAR_PANELS',enum:10},
    {name:'GAS Pipeline',value:'GAS_PIPELINES',enum:11},
    {name:'Water Supply',value:'WATER_SUPPLY',enum:12},
    {name:'Water Storage',value:'WATER_STORAGE',enum:13},
    {name:'Rain Water Harvesting',value:'RAIN_WATER_HARVESTING',enum:14},
    {name:'Electrification',value:'ELECTRIFICATION',enum:15},
    {name:'Motor Pump',value:'MOTOR_PUMP',enum:16},
    {name:'Sewer Lines',value:'SEWER_LINES',enum:17},
    {name:'Open Parking',value:'OPEN_PARKING',enum:18},
    {name:'Gate Security',value:'GATED_SOCIETY',enum:19},
    {name:'Sweeming Pool',value:'SWIMMING_POOL',enum:20},
    {name:'CC TV',value:'CCTV',enum:21},
    {name:'Others',value:'OTHERS',enum:22},
  ]
  areaUnit = [
    {name:'Square Feet',value:'SQUARE_FEET',enum:'0'},
    {name:'Square Yards',value:'SQUARE_YARDS',enum:'1'},
    {name:'Square Meters',value:'SQUARE_METERS',enum:'2'},
    {name:'Acres',value:'ACRES',enum:'3'},
    {name:'Marla',value:'MARLA',enum:'4'},
    {name:'Ghaz',value:'GHAZ',enum:'5'},
    {name:'Bigha',value:'BIGHGA',enum:'6'},
    {name:'Cents',value:'CENTS',enum:'7'},
    {name:'Biswa',value:'BISWA',enum:'8'},
    {name:'Kottah',value:'KOTTAH',enum:'9'},
    {name:'Kanal',value:'KANAL',enum:'10'},
    {name:'Grounds',value:'GROUNDS',enum:'11'},
    {name:'Guntha',value:'GUNTHA',enum:'12'},
    {name:'Hectares',value:'HECTARES',enum:'13'},
    {name:'Rood',value:'ROOD',enum:'14'},
    {name:'Chataks',value:'CHATAKS',enum:'15'},
    {name:'Perch',value:'PERCH',enum:'16'},
  ]

  lengthUnit = [
    {name:'Meter',value:'METER',enum:'17'},
    {name:'Centimeter',value:'CENTIMETER',enum:'18'},
    {name:'Feet',value:'FEET',enum:'0'},
    {name:'Yards',value:'YARDS',enum:'1'},
    {name:'Meters',value:'METERS',enum:'2'},
    {name:'Acres',value:'ACRES',enum:'3'},
    {name:'Marla',value:'MARLA',enum:'4'},
    {name:'Ghaz',value:'GHAZ',enum:'5'},
    {name:'Bigha',value:'BIGHGA',enum:'6'},
    {name:'Cents',value:'CENTS',enum:'7'},
    {name:'Biswa',value:'BISWA',enum:'8'},
    {name:'Kottah',value:'KOTTAH',enum:'9'},
    {name:'Kanal',value:'KANAL',enum:'10'},
    {name:'Grounds',value:'GROUNDS',enum:'11'},
    {name:'Guntha',value:'GUNTHA',enum:'12'},
    {name:'Hectares',value:'HECTARES',enum:'13'},
    {name:'Rood',value:'ROOD',enum:'14'},
    {name:'Chataks',value:'CHATAKS',enum:'15'},
    {name:'Perch',value:'PERCH',enum:'16'},
  ]

  facingSide = [
    {name:'North West',value:'NORTH_WEST',enum:5,isSelected:false,count:1},
    {name:'North',value:'NORTH',enum:0,isSelected:false,count:1},
    {name:'North East',value:'NORTH_EAST',enum:4,isSelected:false,count:1},
    {name:'West',value:'WEST',enum:2,isSelected:false,count:1},
    {name:'Center',value:'CENTER',isSelected:false,count:1},
    {name:'East',value:'EAST',enum:1,isSelected:false,count:1},
    {name:'South West',value:'SOUTH_WEST',enum:6,isSelected:false,count:1},
    {name:'South',value:'SOUTH',enum:3,isSelected:false,count:1},
    {name:'South East',value:'SOUTH_EAST',enum:7,isSelected:false,count:1},
  ]
  projectType = {
    RESIDENTIAL:"0",
    COMMERCIAL : "1",
    INDUSTRIAL : "2",
    AGRICULTURAL : "3"
  }
  projectSubType = {
    PLOTTING:"0",
    HOUSING : "1",
    BUILDER_PROJECTS : "2",
  }
  approvalType =  [
    {name:'Freehold',value:'FREEHOLD',enum:'0'},
    {name:'Local Authority Approval',value:'LOCAL_AUTHORITY_APPROVAL',enum:'1'},
    {name:'Others',value:'OTHERS',enum:'2'}
  ];
  nearByLocation = [
    {name:'Railway',nearBy:'0',nearByLocation:'',value:'RAILWAY'},
    {name:'Airport',nearBy:'1',nearByLocation:'',value:'AIRPORT'},
    {name:'Metro',nearBy:'2',nearByLocation:'',value:'METRO'},
    {name:'Bus Stand',nearBy:'3',nearByLocation:'',value:'BUS_STAND'},
    {name:'Other',nearBy:'4',nearByLocation:'',value:'OTHER'},
  ]
  nearByLocationK2V={
    RAILWAY:'Railway',
    AIRPORT:'Airport',
    METRO:'Metro',
    BUS_STAND:'Bus Stand',
    OTHER:'Other',
  }
  userRoles = [
    {name:'Need Analysis',value:'NA',enum:'0'},
    {name:'Risk Analysis',value:'RA',enum:'1'},
    {name:'Sale Cosure',  value:'SC',enum:'2'},
    {name:'Project Conceptualization',value:'PROJECT_CONCEPTUALIZATION',enum:'3'},
    {name:'Project Sustainability Consulting',value:'PROJECT_SUSTAINABILITY_CONSULTING',enum:'4'},
    {name:'Investment Liquid',value:'INVESTMENT_LIQUID',enum:'5'},
    {name:'Investment Fixed',value:'INVESTMENT_FIXED',enum:'6'},
    {name:'Approval Central NOCS',value:'APPROVAL_CENTRAL_NOCS',enum:'7'},
    {name:'Approval State NOCS',value:'APPROVAL_STATE_NOCS',enum:'8'},
    {name:'Approval Land Due Diligence',value:'APPROVAL_LAND_DUE_DILIGENCE',enum:'9'},
    {name:'Approval Project Due Diligence',value:'APPROVAL_PROJECT_DUE_DILIGENCE',enum:'10'},
    {name:'Deed Prepration',value:'DEED_PREPARATION',enum:'11'},
    {name:'Contract Drafting',value:'CONTRACT_DRAFTING',enum:'12'},
    {name:'Soil Testing',value:'SOIL_TESTING',enum:'13'},
    {name:'Land Servey',value:'LAND_SURVEY',enum:'14'},
    {name:'Arcitecture as per the Project Type and Subtype',value:'ARCHITECTURE_AS_PER_THE_PROJECT_TYPE_AND_SUBTYPE',enum:'15'},
    {name:'Land Development',value:'LAND_DEVELOPMENT',enum:'16'},
    {name:'Facility Manager',value:'FACILITY_MANAGER',enum:'17'},
    {name:'Safety Manager',value:'SAFETY_MANAGER',enum:'18'},
    {name:'Manpower Sourcing',value:'MANPOWER_SOURCING',enum:'19'},
    {name:'Matarial Sourcing',value:'MATERIAL_SOURCING',enum:'20'},
    {name:'Inverior Design',value:'INTERIOR_DESIGN',enum:'21'},
    {name:'Exterior Design',value:'EXTERIOR_DESIGN',enum:'22'},
    {name:'Quality Analysis',value:'QUALITY_ANALYSIS',enum:'23'},
    {name:'Database Admin',value:'DATABASE_ADMIN',enum:'24'},
    {name:'Database Consulting',value:'DATABASE_CONSULTING',enum:'25'},
    {name:'Digital Marketing',value:'DIGITAL_MARKETING',enum:'26'},
    {name:'Customer Service',value:'CUSTOMER_SERVICE',enum:'27'},
    {name:'Project Monitoring',value:'PROJECT_MONITORING',enum:'28'},
    {name:'Senior Sale Closure',value:'SENIOR_SALE_CLOSURE',enum:'29'},
    {name:'Under Writer',value:'UNDER_WRITER',enum:'30'}
  ]
  userRolesK2V={
   

  }
  homeAppliances = [
    {name:'Fans', value:'FANS',enum:'0'}, 
    {name:'Lights', value:'LIGHTS',enum:'1'}, 
    {name:'Fridge', value:'FRIDGE',enum:'2'}, 
    {name:'Air Condition', value:'AIR_CONDITION',enum:'3'}, 
    {name:'Geyser', value:'GEYSER',enum:'4'},
    {name:'Television', value:'TELEVISION',enum:'5'}, 
    {name:'Gass Cooking Unit', value:'GAS_COOKING_UNIT',enum:'6'},
    {name:'Induction Coocking Unit', value:'INDUCTION_COOKING_UNIT',enum:'7'},
    {name:'Water Purifier', value:'WATER_PURIFIER',enum:'8'}, 
    {name:'Air Purifier', value:'AIR_PURIFIER',enum:'9'},
    {name:'Semi Automatic Washing Machine', value:'SEMI_AUTOMATIC_WASHING_MACHINE',enum:'10'},
    {name:'Fully Automatic Washing Machine', value:'FULLY_AUTOMATIC_WASHING_MACHINE',enum:'11'}, 
    {name:'Vaccum Cleaner', value:'VACCUM_CLEANER',enum:'12'}, 
    {name:'Chimney', value:'CHIMNEY',enum:'13'},
    {name:'Exhaust Fans', value:'EXHAUST_FANS',enum:'14'},
    {name:'Computer', value:'COMPUTER',enum:'15'},
    {name:'Chandelier', value:'CHANDELIER',enum:'16'},
    {name:'Power Point Socket', value:'POWER_POINT_SOCKETS',enum:'17'},
    {name:'Water Storage', value:'WATER_STORAGE',enum:'18'},
    {name:'Iroging Board', value:'IRONING_BOARD',enum:'19'},
    {name:'Cutlery', value:'CUTLERY',enum:'20'},
    {name:'Crockery', value:'CROCKERY',enum:'21'},,
    {name:'Internet', value:'INTERNET',enum:'22'},,
    {name:'Dish Cable', value:'DISH_CABLE',enum:'23'},
    {name:'Oven', value:'OVEN',enum:'24'},
    {name:'Electric Cooker', value:'ELECTRIC_COOKER',enum:'25'},
    {name:'Electric Kettle', value:'ELECTRIC_KETTLE',enum:'26'},
    {name:'Griller', value:'GRILLER',enum:'27'},
    {name:'Blender', value:'BLENDER',enum:'28'},
    {name:'Juicer Mixer Grinder', value:'JUICER_MIXER_GRINDER',enum:'29'},
  ]
  furnishingStatus =[
    {name:'Unfurnished', value:'UNFURNISHED',enum:'0'},
    {name:'Semi Furnished', value:'SEMI_FURNISHED',enum:'1'},
    {name:'Fully Furnished', value:'FULLY_FURNISHED',enum:'2'},
    {name:'Raw', value:'RAW',enum:'3'}
  ]
  furniture = [
    {name :'Center Table',value :'CENTRE_TABLE', enum: '0'},
    {name :'Sofa',value :'SOFA', enum: '1'}, 
    {name :'Dining Set',value :'DINING_SET', enum: '2'},
    {name :'Bed',value :'BED', enum: '3'},
    {name :'Wardrobes',value :'WARDROBES', enum: '4'},
    {name :'Recliner & Rocker',value :'RECLINER_AND_ROCKER', enum: '5'}, 
    {name :'TV Unit',value :'TV_UNIT', enum: '6'},
    {name :'Book Shelves',value :'BOOK_SHELVES', enum: '7'},
    {name :'Almirah',value :'ALMIRAH', enum: '8'}, 
    {name :'Bar Cabinets',value :'BAR_CABINETS', enum: '9'} ,
    {name :'Curtains',value :'CURTAINS', enum: '10'},
    {name :'Shoe Shelf',value :'SHOE_SHELF', enum: '11'},
    {name :'Study Table',value :'STUDY_TABLE', enum: '13'},
    {name :'Carpet',value :'CARPET', enum: '14'}
  ]
  bathroomplace = [
    {name :'Attached',value :'ATTACHED', enum: '0'},
    {name :'Seperated',value :'SEPERATED', enum: '1'}, 
  ]
  roomTypes = [
    {name :'Bed Rooms', value :'BED_ROOMS', enum :'0'},
    {name :'Bath Rooms', value :'BATH_ROOMS', enum :'1'},
    {name :'Servent Rooms', value :'SERVENT_ROOMS', enum :'2'},
    {name :'Kitchen', value :'KITCHEN', enum :'3'},
    {name :'Pooja Room', value :'POOJA_ROOMS', enum :'4'},
    {name :'Store Room', value :'STORE_ROOM', enum :'5'},
    {name :'Study Room', value :'STUDY_ROOM', enum :'6'},
    {name :'Living Room', value :'LIVING_ROOM', enum :'7'},
    {name :'Dining Room', value :'DINING_ROOM', enum :'8'},
    {name :'Basement', value :'BASEMENT', enum :'9'}
  ]
  roomTypeK2V={
    BED_ROOMS:'Bed Rooms',
    BATH_ROOMS:'Bath Rooms',
    SERVENT_ROOMS:'Servent Rooms',
    KITCHEN:'Kitchen',
    POOJA_ROOMS:'Pooja Room',
    STORE_ROOM:'Store Room',
    STUDY_ROOM:'Study Room',
    LIVING_ROOM:'Living Room',
    DINING_ROOM:'Dining Room',
    BASEMENT:'Basement',
  }
  flooringTypes = [
    {name : 'Marbel Finish', value :'MARBEL_FINISH', enum :'0'},
    {name : 'Tile Finish', value :'TILE_FINISH', enum :'1'}, 
    {name : 'Wooden Finish', value :'WOODEN_FINISH', enum :'2'},
    {name : 'Other', value :'OTHERS', enum :'3'}
  ]
  cealingTypes = [
    {name :'Border Finishing', value: 'BORDER_FINISISHING', enum :'0'},
    {name :'Cornis Finishing', value: 'CORNIS_FINISHING', enum :'1'}, 
    {name :'False Sealing', value: 'FALSE_SEALING', enum :'2'},
    {name :'Others', value: 'OTHERS', enum :'3'}
  ] 
  washroomStyle = [
    {name :'Indian', value:'INDIAN', enum :'0'} , 
    {name :'Western', value:'WESTERN', enum :'1'} , 
    {name :'Italian', value:'ITALIAN', enum :'2'} , 
    {name :'French', value:'FRENCH', enum :'3'} , 
    {name :'Others', value:'OTHERS', enum :'4'}
  ] 
  finalizeInv = [
    {name:'Within One Month', value:'WITHIN_ONE_MONTH', enum:'0'}, 
    {name:'Next Three Month', value:'NEXT_QUATER', enum:'1'}, 
    {name:'Next Six Month', value:'NEXT_SIX_MONTHS', enum:'2'}, 
    {name:'Next Year', value:'NEXT_YEAR', enum:'3'}
  ]
  cnstrctPhase = [
    {name:'Ready To Move', value:'READY_TO_MOVE', enum:'0'} ,
    {name:'Finishing Mode', value:'FINISHING_MODE', enum:'1'} ,
    {name:'Middle Way COnstruction', value:'MIDDLE_WAY_CONSTRUCTION', enum:'2'},
    {name:'Launching', value:'LAUNCHING', enum:'3'} ,
    {name:'Pre-Launched', value:'PRE_LAUNCHING', enum:'4'}
  ]
  ceilingType = [
    {name:'Border Finishing', value:'BORDER_FINISISHING', enum:'0'},
    {name:'Cornis Finishing', value:'CORNIS_FINISHING', enum:'1'},
    {name:'False Sealing', value:'FALSE_SEALING', enum:'2'},
    {name:'Other', value:'OTHERS', enum:'3'}
  ]
  marketCatgry = [
    {name:'Primary Market', value:'PRIMARY_MARKET', enum:'0'},
    {name:'Secondary Market', value:'SECONDARY_MARKET', enum:'1'},
    {name:'Leasing Market', value:'LEASING_MARKET', enum:'2'},
  ]
  department = [
    { name: 'Sales', value: 'SALE', route: 'sales', editable:false},
    { name: 'Marketing', value: 'MARKETING', route: 'marketing', editable:false},
    { name: 'Legal', value: 'LEGAL', route: 'sales', editable:false},
    { name: 'Admin', value: 'ADMIN', route: 'sales', editable:false},
    { name: 'IT', value: 'IT', route: 'it', editable:false},
    { name: 'Support', value: 'SUPPORT', route: 'support', editable:false},
  ]
  assetsType = [
    {name:'Residential',value:'RESIDENTIAL', enum:'0'}, 
    {name:'Commercial',value:'COMMERCIAL', enum:'1'}, 
    {name:'Industrial',value:'INDUSTRIAL', enum:'2'}, 
    {name:'Agricultural',value:'AGRICULTURAL', enum:'3'}, 
    {name:'Raw Land',value:'RAW_LAND', enum:'4'}
  ]
  propertyFor =[
    {name:'Sell',value:'SELL', enum:'0'} ,
    {name:'Leave',value:'LEASE', enum:'1'},
    {name:'Rent',value:'RENT', enum:'2'},
    {name:'Co-work',value:'CO_WORK', enum:'3'},
    {name:'Co-leaving',value:'CO_LIVING', enum:'4'} ,
    {name:'Open For Project',value:'OPEN_FOR_PROJECT', enum:'5'} ,
    {name:'Open For Development',value:'OPEN_FOR_DEVELOPMENT', enum:'6'}
  ]
  assetsSubType = [
    {name:'Office Building',value:'OFFICE_BUILDING', enum:'0'},
    {name:'Complex',value:'COMPLEX', enum:'1'},
    {name:'Shop',value:'SHOPS', enum:'2'},
    {name:'Flat',value:'FLAT', enum:'3'}, 
    {name:'Villa',value:'VILLA', enum:'4'}, 
    {name:'House',value:'HOUSE', enum:'5'}, 
    {name:'Bunglow',value:'BUNGLOW', enum:'6'},
    {name:'Factory',value:'FACTORY', enum:'7'}, 
    {name:'Assembling Unit',value:'ASSEMBLING_UNIT', enum:'8'},
    {name:'Workshop',value:'WORKSHOP', enum:'9'} , 

    {name:'Farm Land',value:'FARM_LAND', enum:'11'} ,
    {name:'Green House',value:'GREEN_HOUSE', enum:'12'} , 
    {name:'Farm House',value:'FARM_HOUSE', enum:'13'} , 
    {name:'Polutary Land',value:'POLUTARY_LAND', enum:'14'},
    {name:'Special Economic Zone',value:'SPECIAL_ECONOMIC_ZONE', enum:'15'},
    {name:'Resort',value:'RESORT', enum:'16'}  ,
    {name:'Warehouse',value:'WAREHOUSE', enum:'17'} ,
    {name:'Hotels',value:'HOTELS', enum:'18'},
    {name:'Laboratory',value:'LABORATORY', enum:'19'} , 
    {name:'Office Floor',value:'OFFICE_FLOOR', enum:'20'}, 
    {name:'Duplex',value:'DUPLEX', enum:'21'} ,
    {name:'Cold Storage',value:'COLD_STORAGE', enum:'22'},
  ]
  kitchenStyleK2V = {
    TRADITIONAL_STYLE:'Traditional',
    MODULAR:'Modular',
    GERMAN:'German',
    ITALIAN:'Italian',
    OTHERS:'Others',
  }
  bathroomStyleK2V = {
    TRADITIONAL:'Traditional',
    WESTERN:'Western',
    GERMAN:'German',
    FRENCH:'French',
    OTHERS:'Others',
  }
}

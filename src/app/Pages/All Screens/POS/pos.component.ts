import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { responseDealsModel } from '../../Master/Deals/dealsModel';
import { MenuItemsModel, responseVariant } from '../../Master/FoodItems/ItemsModel';
import { allVariantsResponse, changeOrderStatus, customerFavResponse, customerModel, FoodCatResponseModel, POSNewModelRequest, requestCustomer, requestCustomerTable, responseAddress, responseCustomer, responseFoodMenuItem, responseOrder, responseTable, tablesResponse } from './posModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  changeOrderStatus: changeOrderStatus;
  responseAddress: responseAddress[];
  addMoborAdd: boolean = false;
  customerModel: customerModel;
  tablesResponse: tablesResponse[];
  POSNewModelRequest: POSNewModelRequest;
  orderRemarks: string = "";
  viewMode: boolean = false;
  customerName: string = "";
  totalTables: number = 0;
  tablesOccupied: number = 0;
  tablesFree: number = 0;
  dtOptions4: DataTables.Settings = {};
  dtTrigger4: Subject<any> = new Subject<any>();
  //........................................
  orderTypeValue: any = "Dine In";
  favDescription: any = "";
  customerFound: boolean = false;
  customerFavResponse: customerFavResponse[];
  requestCustomer: requestCustomer;
  date: string = "";
  tableList: string = "";
  customerFavList: any = [];
  // POSModelResponse: POSModelResponse;
  selectedTables: requestCustomerTable[];
  editMode: boolean = false;
  responseOrderReplica: responseOrder[];
  responseOrder: responseOrder[];
  subTotal: number = 0;
  salesTax: number = 0;
  discount: number = 0;
  total: number = 0;
  @ViewChildren("closeVariantsModal") closeVariantsModal: any;
  @ViewChildren("closeOrderViewModal") closeOrderViewModal: any;
  @ViewChildren("closeAddCustomerModal") closeAddCustomerModal: any;
  @ViewChildren("closeAddRemarksModal") closeAddRemarksModal: any;
  @ViewChildren("closeTablesModal") closeTablesModal: any;
  @ViewChildren("closeOrdersModal") closeOrdersModal: any;

  SelectClicked: boolean = false;
  allVariantsResponse: allVariantsResponse[];
  tableID: any;
  responseTableReplica: responseTable[];
  responseTable: responseTable[];
  responseCustomer: responseCustomer[];
  responseDealsModel: responseDealsModel[];
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  @ViewChild('myInputV')
  myInputVariableVariant: ElementRef;
  fileToUpload: any = null;
  isBrowser: boolean = false;
  imageUrl: string;
  imageUrlV: string;
  Image: any;
  file: any[] = [];
  symbol: string = "";
  fileName: string = "No file chosen";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChildren("closeVariantModal") closeVariantModal: any;
  @ViewChildren("closeViewVariantModal") closeViewVariantModal: any;
  @ViewChildren("attachItemImageModal") attachItemImageModal: any;

  responseVariant: responseVariant[];
  ItemPrice: boolean = false;
  foodMenuItemModel: MenuItemsModel;
  responseFoodMenuItem: responseFoodMenuItem[];
  ItemsResponseModelReplica: responseFoodMenuItem[];
  FoodCatResponseModel: FoodCatResponseModel[];
  addMode: boolean = false;
  submitted: boolean = false;
  Vsubmitted: boolean = false;
  MenuItemsForm: FormGroup;
  VariantForm: FormGroup;
  SearchForm: FormGroup;
  CustomerForm: FormGroup;
  DeliveryForm: FormGroup;
  isShow: boolean = true;
  showDiscount: boolean = false;
  showVDiscount: boolean = false;
  dropdownSettings: IDropdownSettings = {};

  constructor(private API: ApiService,
    public GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.tablesResponse = [];
    this.POSNewModelRequest = new POSNewModelRequest();
    this.customerModel = new customerModel();
    this.responseAddress = [];
    this.changeOrderStatus = new changeOrderStatus();
    //............................................
    this.customerFavResponse = [];
    this.date = new Date().toLocaleString().slice(0, 17);
    this.requestCustomer = new requestCustomer();
    // this.POSModelResponse = new POSModelResponse();
    this.selectedTables = [];
    this.responseOrderReplica = [];
    this.responseOrder = [];
    this.POSNewModelRequest = new POSNewModelRequest();
    this.FoodCatResponseModel = [];
    this.foodMenuItemModel = new MenuItemsModel();
    this.responseVariant = [];
    this.responseDealsModel = [];
    this.responseTableReplica = [];
    this.responseTable = [];
    this.responseCustomer = [];
    this.allVariantsResponse = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tableID',
      textField: 'tableName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    }
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));

    this.getAllData();
    this.symbol = this.GV.Currency;
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.InitializeForm();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.dtOptions4 = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.SearchForm.controls['foodMenuID'].enable();
    this.SearchForm.controls['searchByRefCode'].enable();
  }

  get f() { return this.MenuItemsForm.controls; }
  get g() { return this.VariantForm.controls; }
  get h() { return this.CustomerForm.controls; }
  get d() { return this.DeliveryForm.controls; }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  InitializeForm() {
    this.MenuItemsForm = new FormGroup({
      foodItemID: new FormControl(),
      refCode: new FormControl(),
      foodItemName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      description: new FormControl(),
      price: new FormControl(),
      isActive: new FormControl(),
      hasVariant: new FormControl(),
      foodMenuID: new FormControl("", [Validators.required]),
      UserID: new FormControl(),
      discount: new FormControl(),
      calculatedPrice: new FormControl(),
      discountPercentage: new FormControl(),
      discountRupees: new FormControl(),
      imageURl: new FormControl(),
    });

    this.VariantForm = new FormGroup({
      variantID: new FormControl(),
      variantName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      RefCode: new FormControl(),
      variantPrice: new FormControl(undefined, [Validators.required]),
      discount: new FormControl(),
      calculatedPrice: new FormControl(),
      description: new FormControl(),
      foodItemID: new FormControl(),
      discountPercentage: new FormControl(),
      discountRupees: new FormControl(),
      imageURL: new FormControl(),
    });
    this.SearchForm = new FormGroup({
      foodMenuID: new FormControl(""),
      searchByRefCode: new FormControl(""),
      searchCustomerByCode: new FormControl(""),
      CustomerName: new FormControl(""),
    });
    this.CustomerForm = new FormGroup({
      customerName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      refCode: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      mobileNO: new FormControl("", [
        Validators.required,
        Validators.pattern(".{11,11}")]),
      Address: new FormControl(""),
      isActive: new FormControl(""),
      companyID: new FormControl(""),
      UserID: new FormControl(""),
      customerID: new FormControl(""),
      favDescription: new FormControl(""),
    });
    this.DeliveryForm = new FormGroup({
      customerName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      mobileNO: new FormControl("", [
        Validators.required,
        Validators.pattern(".{11,11}")]),
      Address: new FormControl("", [Validators.required]),
    });
  }

  getAllData() {
    if (this.GV.companyID == 0) {
      this.toastr.warning('Select Company First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    else if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    else {
      //..............................................................
      this.API.getdata('/FoodMenu/getfoodMenu?OutletID=' + this.GV.OutletID).subscribe(c => {
        if (c != null) {
          this.FoodCatResponseModel = c.foodMenuResponses;
          this.FoodCatResponseModel.forEach((x) => {
            if (x.foodMenuName.length > 9) {
              x.newStr = x.foodMenuName.substring(0, 9) + '..';
            }
            else {
              x.newStr = x.foodMenuName;
            }
          });
          this.SearchForm.controls.foodMenuID.setValue(0);
          this.FoodCatResponseModel = this.FoodCatResponseModel.sort((n1, n2) => n1.foodMenuID - n2.foodMenuID);
        }
      },
        error => {
          this.toastr.error(error.statusText, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      //...............................................
      this.API.getdata('/FoodMenu/getfoodItemAgainstOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
        if (c != null) {
          this.responseFoodMenuItem = [];
          this.ItemsResponseModelReplica = [];
          this.responseFoodMenuItem = c.responseFoodMenuItems;
          this.ItemsResponseModelReplica = c.responseFoodMenuItems;

          this.ItemsResponseModelReplica.forEach((x) => {
            if (x.foodItemName.length > 15) {
              x.newStr = x.foodItemName.substring(0, 15) + '..';
            }
            else {
              x.newStr = x.foodItemName;
            }
          });
        }
      },
        error => {
          this.toastr.error(error.statusText, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      //....................................................
      this.API.getdata('/FoodMenu/getTable?outletID=' + this.GV.OutletID).subscribe(c => {
        if (c != null) {
          this.responseTable = c.responseTables;
        }
      },
        error => {
          this.toastr.error(error.statusText, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      //.....................................................
      this.API.getdata('/FoodMenu/getDeals?outletID=' + this.GV.OutletID).subscribe(c => {
        if (c != null) {
          this.responseDealsModel = [];
          this.responseDealsModel = c.responseDeal;
        }
      },
        error => {
          this.toastr.error(error.statusText, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      //........................................................
      this.API.getdata('/FoodMenu/getCustomer?companyID=' + this.GV.companyID).subscribe(c => {
        if (c != null) {
          this.responseCustomer = c.responseCustomers;
        }
      },
        error => {
          this.toastr.error(error.statusText, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      //........................................................
      // this.API.getdata('/FoodMenu/getVariantandFoodItemAgainstOutletID?OutletID=' + this.GV.OutletID).subscribe(c => {
      //   if (c != null) {
      //     this.allVariantsResponse = c.responseVariantandFoodItem;
      //   }
      // },
      //   error => {
      //     this.toastr.error(error.statusText, 'Error', {
      //       timeOut: 3000,
      //       'progressBar': true,
      //     });
      //   });
    }

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  getAllTables() {
    this.responseTable = [];
    this.API.getdata('/FoodMenu/getTable?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseTable = c.responseTables;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getVariants(p: any) {
    this.API.getdata('/FoodMenu/getVariant?foodItemID=' + p.foodItemID).subscribe(c => {
      if (c != null) {
        this.responseVariant = [];
        this.responseVariant = c.responseVariant;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  filterCategories(p: any) {
    if (p == 0) {
      this.SearchForm.controls.foodMenuID.setValue(p);
      this.ItemsResponseModelReplica = this.responseFoodMenuItem;
    }
    else if (p.foodMenuID != 0) {
      this.SearchForm.controls.foodMenuID.setValue(p.foodMenuID);
      const result = this.responseFoodMenuItem.filter(x => x.foodMenuID == p.foodMenuID);
      this.ItemsResponseModelReplica = result;
    }
  }

  pushItem(p: any) {
    let body = {
      quantity: 0,
      calculatedPrice: p.calculatedPrice,
      discount: p.discount,
      foodItemID: p.foodItemID,
      foodMenuID: p.foodMenuID,
      description: p.description,
      foodItemName: p.foodItemName,
      foodMenuName: p.foodMenuName,
      hasVariant: p.hasVariant,
      isActive: p.isActive,
      newStr: p.newStr,
      price: p.price,
      outletID: p.outletID,
      refCode: p.refCode,
      variantID: p.variantID,
      variantName: p.variantName,
      variantPrice: p.variantPrice,
      dealID: p.dealID,
      dealName: p.dealName,
      itemsDescription: p.itemsDescription,
      dealPrice: p.dealPrice,
      kotID: 0,
    }
    if (body.discount == undefined) {
      body.discount = 0;
    }
    if (body.variantID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.variantID == body.variantID);
      if (index == -1) {
        body.quantity = 1;
        this.POSNewModelRequest.requestKotDetail.push(body);
      }
      else {
        this.POSNewModelRequest.requestKotDetail[index].quantity += 1;
      }
    }
    else if (body.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == body.foodItemID);
      if (index == -1) {
        body.quantity = 1;
        this.POSNewModelRequest.requestKotDetail.push(body);
      }
      else {
        this.POSNewModelRequest.requestKotDetail[index].quantity += 1;
      }
    }
    else if (body.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == body.dealID);
      if (index == -1) {
        body.quantity = 1;
        this.POSNewModelRequest.requestKotDetail.push(body);
      }
      else {
        this.POSNewModelRequest.requestKotDetail[index].quantity += 1;
      }
    }
    this.calculateTotals();
    this.closeVariantsModal["first"].nativeElement.click();
  }

  calculateTotals() {
    this.subTotal = 0;
    this.salesTax = 0;
    this.discount = 0;
    this.total = 0;
    this.POSNewModelRequest.requestKotDetail.forEach((x) => {
      if (x.variantID) {
        if (x.discount == 0) {
          this.subTotal += x.variantPrice * x.quantity;
        }
        else {
          this.discount += (x.variantPrice - x.calculatedPrice) * x.quantity;
          this.subTotal += x.calculatedPrice * x.quantity;
        }
      }
      else if (x.foodItemID) {
        if (x.discount == 0) {
          this.subTotal += x.price * x.quantity;
        }
        else {
          this.discount += (x.price - x.calculatedPrice) * x.quantity;
          this.subTotal += x.calculatedPrice * x.quantity;
        }
      }
      else if (x.dealID) {
        this.subTotal += x.dealPrice * x.quantity;
      }
    })
    this.total = this.subTotal + this.salesTax + this.discount;
    //............Discount......................
    // var one = this.subTotal - this.discount;
    // var two = this.subTotal - one;
    // var three = two / this.subTotal;
    // var four = three * 100;
    // this.discount = Math.floor(four);
  }
  decrement(p: any) {
    if (p.variantID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.variantID == p.variantID);
      if (this.POSNewModelRequest.requestKotDetail[index].quantity > 1) {
        this.POSNewModelRequest.requestKotDetail[index].quantity -= 1;
      }
      else {
        return
      }
    }
    else if (p.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == p.foodItemID);
      if (this.POSNewModelRequest.requestKotDetail[index].quantity > 1) {
        this.POSNewModelRequest.requestKotDetail[index].quantity -= 1;
      }
      else {
        return
      }
    }
    else if (p.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == p.dealID);
      if (this.POSNewModelRequest.requestKotDetail[index].quantity > 1) {
        this.POSNewModelRequest.requestKotDetail[index].quantity -= 1;
      }
      else {
        return
      }
    }
    this.calculateTotals();
  }
  increment(p: any) {
    if (p.variantID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.variantID == p.variantID);
      this.POSNewModelRequest.requestKotDetail[index].quantity += 1;
    }
    else if (p.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == p.foodItemID);
      this.POSNewModelRequest.requestKotDetail[index].quantity += 1;
    }
    else if (p.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == p.dealID);
      this.POSNewModelRequest.requestKotDetail[index].quantity += 1;
    }
    this.calculateTotals();
  }

  removeItem(p: any) {
    if (p.variantID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.variantID == p.variantID);
      this.POSNewModelRequest.requestKotDetail[index].quantity = 0;
      this.POSNewModelRequest.requestKotDetail.splice(index, 1);
    }
    else if (p.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == p.foodItemID);
      this.POSNewModelRequest.requestKotDetail[index].quantity = 0;
      this.POSNewModelRequest.requestKotDetail.splice(index, 1);
    }
    else if (p.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == p.dealID);
      this.POSNewModelRequest.requestKotDetail[index].quantity = 0;
      this.POSNewModelRequest.requestKotDetail.splice(index, 1);
    }
    this.calculateTotals();
    return
  }

  showOrHide(status: any) {
    this.SearchForm.controls.foodMenuID.setValue(0);
    if (status == 1) {
      this.isShow = true;
    }
    else {
      this.isShow = false;
    }
    if (this.isShow == false) {
      this.SearchForm.controls['foodMenuID'].disable();
      this.SearchForm.controls['searchByRefCode'].disable();
      this.SearchForm.controls['searchByRefCode'].reset();
    }
    else {
      this.ItemsResponseModelReplica = this.responseFoodMenuItem;
      this.SearchForm.controls['foodMenuID'].enable();
      this.SearchForm.controls['searchByRefCode'].enable();
    }
  }
  searchByRC() {
    if (this.SearchForm.controls.searchByRefCode.value == null || this.SearchForm.controls.searchByRefCode.value == "") {
      this.ItemsResponseModelReplica = this.responseFoodMenuItem;
      return
    }
    else {
      this.ItemsResponseModelReplica = this.responseFoodMenuItem;
      var item = this.ItemsResponseModelReplica.find((x) => x.refCode == this.SearchForm.controls.searchByRefCode.value);
      if (item) {
        this.ItemsResponseModelReplica = this.ItemsResponseModelReplica.filter((c) => c.refCode == item?.refCode);
        return
      }
      else {
        this.ItemsResponseModelReplica = [];
      }
    }
  }


  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
    var index = this.POSNewModelRequest.requestCustomerTable.findIndex((x) => x.tableID == item.tableID);
    this.POSNewModelRequest.requestCustomerTable.splice(index, 1);
  }
  onItemDeSelectAll(item: any) {
    this.POSNewModelRequest.requestCustomerTable = [];
  }
  onSelectAll(items: any) {
    this.POSNewModelRequest.requestCustomerTable = [];
    this.responseTable.forEach((x) => {
      let body = {
        customerTableID: 0,
        kotID: 0,
        tableID: x.tableID
      }
      this.POSNewModelRequest.requestCustomerTable.push(body);
    })
  }
  onTableSelect(event: any) {
    var tableInfo: any = this.responseTable.find((x) => x.tableID == event.tableID);
    let body = {
      customerTableID: 0,
      kotID: 0,
      tableID: tableInfo.tableID
    }
    this.POSNewModelRequest.requestCustomerTable.push(body);
  }

  searchCustomer() {
    var customer: any = this.responseCustomer.find((x) => x.refCode == this.SearchForm.controls.searchCustomerByCode.value);
    if (customer) {
      this.customerFound = true;
      this.SearchForm.controls.CustomerName.setValue(customer.customerName);
      this.POSNewModelRequest.requestCustomerDetail.customerID = customer.customerID;
      this.toastr.success('Verified Customer', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    var customer: any = this.responseCustomer.find((x) => x.mobileNO == this.SearchForm.controls.searchCustomerByCode.value);
    if (customer) {
      this.customerFound = true;
      this.SearchForm.controls.CustomerName.setValue(customer.customerName);
      this.POSNewModelRequest.requestCustomerDetail.customerID = customer.customerID;
      this.toastr.success('Verified Customer', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    if (this.SearchForm.controls.searchCustomerByCode.value == "") {
      this.customerFound = false;
      this.SearchForm.controls.CustomerName.setValue("");
      this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
      return
    }
    else {
      this.customerFound = false;
      this.SearchForm.controls.CustomerName.setValue("");
      this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
      this.toastr.error('Customer not found', '', {
        timeOut: 3000,
        'progressBar': true,
      });
    }
  }
  resetForm() {
    this.CustomerForm.reset();
    this.responseAddress = [];
  }
  resetOrder() {
    this.orderTypeValue = "Dine In";
    this.addMoborAdd = false;
    this.customerName = "";
    this.orderRemarks = "";
    this.subTotal = 0;
    this.salesTax = 0;
    this.discount = 0;
    this.total = 0;
    this.customerFound = false;
    this.editMode = false;
    this.selectedTables = [];
    this.SearchForm.reset();
    this.CustomerForm.reset();
    this.changeOrderStatus = new changeOrderStatus();
    this.POSNewModelRequest = new POSNewModelRequest();
  }

  submitOrder() {
    if (this.POSNewModelRequest.requestKotDetail.length == 0) {
      this.toastr.error('Select atleast one item', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    this.POSNewModelRequest.requestKot.UserID = this.GV.userID;
    this.POSNewModelRequest.requestKot.outletID = this.GV.OutletID;
    this.POSNewModelRequest.requestKot.orderType = this.orderTypeValue;
    this.POSNewModelRequest.requestKotSR.outletID = this.GV.OutletID;
    this.API.PostData('/Pos/AddEditKot', this.POSNewModelRequest).subscribe(c => {
      if (c != null) {
        this.getKOTReciept(c.kotID);
        this.toastr.success(c.message, 'Success', {
          timeOut: 3000,
          'progressBar': true,
        });
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  getKOTReciept(kotID: any) {
    this.POSNewModelRequest = new POSNewModelRequest();
    this.API.getdata('/Pos/getKOTBykotID?kotID=' + kotID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          if (c.responseCustomerDetail == null) {
            this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
            this.POSNewModelRequest.requestCustomerDetail.customerDetailID = 0;
            this.POSNewModelRequest.requestCustomerDetail.kotID = 0;
          }
          else {
            this.POSNewModelRequest.requestCustomerDetail = c.responseCustomerDetail;
            if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
              var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
              this.customerName = this.responseCustomer[index].customerName;
            }
          }
          this.POSNewModelRequest.requestCustomerTable = c.responseCustomerTable;
          this.POSNewModelRequest.requestKot = c.responseKot;
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.customerName = this.responseCustomer[index].customerName;
            this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
            this.searchCustomer();
          }
          else {
            this.customerName = "";
            this.SearchForm.controls.searchCustomerByCode.setValue("");
            this.searchCustomer();
          }
          this.tableList = "";
          this.POSNewModelRequest.requestCustomerTable.forEach((x) => {
            this.responseTable.forEach((c) => {
              if (c.tableID == x.tableID) {
                this.tableList = this.tableList.concat(c.tableName, ', ');
              }
            })
          })
          this.tableList = this.tableList.slice(0, -2);
          this.closeTablesModal["first"].nativeElement.click();
          var button: any = document.getElementById("KOTReciept");
          setTimeout(() => { button.click() }, 1000);
          setTimeout(() => { this.resetOrder(); }, 2000);
        }
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getInvoiceReciept(kotID: any) {
    this.POSNewModelRequest = new POSNewModelRequest();
    this.API.getdata('/Pos/getKOTBykotID?kotID=' + kotID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          if (c.responseCustomerDetail == null) {
            this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
            this.POSNewModelRequest.requestCustomerDetail.customerDetailID = 0;
            this.POSNewModelRequest.requestCustomerDetail.kotID = 0;
          }
          else {
            this.POSNewModelRequest.requestCustomerDetail = c.responseCustomerDetail;
            if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
              var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
              this.customerName = this.responseCustomer[index].customerName;
            }
          }
          this.POSNewModelRequest.requestCustomerTable = c.responseCustomerTable;
          this.POSNewModelRequest.requestKot = c.responseKot;
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.customerName = this.responseCustomer[index].customerName;
            this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
            this.searchCustomer();
          }
          else {
            this.customerName = "";
            this.SearchForm.controls.searchCustomerByCode.setValue("");
            this.searchCustomer();
          }
          this.tableList = "";
          this.POSNewModelRequest.requestCustomerTable.forEach((x) => {
            this.responseTable.forEach((c) => {
              if (c.tableID == x.tableID) {
                this.tableList = this.tableList.concat(c.tableName, ', ');
              }
            })
          })
          this.tableList = this.tableList.slice(0, -2);
          this.closeTablesModal["first"].nativeElement.click();
          this.closeOrdersModal["first"].nativeElement.click();
          this.calculateTotals();
          var button: any = document.getElementById("InvoiceReciept");
          setTimeout(() => { button.click() }, 1000);
          setTimeout(() => { this.resetOrder(); }, 2000);
        }
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getAllOrders() {
    this.responseOrder = [];
    this.API.getdata('/Pos/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseOrder = c.responseKot;
        this.dtTrigger4.next();
        this.responseOrder.sort((a, b) => a.kotID < b.kotID ? 1 : a.kotID > b.kotID ? -1 : 0);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  editOrder() {
    this.closeOrderViewModal["first"].nativeElement.click();
    this.closeTablesModal["first"].nativeElement.click();
    return
  }
  searchOrder() {
    var searchOrder: any = document.getElementById("search_running_orders");
    if (searchOrder.value == "" || searchOrder.value == null || searchOrder.value == undefined) {
      this.responseOrderReplica = this.responseOrder;
      return
    }
    else {
      this.responseOrderReplica = this.responseOrder.filter((c) => c.kotID == searchOrder.value);
      if (this.responseOrderReplica.length == 0) {
        this.responseOrderReplica = this.responseOrder;
        this.toastr.error('Order Not Found', '', {
          timeOut: 3000,
          'progressBar': true,
        });
      }
      else {
        return
      }
    }
  }
  paymentMade(p: any) {
    this.changeOrderStatus.statusID = p.statusID;
    this.changeOrderStatus.kotID = p.kotID;
    this.API.PostData("/Pos/changeOrderStatus", this.changeOrderStatus).subscribe(c => {
      if (c != null) {
        this.toastr.success(c.message, 'Success', {
          timeOut: 3000,
          'progressBar': true,
        });
        this.resetOrder();
        this.getAllOrders();
        this.showTables();
        this.getAllTables();
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  cancelOrderConfirm(p: any) {
    this.changeOrderStatus.statusID = p.statusID;
    this.changeOrderStatus.kotID = p.kotID;
    this.API.PostData("/Pos/changeOrderStatus", this.changeOrderStatus).subscribe(c => {
      if (c != null) {
        this.toastr.success(c.message, 'Success', {
          timeOut: 3000,
          'progressBar': true,
        });
        this.resetOrder();
        this.getAllOrders();
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  cancelOrderNotConfirm(p: any) {
    Swal.fire({
      text: 'Are you sure you want to cancel ' + p.kotNO + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result: any) => {
      if (result.isConfirmed) {
        let body = {
          statusID: 7,
          kotID: p.kotID
        }
        this.cancelOrderConfirm(body);
      }
    })
  }
  viewOrder(p: any) {
    if (p.kotID == 0) {
      this.toastr.info('No order against selected table', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    this.closeOrdersModal["first"].nativeElement.click();
    this.resetOrder();
    this.API.getdata('/Pos/getKOTBykotID?kotID=' + p.kotID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          if (c.responseCustomerDetail == null) {
            this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
            this.POSNewModelRequest.requestCustomerDetail.customerDetailID = 0;
            this.POSNewModelRequest.requestCustomerDetail.kotID = 0;
          }
          else {
            this.POSNewModelRequest.requestCustomerDetail = c.responseCustomerDetail;
            if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
              var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
              this.customerName = this.responseCustomer[index].customerName;
            }
          }
          this.POSNewModelRequest.requestCustomerTable = c.responseCustomerTable;
          this.POSNewModelRequest.requestKot = c.responseKot;
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.customerName = this.responseCustomer[index].customerName;
            this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
            this.searchCustomer();
          }
          else {
            this.customerName = "";
            this.SearchForm.controls.searchCustomerByCode.setValue("");
            this.searchCustomer();
          }
          this.tableList = "";
          this.POSNewModelRequest.requestCustomerTable.forEach((x) => {
            this.responseTable.forEach((c) => {
              if (c.tableID == x.tableID) {
                this.tableList = this.tableList.concat(c.tableName, ', ');
              }
            })
          })
          this.tableList = this.tableList.slice(0, -2);
          this.closeTablesModal["first"].nativeElement.click();
        }
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  orderType(val: any) {
    if (val == 1) {
      this.orderTypeValue = "Dine In";
    }
    else if (val == 2) {
      this.orderTypeValue = "Take Away";
    }
    else {
      this.submitted = false;
      this.orderTypeValue = "Delivery";
      var customer: any = this.responseCustomer.find((x) => x.refCode == this.SearchForm.controls.searchCustomerByCode.value);
      if (customer != undefined) {
        this.CustomerForm.controls.customerName.setValue(customer.customerName);
        this.CustomerForm.controls.mobileNO.setValue(customer.mobileNO);
        this.CustomerForm.controls.Address.setValue(customer.address);
        this.CustomerForm.controls.companyID.setValue(customer.companyID);
        this.CustomerForm.controls.customerID.setValue(customer.customerID);
        this.CustomerForm.controls.isActive.setValue(customer.isActive);
        this.CustomerForm.controls.UserID.setValue(customer.UserID);
        this.CustomerForm.controls.refCode.setValue(customer.refCode);
        this.responseAddress = [];
        this.API.getdata('/FoodMenu/getCustomerAddress?customerID=' + customer.customerID).subscribe(c => {
          if (c != null) {
            this.responseAddress = c.responseAddress;
          }
        },
          error => {
            this.toastr.error(error.message, 'Error', {
              timeOut: 3000,
              'progressBar': true,
            });
          });
      }
    }
  }
  checkAddress(status: any, p: any) {
    if (status == true) {
      this.responseAddress.forEach((x) => {
        if (x.customerInfoID == p.customerInfoID) {
          x.checked = true;
          this.CustomerForm.controls.Address.setValue(x.adress);
        }
        else {
          x.checked = false;
        }
      })
    }
    else {
      this.CustomerForm.controls.Address.setValue("");
      var index = this.responseAddress.findIndex((x) => x.customerInfoID == p.customerInfoID);
      this.responseAddress[index].checked = false;
    }

  }
  saveRemarks() {
    if (this.orderRemarks == "") {
      this.POSNewModelRequest.requestKot.remarks = "";
    }
    else {
      this.POSNewModelRequest.requestKot.remarks = this.orderRemarks;
    }
    this.closeAddRemarksModal["first"].nativeElement.click();
  }

  showTables() {
    this.tablesResponse = [];
    this.totalTables = 0;
    this.tablesOccupied = 0;
    this.tablesFree = 0;
    this.API.getdata('/Pos/getTableStatus?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.tablesResponse = c.getTableStatus;
        this.totalTables = this.tablesResponse.length;
        this.tablesResponse.forEach((x) => {
          if (x.statusID == 1) {
            this.tablesOccupied++;
          }
          else {
            this.tablesFree++;
          }
        })
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  //..........................Add Customer....................................................
  addCustomer() {
    this.viewMode = false;
    this.submitted = false;
    this.CustomerForm.reset();
  }

  viewCustomer() {
    this.viewMode = true;
    this.CustomerForm.controls.favDescription.setValue("");
    this.favDescription = "";
    this.customerFavResponse = [];
    this.customerFavList = [];
    var customer: any = this.responseCustomer.find((x) => x.refCode == this.SearchForm.controls.searchCustomerByCode.value);
    if (customer) {
      this.CustomerForm.controls.customerName.setValue(customer.customerName);
      this.CustomerForm.controls.refCode.setValue(customer.refCode);
      this.CustomerForm.controls.mobileNO.setValue(customer.mobileNO);
      this.CustomerForm.controls.Address.setValue(customer.address);
      this.CustomerForm.controls.isActive.setValue(customer.isActive);
      this.CustomerForm.controls.companyID.setValue(customer.companyID);
      this.CustomerForm.controls.UserID.setValue(customer.UserID);
      this.CustomerForm.controls.customerID.setValue(customer.customerID);

      this.API.getdata('/FoodMenu/getOrderByCustomer?mobileNO=' + this.CustomerForm.controls.mobileNO.value).subscribe(c => {
        if (c != null) {
          this.customerFavResponse = c.responseCustomerOrder;
          let key = "foodItemID"
          this.customerFavResponse.forEach((x) => {
            if (this.customerFavList.some((val: any) => { return val[key] == x.foodItemID })) {
              this.customerFavList.forEach((k: any) => {
                if (k[key] === x.foodItemID) {
                  k["occurrence"]++
                }
              })

            } else {
              let a: any = {}
              a[key] = x.foodItemID
              a["occurrence"] = 1
              this.customerFavList.push(a);
            }
          })
          const seen = new Set();
          const filteredArr = this.customerFavResponse.filter(el => {
            const duplicate = seen.has(el.foodItemID);
            seen.add(el.foodItemID);
            return !duplicate;
          });
          this.customerFavResponse = filteredArr;
          this.customerFavResponse.forEach((x) => {
            this.customerFavList.forEach((y: any) => {
              if (y.foodItemID == x.foodItemID) {
                x.occurrence = y.occurrence;
              }
            })
          })
          this.customerFavResponse.sort((a, b) => a.occurrence < b.occurrence ? 1 : a.occurrence > b.occurrence ? -1 : 0);
          this.customerFavResponse.forEach((x) => {
            this.favDescription = this.favDescription.concat(x.occurrence, ' x ', x.foodItemName, ', ');
          })
          this.favDescription = this.favDescription.slice(0, -2);
          this.favDescription = this.favDescription.split(",").join("\n")
          this.CustomerForm.controls.favDescription.setValue(this.favDescription);
          return
        }
      },
        error => {
          this.toastr.error(error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      return
    }
    this.customerFavResponse = [];
    this.customerFavList = [];
    var customer: any = this.responseCustomer.find((x) => x.mobileNO == this.SearchForm.controls.searchCustomerByCode.value);
    if (customer) {
      this.CustomerForm.controls.customerName.setValue(customer.customerName);
      this.CustomerForm.controls.refCode.setValue(customer.refCode);
      this.CustomerForm.controls.mobileNO.setValue(customer.mobileNO);
      this.CustomerForm.controls.Address.setValue(customer.address);
      this.CustomerForm.controls.isActive.setValue(customer.isActive);
      this.CustomerForm.controls.companyID.setValue(customer.companyID);
      this.CustomerForm.controls.UserID.setValue(customer.UserID);
      this.CustomerForm.controls.customerID.setValue(customer.customerID);
      this.API.getdata('/FoodMenu/getOrderByCustomer?mobileNO=' + this.CustomerForm.controls.mobileNO.value).subscribe(c => {
        if (c != null) {
          this.customerFavResponse = c.responseCustomerOrder;
          //find duplicate and push into new array
          let key = "foodItemID"
          this.customerFavResponse.forEach((x) => {
            if (this.customerFavList.some((val: any) => { return val[key] == x.foodItemID })) {
              this.customerFavList.forEach((k: any) => {
                if (k[key] === x.foodItemID) {
                  k["occurrence"]++
                }
              })

            } else {
              let a: any = {}
              a[key] = x.foodItemID
              a["occurrence"] = 1
              this.customerFavList.push(a);
            }
          })
          //remove duplicate from original array
          const seen = new Set();
          const filteredArr = this.customerFavResponse.filter(el => {
            const duplicate = seen.has(el.foodItemID);
            seen.add(el.foodItemID);
            return !duplicate;
          });
          this.customerFavResponse = filteredArr;

          //update occurrance from new array to original array
          this.customerFavResponse.forEach((x) => {
            this.customerFavList.forEach((y: any) => {
              if (y.foodItemID == x.foodItemID) {
                x.occurrence = y.occurrence;
              }
            })
          })
          this.customerFavResponse.sort((a, b) => a.occurrence < b.occurrence ? 1 : a.occurrence > b.occurrence ? -1 : 0);
          //concat and  to show in next line for textarea
          this.customerFavResponse.forEach((x) => {
            this.favDescription = this.favDescription.concat(x.occurrence, ' x ', x.foodItemName, ', ');
          })
          this.favDescription = this.favDescription.slice(0, -2);
          this.favDescription = this.favDescription.split(",").join("\n")
          this.CustomerForm.controls.favDescription.setValue(this.favDescription);
          return
        }
      },
        error => {
          this.toastr.error(error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
      return
    }
  }

  freeTable(p: any) {
    let body = {
      kotID: p.kotID,
      tableID: p.tableID
    }
    this.API.PostData('/Pos/changeTableStatus', body).subscribe(c => {
      if (c != null) {
        this.toastr.success(c.message, 'Success', {
          timeOut: 3000,
          'progressBar': true,
        });
        this.showTables();
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.CustomerForm.controls.isActive.setValue(true);
    } else {
      this.CustomerForm.controls.isActive.setValue(false);
    }
  }
  saveCustomer() {
    if (this.GV.companyID == 0) {
      this.toastr.warning('Select Company First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    else {
      this.CustomerForm.controls.companyID.setValue(this.GV.companyID);
      this.CustomerForm.controls.UserID.setValue(this.GV.userID);
    }
    this.submitted = true;
    if (this.CustomerForm.valid) {
      if (this.CustomerForm.controls.isActive.value == "" || this.CustomerForm.controls.isActive.value == null) {
        this.CustomerForm.controls.isActive.setValue(false);
      }
      if (this.CustomerForm.controls.customerID.value == "" || this.CustomerForm.controls.customerID.value == null) {
        this.CustomerForm.controls.customerID.setValue(0);
      }
      this.customerModel.requestCustomer = this.CustomerForm.value;
      if (this.addMoborAdd == true) {
        this.customerModel.requestCustomerInfo.customerID = this.customerModel.requestCustomer.customerID;
        this.customerModel.requestCustomerInfo.UserID = this.GV.userID;
      }
      else {
        this.customerModel.requestCustomerInfo.Adress = "";
        this.customerModel.requestCustomerInfo.UserID = 0;
        this.customerModel.requestCustomerInfo.Phone = "";
        this.customerModel.requestCustomerInfo.customerID = 0;
        this.customerModel.requestCustomerInfo.customerInfoID = 0;
      }
      this.POSNewModelRequest.requestCustomerDetail.customerID = this.customerModel.requestCustomer.customerID;
      this.API.PostData('/FoodMenu/AddEditCustomer', this.customerModel).subscribe(c => {
        if (c != null) {
          if (c.status == "Failed") {
            this.toastr.error(c.message, 'Error', {
              timeOut: 3000,
              'progressBar': true,
            });
            return;
          }
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.getCustomers();
          this.viewMode = false;
          this.closeAddCustomerModal["first"].nativeElement.click();
        }
      },
        error => {
          this.toastr.error(error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
    }
  }
  getCustomers() {
    this.API.getdata('/FoodMenu/getCustomer?companyID=' + this.GV.companyID).subscribe(c => {
      if (c != null) {
        this.responseCustomer = c.responseCustomers;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  handleInput(event: any) {
    if (event.shiftKey == true && event.key == 'P') {
      this.submitOrder();
    }
  }


  //....................................................................................
  addMobAdd() {
    this.addMoborAdd = !this.addMoborAdd;
  }

  setMobile(newMob: any) {
    this.customerModel.requestCustomerInfo.Phone = newMob.value;
  }
  setAddress(newAdd: any) {
    this.customerModel.requestCustomerInfo.Adress = newAdd.value;
  }
}
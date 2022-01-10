import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { responseDealsModel } from '../../Master/Deals/dealsModel';
import { MenuItemsModel, responseVariant } from '../../Master/FoodItems/ItemsModel';
import { allVariantsResponse, customerFavResponse, FoodCatResponseModel, POSModelResponse, POSNewModelRequest, requestCustomer, responseCustomer, responseFoodMenuItem, responseOrder, responseTable } from './posModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  POSNewModelRequest: POSNewModelRequest;

  //........................................
  orderTypeValue: any = "Dine In";
  favDescription: any = "";
  customerFound: boolean = false;
  customerFavResponse: customerFavResponse[];
  requestCustomer: requestCustomer;
  date: string = "";
  tableList: string = "";
  customerFavList: any = [];
  POSModelResponse: POSModelResponse;
  selectedTables = [];
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
  isShow: boolean = true;
  showDiscount: boolean = false;
  showVDiscount: boolean = false;
  dropdownSettings: IDropdownSettings = {};

  constructor(private API: ApiService,
    public GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.POSNewModelRequest = new POSNewModelRequest();
    //............................................
    this.customerFavResponse = [];
    this.date = new Date().toLocaleString().slice(0, 17);
    this.requestCustomer = new requestCustomer();
    this.POSModelResponse = new POSModelResponse();
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
    this.getAllData();
    this.getAllOrders();
    this.symbol = this.GV.Currency;
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.InitializeForm();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.SearchForm.controls['foodMenuID'].enable();
    this.SearchForm.controls['searchByRefCode'].enable();
  }

  get f() { return this.MenuItemsForm.controls; }
  get g() { return this.VariantForm.controls; }
  get h() { return this.CustomerForm.controls; }

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
      OwnerID: new FormControl(),
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
      OwnerID: new FormControl(""),
      customerID: new FormControl(""),
      favDescription: new FormControl(""),
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
      this.API.getdata('/FoodMenu/getVariantandFoodItemAgainstOutletID?OutletID=' + this.GV.OutletID).subscribe(c => {
        if (c != null) {
          this.allVariantsResponse = c.responseVariantandFoodItem;
        }
      },
        error => {
          this.toastr.error(error.statusText, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
    }

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
    debugger
    let body = {
      Quantity: 0,
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
    if (body.variantID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.variantID == body.variantID);
      if (index == -1) {
        body.Quantity = 1;
        this.POSNewModelRequest.requestKotDetail.push(body);
      }
      else {
        this.POSNewModelRequest.requestKotDetail[index].Quantity += 1;
      }
    }
    else if (body.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == body.foodItemID);
      if (index == -1) {
        body.Quantity = 1;
        this.POSNewModelRequest.requestKotDetail.push(body);
      }
      else {
        this.POSNewModelRequest.requestKotDetail[index].Quantity += 1;
      }
    }
    else if (body.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == body.dealID);
      if (index == -1) {
        body.Quantity = 1;
        this.POSNewModelRequest.requestKotDetail.push(body);
      }
      else {
        this.POSNewModelRequest.requestKotDetail[index].Quantity += 1;
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
          this.subTotal += x.variantPrice * x.Quantity;
        }
        else {
          this.discount += (x.variantPrice - x.calculatedPrice) * x.Quantity;
          this.subTotal += x.calculatedPrice * x.Quantity;
        }
      }
      else if (x.foodItemID) {
        if (x.discount == 0) {
          this.subTotal += x.price * x.Quantity;
        }
        else {
          this.discount += (x.price - x.calculatedPrice) * x.Quantity;
          this.subTotal += x.calculatedPrice * x.Quantity;
        }
      }
      else if (x.dealID) {
        this.subTotal += x.dealPrice * x.Quantity;
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
      if (this.POSNewModelRequest.requestKotDetail[index].Quantity > 1) {
        this.POSNewModelRequest.requestKotDetail[index].Quantity -= 1;
      }
      else {
        return
      }
    }
    else if (p.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == p.foodItemID);
      if (this.POSNewModelRequest.requestKotDetail[index].Quantity > 1) {
        this.POSNewModelRequest.requestKotDetail[index].Quantity -= 1;
      }
      else {
        return
      }
    }
    else if (p.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == p.dealID);
      if (this.POSNewModelRequest.requestKotDetail[index].Quantity > 1) {
        this.POSNewModelRequest.requestKotDetail[index].Quantity -= 1;
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
      this.POSNewModelRequest.requestKotDetail[index].Quantity += 1;
    }
    else if (p.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == p.foodItemID);
      this.POSNewModelRequest.requestKotDetail[index].Quantity += 1;
    }
    else if (p.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == p.dealID);
      this.POSNewModelRequest.requestKotDetail[index].Quantity += 1;
    }
    this.calculateTotals();
  }

  removeItem(p: any) {
    if (p.variantID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.variantID == p.variantID);
      this.POSNewModelRequest.requestKotDetail[index].Quantity = 0;
      this.POSNewModelRequest.requestKotDetail.splice(index, 1);
    }
    else if (p.foodItemID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == p.foodItemID);
      this.POSNewModelRequest.requestKotDetail[index].Quantity = 0;
      this.POSNewModelRequest.requestKotDetail.splice(index, 1);
    }
    else if (p.dealID) {
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.dealID == p.dealID);
      this.POSNewModelRequest.requestKotDetail[index].Quantity = 0;
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
    debugger
  }
  onItemDeSelect(item: any) {
    debugger
    var index = this.POSNewModelRequest.requestCustomerTable.findIndex((x) => x.tableID == item.tableID);
    this.POSNewModelRequest.requestCustomerTable.splice(index, 1);
  }
  onItemDeSelectAll(item: any) {
    debugger
    this.POSNewModelRequest.requestCustomerTable = [];
  }
  onSelectAll(items: any) {
    debugger
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
    debugger
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

  resetOrder() {
    this.subTotal = 0;
    this.salesTax = 0;
    this.discount = 0;
    this.total = 0;
    this.customerFound = false;
    this.editMode = false;
    this.selectedTables = [];
    this.SearchForm.reset();
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
    debugger
    this.POSNewModelRequest.requestKot.OwnerID = this.GV.ownerID;
    this.POSNewModelRequest.requestKot.outletID = this.GV.OutletID;
    this.POSNewModelRequest.requestKotSR.outletID = this.GV.OutletID;
    if (this.POSNewModelRequest.requestKot.kotID > 0) {
      this.POSNewModelRequest.requestKotDetail.forEach((x) => x.kotID = this.POSNewModelRequest.requestKot.kotID);
      this.POSNewModelRequest.requestCustomerTable.forEach((x) => x.kotID = this.POSNewModelRequest.requestKot.kotID);
      this.POSNewModelRequest.requestCustomerDetail.kotID = this.POSNewModelRequest.requestKot.kotID;
    }
    // if (this.POSNewModelRequest.requestOrder.orderID == 0) {
    //   this.POSNewModelRequest.requestKotDetail.forEach((x) => x.orderID = 0);
    //   this.POSNewModelRequest.requestTable.forEach((x) => x.orderID = 0);
    //   this.POSNewModelRequest.requestCustomer.orderID = 0;
    //   this.POSNewModelRequest.requestCustomer.OwnerID = this.GV.ownerID;
    //   this.POSNewModelRequest.requestOrder.orderID = 0;
    //   this.POSNewModelRequest.requestOrder.outletID = this.GV.OutletID;
    //   this.POSNewModelRequest.requestOrder.orderType = this.orderTypeValue;
    // }
    // else {
    //   this.POSNewModelRequest.requestKotDetail.forEach((x) => x.orderID = this.POSNewModelRequest.requestOrder.orderID);
    //   this.POSNewModelRequest.requestTable.forEach((x) => x.orderID = this.POSNewModelRequest.requestOrder.orderID);
    //   this.POSNewModelRequest.requestCustomer.orderID = this.POSNewModelRequest.requestOrder.orderID;
    //   this.POSNewModelRequest.requestCustomer.OwnerID = this.GV.ownerID;
    //   this.POSNewModelRequest.requestOrder.orderID = this.POSNewModelRequest.requestOrder.orderID;
    //   this.POSNewModelRequest.requestOrder.outletID = this.GV.OutletID;
    //   this.POSNewModelRequest.requestOrder.orderType = this.orderTypeValue;
    // }

    debugger
    this.API.PostData('/Generic/AddEditKot', this.POSNewModelRequest).subscribe(c => {
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
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  getAllOrders() {
    this.responseOrder = [];
    this.API.getdata('/Generic/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseOrder = c.responseOrder;
        this.responseOrderReplica = c.responseOrder;
        this.responseTableReplica = c.responseTable;
        this.responseOrder.sort((a, b) => a.orderID < b.orderID ? 1 : a.orderID > b.orderID ? -1 : 0);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  editOrder(p: any) {
    this.closeOrderViewModal["first"].nativeElement.click();
    this.resetOrder();
    this.API.getdata('/Generic/getOrder?OrderID=' + p.orderID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.editMode = false;
          this.resetOrder();
          return;
        }
        else {
          this.editMode = true;
          this.POSNewModelRequest.requestCustomerDetail = c.responseCustomer;
          this.POSNewModelRequest.requestKotDetail = c.responseReceiptArr;
          this.POSNewModelRequest.requestCustomerTable = c.responseTable;
          this.selectedTables = c.responseTable;
          this.POSNewModelRequest.requestKotSR.kotDate = this.POSNewModelRequest.requestKotSR.kotDate.substring(0, this.POSNewModelRequest.requestKotSR.kotDate.length - 8);
          // var date = this.POSNewModelRequest.requestOrder.kotDate.substring(0, this.POSNewModelRequest.requestOrder.kotDate.length - 17);
          // var time = this.POSNewModelRequest.requestOrder.kotDate.substring(11, this.POSNewModelRequest.requestOrder.kotDate.length - 8);
          // var dateTime = date.concat(time.toString());
          // this.POSNewModelRequest.requestOrder.kotDate = dateTime;
          this.calculateTotals();
          if (c.responseCustomer.refCode == null || c.responseCustomer.refCode == "") {
            return
          }
          else {
            this.customerFound = false;
            this.SearchForm.controls.searchCustomerByCode.setValue(c.responseCustomer.refCode);
            this.SearchForm.controls.CustomerName.setValue(c.responseCustomer.customerName);
            this.searchCustomer();
          }
        }
      }
    },
      error => {
        this.editMode = false;
        this.resetOrder();
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  searchOrder() {
    var searchOrder: any = document.getElementById("search_running_orders");
    if (searchOrder.value == "" || searchOrder.value == null || searchOrder.value == undefined) {
      this.responseOrderReplica = this.responseOrder;
      return
    }
    else {
      this.responseOrderReplica = this.responseOrder.filter((c) => c.orderID == searchOrder.value);
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

  viewOrder(p: any) {
    this.API.getdata('/Generic/getOrder?OrderID=' + p.orderID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          this.POSModelResponse = c;
          this.tableList = "";
          this.POSModelResponse.responseTable.forEach((x) => {
            if (this.POSModelResponse.responseTable.length > 0) {
              this.tableList = this.tableList.concat(x.tableName, ', ');
            }
          })
          this.tableList = this.tableList.slice(0, -2);
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
      this.orderTypeValue = "Dine In"
    }
    else if (val == 2) {
      this.orderTypeValue = "Take Away"
    }
    else {
      this.orderTypeValue = "Delivery"
    }
  }
  //..........................Add Customer....................................................
  addCustomer() {
    this.submitted = false;
    this.CustomerForm.reset();
  }

  viewCustomer() {
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
      this.CustomerForm.controls.OwnerID.setValue(customer.ownerID);
      this.CustomerForm.controls.customerID.setValue(customer.customerID);

      this.API.getdata('/Generic/getOrderByCustomer?refCode=' + this.CustomerForm.controls.refCode.value).subscribe(c => {
        if (c != null) {
          this.customerFavResponse = c.responseReceiptArr;
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
      this.CustomerForm.controls.OwnerID.setValue(customer.ownerID);
      this.CustomerForm.controls.customerID.setValue(customer.customerID);
      this.API.getdata('/Generic/getOrderByCustomer?refCode=' + this.CustomerForm.controls.refCode.value).subscribe(c => {
        if (c != null) {
          this.customerFavResponse = c.responseReceiptArr;
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
      this.CustomerForm.controls.OwnerID.setValue(this.GV.ownerID);
    }
    this.submitted = true;
    if (this.CustomerForm.valid) {
      if (this.CustomerForm.controls.isActive.value == "" || this.CustomerForm.controls.isActive.value == null) {
        this.CustomerForm.controls.isActive.setValue(false);
      }
      if (this.CustomerForm.controls.customerID.value == "" || this.CustomerForm.controls.customerID.value == null) {
        this.CustomerForm.controls.customerID.setValue(0);
      }
      this.requestCustomer = this.CustomerForm.value;
      this.API.PostData('/FoodMenu/AddEditCustomer', this.requestCustomer).subscribe(c => {
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
}
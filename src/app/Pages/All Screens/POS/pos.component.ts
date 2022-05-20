import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { responseDealsModel } from '../../Master/Deals/dealsModel';
import { MenuItemsModel, responseVariant } from '../../Master/MenuItems/ItemsModel';
import { allVariantsResponse, changeOrderStatus, customerFavResponse, customerModel, FBRRequestObject, FoodCatResponseModel, paymentTypesResponse, POSNewModelRequest, requestCustomer, requestCustomerTable, responseAddress, responseCustomer, responseFoodMenuItem, responseOrder, responseTable, tablesResponse, taxesResponseModel, taxResponseModel } from './posModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  totalTaxInAmount: number = 0;
  OpeningDate: any;
  totalDiscount: number = 0;
  invoiceDiscount: number = 0;
  totalMinusInvDis: number = 0;
  PaymentModeName: string = '';
  chargesArray: { name: string, chargesAmount: number, chargesPercentage: number }[] = [
    { "name": "Dine In", chargesAmount: 0, chargesPercentage: 0 },
    { "name": "Take Away", chargesAmount: 0, chargesPercentage: 0 },
    { "name": "Delivery", chargesAmount: 0, chargesPercentage: 0 },
  ];
  chargesValuePercentage: number = 0;
  payModeID: number = 0;
  paymentTypesResponse: paymentTypesResponse[];
  totalTax: number = 0;
  taxArr: any = [];
  taxesResponseModel: taxesResponseModel[];
  taxResponseModel: taxResponseModel[];
  KOTNumber: any;
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  QRCodeValue: any = 0;
  chargesValue: any = 0;
  FBRRequestObject: FBRRequestObject;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  OutletInfo: any;
  // showCart: boolean = false;
  // showItems: boolean = false;
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
  paidAmount: any = 0;
  balanceDue: number = 0;
  changeAmount: number = 0;
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
  @ViewChildren("closeInvoiceModal") closeInvoiceModal: any;
  @ViewChildren("closeInvDisModal") closeInvDisModal: any;

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

  constructor(private API: ApiService, private _sanitizer: DomSanitizer,
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
    this.taxesResponseModel = [];
    this.taxResponseModel = [];
    this.paymentTypesResponse = [];
    this.FBRRequestObject = new FBRRequestObject();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'tableID',
      textField: 'tableName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    }
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
  }
  ngOnInit(): void {
    this.OpeningDate = localStorage.getItem('openingDate');
    this.GV.OutletInfo = JSON.parse(localStorage.getItem('OutletInfo') || '{}');
    this.OutletInfo = this.GV.OutletInfo;
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.getAllData();
    this.getTaxes();
    this.symbol = this.GV.Currency;
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.InitializeForm();
    this.SearchForm.controls['foodMenuID'].enable();
    this.SearchForm.controls['searchByRefCode'].enable();
    this.chargesValue = this.OutletInfo.serviceCharges;
    this.chargesValuePercentage = this.OutletInfo.serviceChargesPer;
    this.updateCharges();
    this.getPaymentModes();
    this.invoiceDiscount = 0;
    this.totalMinusInvDis = 0;
    this.totalDiscount = 0;
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
      customerCode: new FormControl(""),
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

  updateCharges() {
    this.chargesArray.forEach((x) => {
      if (x.name == "Dine In") {
        if (this.OutletInfo.serviceCharges > 0) {
          x.chargesAmount = this.OutletInfo.serviceCharges;
          x.chargesPercentage = 0;
        }
        else if (this.OutletInfo.serviceChargesPer > 0) {
          x.chargesAmount = 0;
          x.chargesPercentage = this.OutletInfo.serviceChargesPer;
        }
        else {
          x.chargesAmount = 0;
          x.chargesPercentage = 0;
        }
      }
      else if (x.name == "Take Away") {
        if (this.OutletInfo.takeawayCharges > 0) {
          x.chargesAmount = this.OutletInfo.takeawayCharges;
          x.chargesPercentage = 0;
        }
        else if (this.OutletInfo.takeawayChargesPer > 0) {
          x.chargesAmount = 0;
          x.chargesPercentage = this.OutletInfo.takeawayChargesPer;
        }
        else {
          x.chargesAmount = 0;
          x.chargesPercentage = 0;
        }
      }
      else {
        if (this.OutletInfo.deliveryCharges > 0) {
          x.chargesAmount = this.OutletInfo.deliveryCharges;
          x.chargesPercentage = 0;
        }
        else if (this.OutletInfo.deliveryChargesPer > 0) {
          x.chargesAmount = 0;
          x.chargesPercentage = this.OutletInfo.deliveryChargesPer;
        }
        else {
          x.chargesAmount = 0;
          x.chargesPercentage = 0;
        }
      }
    })
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
          this.taxResponseModel = c.responseTaxModel;
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
    var sectionID: any;
    var outletID: any;
    if (p.variantID > 0) {
      var index = this.responseFoodMenuItem.findIndex((x) => x.foodItemID == p.foodItemID);
      sectionID = this.responseFoodMenuItem[index].sectionID;
      outletID = this.responseFoodMenuItem[index].outletID;
    }
    else {
      sectionID = p.sectionID
    }
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
      outletID: outletID,
      refCode: p.refCode,
      variantID: p.variantID,
      variantName: p.variantName,
      variantPrice: p.variantPrice,
      dealID: p.dealID,
      dealName: p.dealName,
      itemsDescription: p.itemsDescription,
      dealPrice: p.dealPrice,
      kotID: 0,
      status: 1,
      sectionID: sectionID,
      totalTax: 0
    }
    if (body.sectionID == undefined) {
      body.sectionID = 0;
    }
    if (body.outletID == undefined) {
      body.outletID = this.GV.OutletID;
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
    this.calculateTaxes(p);
    this.calculateTotals();
    this.closeVariantsModal["first"].nativeElement.click();
  }

  getTaxes() {
    this.API.getdata('/Generic/getTax?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.taxesResponseModel = c.responseTax;
          this.dtTrigger.next();
        });
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  calculateTaxes(itemObj: any) {
    let arr = this.taxResponseModel.filter((c) => c.foodItemID == itemObj.foodItemID);
    var indexOfItem = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == itemObj.foodItemID);
    var quantity: any = this.POSNewModelRequest.requestKotDetail[indexOfItem].quantity;
    if (arr.length > 0) {
      var taxPercentageTotal = 0;
      arr.forEach((element) => {
        taxPercentageTotal += element.taxRate;
      })
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == itemObj.foodItemID);
      this.POSNewModelRequest.requestKotDetail[index].totalTax = ((itemObj.price * taxPercentageTotal) * quantity) / 100;

      this.taxResponseModel.forEach((y) => {
        if (y.foodItemID == itemObj.foodItemID) {
          let body = {
            taxName: y.taxName,
            taxRate: y.taxRate,
          }
          var index = this.taxArr.findIndex((el: any) => el.taxName == body.taxName);
          if (index == -1) {
            this.taxArr.push(body);
          }
          else {
            this.taxArr[index].taxRate += body.taxRate;
          }
        }
      })
    }
    else {
      var taxPercentageTotal = 0;
      this.taxesResponseModel.forEach((element) => {
        taxPercentageTotal += element.taxRate;
      })
      var index = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.foodItemID == itemObj.foodItemID);
      this.POSNewModelRequest.requestKotDetail[index].totalTax = ((itemObj.price * taxPercentageTotal) * quantity) / 100;

      this.taxesResponseModel.forEach((y) => {
        let body = {
          taxName: y.taxName,
          taxRate: y.taxRate,
        }
        var index = this.taxArr.findIndex((el: any) => el.taxName == body.taxName);
        if (index == -1) {
          this.taxArr.push(body);
        }
        else {
          this.taxArr[index].taxRate += body.taxRate;
        }
      })
    }
    this.calculateTotals();
    this.calculateTotalTax();
  }

  calculateTotalTax() {
    this.totalTaxInAmount = 0;
    this.POSNewModelRequest.requestKotDetail.forEach((x) => {
      this.totalTaxInAmount += x.totalTax;
    });
  }
  // calculateTaxes(itemObj: any, bool: any, quantity: any) {
  //   if (bool == true) {
  //     //adding tax case
  //     let arr = this.taxResponseModel.filter((c) => c.foodItemID == itemObj.foodItemID);
  //     if (arr.length > 0) {
  //       var loop = 0;
  //       while (loop < quantity) {
  //         //item with Taxes
  //         arr.forEach((element) => {
  //           var count = 0;
  //           var obj: any = this.taxResponseModel.find((x: any) => (x.foodItemID == element.foodItemID) && (x.foodItemtaxID == element.foodItemtaxID));
  //           var ind = this.taxArr.findIndex((y: any) => y.taxName == obj.taxName);
  //           if (ind == -1) {
  //             let body = {
  //               taxName: obj.taxName,
  //               taxRate: obj.taxRate,
  //               count: count + 1,
  //               isActive: true
  //             }
  //             this.taxArr.push(body);
  //           }
  //           else {
  //             this.taxArr[ind].taxRate += obj.taxRate;
  //             this.taxArr[ind].count += 1;
  //           }
  //         })
  //         loop++;
  //       }
  //     }
  //     else {
  //       var loop = 0;
  //       //item with No Taxes
  //       while (loop < quantity) {
  //         this.taxesResponseModel.forEach((el: any) => {
  //           var count = 0;
  //           var index = this.taxArr.findIndex((y: any) => y.taxName == el.taxName);
  //           if (index == -1) {
  //             let body = {
  //               taxName: el.taxName,
  //               taxRate: el.taxRate,
  //               count: count + 1,
  //               isActive: true
  //             }
  //             this.taxArr.push(body);
  //           }
  //           else {
  //             this.taxArr[index].taxRate += el.taxRate;
  //             this.taxArr[index].count += 1;
  //           }
  //         })
  //         loop++;
  //       }
  //     }
  //   }
  //   else {
  //     //removing tax case
  //     var index = this.taxResponseModel.findIndex((c) => c.foodItemID == itemObj.foodItemID);
  //     if (index != -1) {
  //       //item with Taxes
  //       let arr = this.taxResponseModel.filter((c) => c.foodItemID == itemObj.foodItemID);
  //       arr.forEach((item) => {
  //         var ind = this.taxArr.findIndex((y: any) => y.taxName == item.taxName);
  //         this.taxArr[ind].taxRate -= item.taxRate * quantity;
  //         this.taxArr[ind].count -= 1;
  //         if (this.taxArr[ind].taxRate == 0) {
  //           this.taxArr.splice(index, 1);
  //         }
  //       });
  //     }
  //     else {
  //       //item with No Taxes
  //       this.taxesResponseModel.forEach((el: any) => {
  //         var index = this.taxArr.findIndex((y: any) => y.taxName == el.taxName);
  //         this.taxArr[index].taxRate -= el.taxRate * quantity;
  //         this.taxArr[index].count -= 1;
  //         if (this.taxArr[index].taxRate == 0) {
  //           this.taxArr.splice(index, 1);
  //         }
  //       })
  //     }
  //   }

  //   this.totalTax = 0;
  //   this.taxArr.forEach((p: any) => {
  //     this.totalTax += p.taxRate;
  //   });
  // }
  // attachOutletTaxes() {
  //   this.taxesResponseModel.forEach((el) => {
  //     let body = {
  //       taxName: el.taxName,
  //       taxRate: el.taxRate,
  //       isActive: true
  //     }
  //     this.taxArr.push(body);
  //   })
  //   this.totalTax = 0;
  //   this.taxArr.forEach((p: any) => {
  //     this.totalTax += p.taxRate;
  //   });
  //   this.total = this.subTotal + this.salesTax + this.chargesValue + this.totalTax;
  // }
  // changeActiveStatus(p: any, val: any) {
  //   if (val.checked == false) {
  //     var index = this.taxArr.findIndex((x: any) => x.taxName == p.taxName);
  //     this.taxArr[index].isActive = false;
  //     this.totalTax -= this.taxArr[index].taxRate;
  //   }
  //   else {
  //     var index = this.taxArr.findIndex((x: any) => x.taxName == p.taxName);
  //     this.taxArr[index].isActive = true;
  //     this.totalTax += this.taxArr[index].taxRate;
  //   }
  //   this.calculateTotals();
  // }
  calculateTotals() {
    this.subTotal = 0;
    this.salesTax = 0;
    this.discount = 0;
    this.total = 0;
    this.balanceDue = 0;
    this.paidAmount = 0;
    this.changeAmount = 0;
    this.POSNewModelRequest.requestKotDetail.forEach((x) => {
      if (x.variantID) {
        this.subTotal += x.variantPrice * x.quantity;
        if (x.discount > 0) {
          this.discount += (x.variantPrice - x.calculatedPrice) * x.quantity;
        }
      }
      else if (x.foodItemID) {
        this.subTotal += x.price * x.quantity;
        if (x.discount > 0) {
          this.discount += (x.price - x.calculatedPrice) * x.quantity;
        }
      }
      else if (x.dealID) {
        this.subTotal += x.dealPrice * x.quantity;
      }
    })

    if (this.POSNewModelRequest.requestKotDetail.length > 0) {
      if (this.chargesValue > 0) {
        this.total += this.chargesValue;
      }
      //finding percentage value according to subtotal
      if (this.chargesValuePercentage > 0) {
        let ChargesValuePercentage = 0;
        ChargesValuePercentage = (this.chargesValuePercentage * this.subTotal) / 100;
        this.total += ChargesValuePercentage;
      }
      this.total += this.totalTaxInAmount;
      this.total += this.subTotal;
      this.total = (Math.ceil(this.total));
      this.totalDiscount = this.discount + this.invoiceDiscount;
      //Total discount gets minus from total payable in HTML

      this.balanceDue = this.subTotal + this.totalTaxInAmount + this.chargesValue;
      if (this.balanceDue < 0) {
        this.changeAmount = (this.balanceDue < 0) ? this.balanceDue * -1 : this.balanceDue;
        this.balanceDue = 0;
      }
      else {
        this.changeAmount = 0;
      }
    }



  }
  // calculateTotals() {
  //   this.subTotal = 0;
  //   this.salesTax = 0;
  //   this.discount = 0;
  //   this.total = 0;
  //   this.balanceDue = 0;
  //   this.paidAmount = 0;
  //   this.changeAmount = 0;
  //   this.POSNewModelRequest.requestKotDetail.forEach((x) => {
  //     if (x.variantID) {
  //       this.subTotal += x.variantPrice * x.quantity;
  //       if (x.discount > 0) {
  //         this.discount += (x.variantPrice - x.calculatedPrice) * x.quantity;
  //       }
  //       // if (x.discount == 0) {
  //       //   this.subTotal += x.variantPrice * x.quantity;
  //       // }
  //       // else {
  //       //   this.discount += (x.variantPrice - x.calculatedPrice) * x.quantity;
  //       //   this.subTotal += x.calculatedPrice * x.quantity;
  //       // }
  //     }
  //     else if (x.foodItemID) {
  //       this.subTotal += x.price * x.quantity;
  //       if (x.discount > 0) {
  //         this.discount += (x.price - x.calculatedPrice) * x.quantity;
  //       }

  //       // if (x.discount == 0) {
  //       //   this.subTotal += x.price * x.quantity;
  //       // }
  //       // else {
  //       //   this.discount += (x.price - x.calculatedPrice) * x.quantity;
  //       //   this.subTotal += x.calculatedPrice * x.quantity;
  //       // }
  //     }
  //     else if (x.dealID) {
  //       this.subTotal += x.dealPrice * x.quantity;
  //     }
  //   })

  //   if (this.POSNewModelRequest.requestKotDetail.length == 0) {
  //     this.total = 0;
  //   }
  //   // else {
  //   //   this.total = this.subTotal + this.salesTax + this.chargesValue;
  //   // }


  //   //finding tax percentage value according to subtotal
  //   var taxPercentagewrtSubtotal = 0;
  //   taxPercentagewrtSubtotal = (this.totalTax * this.subTotal) / 100;
  //   //finding percentage value according to subtotal
  //   let ChargesValuePercentage = 0;
  //   ChargesValuePercentage = (this.chargesValuePercentage * this.subTotal) / 100;
  //   if (this.chargesValue > 0) {
  //     this.total += this.chargesValue;
  //   }
  //   if (this.chargesValuePercentage > 0) {
  //     this.total += ChargesValuePercentage;
  //   }
  //   this.total += taxPercentagewrtSubtotal;
  //   this.total += this.subTotal;
  //   this.totalDiscount = this.discount + this.invoiceDiscount;
  //   //this.total -= this.discount;
  //   //this.total -= this.invoiceDiscount;

  //   this.balanceDue = this.subTotal + this.totalTaxInAmount + this.chargesValue;
  //   if (this.balanceDue < 0) {
  //     this.changeAmount = (this.balanceDue < 0) ? this.balanceDue * -1 : this.balanceDue;
  //     this.balanceDue = 0;
  //   }
  //   else {
  //     this.changeAmount = 0;
  //   }
  //   this.total = (Math.ceil(this.total));
  //   //............Discount......................
  //   // var one = this.subTotal - this.discount;
  //   // var two = this.subTotal - one;
  //   // var three = two / this.subTotal;
  //   // var four = three * 100;
  //   // this.discount = Math.floor(four);
  // }
  setTotalinInvDis() {
    this.totalDiscount = this.discount + this.invoiceDiscount;
    this.totalMinusInvDis = this.total - this.discount;
  }
  checkValidInput() {
    if (this.invoiceDiscount > 0) {
      if (this.discount + this.invoiceDiscount > this.total) {
        this.invoiceDiscount = 0;
        this.toastr.error('Invoice discount cannot be greater than Total Payable', '', {
          timeOut: 3000,
          'progressBar': true,
        });
      }
      else {
        this.totalDiscount = this.discount + this.invoiceDiscount;
        this.totalMinusInvDis = this.total - this.totalDiscount;
      }
    }
    else {
      this.invoiceDiscount = 0;
      this.totalDiscount = this.discount + this.invoiceDiscount;
    }
    // this.totalMinusInvDis = this.total - this.totalDiscount;
    // if (this.invoiceDiscount > 0) {
    //   var checkInvDisValid = this.totalMinusInvDis - this.invoiceDiscount;
    //   if (checkInvDisValid < 0) {
    //     this.invoiceDiscount = 0;
    //     this.toastr.error('Invoice discount cannot be greater than Total Payable', '', {
    //       timeOut: 3000,
    //       'progressBar': true,
    //     });
    //   }
    //   else {
    //     this.totalMinusInvDis -= this.invoiceDiscount;
    //     return
    //   }
    // }
  }
  saveInvDis() {
    this.totalDiscount = this.discount + this.invoiceDiscount;
    //this.discount += this.invoiceDiscount;
    // this.total = this.totalMinusInvDis;
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
    this.calculateTaxes(p);
    this.calculateTotals();
    return
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
    this.calculateTaxes(p);
    this.calculateTotals();
    return
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
  autocompleListFormatter = (data: any): SafeHtml => {
    let html = `<span>${data.customerName} </span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  valueChanged(newVal: any) {
    this.POSNewModelRequest.requestCustomerDetail.customerID = newVal.customerID;
    this.SearchForm.controls.CustomerName.setValue(newVal.customerName);
    this.SearchForm.controls.customerCode.setValue(newVal.refCode);

    // this.SearchForm = new FormGroup({
    //   foodMenuID: new FormControl(""),
    //   searchByRefCode: new FormControl(""),
    //   searchCustomerByCode: new FormControl(""),
    //   CustomerName: new FormControl(""),
    //   customerCode: new FormControl(""),
    // });


    // var com = this.responseCustomer.find(c => c.customerName == newVal);
    // if (com != null) {
    //   this.customerFound = true;
    //   this.SearchForm.controls.CustomerName.setValue(com.customerName);
    //   this.POSNewModelRequest.requestCustomerDetail.customerID = com.customerID;
    //   return
    // }
    // else {
    //   var customer: any = this.responseCustomer.find((x) => x.mobileNO == this.SearchForm.controls.searchCustomerByCode.value);
    //   if (customer) {
    //     this.customerFound = true;
    //     this.SearchForm.controls.CustomerName.setValue(customer.customerName);
    //     this.POSNewModelRequest.requestCustomerDetail.customerID = customer.customerID;
    //     return
    //   }
    //   if (this.SearchForm.controls.searchCustomerByCode.value == "") {
    //     this.customerFound = false;
    //     this.SearchForm.controls.CustomerName.setValue("");
    //     this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
    //     return
    //   }
    //   else {
    //     this.customerFound = false;
    //     this.SearchForm.controls.CustomerName.setValue("");
    //     this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
    //     this.toastr.error('Customer not found', '', {
    //       timeOut: 3000,
    //       'progressBar': true,
    //     });
    //   }
    // }
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
    this.balanceDue = 0;
    this.paidAmount = 0;
    this.changeAmount = 0;
    this.totalTax = 0;
    this.customerFound = false;
    this.editMode = false;
    this.selectedTables = [];
    this.taxArr = [];
    this.SearchForm.reset();
    this.CustomerForm.reset();
    this.changeOrderStatus = new changeOrderStatus();
    this.POSNewModelRequest = new POSNewModelRequest();
    this.chargesValue = this.OutletInfo.serviceCharges;
    this.chargesValuePercentage = this.OutletInfo.serviceChargesPer;
    this.invoiceDiscount = 0;
    this.totalMinusInvDis = 0;
    this.totalDiscount = 0;
    this.totalTaxInAmount = 0;
  }
  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  submitOrder() {
    if (this.POSNewModelRequest.requestKotDetail.length == 0) {
      this.toastr.error('Select atleast one item', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    var date: any = localStorage.getItem('openingDate');
    this.POSNewModelRequest.requestKot.invoiceDiscount = this.invoiceDiscount;
    this.POSNewModelRequest.requestKot.UserID = this.GV.userID;
    this.POSNewModelRequest.requestKot.outletID = this.GV.OutletID;
    this.POSNewModelRequest.requestKot.orderType = this.orderTypeValue;
    this.POSNewModelRequest.requestKotSR.outletID = this.GV.OutletID;
    this.POSNewModelRequest.FBRRequestObject.InvoiceNumber = "";
    this.POSNewModelRequest.FBRRequestObject.POSID = this.OutletInfo.posID;
    this.POSNewModelRequest.FBRRequestObject.USIN = this.OutletInfo.usinNumber;
    this.POSNewModelRequest.FBRRequestObject.RefUSIN = "";
    this.POSNewModelRequest.FBRRequestObject.DateTime = date;
    this.POSNewModelRequest.FBRRequestObject.BuyerName = "";
    this.POSNewModelRequest.FBRRequestObject.BuyerNTN = "";
    this.POSNewModelRequest.FBRRequestObject.BuyerCNIC = "";
    this.POSNewModelRequest.FBRRequestObject.BuyerPhoneNumber = "";
    this.POSNewModelRequest.FBRRequestObject.TotalSaleValue = this.total;
    this.POSNewModelRequest.FBRRequestObject.TotalTaxCharged = this.totalTax;
    this.POSNewModelRequest.FBRRequestObject.Discount = this.discount;
    this.POSNewModelRequest.FBRRequestObject.FurtherTax = 0;
    this.POSNewModelRequest.FBRRequestObject.TotalBillAmount = this.total;
    this.POSNewModelRequest.FBRRequestObject.PaymentMode = this.payModeID;
    this.POSNewModelRequest.FBRRequestObject.InvoiceType = 1;
    this.POSNewModelRequest.FBRRequestObject.TotalQuantity = this.POSNewModelRequest.requestKotDetail.length;
    this.POSNewModelRequest.requestKotDetail.forEach((item) => {
      if (item.dealID) {
        let body: any = {
          ItemCode: item.refCode,
          ItemName: item.dealName,
          PCTCode: '',
          Quantity: item.quantity,
          TaxRate: 0,
          SaleValue: item.price,
          Discount: item.discount,
          FurtherTax: 0,
          TaxCharged: 0,
          TotalAmount: item.quantity * item.price,
          InvoiceType: 1,
          RefUSIN: ''
        }
        this.POSNewModelRequest.FBRRequestObject.Items.push(body);
      }
      else {
        let body: any = {
          ItemCode: item.refCode,
          ItemName: item.foodItemName,
          PCTCode: '',
          Quantity: item.quantity,
          TaxRate: 0,
          SaleValue: item.price,
          Discount: item.discount,
          FurtherTax: 0,
          TaxCharged: 0,
          TotalAmount: item.quantity * item.price,
          InvoiceType: 1,
          RefUSIN: '',
        }
        this.POSNewModelRequest.FBRRequestObject.Items.push(body);
      }
    });
    if (!this.OpeningDate) {
      this.toastr.error('No Date is opened yet', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
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
          this.invoiceDiscount = this.POSNewModelRequest.requestKot.invoiceDiscount;
          this.KOTNumber = this.POSNewModelRequest.requestKot.kotNO.substring(0, 4);
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var customerObj = this.responseCustomer.find((x) => x.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.valueChanged(customerObj);
            // var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            // this.customerName = this.responseCustomer[index].customerName;
            // this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
            // this.searchCustomer();
          }
          // else {
          //   this.customerName = "";
          //   this.SearchForm.controls.searchCustomerByCode.setValue("");
          //   this.searchCustomer();
          // }
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
  getInvoiceReciept(kotID: any, val: any) {
    this.POSNewModelRequest = new POSNewModelRequest();
    this.API.getdata('/Pos/getKOTBykotID?kotID=' + kotID).subscribe(c => {
      if (c != null) {
        this.QRCodeValue = c.responseKot.code;
        this.invoiceDiscount = this.POSNewModelRequest.requestKot.invoiceDiscount;
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
          this.invoiceDiscount = this.POSNewModelRequest.requestKot.invoiceDiscount;
          this.KOTNumber = this.POSNewModelRequest.requestKot.kotNO.substring(0, 4);
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var customerObj = this.responseCustomer.find((x) => x.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.valueChanged(customerObj);
            // var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            // this.customerName = this.responseCustomer[index].customerName;
            // this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
            // this.searchCustomer();
          }
          // else {
          //   this.customerName = "";
          //   this.SearchForm.controls.searchCustomerByCode.setValue("");
          //   this.searchCustomer();
          // }
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
          // if (val == 1) {
          //   var button: any = document.getElementById("BillReciept");
          //   setTimeout(() => { button.click() }, 1000);
          // }
          // else {
          //   var button: any = document.getElementById("InvoiceReciept");
          //   setTimeout(() => { button.click() }, 1000);
          // }
          // setTimeout(() => { this.resetOrder(); }, 2000);
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
    this.API.getdata('/Pos/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseOrder = c.responseKot;
          this.responseOrder.sort((a, b) => a.kotID < b.kotID ? 1 : a.kotID > b.kotID ? -1 : 0);
          this.dtTrigger.next();
        });
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
          this.invoiceDiscount = this.POSNewModelRequest.requestKot.invoiceDiscount;
          this.KOTNumber = this.POSNewModelRequest.requestKot.kotNO.substring(0, 4);
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var customerObj = this.responseCustomer.find((x) => x.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.valueChanged(customerObj);
            // var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            // this.customerName = this.responseCustomer[index].customerName;
            // this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
            // this.searchCustomer();
          }
          // else {
          //   this.customerName = "";
          //   this.SearchForm.controls.searchCustomerByCode.setValue("");
          //   this.searchCustomer();
          // }
          this.tableList = "";
          this.POSNewModelRequest.requestCustomerTable.forEach((x) => {
            this.responseTable.forEach((c) => {
              if (c.tableID == x.tableID) {
                this.tableList = this.tableList.concat(c.tableName, ', ');
              }
            })
          })

          this.POSNewModelRequest.requestKotDetail.forEach((x) => {
            this.calculateTaxes(x);
          })
          setTimeout(() => { this.calculateTotals() }, 1000);
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
      if (this.OutletInfo.serviceCharges > 0) {
        this.chargesValue = this.OutletInfo.serviceCharges;
        this.chargesValuePercentage = 0;
      }
      else {
        this.chargesValuePercentage = this.OutletInfo.serviceChargesPer;
        this.chargesValue = 0;
      }
      this.calculateTotals();
    }
    else if (val == 2) {
      this.orderTypeValue = "Take Away";
      if (this.OutletInfo.takeawayCharges > 0) {
        this.chargesValue = this.OutletInfo.takeawayCharges;
        this.chargesValuePercentage = 0;
      }
      else {
        this.chargesValuePercentage = this.OutletInfo.takeawayChargesPer;
        this.chargesValue = 0;
      }
      this.calculateTotals();
    }
    else {
      this.submitted = false;
      this.orderTypeValue = "Delivery";
      if (this.OutletInfo.deliveryCharges > 0) {
        this.chargesValue = this.OutletInfo.deliveryCharges;
        this.chargesValuePercentage = 0;
      }
      else {
        this.chargesValuePercentage = this.OutletInfo.deliveryChargesPer;
        this.chargesValue = 0;
      }
      this.calculateTotals();
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
    this.CustomerForm.controls.isActive.setValue(true);
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




  //.............................
  calBalanceDue() {
    this.balanceDue = this.total - this.paidAmount;
    if (this.balanceDue < 0) {
      this.changeAmount = (this.balanceDue < 0) ? this.balanceDue * -1 : this.balanceDue;
      this.balanceDue = 0;
    }
    else {
      this.changeAmount = 0;
    }
  }
  // updateView(val: any) {
  //   if (val == 1) {
  //     this.showCart = true;
  //     this.showItems = false;
  //   }
  //   else {
  //     this.showCart = false;
  //     this.showItems = true;
  //   }
  // }

  getPaymentModes() {
    this.API.getdata('/Generic/getPaymentMode').subscribe(c => {
      if (c != null) {
        this.paymentTypesResponse = c.responsePaymentMode;
        if (this.OutletInfo.paymentModeID > 0) {
          var index = this.paymentTypesResponse.findIndex((x) => x.paymentModeID == this.OutletInfo.paymentModeID);
          this.payModeID = this.paymentTypesResponse[index].paymentModeID;
          this.PaymentModeName = this.paymentTypesResponse[index].paymentModeName;
        }
        else {
          this.payModeID = 0;
          this.PaymentModeName = '';
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

  payModeChanged() {
    var optionSelected: any = document.getElementById("payOption");
    var index = optionSelected.selectedIndex;
    this.payModeID = this.paymentTypesResponse[index].paymentModeID;
  }

  changePaymentMode(p: any, isActive: any) {
    if (isActive.checked == true) {
      this.payModeID = p.paymentModeID;
      this.PaymentModeName = p.paymentModeName;
    }
    else {
      this.payModeID = this.paymentTypesResponse[0].paymentModeID;
      this.PaymentModeName = this.paymentTypesResponse[0].paymentModeName;
    }
  }
  destroyDT = (tableIndex: any, clearData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
        this.datatableElement.forEach((dtElement: DataTableDirective, index) => {
          if (index == tableIndex) {
            if (dtElement.dtInstance) {

              if (tableIndex == 0) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
              else if (tableIndex == 1) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              } else if (tableIndex == 2) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
              else if (tableIndex == 3) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 4) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };
}

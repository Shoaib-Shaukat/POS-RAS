import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataTableDirective } from 'angular-datatables';
import { FoodCatRequestModel } from '../MenuCategories/FoodCategoryModel';
import { CurrencyModelResponse, FoodCatResponseModel, MenuItemsModel, ProductModelResponse, purchaseModelRequest, purchaseModelResponse, requestFoodMenuItem, requestItemIngredientDetail, requestVariant, responseFoodMenuItem, responseItemIgredientDetail, responseVariant, SectionModelResponse, VendorModelResponse } from './PurchaseModel';
import { throwIfEmpty } from 'rxjs/operators';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  GrandValue: any;
  PaidValue: any;
  DueValue: any;
  VendorModelResponse: VendorModelResponse[];
  purchaseModelResponse: purchaseModelResponse[];
  purchaseModelRequest: purchaseModelRequest;
  foodMenuItemModel: MenuItemsModel;
  ProductModelResponse: ProductModelResponse[];

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dropdownSettings: IDropdownSettings = {};
  responseItemIgredientDetail: responseItemIgredientDetail[];
  selectedIngredientsArray: requestItemIngredientDetail[];
  selectedIngredients: requestItemIngredientDetail[];
  addMode: boolean = false;
  submitted: boolean = false;
  Vsubmitted: boolean = false;
  PurchaseForm: FormGroup;
  isShow: boolean = false;
  showDiscount: boolean = false;
  showVDiscount: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.VendorModelResponse = [];
    this.purchaseModelResponse = [];
    this.purchaseModelRequest = new purchaseModelRequest();
    this.selectedIngredientsArray = [];
    this.selectedIngredients = [];
    this.responseItemIgredientDetail = [];
    this.ProductModelResponse = [];
    this.foodMenuItemModel = new MenuItemsModel();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'pID',
      textField: 'description',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.getPurchases();
    this.InitializeForm();
    this.getVendors();
    this.getProducts();
  }

  get f() { return this.PurchaseForm.controls; }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  InitializeForm() {
    this.PurchaseForm = new FormGroup({
      vendorID: new FormControl("", [Validators.required]),
      purchaseDate: new FormControl("", [Validators.required]),
      outletID: new FormControl(""),
      userID: new FormControl(""),
    });
  }

  addPurchase() {
    this.submitted = false;
    this.PurchaseForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.selectedIngredients = [];
    this.selectedIngredientsArray = [];
    this.PurchaseForm.controls.vendorID.setValue(0);
  }

  savePurchaseInfo() {
    this.submitted = true;
    if (this.PurchaseForm.valid) {
      this.PurchaseForm.controls.outletID.setValue(this.GV.OutletID);
      this.PurchaseForm.controls.userID.setValue(this.GV.userID);
      this.purchaseModelRequest.purchaseModel = this.PurchaseForm.value;
      this.API.PostData('//', this.purchaseModelRequest).subscribe(c => {
        if (c != null) {
          if (c.status == "Failed") {
            this.toastr.error(c.message, 'Error', {
              timeOut: 3000,
              'progressBar': true,
            });
          }
          else {
            this.toastr.success(c.message, 'Success', {
              timeOut: 3000,
              'progressBar': true,
            });
            this.isShow = !this.isShow;
            this.purchaseModelRequest = new purchaseModelRequest();
            this.getPurchases();
          }
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
  quantityChanged(ing: any, inputValue: any) {
    if (inputValue.value != "") {
      var value = Number(inputValue.value);
      var index = this.selectedIngredientsArray.findIndex((x) => x.pID == ing.pID);
      if (index != -1) {
        this.selectedIngredientsArray[index].total = Number(this.selectedIngredientsArray[index].costPrice * value);
      }
    }
    else {
      var index = this.selectedIngredientsArray.findIndex((x) => x.pID == ing.pID);
      if (index != -1) {
        this.selectedIngredientsArray[index].total = 0;
      }
    }
    var sum = 0;
    this.selectedIngredientsArray.forEach((x) => {
      if (x.total) {
        sum = sum + x.total;
      }
    });
    this.GrandValue = Number(sum);
    this.DueValue = this.GrandValue;
    if (this.PaidValue > 0) {
      this.DueValue = this.GrandValue - this.PaidValue;
    }
  }
  paidValueChanged() {
    if (this.PaidValue > 0) {
      this.DueValue = this.GrandValue - this.PaidValue;
    }
    else {
      this.DueValue = this.GrandValue;
    }
  }
  editPurchaseInfo(p: any) {
    this.addMode = true;
    this.isShow = !this.isShow;
    this.PurchaseForm.patchValue(p);
    // this.API.getdata('/FoodMenu/getVariant?foodItemID=' + p.foodItemID).subscribe(c => {
    //   if (c != null) {
    //     this.foodMenuItemModel.requestVariants = c.responseVariant;
    //     if (this.foodMenuItemModel.requestVariants.length == 0) {
    //       this.ItemPrice = false;
    //     } else {
    //       this.ItemPrice = true;
    //       this.PurchaseForm.controls.price.setValue(0);
    //     }
    //   }
    // },
    //   error => {
    //     this.toastr.error(error.statusText, 'Error', {
    //       timeOut: 3000,
    //       'progressBar': true,
    //     });
    //   });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  //................................................................
  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
    var index = this.foodMenuItemModel.requestItemIngredientDetail.findIndex((x) => ((x.pID == item.pID) && (x.description == item.description)));
    this.foodMenuItemModel.requestItemIngredientDetail.splice(index, 1);
    var indexSec = this.selectedIngredientsArray.findIndex((x) => ((x.pID == item.pID) && (x.description == item.description)));
    this.selectedIngredientsArray.splice(indexSec, 1);
    this.selectedIngredients = this.selectedIngredientsArray;
  }
  onItemDeSelectAll(item: any) {
    this.foodMenuItemModel.requestItemIngredientDetail = [];
    this.selectedIngredientsArray = [];
    this.selectedIngredients = [];
  }
  onSelectAll(items: any) {
    this.ProductModelResponse.forEach((x: any) => {
      var index = this.foodMenuItemModel.requestItemIngredientDetail.findIndex((c) => c.pID == x.pID);
      if (index == -1) {
        let body: any = {
          pID: x.pID,
          quantity: 0,
          amount: 0,
          instructions: "",
          description: x.description,
          unitName: x.unitName,
          costPrice: x.costPrice,
          total: 0
        }
        this.foodMenuItemModel.requestItemIngredientDetail.push(body);
        this.selectedIngredientsArray.push(body);
      }
    })
    this.selectedIngredients = this.selectedIngredientsArray;
  }
  onIngredientSelect(event: any) {
    var ingInfo: any = this.ProductModelResponse.find((x) => ((x.pID == event.pID) && (x.description == event.description)));
    let body: any = {
      pID: ingInfo.pID,
      quantity: 0,
      amount: 0,
      instructions: "",
      description: ingInfo.description,
      unitName: ingInfo.unitName,
      costPrice: ingInfo.costPrice,
      total: 0
    }
    this.foodMenuItemModel.requestItemIngredientDetail.push(body);
    this.selectedIngredientsArray.push(ingInfo);
    this.selectedIngredients = this.selectedIngredientsArray;
  }

  resetAll() {
    this.GrandValue = null;
    this.PaidValue = null;
    this.DueValue = null;
    this.addMode = false;
    this.submitted = false;
    this.PurchaseForm.reset();
    this.foodMenuItemModel = new MenuItemsModel();
    this.selectedIngredients = [];
    this.selectedIngredientsArray = [];
    this.PurchaseForm.controls.vendorID.setValue(0);
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

  getPurchases() {
    this.API.getdata('/Generic/getPurchases?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.purchaseModelResponse = c;
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


  getVendors() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getVendor?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.VendorModelResponse = c.responseVendor;
        let body: any = {
          vendorID: 0,
          vendorName: 'Select Vendor'
        }
        this.VendorModelResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  getProducts() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/Ingredient/getProduct?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.ProductModelResponse = c.responseProduct;
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

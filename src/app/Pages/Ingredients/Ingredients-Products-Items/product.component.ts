import { Component, OnInit, QueryList, ViewChildren, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { ProductModelResponse, SubCategoryResponse, IngredientResponse, IngCompanyResponse, unitResponse, VendorModelResponse, requestProductModel, LocationModelResponse, vendorResponse } from './ProductModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  selectedRegion: number;
  selectedCountry: number;
  addMode: boolean = false;
  submitted: boolean = false;
  showDiscount: boolean = true;
  ProductForm: FormGroup;
  isShow: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  requestProductModel: requestProductModel;
  ProductModelResponse: ProductModelResponse[];

  SubCategoryResponse: SubCategoryResponse[];
  IngredientResponse: IngredientResponse[];
  IngCompanyResponse: IngCompanyResponse[];
  VendorModelResponse: VendorModelResponse[];
  selectedVendors: VendorModelResponse[];
  selectedVendorsArray: VendorModelResponse[];
  unitResponse: unitResponse[];
  LocationModelResponse: LocationModelResponse[];
  vendorResponse: vendorResponse[];
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.requestProductModel = new requestProductModel();
    this.ProductModelResponse = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'vendorID',
      textField: 'vendorName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.SubCategoryResponse = [];
    this.IngredientResponse = [];
    this.IngCompanyResponse = [];
    this.unitResponse = [];
    this.VendorModelResponse = [];
    this.selectedVendors = [];
    this.LocationModelResponse = [];
    this.selectedVendorsArray = [];
    this.vendorResponse = [];
  }

  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getProducts();
    this.getAllIngredientsInfo();
    this.getVendors();
    this.getLocations();
  }

  InitializeForm() {
    this.ProductForm = new FormGroup({
      pID: new FormControl(""),
      description: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      isImported: new FormControl(""),
      userID: new FormControl(""),
      outletID: new FormControl(""),
      costPrice: new FormControl(""),
      baseSalePrice: new FormControl(""),
      discountPercentage: new FormControl(""),
      discountAmount: new FormControl(""),
      salePrice: new FormControl(""),
      opQuantity: new FormControl(""),
      opValue: new FormControl(""),
      recorderLevel: new FormControl(""),
      locationID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      ingredientID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      ingredientCategoryID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      ingredientCompanyID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      unitID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
    });
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
  getLocations() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getLocation?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.LocationModelResponse = c.responseLocation;
        let body: any = {
          locationID: 0,
          locationName: 'Select Location'
        }
        this.LocationModelResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getAllIngredientsInfo() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/Ingredient/getIngredient?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.IngredientResponse = c.responseIngredient;
        let body: any = {
          ingredientID: 0,
          name: 'Select Ingredient'
        }
        this.IngredientResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });

    this.API.getdata('/Ingredient/getIngredientCompany?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.IngCompanyResponse = c.responseIngredientCompany;
        let body: any = {
          ingredientCompanyID: 0,
          ingredientCompanyName: 'Select Ingredient Company'
        }
        this.IngCompanyResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });

    this.API.getdata('/Ingredient/getUnit?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.unitResponse = c.unitResponse;
        let body: any = {
          unitID: 0,
          name: 'Select Ingredient Unit'
        }
        this.unitResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getIngredientSubCategory() {
    this.SubCategoryResponse = [];
    this.API.getdata('/Ingredient/getIngredientCategoryAginstCategoryID?IngredientID=' + Number(this.ProductForm.controls.ingredientID.value)).subscribe(c => {
      if (c != null) {
        this.SubCategoryResponse = c.responseIngredientsCategory;
        let body: any = {
          ingredientCategoryID: 0,
          oName: 'Select Ingredient Sub Category'
        }
        this.SubCategoryResponse.push(body);
        this.ProductForm.controls.ingredientCategoryID.setValue(0);
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
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  addProduct() {
    this.submitted = false;
    this.ProductForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.ProductForm.controls.ingredientID.setValue(0);
    this.ProductForm.controls.ingredientCompanyID.setValue(0);
    this.ProductForm.controls.unitID.setValue(0);
    this.ProductForm.controls.locationID.setValue(0);
    this.requestProductModel = new requestProductModel();
    this.selectedVendors = [];
    this.selectedVendorsArray = [];
    this.ProductForm.controls.isActive.setValue(true);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.ProductForm.controls; }

  saveProduct() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.submitted = true;
    if (this.ProductForm.valid) {
      if (this.ProductForm.controls.pID.value == "" || this.ProductForm.controls.pID.value == null) {
        this.ProductForm.controls.pID.setValue(0);
      }
      if (this.ProductForm.controls.isImported.value == "" || this.ProductForm.controls.isImported.value == null) {
        this.ProductForm.controls.isImported.setValue(false);
      }
      this.ProductForm.controls.userID.setValue(this.GV.userID);
      this.ProductForm.controls.outletID.setValue(this.GV.OutletID);
      this.requestProductModel.requestProduct = this.ProductForm.value;
      this.requestProductModel.requestProduct.ingredientID = Number(this.requestProductModel.requestProduct.ingredientID);
      this.requestProductModel.requestProduct.ingredientCategoryID = Number(this.requestProductModel.requestProduct.ingredientCategoryID);
      this.requestProductModel.requestProduct.ingredientCompanyID = Number(this.requestProductModel.requestProduct.ingredientCompanyID);
      this.requestProductModel.requestProduct.unitID = Number(this.requestProductModel.requestProduct.unitID);
      this.requestProductModel.requestProduct.discountAmount = Number(this.requestProductModel.requestProduct.discountAmount);
      this.requestProductModel.requestProduct.discountPercentage = Number(this.requestProductModel.requestProduct.discountPercentage);
      this.requestProductModel.requestProduct.locationID = Number(this.requestProductModel.requestProduct.locationID);
      this.requestProductModel.requestProduct.recorderLevel = Number(this.requestProductModel.requestProduct.recorderLevel);
      this.requestProductModel.requestProduct.salePrice = Number(this.requestProductModel.requestProduct.salePrice);
      this.requestProductModel.requestProduct.opValue = Number(this.requestProductModel.requestProduct.opValue);
      this.requestProductModel.requestProduct.opQuantity = Number(this.requestProductModel.requestProduct.opQuantity);
      this.requestProductModel.requestProduct.baseSalePrice = Number(this.requestProductModel.requestProduct.baseSalePrice);
      this.requestProductModel.requestProduct.costPrice = Number(this.requestProductModel.requestProduct.costPrice);
      this.API.PostData('/Ingredient/AddEditProduct', this.requestProductModel).subscribe(c => {
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
          this.isShow = !this.isShow;
          this.getProducts();
          this.resetAll();
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
  isActiveCheck(check: boolean) {
    if (check == true) {
      this.ProductForm.controls.isActive.setValue(true);
    } else {
      this.ProductForm.controls.isActive.setValue(false);
    }
  }
  isImportedCheck(check: boolean) {
    if (check == true) {
      this.ProductForm.controls.isImported.setValue(true);
    } else {
      this.ProductForm.controls.isImported.setValue(false);
    }
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
        this.destroyDT(0, false).then(destroyed => {
          this.ProductModelResponse = c.responseProduct;
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

  editProduct(p: any) {
    this.requestProductModel = new requestProductModel();
    this.selectedVendors = [];
    this.selectedVendorsArray = [];
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.ProductForm.patchValue(p);
    this.getVendorsList(p.pID);
    this.getIngredientSubCategory();
    setTimeout(() => { this.ProductForm.controls.ingredientCategoryID.patchValue(p.ingredientCategoryID); }, 1000);
  }
  getVendorsList(productID: any) {
    this.vendorResponse = [];
    this.API.getdata('/Ingredient/getVendor?pID=' + productID).subscribe(c => {
      if (c != null) {
        this.vendorResponse = c.responseVendorDetail;
        this.selectedVendors = c.responseVendorDetail;
        this.selectedVendorsArray = c.responseVendorDetail;
        if (this.vendorResponse.length > 0) {
          this.vendorResponse.forEach((x) => {
            let body = {
              vendorID: x.vendorID
            }
            this.requestProductModel.requestVendorDetail.push(body);
          })
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
  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
    var index = this.requestProductModel.requestVendorDetail.findIndex((x) => x.vendorID == item.vendorID);
    this.requestProductModel.requestVendorDetail.splice(index, 1);
    var indexArr = this.selectedVendorsArray.findIndex((y) => y.vendorID == item.vendorID);
    this.selectedVendorsArray.splice(indexArr, 1);
    this.selectedVendors = this.selectedVendorsArray;
  }
  onItemDeSelectAll(item: any) {
    this.requestProductModel.requestVendorDetail = [];
    this.selectedVendorsArray = [];
    this.selectedVendors = [];
  }
  onSelectAll(items: any) {
    this.requestProductModel.requestVendorDetail = [];
    this.selectedVendorsArray = [];
    this.selectedVendors = [];
    this.VendorModelResponse.forEach((x) => {
      let body = {
        vendorID: x.vendorID
      }
      this.requestProductModel.requestVendorDetail.push(body);
    })
    this.selectedVendorsArray = this.VendorModelResponse;
    this.selectedVendors = this.selectedVendorsArray;
  }
  onVendorSelect(event: any) {
    var vendorInfo: any = this.VendorModelResponse.find((x) => x.vendorID == event.vendorID);
    let body = {
      vendorID: vendorInfo.vendorID
    }
    this.requestProductModel.requestVendorDetail.push(body);
    this.selectedVendorsArray.push(vendorInfo);
    this.selectedVendors = this.selectedVendorsArray;
  }

  calOpValue() {
    var value = this.ProductForm.controls.costPrice.value * this.ProductForm.controls.opQuantity.value;
    this.ProductForm.controls.opValue.setValue(value);
  }
  resetDiscounts() {
    this.ProductForm.controls.discountAmount.setValue(0);
    this.ProductForm.controls.discountPercentage.setValue(0);
    this.ProductForm.controls.salePrice.setValue(0);
    if (this.ProductForm.controls.baseSalePrice.value == null || this.ProductForm.controls.baseSalePrice.value == 0) {
      this.ProductForm.controls.baseSalePrice.setValue(0);
      this.showDiscount = true;
    }
    else {
      this.showDiscount = false;
    }
  }
  caldiscountAmount() {
    this.ProductForm.controls.discountPercentage.setValue(Number(this.ProductForm.controls.discountPercentage.value));
    this.ProductForm.controls.baseSalePrice.setValue(Number(this.ProductForm.controls.baseSalePrice.value));
    if (this.ProductForm.controls.discountPercentage.value > 100) {
      this.toastr.error('', 'Invalid Input', {
        timeOut: 3000,
        'progressBar': true,
      });
      this.ProductForm.controls.discountAmount.setValue(0);
      this.ProductForm.controls.discountPercentage.setValue(0);
      this.ProductForm.controls.salePrice.setValue(0);
      return
    }
    if (this.ProductForm.controls.discountPercentage.value != null || this.ProductForm.controls.discountPercentage.value != 0) {
      var one = this.ProductForm.controls.discountPercentage.value * this.ProductForm.controls.baseSalePrice.value;
      var two = one / 100;
      var three = this.ProductForm.controls.baseSalePrice.value - two;
      this.ProductForm.controls.discountAmount.setValue(Math.ceil(two));
      this.ProductForm.controls.salePrice.setValue(Math.ceil(three));
    }
    else {
      this.ProductForm.controls.salePrice.setValue(0);
    }
  }
  calDiscountPercentage() {
    this.ProductForm.controls.discountAmount.setValue(Number(this.ProductForm.controls.discountAmount.value));
    this.ProductForm.controls.baseSalePrice.setValue(Number(this.ProductForm.controls.baseSalePrice.value));
    if (this.ProductForm.controls.discountAmount.value > this.ProductForm.controls.baseSalePrice.value) {
      this.toastr.error('', 'Invalid Input', {
        timeOut: 3000,
        'progressBar': true,
      });
      this.ProductForm.controls.discountAmount.setValue(0);
      this.ProductForm.controls.discountPercentage.setValue(0);
      this.ProductForm.controls.salePrice.setValue(0);
      return
    }

    if (this.ProductForm.controls.discountAmount.value == null || this.ProductForm.controls.discountAmount.value == 0 || this.ProductForm.controls.discountAmount.value == "") {
      this.ProductForm.controls.discountAmount.setValue(0);
      this.ProductForm.controls.discountPercentage.setValue(0);
      this.ProductForm.controls.salePrice.setValue(0);
    }
    else {
      var one = this.ProductForm.controls.baseSalePrice.value - this.ProductForm.controls.discountAmount.value;
      var two = this.ProductForm.controls.baseSalePrice.value - one;
      var three = two / this.ProductForm.controls.baseSalePrice.value;
      var four = three * 100;
      this.ProductForm.controls.discountPercentage.setValue(Math.ceil(four));
      this.ProductForm.controls.salePrice.setValue(Math.ceil(one));
    }
  }

  resetAll() {
    this.SubCategoryResponse = [];
    this.ProductForm.reset();
    this.requestProductModel = new requestProductModel();
    this.selectedVendors = [];
    this.submitted = false;
    this.selectedVendorsArray = [];
    this.ProductForm.controls.ingredientID.setValue(0);
    this.ProductForm.controls.ingredientCompanyID.setValue(0);
    this.ProductForm.controls.unitID.setValue(0);
    this.ProductForm.controls.locationID.setValue(0);
    this.ProductForm.controls.isActive.setValue(true);
  }
}
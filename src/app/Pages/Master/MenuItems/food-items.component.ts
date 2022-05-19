import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestFoodMenuItem, FoodCatResponseModel, responseFoodMenuItem, MenuItemsModel, requestVariant, responseVariant, SectionModelResponse, CurrencyModelResponse, ProductModelResponse, requestItemIngredientDetail, taxesResponseModel, requestTaxDetail } from './ItemsModel';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DataTableDirective } from 'angular-datatables';
import { FoodCatRequestModel } from '../MenuCategories/FoodCategoryModel';
@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.css']
})
export class FoodItemsComponent implements OnInit, OnDestroy {
  taxesResponseModel: taxesResponseModel[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  dropdownSettings: IDropdownSettings = {};
  dropdownSettings1: IDropdownSettings = {};

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

  CurrencyModelResponse: CurrencyModelResponse[];
  SectionModelResponse: SectionModelResponse[];
  responseVariant: responseVariant[];
  ItemPrice: boolean = false;
  requestVariant: requestVariant;
  foodMenuItemModel: MenuItemsModel;
  responseFoodMenuItem: responseFoodMenuItem[];
  ItemsResponseModelReplica: responseFoodMenuItem[];
  requestFoodMenuItem: requestFoodMenuItem;
  FoodCatResponseModel: FoodCatResponseModel[];
  ProductModelResponse: ProductModelResponse[];
  selectedIngredientsArray: requestItemIngredientDetail[];
  selectedIngredients: requestItemIngredientDetail[];

  selectedTaxesArray: requestTaxDetail[];
  selectedTaxes: requestTaxDetail[];

  addMode: boolean = false;
  submitted: boolean = false;
  Vsubmitted: boolean = false;
  MenuItemsForm: FormGroup;
  VariantForm: FormGroup;
  SearchForm: FormGroup;
  isShow: boolean = false;
  showDiscount: boolean = false;
  showVDiscount: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.requestFoodMenuItem = new requestFoodMenuItem();
    this.FoodCatResponseModel = [];
    this.foodMenuItemModel = new MenuItemsModel();
    this.responseVariant = [];
    this.SectionModelResponse = [];
    this.CurrencyModelResponse = [];
    this.ProductModelResponse = [];
    this.selectedIngredientsArray = [];
    this.selectedIngredients = [];
    this.taxesResponseModel = [];
    this.selectedTaxes = [];
    this.selectedTaxesArray = [];
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

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'taxID',
      textField: 'taxName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    }
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    this.symbol = this.GV.Currency;
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.InitializeForm();
    this.getAllItems();
    this.GetFoodMenuCategory();
    this.resetDiscounts();
    this.resetDiscountsV();
    this.getSections();
    this.getCurrencies();
    this.getProducts();
    this.getTaxes();
    this.SearchForm.controls.foodMenuID.setValue(0);
  }

  get f() { return this.MenuItemsForm.controls; }
  get g() { return this.VariantForm.controls; }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  InitializeForm() {
    this.MenuItemsForm = new FormGroup({
      foodItemID: new FormControl(),
      refCode: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      foodItemName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      description: new FormControl(),
      price: new FormControl(),
      isActive: new FormControl(),
      hasVariant: new FormControl(),
      foodMenuID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      UserID: new FormControl(),
      outletID: new FormControl(),
      discount: new FormControl(),
      calculatedPrice: new FormControl(),
      discountPercentage: new FormControl(),
      discountRupees: new FormControl(),
      imageURl: new FormControl(),
      sectionID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      currencyID: new FormControl(),
      preparationTime: new FormControl(),
      generalRemarks: new FormControl(),
      prepRemarks: new FormControl()
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
    });
  }

  addNewFoodCategory() {
    this.ItemPrice = false;
    this.submitted = false;
    this.MenuItemsForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.foodMenuItemModel = new MenuItemsModel();
    this.resetDiscounts();
    this.MenuItemsForm.controls.foodMenuID.setValue(0);
    this.SearchForm.controls.foodMenuID.setValue(0);
    this.MenuItemsForm.controls.sectionID.setValue(0);
    this.MenuItemsForm.controls.currencyID.setValue(0);
    this.selectedIngredients = [];
    this.selectedIngredientsArray = [];
    this.selectedTaxes = [];
    this.selectedTaxesArray = [];
    this.MenuItemsForm.controls.isActive.setValue(true);
    this.filterCategories();
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
  getSections() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getSection?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.SectionModelResponse = c.responseSections;
        let body: any = {
          sectionID: 0,
          sectionName: 'Select Section'
        }
        this.SectionModelResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getCurrencies() {
    this.API.getdata('/Generic/getCurrency?companyID=' + this.GV.companyID).subscribe(c => {
      if (c != null) {
        this.CurrencyModelResponse = c.responseCurrencies;
        let body: any = {
          currencyID: 0,
          currencyName: 'Select Currency'
        }
        this.CurrencyModelResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  GetFoodMenuCategory() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getfoodMenu?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.FoodCatResponseModel = c.foodMenuResponses;
        let body: any = {
          foodMenuID: 0,
          foodMenuName: 'Select Menu Category'
        }
        this.FoodCatResponseModel.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  SaveMenuItems() {
    this.submitted = true;
    if (this.MenuItemsForm.valid) {
      //this.uploadFiles();
      if (this.foodMenuItemModel.requestVariants.length > 0) {
        this.MenuItemsForm.controls.hasVariant.setValue(true);
        this.imageUrl = "";
      }
      else {
        this.MenuItemsForm.controls.hasVariant.setValue(false);
      }
      if (this.MenuItemsForm.controls.foodMenuID.value == null) {
        this.MenuItemsForm.controls.foodMenuID.setValue(0);
      }
      if (this.MenuItemsForm.controls.foodItemID.value == null) {
        this.MenuItemsForm.controls.foodItemID.setValue(0);
        this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => x.foodItemID = 0);
        this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => x.itemIgredeintID = 0);
        this.foodMenuItemModel.requestTaxModel.forEach((x) => x.foodItemID = 0);
      }
      if (this.MenuItemsForm.controls.discountPercentage.value != null && this.MenuItemsForm.controls.discountPercentage.value != 0) {
        this.MenuItemsForm.controls.discount.setValue(this.MenuItemsForm.controls.discountPercentage.value);
      }
      else {
        this.MenuItemsForm.controls.discount.setValue(0);
      }
      if (this.MenuItemsForm.controls.calculatedPrice.value == null) {
        this.MenuItemsForm.controls.calculatedPrice.setValue(0);
      }
      if (this.MenuItemsForm.controls.refCode.value == null) {
        this.MenuItemsForm.controls.refCode.setValue("");
      }

      this.MenuItemsForm.controls.outletID.setValue(this.GV.OutletID);
      this.MenuItemsForm.controls.UserID.setValue(this.GV.userID);
      this.MenuItemsForm.controls.foodMenuID.setValue(+(this.MenuItemsForm.controls.foodMenuID.value));
      this.foodMenuItemModel.requestFoodMenuItem = this.MenuItemsForm.value;
      if (this.imageUrl == null || this.imageUrl == "" || this.imageUrl == undefined) {
        this.imageUrl = ""
      }
      else {
        this.foodMenuItemModel.requestFoodMenuItem.imageURl = this.imageUrl;
      }
      this.foodMenuItemModel.requestFoodMenuItem.currencyID = Number(this.foodMenuItemModel.requestFoodMenuItem.currencyID);
      this.foodMenuItemModel.requestFoodMenuItem.preparationTime = Number(this.foodMenuItemModel.requestFoodMenuItem.preparationTime);
      this.foodMenuItemModel.requestFoodMenuItem.sectionID = Number(this.foodMenuItemModel.requestFoodMenuItem.sectionID);
      this.API.PostData('/FoodMenu/AddEditfoodMenuItem', this.foodMenuItemModel).subscribe(c => {
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
            this.foodMenuItemModel = new MenuItemsModel();
            this.SearchForm.controls.foodMenuID.setValue(0);
            this.getAllItems();
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
  // amountChanged(ing: any, inputValue: any) {
  //   var value = Number(inputValue.value);
  //   this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => {
  //     if ((x.description == ing.description) && (x.pID == ing.pID)) {
  //       x.amount = value;
  //     }
  //   })
  // }
  instructionsChanged(ing: any, inputValue: any) {
    if (inputValue.value != "") {
      this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => {
        if ((x.description == ing.description) && (x.pID == ing.pID)) {
          x.instructions = inputValue.value;
          var index = this.selectedIngredientsArray.findIndex((y) => ((y.description == x.description) && (y.pID == x.pID)));
          this.selectedIngredientsArray[index].instructions = x.instructions;
          return
        }
      })
    }
    else {
      this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => {
        if ((x.description == ing.description) && (x.pID == ing.pID)) {
          x.instructions = "";
          var index = this.selectedIngredientsArray.findIndex((y) => ((y.description == x.description) && (y.pID == x.pID)));
          this.selectedIngredientsArray[index].instructions = "";
          return
        }
      })
    }
  }
  quantityChanged(ing: any, inputValue: any) {
    if (inputValue.value != "") {
      var value = Number(inputValue.value);
      this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => {
        if ((x.description == ing.description) && (x.pID == ing.pID)) {
          x.quantity = value;
          x.amount = (value) * (Number(ing.costPrice));
          var index = this.selectedIngredientsArray.findIndex((y) => y.description == x.description);
          this.selectedIngredientsArray[index].amount = x.amount;
          return
        }
      })
    }
    else {
      this.foodMenuItemModel.requestItemIngredientDetail.forEach((x) => {
        if ((x.description == ing.description) && (x.pID == ing.pID)) {
          x.quantity = value;
          x.amount = 0;
          var index = this.selectedIngredientsArray.findIndex((y) => y.description == x.description);
          this.selectedIngredientsArray[index].amount = 0;
          return
        }
      })
    }
  }
  EditFoodMenuCategory(p: any) {
    this.addMode = true;
    this.isShow = !this.isShow;
    this.MenuItemsForm.patchValue(p);
    if (this.MenuItemsForm.controls.price.value > 0) {
      this.showDiscount = false;
    }
    else {
      this.showDiscount = true;
    }
    this.API.getdata('/FoodMenu/getVariant?foodItemID=' + p.foodItemID).subscribe(c => {
      if (c != null) {
        this.foodMenuItemModel.requestVariants = c.responseVariant;
        if (this.foodMenuItemModel.requestVariants.length == 0) {
          this.ItemPrice = false;
        } else {
          this.ItemPrice = true;
          this.MenuItemsForm.controls.price.setValue(0);
        }
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
    //get Selected Ingredients
    this.API.getdata('/FoodMenu/getItemIngredientDetail?foodItemID=' + p.foodItemID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.foodMenuItemModel.requestItemIngredientDetail = [];
          this.selectedIngredientsArray = [];
          this.selectedIngredients = [];
        }
        else {
          this.selectedIngredients = c.responseItemIgredientDetail;
          this.selectedIngredientsArray = c.responseItemIgredientDetail;
          this.foodMenuItemModel.requestItemIngredientDetail = c.responseItemIgredientDetail;
        }
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
    //get Selected Taxes
    this.API.getdata('/FoodMenu/getfooditemTaxDetail?foodItemID=' + p.foodItemID).subscribe(c => {
      if (c != null) {
        this.selectedTaxes = c.responseTaxModel;
        this.selectedTaxesArray = c.responseTaxModel;
        this.foodMenuItemModel.requestTaxModel = c.responseTaxModel;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
    this.selectedTaxes = [];
    this.selectedTaxesArray = [];
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.MenuItemsForm.controls.isActive.setValue(true);
    } else {
      this.MenuItemsForm.controls.isActive.setValue(false);
    }
  }

  pushVariant() {
    this.Vsubmitted = true;
    if (this.VariantForm.valid) {
      if (this.VariantForm.controls.RefCode.value == null) {
        this.VariantForm.controls.RefCode.setValue("");
      }
      if (this.VariantForm.controls.variantID.value == null) {
        this.VariantForm.controls.variantID.setValue(0);
      }
      if (this.VariantForm.controls.foodItemID.value == null) {
        this.VariantForm.controls.foodItemID.setValue(0);
      }
      if (this.MenuItemsForm.controls.foodItemID.value != null || this.MenuItemsForm.controls.foodItemID.value != 0) {
        this.VariantForm.controls.foodItemID.setValue(+(this.MenuItemsForm.controls.foodItemID.value));
      }
      if (this.VariantForm.controls.discount.value == null) {
        this.VariantForm.controls.discount.setValue(0);
      }
      if (this.VariantForm.controls.calculatedPrice.value == null) {
        this.VariantForm.controls.calculatedPrice.setValue(0);
      }
      if (this.VariantForm.controls.discountPercentage.value != null && this.VariantForm.controls.discountPercentage.value != 0) {
        this.VariantForm.controls.discount.setValue(this.VariantForm.controls.discountPercentage.value);
      }
      else {
        this.VariantForm.controls.discount.setValue(0);
      }

      this.requestVariant = this.VariantForm.value;

      if (this.imageUrlV == null || this.imageUrlV == "" || this.imageUrlV == undefined) {
        this.imageUrlV = ""
        this.requestVariant.imageURL = this.imageUrlV;
      }
      else {
        this.requestVariant.imageURL = this.imageUrlV;
      }
      if (this.VariantForm.controls.variantID.value == 0) {
        this.foodMenuItemModel.requestVariants.push(this.requestVariant);
      }
      else {
        var index = this.foodMenuItemModel.requestVariants.findIndex((x) => x.variantID == this.VariantForm.controls.variantID.value);
        this.foodMenuItemModel.requestVariants[index] = this.requestVariant;
      }
      this.closeVariantModal["first"].nativeElement.click();
    }
    if (this.foodMenuItemModel.requestVariants.length == 0) {
      this.ItemPrice = false;
    }
    else {
      this.imageUrl = "";
      this.foodMenuItemModel.requestFoodMenuItem.imageURl = "";
      this.ItemPrice = true;
      this.MenuItemsForm.controls.price.setValue(0);
      this.MenuItemsForm.controls.discount.setValue(0);
      this.MenuItemsForm.controls.discountPercentage.setValue(0);
      this.MenuItemsForm.controls.discountRupees.setValue(0);
      this.MenuItemsForm.controls.calculatedPrice.setValue(0);
    }
  }

  removeVariant(p: any) {
    var index = this.foodMenuItemModel.requestVariants.findIndex(
      (c) => c.variantID == p.variantID
    );
    this.foodMenuItemModel.requestVariants.splice(index, 1);

    if (this.foodMenuItemModel.requestVariants.length == 0) {
      this.ItemPrice = false;
    } else {
      this.ItemPrice = true;
      this.MenuItemsForm.controls.price.setValue(0);
    }
  }

  addVariant() {
    this.Vsubmitted = false;
    this.VariantForm.reset();
    this.resetDiscountsV();
    this.myInputVariableVariant.nativeElement.value = "";
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editVariant(p: any) {
    this.VariantForm.patchValue(p);
    if (this.VariantForm.controls.variantPrice.value > 0) {
      this.showVDiscount = false;
    }
    else {
      this.showVDiscount = true;
    }
  }

  getAllItems() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getfoodItemAgainstOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.ItemsResponseModelReplica = c.responseFoodMenuItems;
          this.dtTrigger.next();
        });
        this.responseFoodMenuItem = c.responseFoodMenuItems;
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

  filterCategories() {
    if (this.SearchForm.controls.foodMenuID.value != 0) {
      const result = this.responseFoodMenuItem.filter(x => x.foodMenuID == this.SearchForm.controls.foodMenuID.value);
      this.ItemsResponseModelReplica = result;
    }
    else {
      this.ItemsResponseModelReplica = this.responseFoodMenuItem;
    }
  }

  calDiscountRupees() {
    if (this.MenuItemsForm.controls.discountPercentage.value > 100) {
      this.toastr.error('', 'Invalid Input', {
        timeOut: 3000,
        'progressBar': true,
      });
      this.MenuItemsForm.controls.discountRupees.setValue(0);
      this.MenuItemsForm.controls.discountPercentage.setValue(0);
      this.MenuItemsForm.controls.calculatedPrice.setValue(0);
      return
    }
    if (this.MenuItemsForm.controls.discountPercentage.value != null || this.MenuItemsForm.controls.discountPercentage.value != 0) {
      var one = this.MenuItemsForm.controls.discountPercentage.value * this.MenuItemsForm.controls.price.value;
      var two = one / 100;
      var three = this.MenuItemsForm.controls.price.value - two;
      this.MenuItemsForm.controls.discountRupees.setValue(Math.ceil(two));
      this.MenuItemsForm.controls.calculatedPrice.setValue(Math.ceil(three));
    }
    else {
      this.MenuItemsForm.controls.calculatedPrice.setValue(0);
    }
  }
  calDiscountPercentage() {
    if (this.MenuItemsForm.controls.discountRupees.value > this.MenuItemsForm.controls.price.value) {
      this.toastr.error('', 'Invalid Input', {
        timeOut: 3000,
        'progressBar': true,
      });
      this.MenuItemsForm.controls.discountRupees.setValue(0);
      this.MenuItemsForm.controls.discountPercentage.setValue(0);
      this.MenuItemsForm.controls.calculatedPrice.setValue(0);
      return
    }
    if (this.MenuItemsForm.controls.discountRupees.value != null || this.MenuItemsForm.controls.discountRupees.value != 0) {
      var one = this.MenuItemsForm.controls.price.value - this.MenuItemsForm.controls.discountRupees.value;
      var two = this.MenuItemsForm.controls.price.value - one;
      var three = two / this.MenuItemsForm.controls.price.value;
      var four = three * 100;
      this.MenuItemsForm.controls.discountPercentage.setValue(Math.ceil(four));
      this.MenuItemsForm.controls.calculatedPrice.setValue(Math.ceil(one));
    }
    else {
      this.MenuItemsForm.controls.calculatedPrice.setValue(0);
    }
  }

  resetDiscounts() {
    this.MenuItemsForm.controls.discountRupees.setValue(0);
    this.MenuItemsForm.controls.discountPercentage.setValue(0);
    this.MenuItemsForm.controls.calculatedPrice.setValue(0);
    if (this.MenuItemsForm.controls.price.value == null || this.MenuItemsForm.controls.price.value == 0) {
      this.MenuItemsForm.controls.price.setValue(0);
      this.showDiscount = true;
    }
    else {
      this.showDiscount = false;
    }
  }

  calDiscountRupeesV() {
    if (this.VariantForm.controls.discountPercentage.value > 100) {
      this.toastr.error('', 'Invalid Input', {
        timeOut: 3000,
        'progressBar': true,
      });
      this.VariantForm.controls.discountRupees.setValue(0);
      this.VariantForm.controls.discountPercentage.setValue(0);
      this.VariantForm.controls.calculatedPrice.setValue(0);
      return
    }
    if (this.VariantForm.controls.discountPercentage.value != null || this.VariantForm.controls.discountPercentage.value != 0) {
      var one = this.VariantForm.controls.discountPercentage.value * this.VariantForm.controls.variantPrice.value;
      var two = one / 100;
      var three = this.VariantForm.controls.variantPrice.value - two;
      this.VariantForm.controls.discountRupees.setValue(Math.ceil(two));
      this.VariantForm.controls.calculatedPrice.setValue(Math.ceil(three));
    }
    else {
      this.VariantForm.controls.calculatedPrice.setValue(0);
    }
  }
  calDiscountPercentageV() {
    if (this.VariantForm.controls.discountRupees.value > this.VariantForm.controls.variantPrice.value) {
      this.toastr.error('', 'Invalid Input', {
        timeOut: 3000,
        'progressBar': true,
      });
      this.VariantForm.controls.discountRupees.setValue(0);
      this.VariantForm.controls.discountPercentage.setValue(0);
      this.VariantForm.controls.calculatedPrice.setValue(0);
      return
    }
    if (this.VariantForm.controls.discountRupees.value != null || this.VariantForm.controls.discountRupees.value != 0) {
      var one = this.VariantForm.controls.variantPrice.value - this.VariantForm.controls.discountRupees.value;
      var two = this.VariantForm.controls.variantPrice.value - one;
      var three = two / this.VariantForm.controls.variantPrice.value;
      var four = three * 100;
      this.VariantForm.controls.discountPercentage.setValue(Math.ceil(four));
      this.VariantForm.controls.calculatedPrice.setValue(Math.ceil(one));
    }
    else {
      this.VariantForm.controls.calculatedPrice.setValue(0);
    }
  }
  resetDiscountsV() {
    this.VariantForm.controls.discountRupees.setValue(0);
    this.VariantForm.controls.discountPercentage.setValue(0);
    this.VariantForm.controls.calculatedPrice.setValue(0);
    if (this.VariantForm.controls.variantPrice.value == null || this.VariantForm.controls.variantPrice.value == 0) {
      this.VariantForm.controls.variantPrice.setValue(0);
      this.showVDiscount = true;
    }
    else {
      this.showVDiscount = false;
    }
  }


  //Attach Image..........................................................................................

  attachImage(file: any) {
    if (!file.target.files)
      return;
    this.fileToUpload = file.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  attachImageV(file: any) {
    if (!file.target.files)
      return;
    this.fileToUpload = file.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrlV = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  //................................................................
  onItemSelect(item: any) {
  }
  onItemDeSelect(item: any) {
    var index = this.foodMenuItemModel.requestItemIngredientDetail.findIndex((x) => ((x.pID == item.pID) && (x.description == item.description)));
    this.foodMenuItemModel.requestItemIngredientDetail.splice(index, 1);
    this.selectedIngredientsArray = this.foodMenuItemModel.requestItemIngredientDetail;
    this.selectedIngredients = this.selectedIngredientsArray;
    // var indexSec = this.selectedIngredientsArray.findIndex((y) => ((y.pID == item.pID) && (y.description == item.description)));
    // this.selectedIngredientsArray.splice(indexSec, 1);
    // this.selectedIngredients = this.selectedIngredientsArray;
  }
  onItemDeSelectAll(item: any) {
    this.foodMenuItemModel.requestItemIngredientDetail = [];
    this.selectedIngredientsArray = [];
    this.selectedIngredients = [];
  }
  onSelectAll(items: any) {
    this.foodMenuItemModel.requestItemIngredientDetail = [];
    this.selectedIngredients = [];
    this.selectedIngredientsArray = [];
    this.ProductModelResponse.forEach((x: any) => {
      let body: any = {
        pID: x.pID,
        quantity: 0,
        amount: 0,
        instructions: "",
        description: x.description,
        unitName: x.unitName,
        costPrice: x.costPrice
      }
      this.foodMenuItemModel.requestItemIngredientDetail.push(body);
      this.selectedIngredientsArray.push(body);
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
    }
    this.foodMenuItemModel.requestItemIngredientDetail.push(body);
    this.selectedIngredientsArray = this.foodMenuItemModel.requestItemIngredientDetail;
    this.selectedIngredients = this.selectedIngredientsArray;
    // this.selectedIngredientsArray.push(ingInfo);
    // this.selectedIngredients = this.selectedIngredientsArray;
  }

  getTaxes() {
    this.API.getdata('/Generic/getTax?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.taxesResponseModel = c.responseTax;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }


  onTaxDeSelect(item: any) {
    var index = this.foodMenuItemModel.requestTaxModel.findIndex((x) => (x.taxID == item.taxID));
    this.foodMenuItemModel.requestTaxModel.splice(index, 1);
    var indexSec = this.selectedTaxesArray.findIndex((x) => ((x.taxID == item.taxID) && (x.taxName == item.taxName)));
    this.selectedTaxesArray.splice(indexSec, 1);
    this.selectedTaxes = this.selectedTaxesArray;
  }
  onTaxDeSelectAll(item: any) {
    this.foodMenuItemModel.requestTaxModel = [];
    this.selectedTaxesArray = [];
    this.selectedTaxes = [];
  }
  onSelectAllTaxes(items: any) {
    this.foodMenuItemModel.requestTaxModel = [];
    this.selectedTaxes = [];
    this.selectedTaxesArray = [];
    this.taxesResponseModel.forEach((x: any) => {
      let body: any = {
        taxID: x.taxID,
        taxName: x.taxName,
        taxRate: x.taxRate,
        isActive: x.isActive,
        outletID: x.outletID,
      }
      this.foodMenuItemModel.requestTaxModel.push(body);
      this.selectedTaxesArray.push(body);
    })
    this.selectedTaxes = this.selectedTaxesArray;
  }
  onTaxSelect(event: any) {
    var ingInfo: any = this.taxesResponseModel.find((x) => (x.taxID == event.taxID));
    let body: any = {
      taxID: ingInfo.taxID,
      taxName: ingInfo.taxName,
      taxRate: ingInfo.taxRate,
      isActive: ingInfo.isActive,
      outletID: ingInfo.outletID
    }
    this.foodMenuItemModel.requestTaxModel.push(body);
    this.selectedTaxesArray.push(ingInfo);
    this.selectedTaxes = this.selectedTaxesArray;
  }

  taxRateChanged(taxRateVal: any, inputValue: any) {
    if (inputValue.value != "" && inputValue.value != null) {
      var value = Number(inputValue.value);
      var index = this.foodMenuItemModel.requestTaxModel.findIndex((x) => x.taxID == taxRateVal.taxID);
      this.foodMenuItemModel.requestTaxModel[index].taxRate = value;
      return
    }
    else {
      var index = this.foodMenuItemModel.requestTaxModel.findIndex((x) => x.taxID == taxRateVal.taxID);
      this.foodMenuItemModel.requestTaxModel[index].taxRate = 0;
      return
    }
  }
  resetAll() {
    this.addMode = false;
    this.ItemPrice = false;
    this.submitted = false;
    this.MenuItemsForm.reset();
    this.foodMenuItemModel = new MenuItemsModel();
    this.resetDiscounts();
    this.MenuItemsForm.controls.foodMenuID.setValue(0);
    this.MenuItemsForm.controls.sectionID.setValue(0);
    this.MenuItemsForm.controls.currencyID.setValue(0);
    this.MenuItemsForm.controls.isActive.setValue(true);
    this.selectedIngredients = [];
    this.selectedIngredientsArray = [];
    this.selectedTaxesArray = [];
    this.selectedTaxes = [];
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

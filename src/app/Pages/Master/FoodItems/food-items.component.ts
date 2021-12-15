import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestFoodMenuItem, FoodCatResponseModel, responseFoodMenuItem, MenuItemsModel, requestVariant, responseVariant } from './ItemsModel';

@Component({
  selector: 'app-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.css']
})
export class FoodItemsComponent implements OnInit, OnDestroy {
  @ViewChild('myInput')
  myInputVariable: ElementRef;

  @ViewChild('myInputV')
  myInputVariableVariant: ElementRef;
  fileToUpload: any = null;
  isBrowser: boolean = false;
  imageUrl: string;
  imageUrlV: string;
  Image: any;
  file: any[] = []
  fileName: string = "No file chosen";
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChildren("closeVariantModal") closeVariantModal: any;
  @ViewChildren("closeViewVariantModal") closeViewVariantModal: any;
  @ViewChildren("attachItemImageModal") attachItemImageModal: any;

  responseVariant: responseVariant[];
  ItemPrice: boolean = false;
  requestVariant: requestVariant;
  foodMenuItemModel: MenuItemsModel;
  responseFoodMenuItem: responseFoodMenuItem[];
  ItemsResponseModelReplica: responseFoodMenuItem[];
  requestFoodMenuItem: requestFoodMenuItem;
  FoodCatResponseModel: FoodCatResponseModel[];
  defaultFoodCat: FoodCatResponseModel;
  addMode: boolean = false;
  submitted: boolean = false;
  Vsubmitted: boolean = false;
  MenuItemsForm: FormGroup;
  VariantForm: FormGroup;
  SearchForm: FormGroup;
  isShow: boolean = false;
  showDiscount: boolean = false;
  showVDiscount: boolean = false;
  outletID: number;
  OwnerID: number;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.requestFoodMenuItem = new requestFoodMenuItem();
    this.FoodCatResponseModel = [];
    this.foodMenuItemModel = new MenuItemsModel();
    this.responseVariant = [];
    this.defaultFoodCat = new FoodCatResponseModel();
  }
  ngOnInit(): void {
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.outletID = this.GV.OutletID;
    this.OwnerID = this.GV.ownerID;
    this.InitializeForm();
    this.getAllItems();
    this.GetFoodMenuCategory();
    this.resetDiscounts();
    this.resetDiscountsV();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
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
    this.myInputVariable.nativeElement.value = "";
  }

  GetFoodMenuCategory() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getfoodMenu?OutletID=' + this.outletID).subscribe(c => {
      if (c != null) {
        this.FoodCatResponseModel = c.foodMenuResponses;
        this.defaultFoodCat.foodMenuID = 0;
        this.defaultFoodCat.foodMenuName = "All";
        this.FoodCatResponseModel.push(this.defaultFoodCat);
        this.SearchForm.controls.foodMenuID.setValue(0);
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
      if (this.MenuItemsForm.controls.isActive.value == "" || this.MenuItemsForm.controls.isActive.value == null) {
        this.MenuItemsForm.controls.isActive.setValue(false);
      }
      if (this.MenuItemsForm.controls.foodMenuID.value == null) {
        this.MenuItemsForm.controls.foodMenuID.setValue(0);
      }
      if (this.MenuItemsForm.controls.foodItemID.value == null) {
        this.MenuItemsForm.controls.foodItemID.setValue(0);
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
      this.MenuItemsForm.controls.OwnerID.setValue(this.OwnerID);
      this.MenuItemsForm.controls.foodMenuID.setValue(+(this.MenuItemsForm.controls.foodMenuID.value));
      this.foodMenuItemModel.requestFoodMenuItem = this.MenuItemsForm.value;
      if (this.imageUrl == null || this.imageUrl == "" || this.imageUrl == undefined) {
        this.imageUrl = ""
      }
      else {
        this.foodMenuItemModel.requestFoodMenuItem.imageURl = this.imageUrl;
      }
      this.API.PostData('/FoodMenu/AddEditfoodMenuItem', this.foodMenuItemModel).subscribe(c => {
        if (c != null) {
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.isShow = !this.isShow;
          this.foodMenuItemModel = new MenuItemsModel();
          this.SearchForm.controls.foodMenuID.setValue(0);
          this.getAllItems();
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

  EditFoodMenuCategory(p: any) {
    this.addMode = !this.addMode;
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
      this.myInputVariable.nativeElement.value = "";
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
    this.API.getdata('/FoodMenu/getfoodItemAgainstOutletID?outletID=' + this.outletID).subscribe(c => {
      if (c != null) {
        this.responseFoodMenuItem = c.responseFoodMenuItems;
        this.ItemsResponseModelReplica = c.responseFoodMenuItems;
        this.dtTrigger.next();
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
}

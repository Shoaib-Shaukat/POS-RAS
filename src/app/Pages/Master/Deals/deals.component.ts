import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { FoodCatResponseModel, MenuItemsModel, requestFoodMenuItem, requestVariant } from '../FoodItems/ItemsModel';
import { requestDealsModel, responseDealsModel, responseFoodMenuItem, responseVariant } from './dealsModel';


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  //.................Deals.....................
  requestDealsModel: requestDealsModel[];
  responseDealsModel: responseDealsModel[];
  //...........................................
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('myInputV')
  myInputVariableVariant: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions0: DataTables.Settings = {};
  dtTrigger0: Subject<any> = new Subject<any>();

  @ViewChildren("closeVariantModal") closeVariantModal: any;
  @ViewChildren("closeViewVariantModal") closeViewVariantModal: any;
  @ViewChildren("attachItemImageModal") attachItemImageModal: any;
  MenuItemsForm: FormGroup;
  VariantForm: FormGroup;
  SearchForm: FormGroup;
  DealForm: FormGroup;
  responseVariant: responseVariant[];
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
  fileToUpload: any = null;
  isBrowser: boolean = false;
  ItemPrice: boolean = false;
  isShow: boolean = false;
  showDiscount: boolean = false;
  showVDiscount: boolean = false;
  dealArrLength: number = -1;
  totalAmount: number = 0;
  outletID: number;
  OwnerID: number;
  imageUrl: string;
  imageUrlV: string;
  Image: any;
  file: any[] = [];
  fileName: string = "No file chosen";

  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.requestDealsModel = [];
    this.responseDealsModel = [];
    this.requestFoodMenuItem = new requestFoodMenuItem();
    this.FoodCatResponseModel = [];
    this.foodMenuItemModel = new MenuItemsModel();
    this.responseVariant = [];
    this.defaultFoodCat = new FoodCatResponseModel();
  }
  ngOnInit(): void {
    this.getDeals();
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.outletID = this.GV.OutletID;
    this.OwnerID = this.GV.ownerID;
    this.InitializeForm();
    this.getAllItems();
    this.GetFoodMenuCategory();
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
    this.DealForm = new FormGroup({

    });
  }

  makeDeal() {
    this.isShow = !this.isShow;
    this.addMode = !this.addMode;
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.MenuItemsForm.controls.isActive.setValue(true);
    } else {
      this.MenuItemsForm.controls.isActive.setValue(false);
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
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
        this.dtTrigger0.next();

        this.ItemsResponseModelReplica.forEach((element) => { element.Quantity = 1 });
        this.ItemsResponseModelReplica.forEach((element) => { element.Checked = false });
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

        this.responseVariant.forEach((element) => { element.Quantity = 1 });
        this.responseVariant.forEach((element) => { element.Checked = false });
        //................................................
        for (let i = 0; i < this.requestDealsModel.length; i++) {
          if (this.requestDealsModel[i].variantID) {
            for (let j = 0; j < this.responseVariant.length; j++) {
              if (this.requestDealsModel[i].variantID == this.responseVariant[j].variantID) {
                this.responseVariant[j].Checked = true;
              }
            }
          }
        }
        //................................................
        // this.requestDealsModel.forEach((element) => {
        //   var checkdup = this.responseVariant.find(
        //     (x) => x.variantID == element.variantID
        //   );
        //   if (checkdup != null) {
        //     var index = this.responseVariant.findIndex(
        //       (x) => x.variantID == element.variantID
        //     );
        //     this.responseVariant[index].Checked = true;
        //   }
        // });

        //.................................................
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

  //.......................................DEALS..........................................
  checkDeal(status: any, p: any) {
    if (status == true) {
      var index = this.ItemsResponseModelReplica.findIndex((x) => x.foodItemID == p.foodItemID);
      this.ItemsResponseModelReplica[index].Checked = true;
      if (p.variantID) {
        var index = this.responseVariant.findIndex((x) => x.variantID == p.variantID);
        this.responseVariant[index].Checked = true;
      }
      let body = {
        FoodItemName: p.foodItemName,
        CalPrice: p.calculatedPrice,
        Price: p.price,
        FoodItemID: p.foodItemID,
        FoodMenuID: p.foodMenuID,
        FoodMenuName: p.foodMenuName,
        hasVariant: p.hasVariant,
        RefCode: p.refCode,
        variantID: p.variantID,
        variantName: p.variantName,
        variantPrice: p.variantPrice,
        Quantity: p.Quantity
      }
      this.requestDealsModel.push(body);
      this.totalAmount = 0;
      this.requestDealsModel.forEach((element) => {
        if (element.variantID) {
          if (element.variantPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.variantPrice * element.Quantity);
          }
        }
        else {
          if (element.CalPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.Price * element.Quantity);
          }
        }
      });
    }
    else {
      var index = this.ItemsResponseModelReplica.findIndex((x) => x.foodItemID == p.foodItemID);
      this.ItemsResponseModelReplica[index].Checked = false;
      this.ItemsResponseModelReplica[index].Quantity = 1;
      var index = this.requestDealsModel.findIndex((x) => x.FoodItemID == p.foodItemID);
      this.requestDealsModel.splice(index, 1);

      this.totalAmount = 0;
      this.requestDealsModel.forEach((element) => {
        if (element.variantID) {
          if (element.variantPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.variantPrice * element.Quantity);
          }
        }
        else {
          if (element.CalPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.Price * element.Quantity);
          }
        }
      });
    }
    this.dealArrLength = this.requestDealsModel.length;
  }
  getDeals() {
    this.API.getdata('/FoodMenu/getDeals?outletID=' + this.outletID).subscribe(c => {
      if (c != null) {
        this.responseDealsModel = [];
        this.responseDealsModel = c.responseDeals;
        this.dtTrigger0
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  dealMakingDone() {
    var button: any = document.getElementById("dealsDone");
    button.click();

    if (this.requestDealsModel.length <= 1) {
      this.toastr.error('Select atleast two items', 'Error', {
        timeOut: 3000,
        'progressBar': true,
      });
    }
    else {
      var button: any = document.getElementById("dealsDone");
      button.click();
    }
  }
  attachDealImage(file: any) {
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
  submitDeal() {
  }

  closeVariantViewModal() {
    this.closeViewVariantModal["first"].nativeElement.click();
  }

  minusQuantity(p: any) {
    var index = this.ItemsResponseModelReplica.findIndex((x) => x.foodItemID == p.foodItemID);
    if (this.ItemsResponseModelReplica[index].Quantity > 1) {
      this.ItemsResponseModelReplica[index].Quantity = this.ItemsResponseModelReplica[index].Quantity - 1;
      var ind = this.requestDealsModel.findIndex((x) => x.FoodItemID == p.foodItemID);
      if (ind != -1) {
        this.requestDealsModel[ind].Quantity = this.ItemsResponseModelReplica[index].Quantity;
        this.totalAmount = 0;
        this.requestDealsModel.forEach((element) => {
          if (element.variantID) {
            if (element.variantPrice > 0) {
              this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
            }
            else {
              this.totalAmount = this.totalAmount + (element.variantPrice * element.Quantity);
            }
          }
          else {
            if (element.CalPrice > 0) {
              this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
            }
            else {
              this.totalAmount = this.totalAmount + (element.Price * element.Quantity);
            }
          }
        });
      }
      else {
        return
      }
    }
    else {
      return
    }
  }

  plusQuantity(p: any) {
    var index = this.ItemsResponseModelReplica.findIndex((x) => x.foodItemID == p.foodItemID);
    this.ItemsResponseModelReplica[index].Quantity = this.ItemsResponseModelReplica[index].Quantity + 1;
    var ind = this.requestDealsModel.findIndex((x) => x.FoodItemID == p.foodItemID);
    if (ind != -1) {
      this.requestDealsModel[ind].Quantity = this.ItemsResponseModelReplica[index].Quantity;
      this.totalAmount = 0;
      this.requestDealsModel.forEach((element) => {
        if (element.variantID) {
          if (element.variantPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.variantPrice * element.Quantity);
          }
        }
        else {
          if (element.CalPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.Price * element.Quantity);
          }
        }
      });
    }
    else {
      return
    }

  }

  minusVQuantity(p: any) {
    var index = this.responseVariant.findIndex((x) => x.variantID == p.variantID);
    if (this.responseVariant[index].Quantity > 1) {
      this.responseVariant[index].Quantity = this.responseVariant[index].Quantity - 1;
      var ind = this.requestDealsModel.findIndex((x) => x.variantID == p.variantID);
      if (ind != -1) {
        this.requestDealsModel[ind].Quantity = this.ItemsResponseModelReplica[index].Quantity;
        this.totalAmount = 0;
        this.requestDealsModel.forEach((element) => {
          if (element.variantID) {
            if (element.variantPrice > 0) {
              this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
            }
            else {
              this.totalAmount = this.totalAmount + (element.variantPrice * element.Quantity);
            }
          }
          else {
            if (element.CalPrice > 0) {
              this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
            }
            else {
              this.totalAmount = this.totalAmount + (element.Price * element.Quantity);
            }
          }
        });
      }
      else {
        return
      }
    }
    else {
      return
    }
  }

  plusVQuantity(p: any) {
    var index = this.responseVariant.findIndex((x) => x.variantID == p.variantID);
    this.responseVariant[index].Quantity = this.responseVariant[index].Quantity + 1;
    var ind = this.requestDealsModel.findIndex((x) => x.variantID == p.variantID);
    if (ind != -1) {
      this.requestDealsModel[ind].Quantity = this.ItemsResponseModelReplica[index].Quantity;
      this.totalAmount = 0;
      this.requestDealsModel.forEach((element) => {
        if (element.variantID) {
          if (element.variantPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.variantPrice * element.Quantity);
          }
        }
        else {
          if (element.CalPrice > 0) {
            this.totalAmount = this.totalAmount + (element.CalPrice * element.Quantity);
          }
          else {
            this.totalAmount = this.totalAmount + (element.Price * element.Quantity);
          }
        }
      });
    }
    else {
      return
    }
  }
}


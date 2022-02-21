import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import Swal from 'sweetalert2';
import { FoodCatResponseModel, MenuItemsModel, requestVariant } from '../FoodItems/ItemsModel';
import { DealModelRequest, responseDealsModel, responseFoodMenuItem, responseVariant } from './dealsModel';


@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  itemsArr: any = [];
  DealId: any;
  itemsDescription: any = "";
  splitString: any = [];
  //.................Deals.....................
  responseDealsModel: responseDealsModel[];
  DealModelRequest: DealModelRequest;
  Dsubmitted: boolean = false;
  //...........................................
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('myInputV')
  myInputVariableVariant: ElementRef;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  @ViewChildren("closeVariantModal") closeVariantModal: any;
  @ViewChildren("closeViewVariantModal") closeViewVariantModal: any;
  @ViewChildren("attachItemImageModal") attachItemImageModal: any;
  @ViewChildren("closeDealsModal") closeDealsModal: any;

  MenuItemsForm: FormGroup;
  VariantForm: FormGroup;
  SearchForm: FormGroup;
  DealForm: FormGroup;
  responseVariant: responseVariant[];
  requestVariant: requestVariant;
  responseFoodMenuItem: responseFoodMenuItem[];
  ItemsResponseModelReplica: responseFoodMenuItem[];
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
  imageUrl: string;
  imageUrlV: string;
  Image: any;
  file: any[] = [];
  fileName: string = "No file chosen";
  symbol: string = "";

  constructor(private API: ApiService, private http: HttpClient,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.responseDealsModel = [];
    this.FoodCatResponseModel = [];
    this.responseVariant = [];
    this.defaultFoodCat = new FoodCatResponseModel();
    this.DealModelRequest = new DealModelRequest();
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.symbol = this.GV.Currency;
    this.getDeals();
    this.responseFoodMenuItem = [];
    this.ItemsResponseModelReplica = [];
    this.InitializeForm();
    this.getAllItems();
    this.GetFoodMenuCategory();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.Dsubmitted = false;
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.GV.companyID = Number(localStorage.getItem('companyID'));
  }

  get f() { return this.MenuItemsForm.controls; }
  get g() { return this.VariantForm.controls; }
  get h() { return this.DealForm.controls; }

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
      DealID: new FormControl(""),
      DealName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      DealPrice: new FormControl("", [Validators.required]),
      description: new FormControl(""),
      isActive: new FormControl(""),
      imageURL: new FormControl("", [Validators.required]),
      totalAmountRs: new FormControl(""),
      itemsDescription: new FormControl(""),
    });
  }

  makeDeal() {
    this.resetDeals();
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
    this.API.getdata('/FoodMenu/getfoodMenu?OutletID=' + this.GV.OutletID).subscribe(c => {
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.DealForm.controls.isActive.setValue(true);
    } else {
      this.DealForm.controls.isActive.setValue(false);
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
    this.API.getdata('/FoodMenu/getfoodItemAgainstOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseFoodMenuItem = c.responseFoodMenuItems;
        this.ItemsResponseModelReplica = c.responseFoodMenuItems;
        this.dtTrigger.next();

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
        for (let i = 0; i < this.DealModelRequest.DealsArray.length; i++) {
          if (this.DealModelRequest.DealsArray[i].variantID) {
            for (let j = 0; j < this.responseVariant.length; j++) {
              if (this.DealModelRequest.DealsArray[i].variantID == this.responseVariant[j].variantID) {
                this.responseVariant[j].Checked = true;
                this.responseVariant[j].Quantity = this.DealModelRequest.DealsArray[i].Quantity;
              }
            }
          }
        }
        //................................................
        // this.DealModelRequest.DealsArray.forEach((element) => {
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
        DealID: p.DealID,
        DealDetailID: p.DealDetailID,
        FoodItemName: p.foodItemName,
        CalPrice: p.calculatedPrice,
        Price: p.price,
        FoodItemID: p.foodItemID,
        FoodMenuID: p.foodMenuID,
        FoodMenuName: p.foodMenuName,
        RefCode: p.refCode,
        variantID: p.variantID,
        variantName: p.variantName,
        variantPrice: p.variantPrice,
        hasVariant: p.hasVariant,
        Quantity: p.Quantity
      }
      if (body.DealID == undefined || body.DealID == null) {
        body.DealID = 0;
      }
      if (body.DealDetailID == undefined || body.DealDetailID == null) {
        body.DealDetailID = 0;
      }
      if (body.variantID == undefined || body.variantID == null) {
        body.variantID = 0;
      }
      if (body.variantName == undefined || body.variantName == null) {
        body.variantName = "";
      }
      if (body.variantPrice == undefined || body.variantPrice == null) {
        body.variantPrice = 0;
      }
      if (body.FoodMenuID == undefined || body.FoodMenuID == null) {
        body.FoodMenuID = 0;
      }
      if (body.FoodMenuName == undefined || body.FoodMenuName == null) {
        body.FoodMenuName = "";
      }
      if (body.Price == undefined || body.Price == null) {
        body.Price = 0;
      }
      if (body.RefCode == undefined || body.RefCode == null) {
        body.RefCode = "";
      }
      if (body.hasVariant == undefined || body.hasVariant == null) {
        body.hasVariant = true;
      }
      this.DealModelRequest.DealsArray.push(body);
      this.totalAmount = 0;
      this.DealModelRequest.DealsArray.forEach((element) => {
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
      this.ItemsResponseModelReplica[index].Quantity = 1;
      if (p.variantID) {
        var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.variantID == p.variantID);
        this.DealModelRequest.DealsArray.splice(ind, 1);
      }
      else {
        var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.FoodItemID == p.foodItemID);
        this.DealModelRequest.DealsArray.splice(ind, 1);
      }
      var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.FoodItemID == p.foodItemID);
      if (ind != -1) {
        this.ItemsResponseModelReplica[index].Checked = true;
      }
      else {
        this.ItemsResponseModelReplica[index].Checked = false;
      }

      this.totalAmount = 0;
      this.DealModelRequest.DealsArray.forEach((element) => {
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
    this.dealArrLength = this.DealModelRequest.DealsArray.length;
  }
  getDeals() {
    this.API.getdata('/FoodMenu/getDeals?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseDealsModel = [];
        this.responseDealsModel = c.responseDeal;
        this.responseDealsModel.forEach((x) => {
          if (x.itemsDescription != "") {
            this.itemsArr = x.itemsDescription.split(',').map((item: any) => item.trim());
            x.itemsDescription = this.itemsArr.join("\n");
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
  dealMakingDone() {
    if (this.DealModelRequest.DealsArray.length == 0) {
      this.toastr.error('Select atleast one item', 'Error', {
        timeOut: 3000,
        'progressBar': true,
      });
    }
    else {
      var button: any = document.getElementById("dealsDone");
      button.click();
      this.DealForm.reset();
      this.DealForm.controls.totalAmountRs.setValue(this.totalAmount);
    }
  }

  fillItemsDescription() {
    this.itemsDescription = "";
    this.DealModelRequest.DealsArray.forEach((x) => {
      if (x.variantName != "") {
        this.itemsDescription = this.itemsDescription.concat(x.Quantity, ' x ', x.FoodItemName, ' ', '(', x.variantName, ')', ', ');
      }
      else {
        this.itemsDescription = this.itemsDescription.concat(x.Quantity, ' x ', x.FoodItemName, ', ');
      }
    })
    this.itemsDescription = this.itemsDescription.slice(0, -2);
    this.DealForm.controls.itemsDescription.setValue(this.itemsDescription);
    this.splitString = this.itemsDescription.split(', ');

    this.itemsArr = this.DealForm.controls.itemsDescription.value.split(',').map((item: any) => item.trim());
    this.DealForm.controls.itemsDescription.setValue(this.itemsArr.join("\n"));
    this.itemsArr = [];
  }



  attachDealImage(file: any) {
    if (!file.target.files)
      return;
    this.fileToUpload = file.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.DealModelRequest.DealObject.imageURL = this.imageUrl;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  submitDeal() {
    this.Dsubmitted = true;
    if (this.DealForm.valid) {
      if (this.DealForm.controls.DealID.value == null || this.DealForm.controls.DealID.value == "") {
        this.DealForm.controls.DealID.setValue(0);
      }
      if (this.DealForm.controls.isActive.value == null || this.DealForm.controls.isActive.value == "") {
        this.DealForm.controls.isActive.setValue(false);
      }
      this.DealModelRequest.DealObject = this.DealForm.value;
      if (this.imageUrl == null || this.imageUrl == "" || this.imageUrl == undefined) {
        this.imageUrl = ""
      }
      else {
        this.DealModelRequest.DealObject.imageURL = this.imageUrl;
      }
      this.DealModelRequest.DealObject.outletID = this.GV.OutletID;
      this.DealModelRequest.DealObject.UserID = this.GV.userID;
      this.API.PostData('/FoodMenu/AddDeal', this.DealModelRequest).subscribe(c => {
        if (c != null) {
          if (c.status == "Failed") {
            this.toastr.error(c.message, 'Error', {
              timeOut: 3000,
              'progressBar': true,
            });
            return
          }
          else {
            this.toastr.success(c.message, 'Success', {
              timeOut: 3000,
              'progressBar': true,
            });
            this.isShow = false;
            this.DealModelRequest.DealsArray = [];
            this.SearchForm.controls.foodMenuID.setValue(0);
            this.closeDealsModal["first"].nativeElement.click();
            this.getDeals();
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

  closeVariantViewModal() {
    this.responseVariant = [];
    this.closeViewVariantModal["first"].nativeElement.click();
  }

  minusQuantity(p: any) {
    var index = this.ItemsResponseModelReplica.findIndex((x) => x.foodItemID == p.foodItemID);
    if (this.ItemsResponseModelReplica[index].Quantity > 1) {
      this.ItemsResponseModelReplica[index].Quantity = this.ItemsResponseModelReplica[index].Quantity - 1;
      var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.FoodItemID == p.foodItemID);
      if (ind != -1) {
        this.DealModelRequest.DealsArray[ind].Quantity = this.ItemsResponseModelReplica[index].Quantity;
        this.totalAmount = 0;
        this.DealModelRequest.DealsArray.forEach((element) => {
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
    var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.FoodItemID == p.foodItemID);
    if (ind != -1) {
      this.DealModelRequest.DealsArray[ind].Quantity = this.ItemsResponseModelReplica[index].Quantity;
      this.totalAmount = 0;
      this.DealModelRequest.DealsArray.forEach((element) => {
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
      var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.variantID == p.variantID);
      if (ind != -1) {
        this.DealModelRequest.DealsArray[ind].Quantity = this.responseVariant[index].Quantity;
        this.totalAmount = 0;
        this.DealModelRequest.DealsArray.forEach((element) => {
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
    var ind = this.DealModelRequest.DealsArray.findIndex((x) => x.variantID == p.variantID);
    if (ind != -1) {
      this.DealModelRequest.DealsArray[ind].Quantity = this.responseVariant[index].Quantity;
      this.totalAmount = 0;
      this.DealModelRequest.DealsArray.forEach((element) => {
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

  resetDeals() {
    this.totalAmount = 0;
    this.DealForm.reset();
    this.Dsubmitted = false;
    this.DealModelRequest = new DealModelRequest();
    this.ItemsResponseModelReplica.forEach((element) => { element.Quantity = 1 });
    this.ItemsResponseModelReplica.forEach((element) => { element.Checked = false });
    this.responseVariant.forEach((element) => { element.Quantity = 1 });
    this.responseVariant.forEach((element) => { element.Checked = false });
  }

  activeDeal(p: any, status: any) {
    if (p.isActive == true && status == 2) {
      this.toastr.warning('Deal Already Active', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    else if (p.isActive == false && status == 1) {
      this.toastr.warning('Deal Already In-Active', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return
    }
    else {
      this.DealId = p.dealID
      this.API.getdata('/FoodMenu/removeDeal?dealID=' + this.DealId).subscribe(c => {
        if (c != null) {
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.DealId = null;
          this.getDeals();
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

  goToDeals() {
    this.totalAmount = 0;
    this.DealForm.reset();
    this.Dsubmitted = false;
    this.DealModelRequest = new DealModelRequest();
    this.ItemsResponseModelReplica.forEach((element) => { element.Quantity = 1 });
    this.ItemsResponseModelReplica.forEach((element) => { element.Checked = false });
    this.responseVariant.forEach((element) => { element.Quantity = 1 });
    this.responseVariant.forEach((element) => { element.Checked = false });
    this.isShow = false;
  }

}


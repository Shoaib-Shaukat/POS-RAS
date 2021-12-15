import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { FoodCatRequestModel, FoodCatResponseModel } from './FoodCategoryModel';

@Component({
  selector: 'app-foodcategory',
  templateUrl: './foodcategory.component.html',
  styleUrls: ['./foodcategory.component.css']
})
export class FoodcategoryComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  FoodCatRequestModel: FoodCatRequestModel;
  FoodCatResponseModel: FoodCatResponseModel[];
  addMode: boolean = false;
  submitted: boolean = false;
  FoodCatForm: FormGroup;
  isShow: boolean = false;
  outletID: number;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {

    this.FoodCatRequestModel = new FoodCatRequestModel();
    this.FoodCatResponseModel = [];

  }
  addNewFoodCategory() {
    this.submitted = false;
    this.FoodCatForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }
  InitializeForm() {
    this.FoodCatForm = new FormGroup({
      foodMenuID: new FormControl(),
      foodMenuName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(),
      outletID: new FormControl(),
    });
  }
  ngOnInit(): void {
    this.outletID = this.GV.OutletID;
    this.InitializeForm();
    this.GetFoodMenuCategory();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.FoodCatForm.controls; }

  SaveFoodMenuCategory() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.submitted = true;
    if (this.FoodCatForm.valid) {
      if (this.FoodCatForm.controls.isActive.value == "" || this.FoodCatForm.controls.isActive.value == null) {
        this.FoodCatForm.controls.isActive.setValue(false);
      }
      if (this.FoodCatForm.controls.foodMenuID.value == null) {
        this.FoodCatForm.controls.foodMenuID.setValue(0);
      }
      this.FoodCatForm.controls.outletID.setValue(this.outletID);
      this.FoodCatRequestModel = this.FoodCatForm.value;
      this.API.PostData('/FoodMenu/AddEditfoodMenu', this.FoodCatRequestModel).subscribe(c => {
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
          this.GetFoodMenuCategory();
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

  EditFoodMenuCategory(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.FoodCatForm.patchValue(p);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.FoodCatForm.controls.isActive.setValue(true);
    } else {
      this.FoodCatForm.controls.isActive.setValue(false);
    }
  }
}

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { IngredientResponse, SubCategoryRequest, SubCategoryResponse } from './IngSubCatModel';

@Component({
  selector: 'app-ingredient-sub-cat',
  templateUrl: './ingredient-sub-cat.component.html',
  styleUrls: ['./ingredient-sub-cat.component.css']
})
export class IngredientSubCatComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  SubCategoryRequest: SubCategoryRequest;
  SubCategoryResponse: SubCategoryResponse[];
  IngredientResponse: IngredientResponse[];
  addMode: boolean = false;
  submitted: boolean = false;
  SubCategoryForm: FormGroup;
  isShow: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.SubCategoryResponse = [];
    this.SubCategoryRequest = new SubCategoryRequest();
    this.IngredientResponse = [];
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getSubCategories();
    this.getIngredientCat();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  InitializeForm() {
    this.SubCategoryForm = new FormGroup({
      ingredientCategoryID: new FormControl(""),
      IngredientID: new FormControl("", [Validators.required]),
      Name: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      UserID: new FormControl(""),
      OutletID: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.SubCategoryForm.controls; }

  addSubCategory() {
    this.submitted = false;
    this.SubCategoryForm.reset();
    this.isShow = !this.isShow;
    this.addMode = true;
    this.SubCategoryForm.controls.IngredientID.setValue(0);
    this.SubCategoryForm.controls.isActive.setValue(true);
  }
  getIngredientCat() {
    this.API.getdata('/Ingredient/getIngredient?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.IngredientResponse = c.responseIngredient;
        let body: any = {
          ingredientID: 0,
          name: "Select Ingredient"
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
  }
  saveSubCatInfo() {
    this.submitted = true;
    if (this.SubCategoryForm.valid) {
      if (this.SubCategoryForm.controls.ingredientCategoryID.value == "" || this.SubCategoryForm.controls.ingredientCategoryID.value == null) {
        this.SubCategoryForm.controls.ingredientCategoryID.setValue(0);
      }
      this.SubCategoryForm.controls.UserID.setValue(this.GV.userID);
      this.SubCategoryForm.controls.OutletID.setValue(this.GV.OutletID);
      this.SubCategoryForm.controls.IngredientID.setValue(Number(this.SubCategoryForm.controls.IngredientID.value));
      this.SubCategoryRequest = this.SubCategoryForm.value;
      this.API.PostData('/Ingredient/AddEditIngredientCategory', this.SubCategoryRequest).subscribe(c => {
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
          this.getSubCategories();
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

  getSubCategories() {
    this.API.getdata('/Ingredient/getIngredientCategory?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.SubCategoryResponse = c.responseIngredientsCategory;
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

  editSubCatInfo(p: any) {
    this.addMode = false;
    this.isShow = !this.isShow;
    this.SubCategoryForm.controls.IngredientID.patchValue(p.ingredientID);
    this.SubCategoryForm.controls.ingredientCategoryID.patchValue(p.ingredientCategoryID);
    this.SubCategoryForm.controls.Name.patchValue(p.oName);
    this.SubCategoryForm.controls.isActive.patchValue(p.isActive);
    this.SubCategoryForm.controls.OutletID.patchValue(p.outletID);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.SubCategoryForm.controls.isActive.setValue(true);
    } else {
      this.SubCategoryForm.controls.isActive.setValue(false);
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
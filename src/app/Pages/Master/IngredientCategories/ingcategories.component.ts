import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { IngredientRequest, IngredientResponse } from './IngCatModel';

@Component({
  selector: 'app-ingcategories',
  templateUrl: './ingcategories.component.html',
  styleUrls: ['./ingcategories.component.css']
})
export class IngcategoriesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  IngredientRequest: IngredientRequest;
  IngredientResponse: IngredientResponse[];
  addMode: boolean = false;
  submitted: boolean = false;
  IngredientForm: FormGroup;
  isShow: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.IngredientResponse = [];
    this.IngredientRequest = new IngredientRequest();

  }
  addNewIngredient() {
    this.submitted = false;
    this.IngredientForm.reset();
    this.isShow = !this.isShow;
    this.addMode = true;
  }
  InitializeForm() {
    this.IngredientForm = new FormGroup({
      IngredientID: new FormControl(""),
      Name: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      UserID: new FormControl(""),
      outletID: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getIngredients();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.GV.userID = Number(localStorage.getItem('userID'));
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.IngredientForm.controls; }

  saveIngInfo() {
    this.submitted = true;
    if (this.IngredientForm.valid) {
      if (this.IngredientForm.controls.IngredientID.value == "" || this.IngredientForm.controls.IngredientID.value == null) {
        this.IngredientForm.controls.IngredientID.setValue(0);
      }
      this.IngredientForm.controls.UserID.setValue(this.GV.userID);
      this.IngredientForm.controls.outletID.setValue(this.GV.OutletID);
      this.IngredientRequest = this.IngredientForm.value;
      this.API.PostData('/Ingredient/AddEditIngredient', this.IngredientRequest).subscribe(c => {
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
          this.getIngredients();
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

  getIngredients() {
    this.API.getdata('/Ingredient/getIngredient?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.IngredientResponse = c.responseIngredient;
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

  editIngredientInfo(p: any) {
    this.addMode = false;
    this.isShow = !this.isShow;
    this.IngredientForm.controls.IngredientID.patchValue(p.ingredientID);
    this.IngredientForm.controls.Name.patchValue(p.name);
    this.IngredientForm.controls.isActive.patchValue(p.isActive);
    this.IngredientForm.controls.outletID.patchValue(p.outletID);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.IngredientForm.controls.isActive.setValue(true);
    } else {
      this.IngredientForm.controls.isActive.setValue(false);
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

import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { MenuResponse } from '../../Main/Users/UsersModel';
import { FoodCatRequestModel, FoodCatResponseModel } from '../MenuCategories/FoodCategoryModel';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.css']
})
export class MenulistComponent implements OnInit {
  @ViewChildren("closeMenuModal") closeMenuModal: any;
  MenuResponse: MenuResponse[];
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  FoodCatRequestModel: FoodCatRequestModel;
  FoodCatResponseModel: FoodCatResponseModel[];
  addMode: boolean = false;
  submitted: boolean = false;
  MenuForm: FormGroup;
  isShow: boolean = false;
  outletID: number;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.FoodCatRequestModel = new FoodCatRequestModel();
    this.FoodCatResponseModel = [];
    this.MenuResponse = [];

  }
  InitializeForm() {
    this.MenuForm = new FormGroup({
      assignMenuID: new FormControl(),
      isActive: new FormControl(),
      menuName: new FormControl("", [Validators.required]),
      sequenceNo: new FormControl("", [Validators.required]),
      menuNumber: new FormControl(),
      menuGroup: new FormControl(),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.outletID = this.GV.OutletID;
    this.InitializeForm();
    this.getMenu();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.MenuForm.controls; }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.MenuForm.controls.isActive.setValue(true);
    } else {
      this.MenuForm.controls.isActive.setValue(false);
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

  getMenu() {
    this.API.getdata('/Generic/getAssignMenu').subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.MenuResponse = c.responseAssignMenu;
          this.dtTrigger.next();
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

  editMenu(p: any) {
    this.MenuForm.reset();
    this.submitted = false;
    this.MenuForm.patchValue(p);
  }
  saveMenu() {
    this.submitted = true;
    if (this.MenuForm.valid) {
      let body = {
        assignMenuID: this.MenuForm.controls.assignMenuID.value,
        isActive: this.MenuForm.controls.isActive.value,
        menuName: this.MenuForm.controls.menuName.value,
        sequenceNo: this.MenuForm.controls.sequenceNo.value,
        menuNumber: this.MenuForm.controls.menuNumber.value,
        menuGroup: this.MenuForm.controls.menuGroup.value,
      }
      this.API.PostData('/Generic/EditAssignMenu', body).subscribe(c => {
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
          this.closeMenuModal["first"].nativeElement.click();
          this.getMenu();
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

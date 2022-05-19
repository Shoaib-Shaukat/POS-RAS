import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestTable, responseTable } from './tableModel';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  requestTable: requestTable;
  responseTable: responseTable[];
  addMode: boolean = false;
  submitted: boolean = false;
  TableForm: FormGroup;
  isShow: boolean = false;
  outletID: number;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.responseTable = [];
    this.requestTable = new requestTable();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  addNewFoodCategory() {
    this.submitted = false;
    this.TableForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.TableForm.controls.isActive.setValue(true);
  }
  InitializeForm() {
    this.TableForm = new FormGroup({
      tableName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      UserID: new FormControl(""),
      tableID: new FormControl(""),
      seatCapacity: new FormControl("", [Validators.required]),
      outletID: new FormControl(""),
      description: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.outletID = this.GV.OutletID;
    this.InitializeForm();
    this.getTables();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.TableForm.controls; }

  saveTableInfo() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    else {
      this.TableForm.controls.outletID.setValue(this.GV.OutletID);
      this.TableForm.controls.UserID.setValue(this.GV.userID);
    }
    this.submitted = true;
    if (this.TableForm.valid) {
      if (this.TableForm.controls.tableID.value == "" || this.TableForm.controls.tableID.value == null) {
        this.TableForm.controls.tableID.setValue(0);
      }
      this.requestTable = this.TableForm.value;
      this.API.PostData('/FoodMenu/AddEditTable', this.requestTable).subscribe(c => {
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
          this.getTables();
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

  getTables() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getTableMaster?outletID=' + this.outletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responseTable = c.responseTables;
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.TableForm.controls.isActive.setValue(true);
    } else {
      this.TableForm.controls.isActive.setValue(false);
    }
  }

  editTableInfo(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.TableForm.patchValue(p);
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
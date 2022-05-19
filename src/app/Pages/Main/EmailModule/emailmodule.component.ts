import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { EmailRequestModel, EmailResponseModel } from './emailModel';

@Component({
  selector: 'app-emailmodule',
  templateUrl: './emailmodule.component.html',
  styleUrls: ['./emailmodule.component.css']
})
export class EmailmoduleComponent implements OnInit {
  dropdownSettings: IDropdownSettings = {};
  reportsTypesArr: { mID: number, name: string }[] = [
    { "mID": 0, "name": "Sales Report" },
    { "mID": 1, "name": "Inventory Report" },
    { "mID": 2, "name": "Outlet Report" },
    { "mID": 3, "name": "Day Open/Close Report" },
  ];
  selectedReports: any = [];
  EmailRequestModel: EmailRequestModel;
  @ViewChildren("closeEmailModal") closeEmailModal: any;
  // this.closeEmailModal["first"].nativeElement.click();
  EmailResponseModel: EmailResponseModel[];

  addMode: boolean = false;
  submitted: boolean = false;
  EmailForm: FormGroup;
  isShow: boolean = false;

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.EmailResponseModel = [];
    this.EmailRequestModel = new EmailRequestModel();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'mID',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
  }
  addNewEmail() {
    this.submitted = false;
    this.EmailForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.EmailRequestModel = new EmailRequestModel();
    this.selectedReports = [];
  }
  InitializeForm() {
    this.EmailForm = new FormGroup({
      userID: new FormControl(""),
      outletID: new FormControl(""),
      email: new FormControl("", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getEmails();
  }
  getEmails() {
    this.API.getdata('/Generic/?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.EmailResponseModel = c;
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
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.EmailForm.controls; }

  saveEmailInfo() {
    this.submitted = true;
    if (this.EmailForm.valid && this.selectedReports.length > 0) {
      this.EmailForm.controls.userID.setValue(this.GV.userID);
      this.EmailForm.controls.outletID.setValue(this.GV.OutletID);
      this.EmailRequestModel.EmailModel = this.EmailForm.value;
      this.API.PostData('/Generic/', this.EmailRequestModel).subscribe(c => {
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
          this.getEmails();
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

  editEmail(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.EmailForm.patchValue(p);
  }
  onItemSelect(item: any) {
  }
  onReportDeSelect(report: any) {
    var index = this.EmailRequestModel.ReportsModel.findIndex((x) => ((x.mID == report.mID)));
    this.EmailRequestModel.ReportsModel.splice(index, 1);
    this.selectedReports = this.EmailRequestModel.ReportsModel;
  }
  onReportDeSelectAll(item: any) {
    this.EmailRequestModel.ReportsModel = [];
    this.selectedReports = [];
  }
  onSelectAll(items: any) {
    this.EmailRequestModel.ReportsModel = [];
    this.selectedReports = [];
    this.EmailRequestModel.ReportsModel = this.reportsTypesArr;
    this.selectedReports = this.EmailRequestModel.ReportsModel;
  }
  onReportSelect(event: any) {
    var reportInfo: any = this.reportsTypesArr.find((x) => ((x.mID == event.mID)));
    this.EmailRequestModel.ReportsModel.push(reportInfo);
    this.selectedReports = this.EmailRequestModel.ReportsModel;
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

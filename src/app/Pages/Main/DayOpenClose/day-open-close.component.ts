import { Component, OnInit, ElementRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { existingDaysResponse, openCloseRequestModel, requestModel } from './dayOpenCloseModel';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-day-open-close',
  templateUrl: './day-open-close.component.html',
  styleUrls: ['./day-open-close.component.css']
})
export class DayOpenCloseComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  existingDaysResponse: existingDaysResponse[];
  requestModel: requestModel;
  dateArray: any = [];
  showMaster: boolean = false;
  showMasterButton: boolean = false;
  fromDate: any;
  toDate: any;
  openingDate: any;
  closingDate: any;
  OpenOrClose: any;
  GmailSelected: boolean = false;
  openCloseRequestModel: openCloseRequestModel;
  @ViewChild('langInput') langInput: ElementRef;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';

  validForm: boolean = false;
  isReadOnly = true;
  clicked = false;
  InvalidLogin: boolean;
  errorMessage: string;
  Roles: any = [];
  returnUrl: string;
  constructor(private _el: ElementRef,
    public API: ApiService,
    public route: Router,
    private activatedRoute: ActivatedRoute,
    private GV: GvarService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,

  ) {
    this.requestModel = new requestModel();
    this.openCloseRequestModel = new openCloseRequestModel();
    this.existingDaysResponse = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  ngOnInit() {
    this.showMaster = true;
    this.showMasterButton = true;
    this.openingDate = this.formatDate(new Date());
    this.closingDate = this.formatDate(new Date());
    this.fromDate = null;
    this.toDate = null;
    this.getExistingDays();
    this.getOpenDay();
  }
  private formatDate(date: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  // seeInput(val: any) {
  //   if (val == "Yes") {
  //     this.GmailSelected = true;
  //   }
  //   else {
  //     this.GmailSelected = false;
  //   }
  // }
  getExistingDays() {
    this.existingDaysResponse = [];
    this.API.getdata('/Generic/getOpendayMaster?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.existingDaysResponse = [];
        }
        else {
          this.destroyDT(0, false).then(destroyed => {
            this.existingDaysResponse = c.responseOpenDayMaster;
            this.existingDaysResponse.sort((a, b) => a.openingDate < b.openingDate ? 1 : a.openingDate > b.openingDate ? -1 : 0);
            this.dtTrigger.next();
          });
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
  navigate(val: any) {
    this.dateArray = [];
    if (val == 1) {
      this.showMaster = false;
      this.getOpenDay();
    }
    else {
      this.showMaster = true;
      this.fromDate = null;
      this.toDate = null;
    }
  }

  getOpenDay() {
    this.API.getdata('/Generic/getOpenday?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.openingDate = this.formatDate(new Date());
          this.closingDate = this.formatDate(new Date());
          this.GV.setOpeningDate('');
          localStorage.setItem('openingDate', '');
        }
        else {
          this.openingDate = c.openingDate;
          this.closingDate = c.openingDate;
          this.GV.setOpeningDate(c.openingDate);
          localStorage.setItem('openingDate', c.openingDate);
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

  saveInfo(val: any) {
    if (val == 1) {
      this.openCloseRequestModel.openingDate = this.openingDate;
      this.openCloseRequestModel.isClosed = false;
    }
    else {
      this.openCloseRequestModel.openingDate = this.closingDate;
      this.openCloseRequestModel.isClosed = true;
    }
    this.openCloseRequestModel.enKey = "";
    this.openCloseRequestModel.outletID = this.GV.OutletID;
    this.openCloseRequestModel.userID = this.GV.userID;
    this.API.PostData('/Generic/AddEditOpenDate', this.openCloseRequestModel).subscribe(c => {
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
        this.getOpenDay();
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  getBetweenDates() {
    if (!this.fromDate || !this.toDate) {
      this.dateArray = [];
      return;
    }
    else {
      this.dateArray = [];
      var currentDate = moment(this.fromDate);
      var stopDate = moment(this.toDate);
      while (currentDate <= stopDate) {
        let body = {
          userID: this.GV.userID,
          outletID: this.GV.OutletID,
          openingDate: moment(currentDate).format('YYYY-MM-DD')
        }
        this.dateArray.push(body);
        currentDate = moment(currentDate).add(1, 'days');
      }
    }
  }

  saveFromToDate() {
    this.requestModel.requestOpenDayMaster = this.dateArray;
    this.API.PostData('/Generic/AddEditOpenDateMaster', this.requestModel).subscribe(c => {
      if (c != null) {
        if (c.status == "Failed") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.fromDate = null;
          this.toDate = null;
          this.dateArray = [];
          this.API.getdata('/Generic/getOpendayMaster?outletID=' + this.GV.OutletID).subscribe(c => {
            if (c != null) {
              if (c.message == "Data not found") {
                this.existingDaysResponse = [];
              }
              else {
                this.destroyDT(0, false).then(destroyed => {
                  this.existingDaysResponse = c.responseOpenDayMaster;
                  this.existingDaysResponse.sort((a, b) => a.openingDate < b.openingDate ? 1 : a.openingDate > b.openingDate ? -1 : 0);
                  this.dtTrigger.next();
                });
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
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  removeDateNotConfirm(p: any) {
    Swal.fire({
      text: 'Are you sure you want to remove ' + p.openingDate + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.removeDateConfirm(p);
      }
    })
  }
  removeDateConfirm(p: any) {
    this.API.getdata('/Generic/RemoveOpeningDate?openingDate=' + p.openingDate).subscribe(c => {
      if (c != null) {
        if (c.status == "Failed") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.API.getdata('/Generic/getOpendayMaster?outletID=' + this.GV.OutletID).subscribe(c => {
            if (c != null) {
              if (c.message == "Data not found") {
                this.existingDaysResponse = [];
              }
              else {
                this.destroyDT(0, false).then(destroyed => {
                  this.existingDaysResponse = c.responseOpenDayMaster;
                  this.existingDaysResponse.sort((a, b) => a.openingDate < b.openingDate ? 1 : a.openingDate > b.openingDate ? -1 : 0);
                  this.dtTrigger.next();
                });
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
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
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

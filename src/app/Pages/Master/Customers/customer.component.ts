import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestCustomer, responseCustomer } from './customerModel';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  requestCustomer: requestCustomer;
  responseCustomer: responseCustomer[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  addMode: boolean = false;
  submitted: boolean = false;
  CustomerForm: FormGroup;
  isShow: boolean = false;
  companyID: number;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.responseCustomer = [];
    this.requestCustomer = new requestCustomer();

  }
  addCustomer() {
    this.submitted = false;
    this.CustomerForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }
  InitializeForm() {
    this.CustomerForm = new FormGroup({
      customerName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      refCode: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      mobileNO: new FormControl("", [
        Validators.required,
        Validators.pattern(".{11,11}")]),
      Address: new FormControl(""),
      isActive: new FormControl(""),
      companyID: new FormControl(""),
      OwnerID: new FormControl(""),
      customerID: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.companyID = this.GV.companyID;
    this.InitializeForm();
    this.getCustomers();
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

  get f() { return this.CustomerForm.controls; }

  saveCustomer() {
    if (this.GV.companyID == 0) {
      this.toastr.warning('Select Company First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    else {
      this.CustomerForm.controls.companyID.setValue(this.GV.companyID);
      this.CustomerForm.controls.OwnerID.setValue(this.GV.ownerID);
    }
    this.submitted = true;
    if (this.CustomerForm.valid) {
      if (this.CustomerForm.controls.isActive.value == "" || this.CustomerForm.controls.isActive.value == null) {
        this.CustomerForm.controls.isActive.setValue(false);
      }
      if (this.CustomerForm.controls.customerID.value == "" || this.CustomerForm.controls.customerID.value == null) {
        this.CustomerForm.controls.customerID.setValue(0);
      }
      this.requestCustomer = this.CustomerForm.value;
      this.API.PostData('/FoodMenu/AddEditCustomer', this.requestCustomer).subscribe(c => {
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
          this.getCustomers();
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

  getCustomers() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getCustomer?companyID=' + this.companyID).subscribe(c => {
      if (c != null) {
        this.responseCustomer = c.responseCustomers;
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.CustomerForm.controls.isActive.setValue(true);
    } else {
      this.CustomerForm.controls.isActive.setValue(false);
    }
  }

  editCustomer(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.CustomerForm.patchValue(p);
  }
}
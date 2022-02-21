import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from './../../Services/Globel/gvar.service'
import { getOutletRequest, OutletRequestModel, OutletResponseModel } from './Outlet.Model';
import { Router } from '@angular/router';
import { CurrencyModelResponse } from '../Master/Currency/currencyModel';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.css'],
})
export class OutletComponent implements OnInit {
  getOutletRequest: getOutletRequest;
  OutletRequestModel: OutletRequestModel;
  OutletResponseModel: OutletResponseModel[];
  CurrencyModelResponse: CurrencyModelResponse[];
  isShow = false;
  OutletForm: FormGroup;
  submitted: boolean = false;
  addMode: boolean = false;
  constructor(public GV: GvarService, public API: ApiService, private toastr: ToastrService, private router: Router) {
    this.OutletForm = new FormGroup({});
    this.OutletRequestModel = new OutletRequestModel();
    this.getOutletRequest = new getOutletRequest();
    this.OutletResponseModel = [];
    this.CurrencyModelResponse = [];
  }

  ngOnInit(): void {
    Number(localStorage.setItem('outletID', '0'));
    this.GV.OutletID = 0;
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    this.GV.isOwner = Number(localStorage.getItem('isOwner'));
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletName = "";
    this.submitted = false;
    this.IntializeForm();
    this.getOutlets();
    this.getCurrencies();
  }

  IntializeForm() {
    this.OutletForm = new FormGroup({
      outletID: new FormControl(""),
      outletName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      phone: new FormControl("", [Validators.required, Validators.pattern(".{10,10}")]),
      email: new FormControl("", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      address: new FormControl("", [Validators.required]),
      hasKitchen: new FormControl(""),
      isActive: new FormControl(""),
      companyID: new FormControl(""),
      UserID: new FormControl(""),
      currencyID: new FormControl("", [Validators.required]),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  get f() { return this.OutletForm.controls; }

  addNewOutlet() {
    this.submitted = false;
    this.OutletForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }

  getOutlets() {
    if (this.GV.companyID == 0) {
      this.toastr.warning('Select Company First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.getOutletRequest.CompanyID = this.GV.companyID;
    this.getOutletRequest.UserID = this.GV.userID;
    this.API.PostData('/Outlet/getOutlet', this.getOutletRequest).subscribe(c => {
      if (c != null) {
        this.OutletResponseModel = c.responseOutlet;
        //this.OutletResponseModel = this.OutletResponseModel.filter(f => this.AllOutlets.some((item: any) => item.outletID === f.outletID));
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  onOutletsubmit() {
    this.submitted = true;
    if (this.OutletForm.valid) {
      if (this.OutletForm.controls.isActive.value == "" || this.OutletForm.controls.isActive.value == null) {
        this.OutletForm.controls.isActive.setValue(false);
      }
      if (this.OutletForm.controls.hasKitchen.value == "" || this.OutletForm.controls.hasKitchen.value == null) {
        this.OutletForm.controls.hasKitchen.setValue(false);
      }
      if (this.OutletForm.controls.outletID.value == null) {
        this.OutletForm.controls.outletID.setValue(0);
      }
      this.OutletForm.controls.UserID.setValue(this.GV.userID);
      this.OutletForm.controls.companyID.setValue((Number(localStorage.getItem('companyID'))));
      this.OutletForm.controls.currencyID.setValue((Number(this.OutletForm.controls.currencyID.value)));
      this.OutletRequestModel = this.OutletForm.value;
      this.API.PostData('/Outlet/AddEditOutlet', this.OutletRequestModel).subscribe(c => {
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
          this.getOutlets();
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
      this.OutletForm.controls.isActive.setValue(true);
    } else {
      this.OutletForm.controls.isActive.setValue(false);
    }
  }
  hasKitchenChange(kitchen: boolean) {
    if (kitchen == true) {
      this.OutletForm.controls.hasKitchen.setValue(true);
    } else {
      this.OutletForm.controls.hasKitchen.setValue(false);
    }
  }

  enterInOutlet(p: any) {
    localStorage.setItem('outletID', p.outletID);
    this.GV.OutletID = p.outletID;
    this.GV.Currency = p.currencyID;
    this.GV.OutletName = p.outletName;
    this.GV.OutletAddress = p.address;
    if (p.outletID == undefined) {
      this.GV.OutletID = 0;
    }
    if (this.GV.OutletID > 0) {
      this.router.navigate(['/Dashboard']);
    }
  }

  editOutlet(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.OutletForm.patchValue(p);
  }

  getCurrencies() {
    this.API.getdata('/Generic/getCurrency?userID=' + this.GV.userID).subscribe(c => {
      if (c != null) {
        this.CurrencyModelResponse = c.responseCurrencies;
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

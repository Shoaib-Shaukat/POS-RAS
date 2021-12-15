import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from './../../Services/Globel/gvar.service'
import { OutletRequestModel, OutletResponseModel } from './Outlet.Model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.css'],
})
export class OutletComponent implements OnInit {
  OutletRequestModel: OutletRequestModel;
  OutletResponseModel: OutletResponseModel[];
  isShow = false;
  OutletForm: FormGroup;
  submitted: boolean = false;
  addMode: boolean = false;
  constructor(public GV: GvarService, public API: ApiService, private toastr: ToastrService, private router: Router) {
    this.OutletForm = new FormGroup({});
    this.OutletRequestModel = new OutletRequestModel();
    this.OutletResponseModel = [];
  }

  ngOnInit(): void {
    this.GV.OutletID = 0;
    this.GV.OutletName = "";
    this.submitted = false;
    this.IntializeForm();
    this.getOutlets();
  }

  IntializeForm() {
    this.OutletForm = new FormGroup({
      outletID: new FormControl(""),
      outletName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      phone: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      defaultWaiter: new FormControl(""),
      hasKitchen: new FormControl(""),
      Active: new FormControl(""),
      createdBy: new FormControl(""),
      modifiedDate: new FormControl(""),
      modifiedBy: new FormControl(""),
      isDeleted: new FormControl(""),
      companyID: new FormControl(""),
      ownerID: new FormControl(""),
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
    this.API.getdata('/Outlet/getOutlet?companyID=' + this.GV.companyID).subscribe(c => {
      if (c != null) {
        this.OutletResponseModel = c.responseOutlet;
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
      if (this.OutletForm.controls.Active.value == "" || this.OutletForm.controls.Active.value == null) {
        this.OutletForm.controls.Active.setValue(false);
      }
      if (this.OutletForm.controls.outletID.value == null) {
        this.OutletForm.controls.outletID.setValue(0);
      }
      this.OutletForm.controls.ownerID.setValue(Number(localStorage.getItem('ownerID')));
      this.OutletForm.controls.companyID.setValue(this.GV.companyID);
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
      this.OutletForm.controls.Active.setValue(true);
    } else {
      this.OutletForm.controls.Active.setValue(false);
    }
  }

  enterInOutlet(p: any) {
    this.GV.OutletID = p.outletID;
    this.GV.OutletName = p.outletName;
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
}

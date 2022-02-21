import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GvarService } from '../../Services/Globel/gvar.service'
import { ApiService } from 'src/app/Services/API/api.service';
import { CompaniesRequestModel, CompaniesResponseModel } from './Companies.Model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {
  CompaniesRequestModel: CompaniesRequestModel;
  CompaniesResponseModel: CompaniesResponseModel[];
  ownerID: any;
  userID: any;
  isShow: boolean = false;
  addMode: boolean = false;
  CompanyForm: FormGroup;
  submitted: boolean = false;

  constructor(public GV: GvarService, public API: ApiService, private router: Router, private toastr: ToastrService) {
    this.CompaniesResponseModel = [];
    this.CompaniesRequestModel = new CompaniesRequestModel();
  }

  ngOnInit() {
    this.GV.companyID = 0;
    this.GV.OutletID = 0;
    this.ownerID = localStorage.getItem('ownerID');
    this.userID = Number(localStorage.getItem('userID'));
    this.IntializeForm();
    this.getCompanies();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.CompanyForm.controls; }

  IntializeForm() {
    this.CompanyForm = new FormGroup({
      companyID: new FormControl(""),
      companyName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      ownerID: new FormControl(""),
    });
  }

  addNewCompany() {
    this.addMode = false;
    this.submitted = false;
    this.CompanyForm.reset();
    this.isShow = !this.isShow;
  }

  getCompanies() {
    this.API.getdata('/Owner/getCompany?userID=' + this.userID).subscribe(c => {
      if (c != null) {
        this.CompaniesResponseModel = c.companyModel;
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
      this.CompanyForm.controls.isActive.setValue(true);
    } else {
      this.CompanyForm.controls.isActive.setValue(false);
    }
  }

  enterInCompany(p: any) {
    Number(localStorage.setItem('companyID', p.companyID));
    this.GV.companyID = Number(p.companyID);
    this.GV.companyName = p.companyName;
    if (p.companyID == undefined) {
      this.GV.companyID = 0;
    }
    if (this.GV.companyID > 0) {
      this.router.navigate(['/Outlet']);
    }
  }

  onCompanySubmit() {
    this.submitted = true;
    if (this.CompanyForm.valid) {
      if (this.CompanyForm.controls.isActive.value == "" || this.CompanyForm.controls.isActive.value == null) {
        this.CompanyForm.controls.isActive.setValue(false);
      }
      if (this.CompanyForm.controls.companyID.value == null) {
        this.CompanyForm.controls.companyID.setValue(0);
      }
      this.CompanyForm.controls.ownerID.setValue(Number(localStorage.getItem('ownerID')));
      this.CompaniesRequestModel = this.CompanyForm.value;
      this.API.PostData('/Owner/AddEditCompany', this.CompaniesRequestModel).subscribe(c => {
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
          this.getCompanies();
        }
      },
        error => {
          this.toastr.error(error.error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
    }
  }

  editCompany(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.CompanyForm.patchValue(p);
  }

}


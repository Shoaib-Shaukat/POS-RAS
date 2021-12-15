import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { registerModelRequest, registerModelResponse } from './Register.Model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  addMode: boolean = false;
  submitted: boolean = false;
  isShow: boolean = false;
  registerModelRequest: registerModelRequest;
  registerModelResponse: registerModelResponse[];
  RegisterForm: FormGroup;
  passMatch: boolean = false;
  returnUrl: string = "";
  validForm: boolean = true;

  constructor(private route: ActivatedRoute,
    private GV: GvarService,
    public API: ApiService,
    private router: Router,
    private toastr: ToastrService) {
    this.registerModelRequest = new registerModelRequest();
    this.registerModelResponse = [];
  }

  ngOnInit(): void {
    this.GV.ownerID = 0;
    this.IntializeForm();
    this.getUsers();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  IntializeForm() {
    this.RegisterForm = new FormGroup({
      ownerId: new FormControl(),
      Name: new FormControl("", [Validators.required]),
      Email: new FormControl("", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      DOB: new FormControl(""),
      Cnic: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]{13}$")]),
      MobileNo: new FormControl("", [
        Validators.required,
        Validators.pattern(".{11,11}")]),
      Gender: new FormControl("", [Validators.required]),
      Address: new FormControl("", [Validators.required]),
      Password: new FormControl("", [
        Validators.required, Validators.pattern('(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>"\'\\;:\{\\\}\\\[\\\]\\\|\\\+\\\-\\\=\\\_\\\)\\\(\\\)\\\`\\\/\\\\\\]])[A-Za-z0-9\d$@].{7,}')]),
      ConfirmPassword: new FormControl("", [Validators.required]),
      isActive: new FormControl(""),
    })
  }

  onRegisterSubmit() {
    this.RegisterForm.markAllAsTouched()
    if (this.RegisterForm.valid) {
      if (this.RegisterForm.controls.ownerId.value == null) {
        this.RegisterForm.controls.ownerId.setValue(0);
      }
      if (this.RegisterForm.controls.isActive.value == "" || this.RegisterForm.controls.isActive.value == null) {
        this.RegisterForm.controls.isActive.setValue(false);
      }
      this.registerModelRequest = this.RegisterForm.value;
      this.API.LoginUser('/api/Owner/AddEditOwner', this.registerModelRequest).subscribe(
        (data) => {
          if (data.status == "Failed") {
            this.toastr.error(data.message, 'Success', {
              timeOut: 3000,
              'progressBar': true,
            });
            return
          }
          if (data.status == "OK") {
            this.toastr.success(data.message, 'Success', {
              timeOut: 3000,
              'progressBar': true,
            });
          }
          this.registerModelRequest = new registerModelRequest();
          this.RegisterForm.reset();
          this.isShow = !this.isShow;
          this.getUsers();
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
          // this.router.navigate([returnUrl]);
        },

        (error) => {
          this.RegisterForm.enable({ emitEvent: true });
          if (error.error != undefined) {
            this.toastr.error(error.error.message, 'Error', {
              timeOut: 3000,
              'progressBar': true,
            });
          } else {
            this.toastr.error('Network Error', 'POS', {
              timeOut: 3000,
              'progressBar': true,
            });
          }
        }
      );
    }
    else {
      return
    }
  }

  passVerify() {
    if (this.RegisterForm.controls.Password.value === this.RegisterForm.controls.ConfirmPassword.value) {
      this.passMatch = true;
    }
    else {
      this.passMatch = false;
    }
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.RegisterForm.controls.isActive.setValue(true);
    } else {
      this.RegisterForm.controls.isActive.setValue(false);
    }
  }

  addNewUser() {
    this.addMode = false;
    this.submitted = false;
    this.RegisterForm.reset();
    this.isShow = !this.isShow;
  }

  getUsers() {
    this.API.getdata('/Owner/getOwner').subscribe(c => {
      if (c != null) {
        this.registerModelResponse = c.ownerModel;
        this.dtTrigger.next();
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  addCompany(p: any) {
    this.GV.ownerID = p.ownerId;
    if (p.ownerId == undefined) {
      this.GV.ownerID = 0;
    }
    if (this.GV.ownerID > 0) {
      this.router.navigate(['/Companies']);
    }
    localStorage.setItem('ownerID', p.ownerId);
    this.router.navigate(['/Companies']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editCompany(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.RegisterForm.controls.Address.patchValue(p.address);
    this.RegisterForm.controls.Cnic.patchValue(p.cnic);
    this.RegisterForm.controls.DOB.patchValue(p.dob);
    this.RegisterForm.controls.Email.patchValue(p.email);
    this.RegisterForm.controls.Gender.patchValue(p.gender);
    this.RegisterForm.controls.isActive.patchValue(p.isActive);
    this.RegisterForm.controls.MobileNo.patchValue(p.mobileNo);
    this.RegisterForm.controls.Name.patchValue(p.name);
    this.RegisterForm.controls.ownerId.patchValue(p.ownerId);
    this.RegisterForm.controls.Password.patchValue(p.password);
    this.RegisterForm.controls.ConfirmPassword.patchValue(p.password);
  }
}

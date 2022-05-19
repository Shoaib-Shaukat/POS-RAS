import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginViewModel } from './LoginModel';
import { ApiService } from '../../../Services/API/api.service';
import { ToastrService } from 'ngx-toastr';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  returnUrl: string = "";
  LoginViewModel: LoginViewModel;
  validForm: boolean = true;
  loginForm: FormGroup;
  submitted: boolean = false;
  clicked: boolean = false;
  constructor(public GV: GvarService,
    public API: ApiService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) {
    this.LoginViewModel = new LoginViewModel();
    this.loginForm = new FormGroup({
      Username: new FormControl("", [Validators.required]),
      Password: new FormControl("", [Validators.required]),
    });
  }
  ngOnInit(): void { }

  get f() { return this.loginForm.controls; }

  onLoginSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.clicked = true;
      this.LoginViewModel = this.loginForm.value;
      this.API.LoginUser('/api/Token/Login/', this.LoginViewModel).subscribe(
        (data) => {
          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 1.08e+7);
          this.ngOnInit();
          this.toastr.success('Login Successful', 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          localStorage.setItem('token', data.token);
          localStorage.setItem('userRoles', data.roles);
          localStorage.setItem('userName', data.name);
          Number(localStorage.setItem('companyID', data.companyID));
          Number(localStorage.setItem('userID', data.userID));
          localStorage.setItem('isOwner', data.owner);
          localStorage.setItem('userMenus', data.menuID);
          if (data.companyID > 0) {
            this.GV.SetCompany(data.companyName);
            localStorage.setItem('companyName', data.companyName);
          }
          else {
            localStorage.setItem('companyName', '');
            this.GV.SetCompany(null);
          }
          this.GV.userID = Number(data.userID);
          this.GV.isOwner = data.owner;
          if (data.companyID == 0) {
            this.GV.companyID = 0;
            this.router.navigate(['/Companies']);
          }
          else {
            this.GV.companyID = data.companyID;
            this.router.navigate(['/Outlet']);
          }
          // if (this.GV.canGetOwner) {
          //   this.router.navigate(['/Register']);
          // }
          // else {
          //   this.router.navigate(['/Companies']);
          // }
        },
        (error) => {
          this.clicked = false;
          this.loginForm.enable({ emitEvent: true });
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
  }
}

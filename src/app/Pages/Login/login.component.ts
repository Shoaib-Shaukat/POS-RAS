import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginViewModel } from './LoginModel';
import { ApiService } from '../../Services/API/api.service';
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
      Username: new FormControl("", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
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
          this.toastr.success('Login Successful', 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });

          localStorage.setItem('token', data.token);
          localStorage.setItem('userRoles', data.roles);
          localStorage.setItem('userName', data.name);
          localStorage.setItem('ownerID', data.ownerID);
          if (this.GV.canGetOwner) {
            this.router.navigate(['/Users']);
          }
          else {
            this.router.navigate(['/Companies']);
          }
        },
        (error) => {
          this.clicked = false;
          this.loginForm.enable({ emitEvent: true });
          if (error.error != undefined) {
            this.toastr.error(error.error.Message, 'Error', {
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

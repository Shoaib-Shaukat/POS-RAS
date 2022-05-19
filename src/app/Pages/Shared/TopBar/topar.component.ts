import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

@Component({
  selector: 'app-topar',
  templateUrl: './topar.component.html',
  styleUrls: ['./topar.component.css']
})
export class ToparComponent implements OnInit {
  OutletName: any;
  CompanyName: any;
  userName: any;
  elem: any;
  date: any;
  fullMode: boolean = false;
  constructor(@Inject(DOCUMENT) private document: any, public GV: GvarService, public router: Router,
    public API: ApiService, private toastr: ToastrService) {
    this.OutletName = localStorage.getItem('OutletName');
    this.CompanyName = localStorage.getItem('companyName');
    this.date = localStorage.getItem('openingDate');
    this.GV.OutletEntered.subscribe((data) => {
      this.setOutletName(data);
    })
    this.GV.CompanyEntered.subscribe((data) => {
      this.setCompanyName(data);
    })
    this.GV.openingDate.subscribe((data: any) => {
      this.date = data;
    })
  }
  ngOnInit(): void {
    this.elem = document.documentElement;
    this.fullMode = false;
    this.userName = localStorage.getItem('userName');
    this.GV.userID = localStorage.getItem('userID');
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    var token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['login']);
    }
  }
  setOutletName(data: any) {
    this.OutletName = data;
  }
  setCompanyName(data: any) {
    this.CompanyName = data;
  }
  //..................................................................................................
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.fullMode = true;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.fullMode = false;
  }
}

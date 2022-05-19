import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestDashboardReport, responseDashboardReport } from './dasboardModel';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  requestDashboardReport: requestDashboardReport;
  responseDashboardReport: responseDashboardReport;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,) {
    this.requestDashboardReport = new requestDashboardReport();
    this.responseDashboardReport = new responseDashboardReport();
  }

  ngOnInit(): void {
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.getMainReport();
  }

  getMainReport() {
    this.requestDashboardReport.companyID = this.GV.companyID;
    this.requestDashboardReport.outletID = this.GV.OutletID;
    this.API.PostData('/DashboardReport/GetDashboardReport', this.requestDashboardReport).subscribe(c => {
      if (c != null) {
        this.responseDashboardReport = c;
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

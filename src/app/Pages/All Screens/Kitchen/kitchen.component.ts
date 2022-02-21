import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import Swal from 'sweetalert2';
import { changeOrderStatus, POSNewModelRequest, requestCustomerTable, responseCustomer, responseOrder, tablesResponse } from './kitchenModel';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit, OnDestroy {
  mySubscription: Subscription

  changeOrderStatus: changeOrderStatus;
  responseOrder: responseOrder[];
  tablesResponse: tablesResponse[];
  POSNewModelRequest: POSNewModelRequest;
  responseCustomer: responseCustomer[];
  selectedTables: requestCustomerTable[];
  orderRemarks: string = "";
  viewMode: boolean = false;
  customerName: string = "";
  totalTables: number = 0;
  tablesOccupied: number = 0;
  tablesFree: number = 0;
  tableList: string = "";
  SearchForm: FormGroup;
  constructor(public API: ApiService, public GV: GvarService, public toastr: ToastrService,) {
    // this.mySubscription = interval(5000).subscribe((x => {
    //   this.getAllOrders();
    // }));
    this.responseOrder = [];
    this.POSNewModelRequest = new POSNewModelRequest();
    this.responseCustomer = [];
    this.changeOrderStatus = new changeOrderStatus();
  }

  ngOnInit(): void {
    this.getAllOrders();
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.SearchForm = new FormGroup({
      foodMenuID: new FormControl(""),
      searchByRefCode: new FormControl(""),
      searchCustomerByCode: new FormControl(""),
      CustomerName: new FormControl(""),
    });
  }

  ngOnDestroy() {
    console.log("Destroy timer");
    this.mySubscription.unsubscribe();
  }
  getCustomers() {
    this.API.getdata('/FoodMenu/getCustomer?companyID=' + this.GV.companyID).subscribe(c => {
      if (c != null) {
        this.responseCustomer = c.responseCustomers;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  getAllOrders() {
    this.responseOrder = [];
    this.API.getdata('/Pos/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseOrder = c.responseKot;
        this.responseOrder.forEach((c) => {
          if ((c.minute.minutes.toString().length) == 1) {
            var min = c.minute.minutes.toString();
            var newMin = '0' + min;
            c.minute.minutes = newMin;
          }
          if ((c.minute.seconds.toString().length) == 1) {
            var sec = c.minute.seconds.toString();
            var newSec = '0' + sec;
            c.minute.seconds = newSec;
          }
        })
        this.responseOrder.sort((a, b) => a.kotID < b.kotID ? 1 : a.kotID > b.kotID ? -1 : 0);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  viewOrder(p: any) {
    this.API.getdata('/Pos/getKOTBykotID?kotID=' + p.kotID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          if (c.responseCustomerDetail == null) {
            this.POSNewModelRequest.requestCustomerDetail.customerID = 0;
            this.POSNewModelRequest.requestCustomerDetail.customerDetailID = 0;
            this.POSNewModelRequest.requestCustomerDetail.kotID = 0;
          }
          else {
            this.POSNewModelRequest.requestCustomerDetail = c.responseCustomerDetail;
            if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
              var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
              this.customerName = this.responseCustomer[index].customerName;
            }
          }
          this.POSNewModelRequest.requestCustomerTable = c.responseCustomerTable;
          this.POSNewModelRequest.requestKot = c.responseKot;
          this.orderRemarks = this.POSNewModelRequest.requestKot.remarks;
          this.POSNewModelRequest.requestKotDetail = c.responseKotDetail;
          this.selectedTables = c.responseCustomerTable;
          if (this.POSNewModelRequest.requestCustomerDetail.customerID > 0) {
            var index = this.responseCustomer.findIndex((c) => c.customerID == this.POSNewModelRequest.requestCustomerDetail.customerID);
            this.customerName = this.responseCustomer[index].customerName;
            this.SearchForm.controls.searchCustomerByCode.setValue(this.responseCustomer[index].refCode);
          }
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

  resetOrder() {
    this.customerName = "";
    this.orderRemarks = "";
    this.selectedTables = [];
    this.SearchForm.reset();
    this.POSNewModelRequest = new POSNewModelRequest();
  }

  changeStatus(p: any) {
    this.changeOrderStatus.statusID = p.statusID;
    this.changeOrderStatus.kotID = p.kotID;
    this.API.PostData("/Pos/changeOrderStatus", this.changeOrderStatus).subscribe(c => {
      if (c != null) {
        this.toastr.success(c.message, 'Success', {
          timeOut: 3000,
          'progressBar': true,
        });
        this.resetOrder();
        this.getAllOrders();
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  cancelOrderNotConfirm(p: any) {
    Swal.fire({
      text: 'Are you sure you want to cancel ' + p.kotNO + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result: any) => {
      if (result.isConfirmed) {
        let body = {
          statusID: 7,
          kotID: p.kotID
        }
        this.changeStatus(body);
      }
    })
  }
}

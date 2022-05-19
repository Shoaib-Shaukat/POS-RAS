import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { CurrencyModelRequest, CurrencyModelResponse } from '../../Main/Currency/currencyModel';
import { POSNewModelRequest, requestCustomerTable, responseCustomer, responseOrder, responseTable } from './ordersModel';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  customerName: string = "";
  orderRemarks: string = "";
  selectedTables: requestCustomerTable[];
  responseTable: responseTable[];
  responseCustomer: responseCustomer[];
  customerFound: boolean = false;
  POSNewModelRequest: POSNewModelRequest;
  tableList: string = "";
  @ViewChildren("closeOrderModal") closeOrderModal: any;
  responseOrder: responseOrder[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  addMode: boolean = false;
  submitted: boolean = false;
  isShow: boolean = false;
  constructor(private API: ApiService,
    public GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.responseOrder = [];
    this.POSNewModelRequest = new POSNewModelRequest();
    this.responseCustomer = [];
    this.selectedTables = [];
    this.responseTable = [];
  }

  ngOnInit(): void {
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getAllOrders();
    this.getCustomersAndTables();
  }
  addOrder() {
    this.submitted = false;
    this.isShow = !this.isShow;
    this.addMode = false;
    this.router.navigate(['/AllScreen/Pos']);
  }

  getAllOrders() {
    this.responseOrder = [];
    this.API.getdata('/Pos/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseOrder = c.responseKot;
        this.dtTrigger.next();
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
  getCustomersAndTables() {
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
    this.API.getdata('/FoodMenu/getTable?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseTable = c.responseTables;
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
    this.POSNewModelRequest = new POSNewModelRequest();
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
          }
          else {
            this.customerName = "";
          }
          this.tableList = "";
          this.POSNewModelRequest.requestCustomerTable.forEach((x) => {
            this.responseTable.forEach((c) => {
              if (c.tableID == x.tableID) {
                this.tableList = this.tableList.concat(c.tableName, ', ');
              }
            })
          })
          this.tableList = this.tableList.slice(0, -2);
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
}

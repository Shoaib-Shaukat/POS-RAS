import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { CurrencyModelRequest, CurrencyModelResponse } from '../../Master/Currency/currencyModel';
import { POSModelRequest, responseOrder } from './ordersModel';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  tableList: string = "";
  @ViewChildren("closeOrderModal") closeOrderModal: any;
  POSModelRequest: POSModelRequest;
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
    this.POSModelRequest = new POSModelRequest();
  }
  addOrder() {
    this.submitted = false;
    this.isShow = !this.isShow;
    this.addMode = false;
    this.router.navigate(['/AllScreen/Pos']);
  }
  ngOnInit(): void {
    this.getAllOrders();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  getAllOrders() {
    this.responseOrder = [];
    this.API.getdata('/Generic/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseOrder = c.responseKot;
        this.dtTrigger.next();
        this.responseOrder.sort((a, b) => a.kotID < b.kotID ? 1 : a.kotID > b.kotID ? -1 : 0);
        //.......................
        // this.responseTableReplica = c.responseTable;
        // this.responseOrder.sort((a, b) => a.orderID < b.orderID ? 1 : a.orderID > b.orderID ? -1 : 0);
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
    this.API.getdata('/Generic/getOrder?OrderID=' + p.orderID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
          return;
        }
        else {
          this.POSModelRequest = c;
          this.POSModelRequest.responseTable.forEach((x) => {
            if (this.POSModelRequest.responseTable.length > 0) {
              this.tableList = this.tableList.concat(x.tableName, ', ');
            }
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

  closeOrderDetailModal() {
    this.tableList = "";
    this.POSModelRequest = new POSModelRequest();
    this.closeOrderModal["first"].nativeElement.click();
  }
}

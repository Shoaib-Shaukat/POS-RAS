import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import Swal from 'sweetalert2';
import { changeOrderStatus, POSNewModelRequest, requestCustomerTable, responseCustomer, responseKotDealDetail, responseKotDetail, responseOrder, responseSection, tablesResponse } from './genericModel';

@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.css']
})
export class GenericComponent implements OnInit {
  responseKotDealDetail: responseKotDealDetail[];
  responseKotDetail: responseKotDetail[];
  responseKotDetailReplica: responseKotDetail[];
  FullOrder: any;
  mySubscription: Subscription
  KOTID: number = 0;
  StartAll: boolean = false;
  ReadyAll: boolean = false;
  CollectAll: boolean = false;
  CancelAll: boolean = false;
  SectionName: any = "";
  changeOrderStatus: changeOrderStatus;
  responseOrder: responseOrder[];
  tablesResponse: tablesResponse[];
  POSNewModelRequest: POSNewModelRequest;
  responseCustomer: responseCustomer[];
  selectedTables: requestCustomerTable[];
  responseSection: responseSection[];
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
    this.responseSection = [];
    this.responseKotDetail = [];
    this.responseKotDetailReplica = [];
    this.responseKotDealDetail = [];
  }

  ngOnInit(): void {
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.getSections();
    this.SearchForm = new FormGroup({
      foodMenuID: new FormControl(""),
      searchByRefCode: new FormControl(""),
      searchCustomerByCode: new FormControl(""),
      CustomerName: new FormControl(""),
    });
  }

  getSections() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getSection?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.responseSection = c.responseSections;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  // ngOnDestroy() {
  //   console.log("Destroy timer");
  //   this.mySubscription.unsubscribe();
  // }
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
  // getAllOrders() {
  //   this.responseOrder = [];
  //   this.API.getdata('/Pos/getOrderByOutletID?outletID=' + this.GV.OutletID).subscribe(c => {
  //     if (c != null) {
  //       this.responseOrder = c.responseKot;
  //       this.responseOrder.forEach((c) => {
  //         if ((c.minute.minutes.toString().length) == 1) {
  //           var min = c.minute.minutes.toString();
  //           var newMin = '0' + min;
  //           c.minute.minutes = newMin;
  //         }
  //         if ((c.minute.seconds.toString().length) == 1) {
  //           var sec = c.minute.seconds.toString();
  //           var newSec = '0' + sec;
  //           c.minute.seconds = newSec;
  //         }
  //       })
  //       this.responseOrder.sort((a, b) => a.kotID < b.kotID ? 1 : a.kotID > b.kotID ? -1 : 0);
  //     }
  //   },
  //     error => {
  //       this.toastr.error(error.statusText, 'Error', {
  //         timeOut: 3000,
  //         'progressBar': true,
  //       });
  //     });
  // }
  viewOrder(p: any) {
    this.POSNewModelRequest = new POSNewModelRequest();
    this.KOTID = p.kotID;
    let body: any = {
      kotID: p.kotID,
      sectionID: p.sectionID
    }
    this.API.PostData('/Pos/getOrderBykotID', body).subscribe(c => {
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

        //...................................
        this.checkStatusOfCheckbox();

      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  checkStatusOfCheckbox() {
    var indexOfNewOrder = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.itemStatusID == 1);
    if (indexOfNewOrder != -1) {
      this.StartAll = true;
    }
    else {
      this.StartAll = false;
    }

    var indexOfReady = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.itemStatusID == 2);
    if (indexOfReady != -1) {
      this.ReadyAll = true;
    }
    else {
      this.ReadyAll = false;
    }

    var indexOfCollect = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.itemStatusID == 3);
    if (indexOfCollect != -1) {
      this.CollectAll = true;
      this.CancelAll = true;
    }
    else {
      this.CollectAll = false;
      this.CancelAll = false;
    }

    var indexOfCancel = this.POSNewModelRequest.requestKotDetail.findIndex((x) => x.itemStatusID == 5);
    if (indexOfCancel != -1) {
      this.CancelAll = true;
    }
    else {
      this.CancelAll = false;
    }
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
        //this.getAllOrders();
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
  cancelItemNotConfirm(p: any, val: any) {
    Swal.fire({
      text: 'Are you sure you want to cancel ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.changeItemStatus(p, val);
      }
    })
  }


  // changeAllItemsStatus(val: any) {
  //   let body: any = {
  //     kotID: this.KOTID,
  //     itemstatusID: val
  //   }
  //   this.API.PostData('/Pos/changeAllItemStatus', body).subscribe(c => {
  //     if (c != null) {
  //       this.POSNewModelRequest.requestKotDetail.forEach((x: any) => {
  //         if (x.kotID == c.kotID) {
  //           x.itemStatus = c.itemStatus
  //           x.itemStatusID = c.itemStatusID
  //         }
  //       })
  //       if (c.itemStatusID == 1) {
  //         this.StartAll = true;
  //       }
  //       else if (c.itemStatusID == 2) {
  //         this.ReadyAll = true;
  //       }
  //       else if (c.itemStatusID == 3) {
  //         this.CollectAll = true;
  //         this.CancelAll = true;
  //       }
  //       else {
  //         this.CancelAll = true;
  //       }
  //       this.checkStatusOfCheckbox();
  //       this.loadScreen(this.FullOrder);
  //     }
  //   },
  //     error => {
  //       this.toastr.error(error.statusText, 'Error', {
  //         timeOut: 3000,
  //         'progressBar': true,
  //       });
  //     });
  // }

  // loadScreen(section: any) {
  //   this.FullOrder = section;
  //   this.responseOrder = [];
  //   this.SectionName = section.sectionName;
  //   let body: any = {
  //     outletID: section.outletID,
  //     sectionID: section.sectionID
  //   }
  //   this.API.PostData('/Pos/getOrderBykotID', body).subscribe(c => {
  //     if (c != null) {
  //       this.responseOrder = c.responseOrder;
  //       this.responseOrder.forEach((c) => {
  //         if ((c.minute.minutes.toString().length) == 1) {
  //           var min = c.minute.minutes.toString();
  //           var newMin = '0' + min;
  //           c.minute.minutes = newMin;
  //         }
  //         if ((c.minute.seconds.toString().length) == 1) {
  //           var sec = c.minute.seconds.toString();
  //           var newSec = '0' + sec;
  //           c.minute.seconds = newSec;
  //         }
  //       })
  //       this.responseOrder.sort((a, b) => a.kotID < b.kotID ? 1 : a.kotID > b.kotID ? -1 : 0);
  //     }
  //   },
  //     error => {
  //       this.toastr.error(error.statusText, 'Error', {
  //         timeOut: 3000,
  //         'progressBar': true,
  //       });
  //     });
  // }


  loadScreen(section: any) {
    this.FullOrder = section;
    this.responseOrder = [];
    this.SectionName = section.sectionName;
    let body: any = {
      outletID: section.outletID,
      sectionID: section.sectionID
    }
    this.API.PostData('/Pos/getOrderBykotID', body).subscribe(c => {
      if (c != null) {
        this.responseKotDetail = c.responseKotDetailgeneric;
        this.responseKotDetailReplica = c.responseKotDetailgeneric;
        // this.responseKotDetailReplica = c.responseKotDetail;
        // this.responseKotDetail = c.responseKotDetail;
        // this.responseKotDealDetail = c.responseKotDealDetail;
        // let newArr = this.responseKotDetailReplica.concat(c.responseKotDealDetail);
        // this.responseKotDetailReplica = newArr;
        // this.responseKotDetail = newArr;
        // this.responseKotDealDetail.forEach((x) => {
        //   this.responseKotDetail.push(x);
        //   this.responseKotDetailReplica.push(x);
        // });
        this.responseKotDetail.forEach((c) => {
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
        this.responseKotDetail.sort((a, b) => a.kotDetailID < b.kotDetailID ? 1 : a.kotDetailID > b.kotDetailID ? -1 : 0);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }


  changeItemStatus(item: any, val: any) {
    this.FullOrder = item;
    let body = {
      kotDetailgenericID: item.kotDetailgenericID,
      itemStatusID: item.itemStatusID,
      dealID: item.dealID,
      kotID: item.kotID,
      kotDetailID: item.kotDetailID
    }
    if (val == 5) {
      body.itemStatusID = 5;
    }
    this.API.PostData('/Pos/changeItemStatus', body).subscribe(c => {
      if (c != null) {
        this.toastr.success(c.message, '', {
          timeOut: 3000,
          'progressBar': true,
        });
        var index = this.responseKotDetail.findIndex((x) => x.kotDetailgenericID == c.kotDetailID);
        this.responseKotDetail[index].itemStatus = c.itemStatus;
        this.responseKotDetail[index].itemStatusID = c.itemStatusID;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  searchOrder(OrderNumber: any) {
    this.responseKotDetail = this.responseKotDetailReplica;
    var orderNo = OrderNumber.value;
    if (orderNo == "" || orderNo == null || orderNo == undefined) {
      this.responseKotDetail = this.responseKotDetailReplica;
      return
    }
    else {
      this.responseKotDetail = this.responseKotDetail.filter((c) => c.kotNO.indexOf(orderNo) > -1);
      if (this.responseKotDetail.length == 0 && !orderNo) {
        this.responseKotDetail = [];
      }
      else {
        this.responseKotDetail = this.responseKotDetail.filter((c) => c.kotNO.indexOf(orderNo) > -1);
        return
      }
    }
  }
}

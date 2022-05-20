import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import Swal from 'sweetalert2';
import { requestSectionModel, responsePrinter, responseSection } from './SectionModel';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  @ViewChildren("closePrinterModal") closePrinterModal: any;
  Psubmitted: boolean = false;
  InvoiceFormatValue: number = 1;
  BillFormatValue: number = 1;
  KotFormatValue: number = 1;
  addMode: boolean = false;
  submitted: boolean = false;
  SectionForm: FormGroup;
  PrinterForm: FormGroup;
  isShow: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  requestSectionModel: requestSectionModel;
  responseSection: responseSection[];
  responsePrinter: responsePrinter[];

  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.requestSectionModel = new requestSectionModel();
    this.responseSection = [];
    this.responsePrinter = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getSections();
  }

  InitializeForm() {
    this.SectionForm = new FormGroup({
      sectionID: new FormControl(""),
      sectionName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      outletID: new FormControl(""),
      userID: new FormControl(""),
      invoiceFormat: new FormControl(""),
      billFormat: new FormControl(""),
      kotFormat: new FormControl(""),
      hasScreen: new FormControl("")
    });
    this.PrinterForm = new FormGroup({
      printerID: new FormControl(""),
      printerIP: new FormControl(""),
      printerPort: new FormControl(""),
      printerTitle: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      outletID: new FormControl(""),
      isActive: new FormControl(""),
      sectionID: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.SectionForm.controls; }
  get g() { return this.PrinterForm.controls; }

  addSection() {
    this.requestSectionModel = new requestSectionModel();
    this.submitted = false;
    this.SectionForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.InvoiceFormatValue = 1;
    this.BillFormatValue = 1;
    this.KotFormatValue = 1;
    this.Psubmitted = false;
    this.SectionForm.controls.hasScreen.setValue(true);
    this.SectionForm.controls.invoiceFormat.setValue(1);
    this.SectionForm.controls.billFormat.setValue(1);
    this.SectionForm.controls.kotFormat.setValue(1);
  }

  hasScreenChecked(check: boolean) {
    if (check == true) {
      this.SectionForm.controls.hasScreen.setValue(true);
    } else {
      this.SectionForm.controls.hasScreen.setValue(false);
    }
  }
  saveSection() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.submitted = true;
    if (this.SectionForm.valid) {
      if (this.SectionForm.controls.sectionID.value == "" || this.SectionForm.controls.sectionID.value == null) {
        this.SectionForm.controls.sectionID.setValue(0);
      }
      this.SectionForm.controls.userID.setValue(this.GV.userID);
      this.SectionForm.controls.outletID.setValue(this.GV.OutletID);
      this.requestSectionModel.requestSection = this.SectionForm.value;
      this.API.PostData('/FoodMenu/AddEditSection', this.requestSectionModel).subscribe(c => {
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
          this.getSections();
        }
      },
        error => {
          this.toastr.error(error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
    }
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
        this.destroyDT(0, false).then(destroyed => {
          this.responseSection = c.responseSections;
          this.dtTrigger.next();
        });
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  editSection(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.SectionForm.patchValue(p);
    this.InvoiceFormatValue = Number(this.SectionForm.controls.invoiceFormat.value);
    this.BillFormatValue = Number(this.SectionForm.controls.billFormat.value);
    this.KotFormatValue = Number(this.SectionForm.controls.kotFormat.value);
    this.getPrinters(p.sectionID);
  }
  destroyDT = (tableIndex: any, clearData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
        this.datatableElement.forEach((dtElement: DataTableDirective, index) => {

          if (index == tableIndex) {
            if (dtElement.dtInstance) {

              if (tableIndex == 0) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
              else if (tableIndex == 1) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              } else if (tableIndex == 2) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
              else if (tableIndex == 3) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 4) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };

  billFChanged() {
    var value: any = $("input:radio[name=billFormat]:checked").val();
    if (value == "0") {
      this.BillFormatValue = 0;
      this.SectionForm.controls.billFormat.setValue(0);
    }
    else if (value == "56") {
      this.BillFormatValue = 1;
      this.SectionForm.controls.billFormat.setValue(1);
    }
    else if (value == "80") {
      this.BillFormatValue = 2;
      this.SectionForm.controls.billFormat.setValue(2);
    }
    else {
      this.BillFormatValue = 3;
      this.SectionForm.controls.billFormat.setValue(3);
    }
  }
  kotFChanged() {
    var value: any = $("input:radio[name=kotFormat]:checked").val();
    if (value == "0") {
      this.KotFormatValue = 0;
      this.SectionForm.controls.kotFormat.setValue(0);
    }
    else if (value == "56") {
      this.KotFormatValue = 1;
      this.SectionForm.controls.kotFormat.setValue(1);
    }
    else if (value == "80") {
      this.KotFormatValue = 1;
      this.SectionForm.controls.kotFormat.setValue(2);
    }
    else {
      this.KotFormatValue = 3;
      this.SectionForm.controls.kotFormat.setValue(3);
    }
  }
  invoiceFChanged() {
    var value: any = $("input:radio[name=invoiceFormat]:checked").val();
    if (value == "0") {
      this.InvoiceFormatValue = 0;
      this.SectionForm.controls.invoiceFormat.setValue(0);
    }
    else if (value == "56") {
      this.InvoiceFormatValue = 1;
      this.SectionForm.controls.invoiceFormat.setValue(1);
    }
    else if (value == "80") {
      this.InvoiceFormatValue = 2;
      this.SectionForm.controls.invoiceFormat.setValue(2);
    }
    else {
      this.InvoiceFormatValue = 3;
      this.SectionForm.controls.invoiceFormat.setValue(3);
    }
  }
  addPrinter() {
    this.PrinterForm.reset();
    this.Psubmitted = false;
    this.PrinterForm.controls.isActive.setValue(true);
  }
  removePrinter(val: any) {
    var index = this.requestSectionModel.requestPrinter.findIndex((x: any) => x.printerID == val.printerID);
    if (this.requestSectionModel.requestPrinter[index].printerID == 0) {
      this.requestSectionModel.requestPrinter.splice(index, 1);
    }
    else {
      Swal.fire({
        text: 'Are you sure you want to remove?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Remove',

      }).then((result) => {
        if (result.isConfirmed) {
          this.confirmRemove(index);
        }
      })
    }
  }
  confirmRemove(index: any) {
    this.requestSectionModel.requestPrinter.splice(index, 1);
  }
  pushPrinter() {
    this.Psubmitted = true;
    if (this.PrinterForm.valid) {
      var index = this.requestSectionModel.requestPrinter.findIndex((x: any) => x.printerTitle == this.PrinterForm.controls.printerTitle.value);
      if (index != -1) {
        this.toastr.error('Printer name already exists', '', {
          timeOut: 3000,
          'progressBar': true,
        });
        return
      }
      else {
        let body = {
          printerID: 0,
          printerIP: this.PrinterForm.controls.printerIP.value,
          printerPort: this.PrinterForm.controls.printerPort.value,
          printerTitle: this.PrinterForm.controls.printerTitle.value,
          outletID: this.GV.OutletID,
          isActive: this.PrinterForm.controls.isActive.value,
          sectionID: 0
        }
        this.requestSectionModel.requestPrinter.push(body);
        this.closePrinterModal["first"].nativeElement.click();
      }
    }
  }


  getPrinters(sectionID: any) {
    this.API.getdata('/FoodMenu/getPrinterAgainstOutlet?sectionID=' + sectionID).subscribe(c => {
      if (c != null) {
        this.responsePrinter = c.reponsePrinter;
        this.requestSectionModel.requestPrinter = c.reponsePrinter;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  isActiveCheckPrinter(check: boolean) {
    if (check == true) {
      this.PrinterForm.controls.isActive.setValue(true);
    } else {
      this.PrinterForm.controls.isActive.setValue(false);
    }
  }

  resetAll() {
    this.addMode = false;
    this.requestSectionModel = new requestSectionModel();
    this.submitted = false;
    this.PrinterForm.reset();
    this.Psubmitted = false;
    this.SectionForm.reset();
    this.InvoiceFormatValue = 1;
    this.BillFormatValue = 1;
    this.KotFormatValue = 1;
    this.Psubmitted = false;
    this.SectionForm.controls.hasScreen.setValue(true);
    this.PrinterForm.controls.isActive.setValue(true);
  }
}

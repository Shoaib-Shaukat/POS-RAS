import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ApiService } from 'src/app/Services/API/api.service';
import { Auth } from 'src/app/Services/GuardService/guard-service.service';
import { MasterComponent } from '../../Master/master.component';
import { AppComponent } from 'src/app/app.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig),
  ],
  exports: [
    CommonModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule,
    NgxMaskModule,
  ],
  providers: [ApiService, Auth, HttpClientModule, { provide: LocationStrategy, useClass: HashLocationStrategy }],

})
export class SharedModule { }

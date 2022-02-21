
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {
  LeftMenu: any = [];
  menuScreens: any;
  showCompanies: boolean = false;
  showOutlets: boolean = false;
  showStaff: boolean = false;
  showCurrencies: boolean = false;
  showCustomers: boolean = false;
  showMenuCategories: boolean = false;
  showMenuItems: boolean = false;
  showTables: boolean = false;
  showPaymentMethods: boolean = false;
  showDeals: boolean = false;
  showPOS: boolean = false;
  showOrders: boolean = false;
  showKitchen: boolean = false;
  showIngredients: boolean = false;
  showWaiter: boolean = false;
  constructor(public GV: GvarService, private router: Router) { }

  ngOnInit(): void {
    this.GV.isOwner = localStorage.getItem('isOwner');
    if (this.GV.isOwner == "true") {
      this.showCompanies = true;
    }
    else {
      this.showCompanies = false;
    }
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    this.GV.isOwner = Number(localStorage.getItem('isOwner'));
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.AssignMenu();
  }
  AssignMenu() {
    if (this.GV.isOwner == "false") {
      this.menuScreens = JSON.parse(localStorage.getItem('userMenus') || '{}');
      this.menuScreens.forEach((element: any) => {
        if (element.userMenuID == 1) {
          this.showStaff = true;
        }
        else if (element.userMenuID == 2) {
          this.showCurrencies = true;
        }
        else if (element.userMenuID == 3) {
          this.showCustomers = true;
        }
        else if (element.userMenuID == 4) {
          this.showMenuCategories = true;
        }
        else if (element.userMenuID == 5) {
          this.showMenuItems = true;
        }
        else if (element.userMenuID == 6) {
          this.showTables = true;
        }
        else if (element.userMenuID == 7) {
          this.showPaymentMethods = true;
        }
        else if (element.userMenuID == 8) {
          this.showDeals = true;
        }
        else if (element.userMenuID == 9) {
          this.showPOS = true;
        }
        else if (element.userMenuID == 10) {
          this.showOrders = true;
        }
        else if (element.userMenuID == 11) {
          this.showKitchen = true;
        }
        else if (element.userMenuID == 12) {
          this.showIngredients = true;
        }
        else if (element.userMenuID == 13) {
          this.showWaiter = true;
        }
      });

      for (let i = 0; i < this.menuScreens.length; i++) {
        if (this.menuScreens[i].userMenuID == 1) {
        }
      }
    }
    else {
      this.showStaff = true;
      this.showCurrencies = true;
      this.showCustomers = true;
      this.showMenuCategories = true;
      this.showMenuItems = true;
      this.showTables = true;
      this.showPaymentMethods = true;
      this.showDeals = true;
      this.showPOS = true;
      this.showOrders = true;
      this.showKitchen = true;
      this.showIngredients = true;
      this.showWaiter = true;
    }
  }
  foodMenuPath() {
    this.router.navigate(['/Master/FoodMenuCat']);
  }

  menuItemsPath() {
    this.router.navigate(['/Master/Items']);
  }

}

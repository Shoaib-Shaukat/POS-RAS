
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GvarService } from 'src/app/Services/Globel/gvar.service';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {

  constructor(public GV: GvarService, private router: Router) { }

  ngOnInit(): void { }

  foodMenuPath() {
    this.router.navigate(['/Master/FoodMenuCat']);
  }

  menuItemsPath() {
    this.router.navigate(['/Master/Items']);
  }

}

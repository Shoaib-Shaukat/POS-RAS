import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(public router: Router) {
    var session = sessionStorage.getItem('loggedinUser');

    if (session == null || session == undefined) {
      router.navigate(['/login']);
      return;
    }
    //router.navigate(['/Dashboard']);
  }

  ngOnInit(): void {
  }

}

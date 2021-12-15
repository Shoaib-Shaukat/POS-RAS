import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topar',
  templateUrl: './topar.component.html',
  styleUrls: ['./topar.component.css']
})
export class ToparComponent implements OnInit {
  userName: any;
  constructor() { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
  }

}

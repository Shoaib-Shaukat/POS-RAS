import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-expenseitem',
  templateUrl: './expenseitem.component.html',
  styleUrls: ['./expenseitem.component.css']
})
export class ExpenseitemComponent implements OnInit {
expenseItemForm: FormGroup;
isShow=false;
  constructor() {
    this.expenseItemForm= new FormGroup({});
   }
addNewExpense(){
  this.isShow=!this.isShow;
}
  ngOnInit(): void {
    this.expenseItemForm= new FormGroup({
      'ExpenseItemName' : new FormControl(''),
      'Description' : new FormControl(''),
    })
  }
onExpenseItemSubmit(){
  console.log(this.expenseItemForm);
}
}

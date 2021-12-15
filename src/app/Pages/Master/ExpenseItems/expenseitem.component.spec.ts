import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseitemComponent } from './expenseitem.component';

describe('ExpenseitemComponent', () => {
  let component: ExpenseitemComponent;
  let fixture: ComponentFixture<ExpenseitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

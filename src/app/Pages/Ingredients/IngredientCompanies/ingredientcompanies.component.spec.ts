import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientcompaniesComponent } from './ingredientcompanies.component';

describe('IngredientcompaniesComponent', () => {
  let component: IngredientcompaniesComponent;
  let fixture: ComponentFixture<IngredientcompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientcompaniesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientcompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientSubCatComponent } from './ingredient-sub-cat.component';

describe('IngredientSubCatComponent', () => {
  let component: IngredientSubCatComponent;
  let fixture: ComponentFixture<IngredientSubCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngredientSubCatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientSubCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

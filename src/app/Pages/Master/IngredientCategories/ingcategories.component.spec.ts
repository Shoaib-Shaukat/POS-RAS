import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngcategoriesComponent } from './ingcategories.component';

describe('IngcategoriesComponent', () => {
  let component: IngcategoriesComponent;
  let fixture: ComponentFixture<IngcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngcategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

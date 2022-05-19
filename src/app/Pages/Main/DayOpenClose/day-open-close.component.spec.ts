import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOpenCloseComponent } from './day-open-close.component';

describe('DayOpenCloseComponent', () => {
  let component: DayOpenCloseComponent;
  let fixture: ComponentFixture<DayOpenCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOpenCloseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOpenCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

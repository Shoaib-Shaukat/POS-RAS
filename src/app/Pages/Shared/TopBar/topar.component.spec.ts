import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToparComponent } from './topar.component';

describe('ToparComponent', () => {
  let component: ToparComponent;
  let fixture: ComponentFixture<ToparComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToparComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToparComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

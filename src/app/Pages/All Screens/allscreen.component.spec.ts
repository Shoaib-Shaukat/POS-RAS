import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllscreenComponent } from './allscreen.component';

describe('AllscreenComponent', () => {
  let component: AllscreenComponent;
  let fixture: ComponentFixture<AllscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

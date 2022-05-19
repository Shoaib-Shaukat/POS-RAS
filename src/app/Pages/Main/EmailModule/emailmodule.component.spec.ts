import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailmoduleComponent } from './emailmodule.component';

describe('EmailmoduleComponent', () => {
  let component: EmailmoduleComponent;
  let fixture: ComponentFixture<EmailmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailmoduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

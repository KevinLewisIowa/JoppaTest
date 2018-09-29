import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanHeaterModalComponent } from './loan-heater-modal.component';

describe('LoanHeaterModalComponent', () => {
  let component: LoanHeaterModalComponent;
  let fixture: ComponentFixture<LoanHeaterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanHeaterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanHeaterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

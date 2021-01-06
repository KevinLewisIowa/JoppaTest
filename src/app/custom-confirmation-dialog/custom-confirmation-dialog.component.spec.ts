import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmationDialogComponent } from './custom-confirmation-dialog.component';

describe('CustomConfirmationDialogComponent', () => {
  let component: CustomConfirmationDialogComponent;
  let fixture: ComponentFixture<CustomConfirmationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

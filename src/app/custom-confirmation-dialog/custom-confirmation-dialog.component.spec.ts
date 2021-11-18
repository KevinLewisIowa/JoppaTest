import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomConfirmationDialogComponent } from './custom-confirmation-dialog.component';

describe('CustomConfirmationDialogComponent', () => {
  let component: CustomConfirmationDialogComponent;
  let fixture: ComponentFixture<CustomConfirmationDialogComponent>;

  beforeEach(waitForAsync(() => {
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

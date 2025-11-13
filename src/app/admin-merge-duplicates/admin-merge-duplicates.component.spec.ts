import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMergeDuplicatesComponent } from './admin-merge-duplicates.component';

describe('AdminMergeDuplicatesComponent', () => {
  let component: AdminMergeDuplicatesComponent;
  let fixture: ComponentFixture<AdminMergeDuplicatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminMergeDuplicatesComponent]
    });
    fixture = TestBed.createComponent(AdminMergeDuplicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

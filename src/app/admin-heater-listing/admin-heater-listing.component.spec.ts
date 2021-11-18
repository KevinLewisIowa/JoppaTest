import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminHeaterListingComponent } from './admin-heater-listing.component';

describe('AdminHeaterListingComponent', () => {
  let component: AdminHeaterListingComponent;
  let fixture: ComponentFixture<AdminHeaterListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHeaterListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHeaterListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationEditModalComponent } from './location-edit-modal.component';

describe('LocationEditModalComponent', () => {
  let component: LocationEditModalComponent;
  let fixture: ComponentFixture<LocationEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

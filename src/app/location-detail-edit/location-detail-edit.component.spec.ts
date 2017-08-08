import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailEditComponent } from './location-detail-edit.component';

describe('LocationDetailEditComponent', () => {
  let component: LocationDetailEditComponent;
  let fixture: ComponentFixture<LocationDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

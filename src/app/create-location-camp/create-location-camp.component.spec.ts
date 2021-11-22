import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateLocationCampComponent } from './create-location-camp.component';

describe('CreateLocationCampComponent', () => {
  let component: CreateLocationCampComponent;
  let fixture: ComponentFixture<CreateLocationCampComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLocationCampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLocationCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

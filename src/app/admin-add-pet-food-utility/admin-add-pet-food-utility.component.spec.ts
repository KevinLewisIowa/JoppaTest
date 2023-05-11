import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddPetFoodUtilityComponent } from './admin-add-pet-food-utility.component';

describe('AdminAddPetFoodUtilityComponent', () => {
  let component: AdminAddPetFoodUtilityComponent;
  let fixture: ComponentFixture<AdminAddPetFoodUtilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddPetFoodUtilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddPetFoodUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

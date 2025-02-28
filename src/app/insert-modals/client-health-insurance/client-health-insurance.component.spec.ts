import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHealthInsuranceComponent } from './client-health-insurance.component';

describe('ClientHealthInsuranceComponent', () => {
  let component: ClientHealthInsuranceComponent;
  let fixture: ComponentFixture<ClientHealthInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientHealthInsuranceComponent]
    });
    fixture = TestBed.createComponent(ClientHealthInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

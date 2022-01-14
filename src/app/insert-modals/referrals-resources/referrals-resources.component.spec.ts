import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { ReferralsResourcesComponent } from "./referrals-resources.component";

describe("ReferralsResourcesComponent", () => {
  let component: ReferralsResourcesComponent;
  let fixture: ComponentFixture<ReferralsResourcesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReferralsResourcesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

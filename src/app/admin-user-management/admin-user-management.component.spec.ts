import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from "rxjs";
import { AdminCreationResponse, MainService } from "app/services/main.service";
import { AdminUserManagementComponent } from "./admin-user-management.component";

describe("AdminUserManagementComponent", () => {
  let component: AdminUserManagementComponent;
  let fixture: ComponentFixture<AdminUserManagementComponent>;
  let mainService: jasmine.SpyObj<MainService>;

  beforeEach(async () => {
    mainService = jasmine.createSpyObj<MainService>("MainService", ["createAdmin"]);

    await TestBed.configureTestingModule({
      declarations: [AdminUserManagementComponent],
      imports: [CommonModule, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: MainService, useValue: mainService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("creates a standard admin and displays the returned temporary password", () => {
    const response: AdminCreationResponse = {
      admin: {
        id: 5,
        email: "regina.sarmento@joppa.org",
        first_name: "Regina",
        last_name: "Sarmento",
        role: "admin",
      },
      temp_password: "one-time-password",
      message: "Admin created successfully.",
    };
    mainService.createAdmin.and.returnValue(of(response));
    component.adminForm.setValue({
      first_name: " Regina ",
      last_name: " Sarmento ",
      email: " REGINA.SARMENTO@JOPPA.ORG ",
    });

    component.createAdmin();

    expect(mainService.createAdmin).toHaveBeenCalledWith({
      first_name: "Regina",
      last_name: "Sarmento",
      email: "regina.sarmento@joppa.org",
    });
    expect(component.createdAdmin).toEqual(response);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("one-time-password");
  });

  it("shows API validation errors when account creation fails", () => {
    mainService.createAdmin.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 422,
            error: { errors: ["Email has already been taken"] },
          })
      )
    );
    component.adminForm.setValue({
      first_name: "Regina",
      last_name: "Sarmento",
      email: "regina.sarmento@joppa.org",
    });

    component.createAdmin();

    expect(component.errorMessage).toBe("Email has already been taken");
    expect(component.createdAdmin).toBeNull();
  });
});

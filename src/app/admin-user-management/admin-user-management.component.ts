import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import {
  AdminCreationResponse,
  MainService,
} from "app/services/main.service";

@Component({
  selector: "app-admin-user-management",
  templateUrl: "./admin-user-management.component.html",
  styleUrls: ["./admin-user-management.component.css"],
})
export class AdminUserManagementComponent {
  adminForm: UntypedFormGroup;
  isSubmitting = false;
  errorMessage = "";
  createdAdmin: AdminCreationResponse = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private mainService: MainService
  ) {
    this.adminForm = this.formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      role: ["admin", Validators.required],
    });
  }

  createAdmin() {
    if (this.adminForm.invalid || this.isSubmitting) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.errorMessage = "";
    this.createdAdmin = null;
    this.isSubmitting = true;
    const formValue = this.adminForm.getRawValue();
    const role = formValue.role;
    if (role !== "admin" && role !== "super_admin") {
      this.errorMessage = "Select a valid admin role.";
      this.isSubmitting = false;
      return;
    }

    this.mainService
      .createAdmin({
        first_name: formValue.first_name.trim(),
        last_name: formValue.last_name.trim(),
        email: formValue.email.trim().toLowerCase(),
        role,
      })
      .subscribe(
        (response) => {
          this.createdAdmin = response;
          this.adminForm.reset({
            first_name: "",
            last_name: "",
            email: "",
            role: "admin",
          });
          this.isSubmitting = false;
        },
        (error: HttpErrorResponse) => {
          this.errorMessage =
            error.error && Array.isArray(error.error.errors)
              ? error.error.errors.join(" ")
              : error.error && error.error.message
              ? error.error.message
              : "The admin account could not be created. Please try again.";
          this.isSubmitting = false;
        }
      );
  }
}

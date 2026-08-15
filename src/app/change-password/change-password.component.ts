import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MainService } from 'app/services/main.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  changePasswordForm: UntypedFormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  private destroy$ = new Subject<void>();

  // Password strength requirements
  passwordRequirements = {
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false
  };

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private service: MainService
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

    // Watch new_password for strength validation
    this.changePasswordForm.get('new_password').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.updatePasswordRequirements(value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updatePasswordRequirements(password: string) {
    this.passwordRequirements.minLength = password.length >= 8;
    this.passwordRequirements.hasUppercase = /[A-Z]/.test(password);
    this.passwordRequirements.hasNumber = /\d/.test(password);
    this.passwordRequirements.hasSpecialChar = /[!@#$%^&*()_+=\-\[\]{};':"\\|,.<>\/?]/.test(password);
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('new_password');
    const confirmPassword = control.get('confirm_password');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
  }

  isPasswordValid(): boolean {
    const newPassword = this.changePasswordForm.get('new_password').value;
    return this.passwordRequirements.minLength &&
           this.passwordRequirements.hasUppercase &&
           this.passwordRequirements.hasNumber &&
           this.passwordRequirements.hasSpecialChar;
  }

  changePassword() {
    if (!this.changePasswordForm.valid || !this.isPasswordValid()) {
      this.errorMessage = 'Please ensure all password requirements are met and passwords match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = {
      current_password: this.changePasswordForm.get('current_password').value,
      new_password: this.changePasswordForm.get('new_password').value,
      confirm_password: this.changePasswordForm.get('confirm_password').value
    };

    this.service.changeAdminPassword(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          this.successMessage = 'Password changed successfully!';
          setTimeout(() => {
            this.router.navigate(['/adminHome']);
          }, 2000);
        },
        error => {
          this.isLoading = false;
          if (error.status === 401) {
            this.errorMessage = 'Current password is incorrect';
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Failed to change password. Please try again.';
          }
        }
      );
  }

  togglePasswordVisibility(field: string) {
    if (field === 'current') {
      this.showPassword = !this.showPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}

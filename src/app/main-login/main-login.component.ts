import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MainService } from 'app/services/main.service';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-login',
  templateUrl: './main-login.component.html',
  styleUrls: ['./main-login.component.css']
})
export class MainLoginComponent implements OnInit {
  adminLoginForm: UntypedFormGroup;
  legacyLoginForm: UntypedFormGroup;
  isAdminLogin = false;
  invalidText = false;
  errorMessage = '';
  isLoading = false;
  forwardIcon = faChevronRight;

  constructor(private fb: UntypedFormBuilder, private router: Router, private service: MainService) { }

  ngOnInit() {
    // New admin login form (email + password)
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Legacy login form (password only)
    this.legacyLoginForm = this.fb.group({
      the_password: ''
    });

    this.legacyLoginForm.get('the_password').setValidators(Validators.required);
    this.service.showEndRoute.next(false);
    this.service.showAdminHome.next(false);
  }

  toggleLoginMode() {
    this.isAdminLogin = !this.isAdminLogin;
    this.invalidText = false;
    this.errorMessage = '';
  }

  adminLogin() {
    if (!this.adminLoginForm.valid) {
      this.errorMessage = 'Please enter valid email and password';
      return;
    }

    this.isLoading = true;
    this.invalidText = false;
    this.errorMessage = '';

    const email = this.adminLoginForm.get('email').value;
    const password = this.adminLoginForm.get('password').value;

    console.log('[AdminLogin] submitting login', { email });

    this.service.attemptAdminLogin(email, password).subscribe(
      (data: any) => {
        console.log('[AdminLogin] success response', data);
        this.isLoading = false;
        if (data.token) {
          // Store token and expiration
          window.localStorage.setItem('apiToken', data.token);
          window.localStorage.setItem('tokenExpires', new Date(data.expires_at).getTime().toString());
          window.localStorage.setItem('adminEmail', data.email);
          window.localStorage.setItem('adminRole', data.role);
          window.localStorage.setItem('isAdmin', JSON.stringify(true));

          // Check if password change is required
          if (data.requires_password_change) {
            this.router.navigate(['change-password']);
          } else {
            this.service.showAdminHome.next(true);
            this.router.navigate(['adminHome']);
          }
        } else {
          this.invalidText = true;
          this.errorMessage = 'Invalid email or password';
        }
      },
      error => {
        console.log('[AdminLogin] error response', error);
        this.isLoading = false;
        this.invalidText = true;
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    );
  }

  legacyLogin() {
    const passwordAttempt: string = this.legacyLoginForm.get('the_password').value;
    this.isLoading = true;
    this.invalidText = false;
    this.errorMessage = '';

    this.service.attemptLogin(passwordAttempt).subscribe((data: any) => {
      this.isLoading = false;
      if (data.token != null && data.token !== 'failedLogin') {
        window.localStorage.setItem('apiToken', data.token);
        window.localStorage.setItem('isAdmin', JSON.stringify(data.admin));
        
        if (data.admin) {
          this.service.showAdminHome.next(true);
          this.router.navigate(['adminHome']);
        }
        else if (data.volunteer) {
          this.router.navigate(['login']);
        }
        else {
          this.router.navigate(['login']);
        }
      } else {
        this.invalidText = true;
        this.errorMessage = 'Invalid password';
      }
    }, error => {
      this.isLoading = false;
      this.invalidText = true;
      this.errorMessage = 'Login failed. Please try again.';
    });
  }

  login() {
    if (this.isAdminLogin) {
      this.adminLogin();
    } else {
      this.legacyLogin();
    }
  }

}

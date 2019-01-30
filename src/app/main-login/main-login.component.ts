import { Component, OnInit } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MainService } from 'app/services/main.service';

@Component({
  selector: 'app-main-login',
  templateUrl: './main-login.component.html',
  styleUrls: ['./main-login.component.css']
})
export class MainLoginComponent implements OnInit {
  passwordForm: FormGroup;
  invalidText = false;

  constructor(private fb: FormBuilder, private router: Router, private service: MainService) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      the_password: ''
    });

    this.passwordForm.get('the_password').setValidators(Validators.required);
  }

  login() {
    const passwordAttempt: string = this.passwordForm.get('the_password').value;
    this.invalidText = false;
    this.service.attemptLogin(passwordAttempt).subscribe((data: any) => {
      if (data.token != null && data.token !== 'failedLogin') {
        window.localStorage.setItem('apiToken', data.token);
        window.localStorage.setItem('isAdmin', JSON.stringify(data.admin));
        this.router.navigate(['login']);
      } else {
        this.invalidText = true;
      }
    }, error => {
      this.invalidText = true;
    });
  }

}

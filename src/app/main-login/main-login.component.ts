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
  passwordForm: UntypedFormGroup;
  invalidText = false;
  forwardIcon = faChevronRight;

  constructor(private fb: UntypedFormBuilder, private router: Router, private service: MainService) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      the_password: ''
    });

    this.passwordForm.get('the_password').setValidators(Validators.required);
    this.service.showEndRoute.next(false);
    this.service.showAdminHome.next(false);
  }

  login() {
    const passwordAttempt: string = this.passwordForm.get('the_password').value;
    this.invalidText = false;
    this.service.attemptLogin(passwordAttempt).subscribe((data: any) => {
      console.log(data);
      if (data.token != null && data.token !== 'failedLogin') {
        window.localStorage.setItem('apiToken', data.token);
        window.localStorage.setItem('isAdmin', JSON.stringify(data.admin));
        
        if (data.admin) {
          this.service.showAdminHome.next(true);
          this.router.navigate(['adminHome']);
        }
        else if (data.volunteer) {
          console.log('volunteer detected')
          this.router.navigate(['admin/reports/routeUndeliveredItems']);
        }
        else {
          this.router.navigate(['login']);
        }
      } else {
        this.invalidText = true;
      }
    }, error => {
      this.invalidText = true;
    });
  }

}

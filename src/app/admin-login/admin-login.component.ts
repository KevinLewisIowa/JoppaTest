import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  adminPasswordForm: FormGroup;

  
  constructor(private fb: FormBuilder, private router:Router) { }

  ngOnInit() {
    let isAdmin: boolean = JSON.parse(window.localStorage.getItem('isAdmin'))
    if (isAdmin) {
      this.router.navigate(['adminHome']);
    }

    this.adminPasswordForm = this.fb.group({
      admin_password: ''
    });

    this.adminPasswordForm.get('admin_password').setValidators(Validators.required);
  }

  back() {
    this.router.navigate(['']);
  }

  attemptAdminLogin() {
    let passwordAttempt: string = this.adminPasswordForm.get('admin_password').value;
    
    if (passwordAttempt === "J0ppa 321") {
      window.localStorage.setItem('isAdmin', JSON.stringify(true));
      this.router.navigate(['adminHome']);
    }
    else {
      alert('The admin password is incorrect');
      this.adminPasswordForm.get('admin_password').setValue('');
    }
  }

}

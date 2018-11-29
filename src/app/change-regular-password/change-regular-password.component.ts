import { Component, OnInit } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-regular-password',
  templateUrl: './change-regular-password.component.html',
  styleUrls: ['./change-regular-password.component.css']
})
export class ChangeRegularPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  constructor(private mainService: MainService, private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      new_password: '',
      confirm_password: '',
    });
    this.passwordForm.get('new_password').setValidators(Validators.required);
    this.passwordForm.get('confirm_password').setValidators(Validators.required);
  }

  back() {
    this.router.navigate([`adminHome`]);
  }

  submitPassword() {
    this.mainService.setNewPassword(this.passwordForm.get('new_password').value).subscribe(data => {
      this.router.navigate([`adminHome`]);
    });
  }

}

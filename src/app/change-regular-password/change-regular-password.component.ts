import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-change-regular-password',
  templateUrl: './change-regular-password.component.html',
  styleUrls: ['./change-regular-password.component.css']
})
export class ChangeRegularPasswordComponent implements OnInit, OnDestroy {
  passwordForm: UntypedFormGroup;
  backIcon = faChevronLeft;
  private destroy$ = new Subject<void>();
  constructor(private mainService: MainService, private fb: UntypedFormBuilder,
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
    this.mainService.setNewPassword(this.passwordForm.get('new_password').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.router.navigate([`adminHome`]);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

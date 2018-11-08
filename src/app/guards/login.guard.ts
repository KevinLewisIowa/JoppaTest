import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { concat } from 'rxjs/operator/concat';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  private isAuthorized = false;
  private appAuth = false;
  private Application;

  constructor(
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentToken = window.sessionStorage.getItem('apiToken');
    let isAuth = false;
    if (currentToken == null) {
      this.router.navigate(['application-login']);
    } else {
        isAuth = true;
    }
    return isAuth;
  }
}

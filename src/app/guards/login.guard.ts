import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';


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
    const currentToken = window.localStorage.getItem('apiToken');
    let isAuth = false;
    if (currentToken == null) {
      this.router.navigate(['application-login']);
    } else {
        isAuth = true;
    }
    return isAuth;
  }
}

@Injectable()
export class IsAdminGuard implements CanActivate {
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
    const isAdmin = window.localStorage.getItem('isAdmin');
    let isAuth = false;
    if (isAdmin != 'true') {
      this.router.navigate(['application-login']);
    } else {
        isAuth = true;
    }
    return isAuth;
  }
}
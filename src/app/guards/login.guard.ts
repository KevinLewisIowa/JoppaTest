import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


@Injectable()
export class IsLoggedInGuard  {

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
export class IsAdminGuard  {

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
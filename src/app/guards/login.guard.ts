import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MainService } from 'app/services/main.service';


@Injectable()
export class IsLoggedInGuard  {

  constructor(
    private router: Router,
    private mainService: MainService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentToken = window.localStorage.getItem('apiToken');
    let isAuth = false;
    
    if (currentToken == null) {
      this.router.navigate(['application-login']);
      return false;
    }

    // Check if token is expired (new admin token system)
    if (this.mainService.isTokenExpired()) {
      window.localStorage.removeItem('apiToken');
      window.localStorage.removeItem('tokenExpires');
      window.localStorage.removeItem('adminEmail');
      window.localStorage.removeItem('adminRole');
      this.router.navigate(['application-login']);
      return false;
    }

    isAuth = true;
    return isAuth;
  }
}

@Injectable()
export class IsAdminGuard  {

  constructor(
    private router: Router,
    private mainService: MainService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAdmin = window.localStorage.getItem('isAdmin');
    const adminRole = window.localStorage.getItem('adminRole');
    let isAuth = false;
    
    // Check new admin system first (adminRole), then fallback to old system (isAdmin)
    if (adminRole) {
      // New admin token system
      if (this.mainService.isTokenExpired()) {
        window.localStorage.removeItem('apiToken');
        window.localStorage.removeItem('tokenExpires');
        window.localStorage.removeItem('adminEmail');
        window.localStorage.removeItem('adminRole');
        this.router.navigate(['application-login']);
        return false;
      }
      isAuth = true;
    } else if (isAdmin === 'true') {
      // Legacy system
      isAuth = true;
    } else {
      this.router.navigate(['application-login']);
      return false;
    }
    
    return isAuth;
  }
}
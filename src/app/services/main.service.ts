import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { Route } from "../models/route";
import { Heater } from "../models/heater";
import { LocationCamp } from "app/models/location-camp";
import { RouteInstance } from "../models/route-instance";
import { RouteInstanceHeaterInteraction } from "app/models/route-instance-heater-interaction";
import { Router } from "@angular/router";
import { RouteInstanceTankHoseInteraction } from "app/models/route-instance-tank-hose-interaction";
import { Inventory } from "app/admin-reports/inventory-report/inventory-report.component";
import { environment } from "environments/environment";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class MainService {
  public showEndRoute: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  public showAdminHome: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private apiUrl = environment.api_url;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    console.log(this.apiUrl);
  }
  getRoutes() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken")
    });
    return this.http
      .get(this.apiUrl + `routes`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  attemptLogin(thePassword: string) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `attemptLogin?passWrd=${thePassword}`)
      .pipe(map((response) => {
        return response;
      }),
        catchError(this.handleError));
  }

  getTheRoutes() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `routes`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getRouteInstancesForDate(date: Date, routeId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.get(this.apiUrl + `getRouteInstancesForDate?date=${date}&routeId=${routeId}`)
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res as RouteInstance;
      }),
        catchError(this.handleError));
  }

  getLatestRouteInstanceInfoForRoute(routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.get(this.apiUrl + `getRouteSummaryInfoForRoute?routeInstanceId=${routeInstanceId}`)
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res as RouteInstance;
      }),
        catchError(this.handleError));
  }

  getInventorySummary() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.get(this.apiUrl + `getAdminInventoryReport?`)
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res as Inventory;
      }),
        catchError(this.handleError));
  }

  getNotesForRouteInstance(routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.get(this.apiUrl + `getNotesForRouteInstance?routeInstanceId=${routeInstanceId}`)
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getHeatEquipmentPerRoute() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http.get(this.apiUrl + `getHeatEquipmentPerRoute`)
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  insertRoute(theRoute: Route) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.apiUrl + `routes`, { route: theRoute }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  setNewPassword(thePassword: string) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `setNewPassword?pswrd=${thePassword}`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  insertRouteInstanceTankHoseInteraction(
    theRouteInstanceTanksHoses: RouteInstanceTankHoseInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.apiUrl + `route_instance_tank_hose_interactions`, { route_instance_tank_hose_interaction: theRouteInstanceTanksHoses }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  insertRouteInstance(routeInstance: RouteInstance): any {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.apiUrl + `route_instances`, { route_instance: routeInstance }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  insertLocationCamp(theLocationCamp: LocationCamp) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.apiUrl + `location_camps`, { location_camp: theLocationCamp }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  checkoutHeater(theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.apiUrl + `route_instance_heater_interactions`, { route_instance_heater_interaction: theRouteInstanceHeaterInteraction }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  updateLocationCamp(theLocationCamp: LocationCamp) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.apiUrl + `location_camps/${theLocationCamp.id}`,
        { location_camp: theLocationCamp },
        { headers: myHeader }
      )
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  updateRoute(theRoute: Route) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.apiUrl + `routes/${theRoute.id}`,
        { route: theRoute },
        { headers: myHeader }
      )
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  updateRouteInstance(theRouteInstance: RouteInstance) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.apiUrl + `route_instances/${theRouteInstance.id}`,
        { route_instance: theRouteInstance },
        { headers: myHeader }
      )
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  updateRouteInstanceTankHoseInteraction(
    theRouteInstanceTanksHoses: RouteInstanceTankHoseInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.patch(this.apiUrl + `route_instance_tank_hose_interactions/${theRouteInstanceTanksHoses.id}`, { route_instance_tank_hose_interaction: theRouteInstanceTanksHoses }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError))
      .subscribe(
        (response) => { },
        (error) => {
          console.log(error);
        }
      );
  }

  updateRouteInstanceHeaterInteraction(
    theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(this.apiUrl + `route_instance_heater_interactions/${theRouteInstanceHeaterInteraction.id}`, { route_instance_heater_interaction: theRouteInstanceHeaterInteraction }, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError))
      .subscribe(
        (response) => { },
        (error) => console.log(error)
      );
  }

  isHeaterCheckedOutOnOtherRoute(heaterId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.apiUrl + `isHeaterCheckedOutOnOtherRoute?heaterId=${heaterId}`,
        { headers: myHeader }
      )
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  insertHeater(theHeater: Heater) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.apiUrl + `heaters`,
        { heater: theHeater },
        { headers: myHeader }
      )
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getRoute(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `routes/${id}`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getCampListing() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getCampListing`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getCampsForRoute(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getCampsForRoute?routeId=${id}`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getRouteInstance(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `route_instances/${id}`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getCheckedOutHeaters(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getClientsForCamp(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
      return this.http.get(this.apiUrl + `getClientsForCamp?locationCampId=${id}`, { headers: myHeader })
      .pipe(map((res: any) => {
        if (res.message === 'invalid-token') {
          window.localStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      }),
        catchError(this.handleError));
  }

  getRouteCampsLongLat(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getRouteCampsLongLat?routeId=${id}`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getLocationCamp(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `location_camps/${id}`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getAdminRouteNumberMeals() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getAdminRouteNumberMeals`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getAdminRouteUndeliveredItems() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getAdminRouteUndeliveredItems`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getAdminRouteUnfulfilledGoalsNextSteps() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getAdminRouteUnfulfilledGoalsNextSteps`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getAdminRouteUnfulfilledPrayerRequestsNeeds() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getAdminRouteUnfulfilledPrayerRequestsNeeds`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getHeaterListing() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getHeaterListing`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getHeaterTypes() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getHeaterTypes`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getHeaterStatuses() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getHeaterStatuses`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getSeenServicedReport(fromDate: Date, toDate: Date) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `seen_and_serviced_report?fromDate=${fromDate}&toDate=${toDate}`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getFirstTimeHomelessnessReport() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getFirstTimeHomelessnessReport`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getClientAttendanceHistory(clientId: number, fromDate: string, toDate: string) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `clientAttendanceHistory?clientId=${clientId}&fromDate=${fromDate}&toDate=${toDate}`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  checkInAllHeaters() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `checkInAllHeaters`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getAvailableHeaters(routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getAvailableHeaters?routeInstanceId=${routeInstanceId}`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getRouteInstanceHeaterInteractions(): Observable<RouteInstanceHeaterInteraction[]> {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `route_instance_heater_interactions`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  removeRouteInstanceHeaterInteraction(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.apiUrl + `route_instance_heater_interactions/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }),
      catchError(this.handleError));
  }

  checkInHeater( theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.patch(this.apiUrl + `route_instance_heater_interactions/${theRouteInstanceHeaterInteraction.id}`, { route_instance_heater_interaction: theRouteInstanceHeaterInteraction }, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  getOverallAttendanceReport(startDate: string, endDate: string) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.get(this.apiUrl + `getOverallAttendanceReport?startDate=${startDate}&endDate=${endDate}`, { headers: myHeader })
    .pipe(map((res: any) => {
      if (res.message === 'invalid-token') {
        window.localStorage.removeItem('apiToken');
        this.router.navigate(['/application-login']);
      }
      return res;
    }),
      catchError(this.handleError));
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/

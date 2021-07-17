import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { RequestOptions } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs";
import "rxjs/Rx";
import { Route } from "../models/route";
import { Client } from "../models/client";
import { Heater } from "../models/heater";

import "rxjs/add/operator/toPromise";

import { Store } from "@ngrx/store";
import { IMainStore } from "../state-management/main.store";
import { LocationCamp } from "app/models/location-camp";
import { RouteInstance } from "../models/route-instance";
import { RouteInstanceHeaterInteraction } from "app/models/route-instance-heater-interaction";
import { and } from "@angular/router/src/utils/collection";
import { Router } from "@angular/router";
import { RouteInstanceTankHoseInteraction } from "app/models/route-instance-tank-hose-interaction";
import { Inventory } from "app/admin-reports/inventory-report/inventory-report.component";

@Injectable()
export class MainService {
  public showEndRoute: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );
  public showAdminHome: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  theHeader = new HttpHeaders().set("Content-Type", "application/json");
  online = true;
  private headers = new Headers({ "Content-Type": "application/json" });
  private apiUrl = "https://joppa-api-prod.herokuapp.com/";

  constructor(
    private http: HttpClient,
    private store: Store<IMainStore>,
    private router: Router
  ) {
    console.log(this.apiUrl);
  }
  getRoutes() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
      'Access-Control-Allow-Origin': '*'
    });
    return this.http
      .get(this.apiUrl + `routes`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch(this.handleError);
  }

  attemptLogin(thePassword) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `attemptLogin?passWrd=${thePassword}`)
      .map((response) => {
        return response;
      });
  }

  getTheRoutes(): Observable<Route[]> {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    if (this.online) {
      return this.http
        .get(this.apiUrl + `routes`, { headers: myHeader })
        .map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        })
        .catch((err) => this.handleError(err));
    } else {
      return this.http
        .get(this.apiUrl + `routes`, { headers: myHeader })
        .map((response) => response)
        .catch(this.handleError);
    }
  }

  getRouteInstancesForDate(date: Date, routeId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(
        this.apiUrl + `getRouteInstancesForDate?date=${date}&routeId=${routeId}`
      )
      .map((response) => response as RouteInstance)
      .catch((err) => this.handleError(err));
  }

  getLatestRouteInstanceInfoForRoute(routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(
        this.apiUrl +
          `getRouteSummaryInfoForRoute?routeInstanceId=${routeInstanceId}`
      )
      .map((response) => response as RouteInstance)
      .catch((err) => this.handleError(err));
  }

  getInventorySummary() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.apiUrl + `getAdminInventoryReport?`)
      .map((response) => response as Inventory)
      .catch((err) => this.handleError(err));
  }

  getNotesForRouteInstance(routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(
        this.apiUrl +
          `getNotesForRouteInstance?routeInstanceId=${routeInstanceId}`
      )
      .map((response) => response)
      .catch((err) => this.handleError(err));
  }

  getHeatEquipmentPerRoute() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.apiUrl + `getHeatEquipmentPerRoute`)
      .map((response) => response)
      .catch((err) => this.handleError(err));
  }

  insertRoute(theRoute: Route) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(this.apiUrl + `routes`, { route: theRoute }, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
  }

  setNewPassword(thePassword) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `setNewPassword?pswrd=${thePassword}`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
  }

  insertRouteInstanceTankHoseInteraction(
    theRouteInstanceTanksHoses: RouteInstanceTankHoseInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.apiUrl + `route_instance_tank_hose_interactions`,
        { route_instance_tank_hose_interaction: theRouteInstanceTanksHoses },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch(this.handleError);
  }

  insertRouteInstance(routeInstance: RouteInstance): any {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.apiUrl + `route_instances`,
        { route_instance: routeInstance },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch(this.handleError);
  }

  insertLocationCamp(theLocationCamp: LocationCamp) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.apiUrl + `location_camps`,
        { location_camp: theLocationCamp },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
  }

  checkoutHeater(
    theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.apiUrl + `route_instance_heater_interactions`,
        {
          route_instance_heater_interaction: theRouteInstanceHeaterInteraction,
        },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
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
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
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
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .subscribe(
        (response) => {},
        (error) => {
          console.log(error);
        }
      );
  }

  updateRouteInstanceTankHoseInteraction(
    theRouteInstanceTanksHoses: RouteInstanceTankHoseInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.apiUrl +
          `route_instance_tank_hose_interactions/${theRouteInstanceTanksHoses.id}`,
        { route_instance_tank_hose_interaction: theRouteInstanceTanksHoses },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .subscribe(
        (response) => {},
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
      .patch(
        this.apiUrl +
          `route_instance_heater_interactions/${theRouteInstanceHeaterInteraction.id}`,
        {
          route_instance_heater_interaction: theRouteInstanceHeaterInteraction,
        },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .subscribe(
        (response) => {},
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
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
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
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      });
  }

  getRoute(id): Observable<Route> {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    if (this.online) {
      return this.http
        .get(this.apiUrl + `routes/${id}`, { headers: myHeader })
        .map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        })
        .catch((err) => this.handleError(err));
    } else {
      return Observable.of(new Route());
    }
  }

  getCampListing() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getCampListing`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((err) => this.handleError(err));
  }

  getCampsForRoute(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getCampsForRoute?routeId=${id}`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((err) => this.handleError(err));
  }

  getRouteInstance(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `route_instances/${id}`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((err) => this.handleError(err));
  }

  getCheckedOutHeaters(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((err) => this.handleError(err));
  }

  getClientsForCamp(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    if (this.online) {
      return this.http
        .get(this.apiUrl + `getClientsForCamp?locationCampId=${id}`, {
          headers: myHeader,
        })
        .map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        })
        .catch((err) => this.handleError(err));
    } else {
      return Observable.of([]);
    }
  }

  getRouteCampsLongLat(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getRouteCampsLongLat?routeId=${id}`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((err) => this.handleError(err));
  }

  getLocationCamp(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `location_camps/${id}`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getAdminRouteNumberMeals() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getAdminRouteNumberMeals`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getAdminRouteUndeliveredItems() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getAdminRouteUndeliveredItems`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getAdminRouteUnfulfilledGoalsNextSteps() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getAdminRouteUnfulfilledGoalsNextSteps`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getAdminRouteUnfulfilledPrayerRequestsNeeds() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getAdminRouteUnfulfilledPrayerRequestsNeeds`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getHeaterListing() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getHeaterListing`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getHeaterTypes() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getHeaterTypes`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getHeaterStatuses() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getHeaterStatuses`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getSeenServicedReport(fromDate: Date, toDate: Date) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.apiUrl +
          `seen_and_serviced_report?fromDate=${fromDate}&toDate=${toDate}`,
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getFirstTimeHomelessnessReport() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `getFirstTimeHomelessnessReport`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getClientAttendanceHistory(
    clientId: number,
    fromDate: string,
    toDate: string
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.apiUrl +
          `clientAttendanceHistory?clientId=${clientId}&fromDate=${fromDate}&toDate=${toDate}`,
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  checkInAllHeaters() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `checkInAllHeaters`, { headers: myHeader })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getAvailableHeaters(routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.apiUrl + `getAvailableHeaters?routeInstanceId=${routeInstanceId}`,
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getRouteInstanceHeaterInteractions(): Observable<
    RouteInstanceHeaterInteraction[]
  > {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.apiUrl + `route_instance_heater_interactions`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  removeRouteInstanceHeaterInteraction(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .delete(this.apiUrl + `route_instance_heater_interactions/${id}`, {
        headers: myHeader,
      })
      .map((res: any) => {
        if (res != null && res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  checkInHeater(
    theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction
  ) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.apiUrl +
          `route_instance_heater_interactions/${theRouteInstanceHeaterInteraction.id}`,
        {
          route_instance_heater_interaction: theRouteInstanceHeaterInteraction,
        },
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
  }

  getOverallAttendanceReport(startDate: string, endDate: string) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.apiUrl +
          `getOverallAttendanceReport?startDate=${startDate}&endDate=${endDate}`,
        { headers: myHeader }
      )
      .map((res: any) => {
        if (res.message === "invalid-token") {
          window.localStorage.removeItem("apiToken");
          this.router.navigate(["/application-login"]);
        }
        return res;
      })
      .catch((error) => this.handleError(error));
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

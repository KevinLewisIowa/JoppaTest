import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Route } from "../models/route";
import { MainService } from "../services/main.service";
import { ClientService } from "../services/client.service";
import { Appearance } from "../models/appearance";
import { Router } from "@angular/router";
import { Client } from "../models/client";
import { LocationCamp } from "app/models/location-camp";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  faChevronLeft,
  faPlus,
  faMap,
  faInfoCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"],
})
export class LocationsComponent implements OnInit, OnDestroy {
  routeId: number;
  thisRoute: Route;
  clients: Client[] = [];
  locationCamps: LocationCamp[];
  isAdmin: boolean;
  heatRoute: boolean;
  backIcon = faChevronLeft;
  createIcon = faPlus;
  allSeenIcon = faCheckCircle;
  mapIcon = faMap;
  informationIcon = faInfoCircle;
  clientCountForRoute: number;
  routeAttendanceList: Appearance[];
  totalDogsForRoute: number = 0;
  totalCatsForRoute: number = 0;
  private destroy$ = new Subject<void>();
  private _destroyed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private mainService: MainService,
    private clientService: ClientService,
    private router: Router
  ) {
    this.thisRoute = new Route();
    this.locationCamps = [];
    this.routeId = this.route.snapshot.params["id"];
    this.heatRoute = JSON.parse(window.localStorage.getItem("heatRoute"));
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
    window.localStorage.setItem("routeId", this.routeId.toString());

    this.clientService.getClientAttendanceForRoute(this.routeId).subscribe((attendanceInfo: Appearance[]) => {
      this.routeAttendanceList = attendanceInfo;
      console.log(`Attendance: ${JSON.stringify(attendanceInfo)}`);

      this.mainService.getRoute(this.routeId).subscribe((route: Route) => {
        if (route == undefined) {
          this.thisRoute = new Route();
        } else {
          this.thisRoute = route;
          localStorage.setItem('isAftercare', JSON.stringify(route.is_aftercare));
          console.log(JSON.stringify(route));
          this.mainService.getClientCountForRoute(this.thisRoute.id).subscribe((data: number) => {
            this.clientCountForRoute = data;

            this.mainService.getCampsForRoute(this.routeId).subscribe((locations: LocationCamp[]) => {
              if (locations == null || locations == undefined) {
                this.locationCamps = [];
              } else {
                let sortedlocations = locations.sort((a, b) => {
                  if (a.position > b.position) {
                    return 1;
                  } else if (a.position < b.position) {
                    return -1;
                  } else {
                    return 0;
                  }
                });

                // After sortedlocations is created, add this filter
                sortedlocations = sortedlocations.filter((location: LocationCamp) => {
                  // If heat_route_only is true and this is NOT a heat route, hide it
                  if (location.heat_route_only && !this.heatRoute && !this.isAdmin) {
                    return false;
                  }
                  return true;
                });

                this.locationCamps = sortedlocations;
                this.mainService.getRoutePetCounts(this.routeId).pipe(takeUntil(this.destroy$)).subscribe((counts: any) => {
                  this.totalDogsForRoute = counts?.totals?.dogs ?? 0;
                  this.totalCatsForRoute = counts?.totals?.cats ?? 0;
                }, error => console.log("Error fetching route pet counts:", error));

                let locationCampIdList: number[] = [];
                sortedlocations.forEach((loc: LocationCamp) => {
                  locationCampIdList.push(loc.id);
                  window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
                });

                this.clientCountForRoute = 0;
                sortedlocations.forEach((location: LocationCamp) => {
                  location.all_seen = false;
                  // Only fetch the client list to get a count; avoid per-client dwelling requests here.
                  this.mainService.getClientsForCamp(location.id).pipe(takeUntil(this.destroy$)).subscribe((data: Client[]) => {
                    const clientsAtCamp = Array.isArray(data) ? data.length : 0;

                    if (clientsAtCamp === 0 && !this.isAdmin) {
                      // remove empty camps for non-admins
                      const index = this.locationCamps.findIndex((camp) => camp.id == location.id);
                      if (index > -1) this.locationCamps.splice(index, 1);
                    } else {
                      location.number_clients_at_camp = clientsAtCamp;
                      this.clientCountForRoute += clientsAtCamp;
                      const clientsToCheck = this.routeAttendanceList.filter((client) => Number(client.location_camp_id) === location.id);
                      location.all_seen = clientsToCheck.length === clientsAtCamp && clientsAtCamp > 0;
                    }

                    // keep LocationCampIdList in sync with visible camps
                    window.localStorage.setItem("LocationCampIdList", JSON.stringify(this.locationCamps.map(c => c.id)));
                  }, error => console.log(error));
                });
              }
            });
          });
        }
      });
    });
    // this.routeAttendanceList = JSON.parse(
    //   localStorage.getItem("RouteAttendance")
    // );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._destroyed = true;
    this.destroy$.next();
    this.destroy$.complete();
  }

  editedRoute(theRoute: Route) {
    this.thisRoute = theRoute;
  }

  openLocation(theLocation: LocationCamp) {
    this.router.navigate([`/locationCamp/${theLocation.id}`]);
  }

  back() {
    if (this.isAdmin) {
      window.localStorage.removeItem("routeId");
    }
    this.router.navigate(["/routes"]);
  }

  newLocationCamp() {
    this.router.navigate(["/locationCampNew"]);
  }

  showRouteLocations() {
    let routeUrl: string = `https://www.google.com/maps/dir`;
    this.mainService
      .getRouteCampsLongLat(this.routeId)
      .subscribe((data: LocationCamp[]) => {
        data.forEach(function (locationCamp: LocationCamp) {
          if (locationCamp.longitude != null && locationCamp.latitude != null) {
            routeUrl =
              routeUrl + `/${locationCamp.latitude},${locationCamp.longitude}`;
          }
        });

        routeUrl = routeUrl + `/@//`;
        console.log(routeUrl);
        window.open(routeUrl, "_blank");
      });
  }
}

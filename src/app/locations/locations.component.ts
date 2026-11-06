import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Appearance } from "../models/appearance";
import { LocationCamp } from "app/models/location-camp";
import { Route } from "../models/route";
import { ClientService } from "../services/client.service";
import { MainService } from "../services/main.service";
import {
  faChevronLeft,
  faCheckCircle,
  faInfoCircle,
  faMap,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.css"],
})
export class LocationsComponent implements OnInit, OnDestroy {
  routeId: number;
  thisRoute: Route;
  locationCamps: LocationCamp[];
  isAdmin: boolean;
  heatRoute: boolean;
  backIcon = faChevronLeft;
  createIcon = faPlus;
  allSeenIcon = faCheckCircle;
  mapIcon = faMap;
  informationIcon = faInfoCircle;
  clientCountForRoute = 0;
  routeAttendanceList: Appearance[] = [];
  totalDogsForRoute = 0;
  totalCatsForRoute = 0;
  loadError = "";
  private destroy$ = new Subject<void>();

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
  }

  ngOnInit() {
    forkJoin([
      this.mainService.getRouteOverviewSummary(this.routeId, this.heatRoute),
      this.clientService.getClientAttendanceForRoute(this.routeId)
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([overview, attendanceInfo]) => {
          this.thisRoute = overview.route;
          window.localStorage.setItem("isAftercare", JSON.stringify(this.thisRoute.is_aftercare));
          this.routeAttendanceList = attendanceInfo || [];

          const routeCamps = (overview.camps || [])
            .sort((a, b) => a.position > b.position ? 1 : a.position < b.position ? -1 : 0)
            .filter(camp => !camp.heat_route_only || this.heatRoute || this.isAdmin)
            .map(camp => {
              const clientCount = Number(camp.number_clients_at_camp) || 0;
              const clientsAtCampAttendance = this.routeAttendanceList.filter(
                attendance => Number(attendance.location_camp_id) === camp.id
              ).length;

              return {
                ...camp,
                number_clients_at_camp: clientCount,
                all_seen: clientCount > 0 && clientsAtCampAttendance === clientCount
              };
            });

          this.locationCamps = routeCamps.filter(camp => this.isAdmin || camp.number_clients_at_camp > 0);
          this.clientCountForRoute = this.locationCamps.reduce(
            (total, camp) => total + camp.number_clients_at_camp,
            0
          );
          this.totalDogsForRoute = Number(overview.pet_counts?.totals?.dogs) || 0;
          this.totalCatsForRoute = Number(overview.pet_counts?.totals?.cats) || 0;

          const locationCampIdList = this.locationCamps.map(camp => camp.id);
          window.localStorage.setItem("LocationCampIdList", JSON.stringify(locationCampIdList));
        },
        error: error => {
          console.error("Unable to load route locations summary", error);
          this.loadError = "Unable to load route locations. Please try again.";
        }
      });
  }

  ngOnDestroy() {
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
      .pipe(takeUntil(this.destroy$))
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
      }, error => console.error("Unable to load route map locations", error));
  }
}

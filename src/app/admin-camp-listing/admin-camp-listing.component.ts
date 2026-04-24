import { ViewChild, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatSort } from "@angular/material/sort";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { Router } from "@angular/router";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { LocationCamp } from "app/models/location-camp";
import { Route } from "app/models/route";
import { MainService } from "app/services/main.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-admin-camp-listing",
  templateUrl: "./admin-camp-listing.component.html",
  styleUrls: ["./admin-camp-listing.component.css"],
})
export class AdminCampListingComponent implements OnInit, OnDestroy {
  displayedColumns = ["camp_name", "route_name", "position", "is_active", "remain_on_route"];
  camps: any[] = [];
  routes: Route[] = [];
  camp: LocationCamp;
  @Output() editedCamp = new EventEmitter<LocationCamp>();
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private mainService: MainService, private router: Router) {
    window.localStorage.removeItem('routeId');
  }

  ngOnInit() {
    this.mainService.getCampListing()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.camps = data;
          this.dataSource = new MatTableDataSource(this.camps);
          this.dataSource.sort = this.sort;

          this.dataSource.paginator = this.paginator;
        },
        (error) => console.log(error)
      );

    this.mainService.getTheRoutes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(routes => {
        this.routes = routes;
      });
  }

  viewCamp(theCamp) {
    window.localStorage.setItem("routeId", JSON.stringify(theCamp.route_id));
    this.router.navigate([`/locationCamp/${theCamp.id}`]);
  }

  submitCamp() {
    let count: number = 0;
    this.camps.forEach(camp => {
      console.log(JSON.stringify(camp));
      this.mainService.updateLocationCamp(camp as LocationCamp)
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          window.localStorage.setItem('routeId', JSON.stringify(data.route_id));
          this.editedCamp.emit(camp as LocationCamp);

          count++;
          console.log(count + ' updated');
          if (count >= this.camps.length) {
            console.log('Everything done updating');
            window.location.reload();
          }
        }, error => {
          console.log(error);
          
          count++;
          console.log(count + ' updated');
          if (count >= this.camps.length) {
            console.log('Everything done updating');
            window.location.reload();
          }
        });
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  back() {
    this.router.navigate(["/adminHome"]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

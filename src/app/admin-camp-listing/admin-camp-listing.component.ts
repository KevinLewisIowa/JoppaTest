import { ViewChild, Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { LocationCamp } from "app/models/location-camp";
import { Route } from "app/models/route";
import { MainService } from "app/services/main.service";

@Component({
  selector: "app-admin-camp-listing",
  templateUrl: "./admin-camp-listing.component.html",
  styleUrls: ["./admin-camp-listing.component.css"],
})
export class AdminCampListingComponent implements OnInit {
  displayedColumns = ["camp_name", "route_name", "position", "is_active"];
  camps: any[] = [];
  routes: Route[] = [];
  camp: LocationCamp;
  @Output() editedCamp = new EventEmitter<LocationCamp>();
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private mainService: MainService, private router: Router) {
    window.localStorage.removeItem('routeId');
    
    this.mainService.getCampListing().subscribe(
      (data) => {
        this.camps = data;
        this.dataSource = new MatTableDataSource(this.camps);
        this.dataSource.sort = this.sort;

        this.dataSource.paginator = this.paginator;
      },
      (error) => console.log(error)
    );

    this.mainService.getTheRoutes().subscribe(routes => {
      this.routes = routes;
    });
  }

  ngOnInit() {}

  viewCamp(theCamp) {
    window.localStorage.setItem("routeId", JSON.stringify(theCamp.route_id));
    this.router.navigate([`/locationCamp/${theCamp.id}`]);
  }

  submitCamp() {
    let count: number = 0;
    this.camps.forEach(camp => {
      console.log(JSON.stringify(camp));
      this.mainService.updateLocationCamp(camp as LocationCamp).subscribe(data => {
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
}

import { ViewChild } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { MainService } from "app/services/main.service";

@Component({
  selector: "app-admin-camp-listing",
  templateUrl: "./admin-camp-listing.component.html",
  styleUrls: ["./admin-camp-listing.component.css"],
})
export class AdminCampListingComponent implements OnInit {
  displayedColumns = ["camp_name", "route_name", "is_active"];
  camps: any[] = [];
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private mainService: MainService, private router: Router) {
    this.mainService.getCampListing().subscribe(
      (data) => {
        console.log(JSON.stringify(data));
        this.camps = data;
        this.dataSource = new MatTableDataSource(this.camps);
        this.dataSource.sort = this.sort;

        this.dataSource.paginator = this.paginator;
      },
      (error) => console.log(error)
    );
  }

  ngOnInit() {}

  viewCamp(theCamp) {
    window.localStorage.setItem("routeId", JSON.stringify(theCamp.route_id));
    this.router.navigate([`/locationCamp/${theCamp.id}`]);
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

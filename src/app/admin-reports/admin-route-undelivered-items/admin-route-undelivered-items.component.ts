import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-route-undelivered-items',
  templateUrl: './admin-route-undelivered-items.component.html',
  styleUrls: ['./admin-route-undelivered-items.component.css']
})
export class AdminRouteUndeliveredItemsComponent implements OnInit {
  displayedColumns = ['preferred_name', 'name', 'item_description', 'date_requested']
  undeliveredItems: any[] = [];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private mainService: MainService, private router: Router) { 
    this.mainService.getAdminRouteUndeliveredItems().subscribe(data => {
      this.undeliveredItems = data;
      this.dataSource = new MatTableDataSource(this.undeliveredItems);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      }, error => console.log(error));
    }
  

  backIcon = faChevronLeft;

  ngOnInit() {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MainService } from 'app/services/main.service';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Observable } from 'rxjs';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { RequestedItem } from 'app/models/requested-item';

@Component({
  selector: 'app-admin-route-undelivered-items',
  templateUrl: './admin-route-undelivered-items.component.html',
  styleUrls: ['./admin-route-undelivered-items.component.css']
})
export class AdminRouteUndeliveredItemsComponent implements OnInit {
  displayedColumns = ['preferred_name', 'name', 'item_description', 'date_requested', 'fulfilled'];
  volunteerColumns = ['preferred_name', 'name', 'item_description', 'date_requested'];
  undeliveredItems: any[] = [];
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private mainService: MainService, private router: Router) { 
    this.isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));

    this.mainService.getAdminRouteUndeliveredItems().subscribe(data => {
      if (!this.isAdmin) {
        this.displayedColumns = this.volunteerColumns;
        this.undeliveredItems = data.filter((w) => !w.fulfilled);
      } else {
        this.undeliveredItems = data;
      }
      this.dataSource = new MatTableDataSource(this.undeliveredItems);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log(error));
  }

  ngOnInit() {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  back() {
    if (this.isAdmin) {
      this.router.navigate(["/admin/reports"]);
    } else {
      window.localStorage.clear();
      this.router.navigate(['/application-login']);
    }
  }

  submitItems() {
    let count: number = 0;
    this.undeliveredItems.forEach(item => {
      let itemToUpdate: RequestedItem = new RequestedItem();
      itemToUpdate.id = item.id;
      itemToUpdate.client_id = item.client_id;
      itemToUpdate.date_requested = item.date_requested;
      itemToUpdate.fulfilled = item.fulfilled;
      itemToUpdate.has_received = item.has_received;
      itemToUpdate.item_description = item.item_description;
      this.mainService.updateRequestedItem(itemToUpdate).subscribe((data: RequestedItem) => {
        count++;

        if (count >= this.undeliveredItems.length) {
          console.log('Everything done updating');
          window.location.reload();
        }
      },
      (error) => {
        console.log(error);
        count++;

        if (count >= this.undeliveredItems.length) {
          console.log('Everything done updating');
          window.location.reload();
        }
      }
      );
    });
  }

}

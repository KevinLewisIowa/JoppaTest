import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource, MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { faChevronLeft, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-client-listing',
  templateUrl: './admin-client-listing.component.html',
  styleUrls: ['./admin-client-listing.component.css']
})
export class AdminClientListingComponent implements OnInit {
  displayedColumns = ['first_name', 'last_name', 'preferred_name', 'phone', 'birth_date', 'route_name', 'camp_name', 'status', 'household_id', 'updated_at'];
  clients: any[] = [];
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;
  pastDate: Date = new Date();
  createIcon = faPlus;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private clientService: ClientService, private router: Router) {
    window.localStorage.removeItem('routeId');

    // this.clientService.seenAndServicedReport('2024-01-01', '2024-11-17').subscribe(data => {
    //   console.log('seenAndServiced ' + JSON.stringify(data));
    // });

    this.clientService.getClientsByName('').subscribe(data => {
      console.log('Number of clients: ' + data.length)
      this.clients = data;
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.sort = this.sort;
      this.sort.active = "updated_at";
      this.sort.direction = "desc";
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'updated_at':
            return new Date(item.last_interaction_date);
          default: return item[property];
        }
      };
      this.dataSource.paginator = this.paginator;
    }, error => console.log(error));
  }

  ngOnInit() {
    this.pastDate.setDate(this.pastDate.getDate() - 60);
  }

  isOverMonthOld(date: string) {
    return new Date(date) < this.pastDate;
  }

  viewClient(theClient) {
    localStorage.setItem('selectedClient', JSON.stringify(theClient.id));
    this.router.navigate(['/serviceClient']);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  createClient() {
    localStorage.setItem('locationCampId', '0');
    this.router.navigate(["/createClient"]);
  }

  back() {
    this.router.navigate(['/adminHome']);
  }

}

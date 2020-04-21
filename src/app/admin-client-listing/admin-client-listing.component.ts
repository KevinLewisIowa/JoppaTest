import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';
import { filter } from 'rxjs/operators';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-client-listing',
  templateUrl: './admin-client-listing.component.html',
  styleUrls: ['./admin-client-listing.component.css']
})
export class AdminClientListingComponent implements OnInit {
  displayedColumns = ['first_name', 'last_name', 'preferred_name', 'phone', 'birth_date', 'route_name', 'camp_name', 'status', 'household_id', 'updated_at', 'Pets', 'Items']
  clients: any[] = [];
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private clientService: ClientService, private router: Router) {
    this.clientService.getClientsByName('').subscribe(data => {
      this.clients = data;
      this.dataSource = new MatTableDataSource(this.clients);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, error => console.log(error));
  }

  ngOnInit() {
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

  back() {
    this.router.navigate(['/adminHome']);
  }

}

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { faChevronLeft, faPlus, faFlag, faCamera, faFire } from '@fortawesome/free-solid-svg-icons';
import { Client } from 'app/models/client';
import { Subscription, Subject, EMPTY } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-client-listing',
  templateUrl: './admin-client-listing.component.html',
  styleUrls: ['./admin-client-listing.component.css']
})
export class AdminClientListingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['id', 'first_name', 'middle_name', 'last_name', 'preferred_name', 'phone', 'birth_date', 'route_name', 'camp_name', 'status', 'household_id', 'updated_at'];
  clients: Client[] = [];
  dataSource = new MatTableDataSource<Client>([]);
  totalClients = 0;
  isLoading = false;
  loadError = '';
  backIcon = faChevronLeft;
  flagIcon = faFlag;
  fireIcon = faFire;
  cameraIcon = faCamera;
  pastDate: Date = new Date();
  createIcon = faPlus;
  private destroy$ = new Subject<void>();
  private filterInput$ = new Subject<string>();
  private loadRequests$ = new Subject<void>();
  private filterValue = '';
  private sortBy = 'updated_at';
  private sortDirection = 'desc';

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private clientService: ClientService, private router: Router) {
    window.localStorage.removeItem('routeId');
  }

  ngOnInit() {
    this.pastDate.setDate(this.pastDate.getDate() - 60);

    this.filterInput$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(filterValue => {
        this.filterValue = filterValue;
        if (this.paginator) this.paginator.pageIndex = 0;
        this.loadRequests$.next();
      });

    this.loadRequests$
      .pipe(
        switchMap(() => {
          this.isLoading = true;
          this.loadError = '';
          return this.clientService.getPaginatedClients(
            this.filterValue,
            (this.paginator ? this.paginator.pageIndex : 0) + 1,
            this.paginator ? this.paginator.pageSize : 50,
            this.sortBy,
            this.sortDirection
          ).pipe(
            catchError(error => {
              console.error('Unable to load clients', error);
              this.loadError = 'Unable to load clients. Please try again.';
              this.isLoading = false;
              return EMPTY;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        this.clients = response.clients;
        this.clients.forEach(client => {
          client.hasAttentionNote = !!client.has_attention_note;
          client.hasHeatingEquipment = !!client.has_heating_equipment;
          client.hasHeatingEquipmentChecked = true;
        });
        this.dataSource.data = this.clients;
        this.totalClients = response.total;
        if (this.paginator) this.paginator.length = response.total;
        this.isLoading = false;
      });
  }

  isOverMonthOld(date: string) {
    return new Date(date) < this.pastDate;
  }

  viewClient(theClient) {
    localStorage.setItem('selectedClient', JSON.stringify(theClient.id));
    this.router.navigate(['/serviceClient']);
  }

  applyFilter(filterValue: string) {
    this.filterInput$.next(filterValue.trim());
  }

  createClient() {
    localStorage.setItem('locationCampId', '0');
    this.router.navigate(["/createClient"]);
  }

  back() {
    this.router.navigate(['/adminHome']);
  }

  private paginatorSub: Subscription;

  private sortSub: Subscription;

  ngAfterViewInit() {
    this.sort.active = this.sortBy;
    this.sort.direction = this.sortDirection as 'asc' | 'desc';

    if (this.paginator) {
      this.paginatorSub = this.paginator.page.subscribe(() => {
        this.loadRequests$.next();
      });
    }

    if (this.sort) {
      this.sortSub = this.sort.sortChange.subscribe(() => {
        this.sortBy = this.sort.active;
        this.sortDirection = this.sort.direction || 'asc';
        if (this.paginator) this.paginator.pageIndex = 0;
        this.loadRequests$.next();
      });
    }

    this.loadRequests$.next();
  }

  ngOnDestroy() {
    if (this.paginatorSub) this.paginatorSub.unsubscribe();
    if (this.sortSub) this.sortSub.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

}

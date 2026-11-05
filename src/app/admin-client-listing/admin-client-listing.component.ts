import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { faChevronLeft, faPlus, faFlag, faCamera, faFire } from '@fortawesome/free-solid-svg-icons';
import { Client } from 'app/models/client';
import { Subscription, lastValueFrom, Subject, EMPTY } from 'rxjs';
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
  private heatingCache: Map<number, boolean> = new Map<number, boolean>();
  private concurrency = 5;
  private destroy$ = new Subject<void>();
  private filterInput$ = new Subject<string>();
  private loadRequests$ = new Subject<void>();
  private filterValue = '';
  private sortBy = 'updated_at';
  private sortDirection = 'desc';

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private clientService: ClientService, private router: Router, private cd: ChangeDetectorRef) {
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
        });
        this.dataSource.data = this.clients;
        this.totalClients = response.total;
        if (this.paginator) this.paginator.length = response.total;
        this.isLoading = false;
        this.triggerChecksForCurrentPage();
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

  // --- Heating equipment cached checks with limited concurrency ---
  private activeChecks = 0;
  private checkQueue: Client[] = [];
  private checkResolvers: Map<number, Array<(val: boolean) => void>> = new Map<number, Array<(val: boolean) => void>>();
  private paginatorSub: Subscription;

  // Public method that returns a promise resolving to whether the client has heating equipment
  public checkClientHasHeatingEquipmentCached(client: Client): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!client) return resolve(false);

      // If already checked on the client object, return immediately
      if (client.hasHeatingEquipmentChecked) return resolve(!!client.hasHeatingEquipment);

      // If in local cache, set and return
      if (this.heatingCache.has(client.id)) {
        client.hasHeatingEquipment = this.heatingCache.get(client.id);
        client.hasHeatingEquipmentChecked = true;
        return resolve(!!client.hasHeatingEquipment);
      }

      // Otherwise, enqueue and register resolver
      if (!this.checkResolvers.has(client.id)) this.checkResolvers.set(client.id, []);
      this.checkResolvers.get(client.id).push(resolve);

      // Avoid duplicate enqueue
      if (!this.checkQueue.some(c => c.id === client.id)) {
        this.checkQueue.push(client);
        this.processQueue();
      }
    });
  }

  private processQueue() {
    while (this.activeChecks < this.concurrency && this.checkQueue.length > 0) {
      const client = this.checkQueue.shift();
      if (!client) continue;
      // If cache was filled meanwhile, resolve immediately
      if (this.heatingCache.has(client.id)) {
        this.completeHeatingCheck(client, this.heatingCache.get(client.id));
        continue;
      }
      this.performHeatingCheck(client);
    }
  }

  private async performHeatingCheck(client: Client) {
    this.activeChecks++;
    try {
      // 1) heaters
      const heaters: any[] = await lastValueFrom(this.clientService.getHeatersForClient(client.id));
      if (Array.isArray(heaters) && heaters.length > 0) {
        this.completeHeatingCheck(client, true);
        return;
      }

      // 2) tanks
      const tanks: any[] = await lastValueFrom(this.clientService.getClientLoanedTanks(client.id));
      if (Array.isArray(tanks) && tanks.length > 0) {
        this.completeHeatingCheck(client, true);
        return;
      }

      // 3) hoses
      const hoses: any[] = await lastValueFrom(this.clientService.getClientLoanedHoses(client.id));
      const hasHoses = Array.isArray(hoses) && hoses.length > 0;
      this.completeHeatingCheck(client, hasHoses);
    } catch (err) {
      console.log(err);
      this.completeHeatingCheck(client, false);
    } finally {
      this.activeChecks--;
      this.processQueue();
    }
  }

  private completeHeatingCheck(client: Client, hasEquipment: boolean) {
    this.heatingCache.set(client.id, hasEquipment);
    client.hasHeatingEquipment = hasEquipment;
    client.hasHeatingEquipmentChecked = true;

    // debug: log the update to help verify template updates
    console.log(`completeHeatingCheck: client ${client.id} => ${hasEquipment}`);

    // ensure view updates
    try { this.cd.detectChanges(); } catch (err) { /* ignore */ }

    const resolvers = this.checkResolvers.get(client.id);
    if (Array.isArray(resolvers)) {
      resolvers.forEach(r => r(hasEquipment));
      this.checkResolvers.delete(client.id);
    }
  }

  // Trigger checks for the currently visible page rows (respecting current filter/sort)
  private triggerChecksForCurrentPage() {
    this.clients.forEach(client => {
      this.checkClientHasHeatingEquipmentCached(client).catch(err => console.error(err));
    });
  }

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

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource, MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { faChevronLeft, faPlus, faFlag, faCamera, faFire } from '@fortawesome/free-solid-svg-icons';
import { Client } from 'app/models/client';
import { Note } from 'app/models/note';
import { Subscription, lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-admin-client-listing',
  templateUrl: './admin-client-listing.component.html',
  styleUrls: ['./admin-client-listing.component.css']
})
export class AdminClientListingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['id', 'first_name', 'middle_name', 'last_name', 'preferred_name', 'phone', 'birth_date', 'route_name', 'camp_name', 'status', 'household_id', 'updated_at'];
  clients: any[] = [];
  dataSource: MatTableDataSource<any>;
  backIcon = faChevronLeft;
  flagIcon = faFlag;
  fireIcon = faFire;
  cameraIcon = faCamera;
  pastDate: Date = new Date();
  createIcon = faPlus;
  private heatingCache: Map<number, boolean> = new Map<number, boolean>();
  private concurrency = 5;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private clientService: ClientService, private router: Router, private cd: ChangeDetectorRef) {
    window.localStorage.removeItem('routeId');

    // this.clientService.seenAndServicedReport('2024-01-01', '2024-11-17').subscribe(data => {
    //   console.log('seenAndServiced ' + JSON.stringify(data));
    // });

    this.clientService.getClientsByName('').subscribe(data => {
      console.log('Number of clients: ' + data.length)
      this.clients = data;

      // Set hasAttentionNote for each client, throttled in batches of 15
      (async () => {
        await this.processClientsInBatches(this.clients, 25);
      })();

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
      // Trigger initial checks for the visible page
      this.triggerChecksForCurrentPage();

      // displayedColumns = ['first_name', 'last_name', 'preferred_name', 'phone', 'birth_date', 'route_name', 'camp_name', 'status', 'household_id', 'updated_at'];
      this.dataSource.filterPredicate = (data, filter: string) => {
        const filterValue = filter.trim().toLowerCase();
        const firstLastName = `${data.first_name} ${data.last_name}`.toLowerCase();
        const firstMiddleLastName = `${data.first_name} ${data.middle_name} ${data.last_name}`.toLowerCase();
        const preferredLastName = `${data.preferred_name} ${data.last_name}`.toLowerCase();
        return firstLastName.includes(filterValue) ||
          firstMiddleLastName.includes(filterValue) ||
          preferredLastName.includes(filterValue) ||
          (data.phone != null && data.phone.toLowerCase().includes(filterValue)) ||
          (data.birth_date != null && data.birth_date.toLowerCase().includes(filterValue)) ||
          (data.route_name != null && data.route_name.toLowerCase().includes(filterValue)) ||
          (data.camp_name != null && data.camp_name.toLowerCase().includes(filterValue)) ||
          (data.status != null && data.status.toLowerCase().includes(filterValue)) ||
          (data.updated_at != null && data.updated_at.toLowerCase().includes(filterValue)) ||
          (data.last_name != null && data.last_name.toLowerCase().includes(filterValue)) ||
          (data.middle_name != null && data.middle_name.toLowerCase().includes(filterValue))
      };
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // Reset to first page when filter changes and trigger visible checks
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    this.triggerChecksForCurrentPage();
  }

  createClient() {
    localStorage.setItem('locationCampId', '0');
    this.router.navigate(["/createClient"]);
  }

  back() {
    this.router.navigate(['/adminHome']);
  }

  // Throttle processClient calls in batches
  async processClientsInBatches(clients: Client[], batchSize: number = 5) {
    for (let i = 0; i < clients.length; i += batchSize) {
      const batch = clients.slice(i, i + batchSize);
      await Promise.all(batch.map(client => this.processClientAsync(client)));
    }
  }

  // Promise-based version of processClient
  processClientAsync(client: Client): Promise<void> {
    return new Promise((resolve) => {
      client.hasAttentionNote = !!(client.admin_notes && client.admin_notes.trim() !== '');
      if (!client.hasAttentionNote) {
        this.clientService.hasPinnedOrWarningNote(client.id).subscribe(
          data => {
            client.hasAttentionNote = data.hasPinnedOrWarningNote;
            resolve();
          },
          error => {
            console.log(error);
            resolve();
          }
        );
      } else {
        resolve();
      }
    });
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
    if (!this.dataSource || !this.dataSource.paginator) return;
    const pageIndex = this.dataSource.paginator.pageIndex || 0;
    const pageSize = this.dataSource.paginator.pageSize || 50;

    // // Use the dataSource's filteredData so that filter/sort are respected
    // const sourceData = (this.dataSource as any).filteredData || this.clients;
    // const start = pageIndex * pageSize;
    // const end = Math.min(start + pageSize, sourceData.length);
    // const pageClients = sourceData.slice(start, end);
    // console.log(`triggerChecksForCurrentPage: pageIndex=${JSON.stringify(sourceData)}`);
    // pageClients.forEach(client => {
    //   // Fire and forget; UI will update when promise resolves
    //   this.checkClientHasHeatingEquipmentCached(client).catch(err => { console.log(err); });
    // });

    // connect() emits the rows actually rendered by the table (after filter, sort, pagination).
    // take(1) subscribes once and auto-unsubscribes.
    (this.dataSource.connect() as any).pipe(take(1)).subscribe((renderedRows: any[]) => {
      console.log('triggerChecksForCurrentPage: rendered rows', renderedRows.map(r => r.id));
      renderedRows.forEach(client => {
        // Fire and forget; UI will update when promise resolves
        this.checkClientHasHeatingEquipmentCached(client).catch(err => { console.log(err); });
      });
    });
  }

  private sortSub: Subscription;

  ngAfterViewInit() {
    // subscribe to paginator events to trigger checks for new pages
    if (this.paginator) {
      this.paginatorSub = this.paginator.page.subscribe(() => {
        // Wait one macrotask so MatTable has updated its rendered rows
        setTimeout(() => this.triggerChecksForCurrentPage(), 0);
      });
    }
 
    // subscribe to sort events to re-trigger checks when sort changes
    if (this.sort) {
      this.sortSub = this.sort.sortChange.subscribe(() => {
        // Sorting also updates rendered rows asynchronously
        setTimeout(() => this.triggerChecksForCurrentPage(), 0);
      });
    }
 
    // initial trigger now that view is initialized
    this.triggerChecksForCurrentPage();
  }

  ngOnDestroy() {
    if (this.paginatorSub) this.paginatorSub.unsubscribe();
    if (this.sortSub) this.sortSub.unsubscribe();
  }

}

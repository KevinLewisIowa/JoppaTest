import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { MatLegacyPaginator as MatPaginator } from "@angular/material/legacy-paginator";
import { MatSort } from "@angular/material/sort";
import { MatLegacyTableDataSource as MatTableDataSource } from "@angular/material/legacy-table";
import { Router } from "@angular/router";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { LocationCamp } from "app/models/location-camp";
import { Route } from "app/models/route";
import { MainService } from "app/services/main.service";
import { EMPTY, forkJoin, Subject, Subscription } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-admin-camp-listing",
  templateUrl: "./admin-camp-listing.component.html",
  styleUrls: ["./admin-camp-listing.component.css"],
})
export class AdminCampListingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ["camp_name", "route_name", "position", "is_active", "remain_on_route"];
  camps: LocationCamp[] = [];
  routes: Route[] = [];
  camp: LocationCamp;
  dataSource = new MatTableDataSource<LocationCamp>([]);
  totalCamps = 0;
  isLoading = false;
  isSaving = false;
  loadError = "";
  saveError = "";
  backIcon = faChevronLeft;
  @Output() editedCamp = new EventEmitter<LocationCamp>();
  private destroy$ = new Subject<void>();
  private filterInput$ = new Subject<string>();
  private loadRequests$ = new Subject<void>();
  private editedCamps = new Map<number, LocationCamp>();
  private filterValue = "";
  private sortBy = "camp_name";
  private sortDirection = "asc";
  private paginatorSub: Subscription;
  private sortSub: Subscription;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  get hasUnsavedChanges(): boolean {
    return this.editedCamps.size > 0;
  }

  constructor(private mainService: MainService, private router: Router) {
    window.localStorage.removeItem("routeId");
  }

  ngOnInit() {
    this.mainService.getTheRoutes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        routes => this.routes = routes,
        error => console.error("Unable to load routes for camp listing", error)
      );

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
          this.loadError = "";
          return this.mainService.getPaginatedCampListing(
            this.filterValue,
            (this.paginator ? this.paginator.pageIndex : 0) + 1,
            this.paginator ? this.paginator.pageSize : 50,
            this.sortBy,
            this.sortDirection
          ).pipe(
            catchError(error => {
              console.error("Unable to load camps", error);
              this.loadError = "Unable to load camps. Please try again.";
              this.isLoading = false;
              return EMPTY;
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        this.camps = response.camps.map(camp => this.editedCamps.get(camp.id) || camp);
        this.dataSource.data = this.camps;
        this.totalCamps = response.total;
        if (this.paginator) this.paginator.length = response.total;
        this.isLoading = false;
      });
  }

  ngAfterViewInit() {
    this.sort.active = this.sortBy;
    this.sort.direction = this.sortDirection as "asc" | "desc";

    this.paginatorSub = this.paginator.page.subscribe(() => this.loadRequests$.next());
    this.sortSub = this.sort.sortChange.subscribe(() => {
      this.sortBy = this.sort.active;
      this.sortDirection = this.sort.direction || "asc";
      this.paginator.pageIndex = 0;
      this.loadRequests$.next();
    });

    this.loadRequests$.next();
  }

  viewCamp(theCamp: LocationCamp) {
    window.localStorage.setItem("routeId", JSON.stringify(theCamp.route_id));
    this.router.navigate([`/locationCamp/${theCamp.id}`]);
  }

  onCampChanged(camp: LocationCamp) {
    this.editedCamps.set(camp.id, camp);
    this.saveError = "";
  }

  submitCamp() {
    const changes = Array.from(this.editedCamps.values());
    if (changes.length === 0 || this.isSaving) return;

    this.isSaving = true;
    this.saveError = "";
    forkJoin(changes.map(camp => this.mainService.updateLocationCamp(camp)))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: savedCamps => {
          savedCamps.forEach(savedCamp => {
            this.editedCamps.delete(savedCamp.id);
            this.editedCamp.emit(savedCamp);
          });
          if (savedCamps.length > 0) {
            window.localStorage.setItem("routeId", JSON.stringify(savedCamps[savedCamps.length - 1].route_id));
          }
          this.isSaving = false;
          this.loadRequests$.next();
        },
        error: error => {
          console.error("Unable to save camp changes", error);
          this.saveError = "Some changes could not be saved. Your edits are still available to retry.";
          this.isSaving = false;
        }
      });
  }

  applyFilter(filterValue: string) {
    this.filterInput$.next(filterValue.trim());
  }

  back() {
    this.router.navigate(["/adminHome"]);
  }

  ngOnDestroy() {
    if (this.paginatorSub) this.paginatorSub.unsubscribe();
    if (this.sortSub) this.sortSub.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

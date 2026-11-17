import { Component, OnDestroy } from "@angular/core";
import { ClientService } from "app/services/client.service";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-admin-client-inactive-updater",
  templateUrl: "./admin-client-inactive-updater.component.html",
  styleUrls: ["./admin-client-inactive-updater.component.css"],
})
export class AdminClientInactiveUpdaterComponent implements OnDestroy {
  inactivityLimit = 90;
  countInactivated = 0;
  inactiveUpdaterRunning: boolean = false;
  processComplete: boolean = false;
  processError = "";
  backIcon = faChevronLeft;
  private destroy$ = new Subject<void>();

  constructor(private clientService: ClientService) {}

  updateInactive() {
    if (this.inactiveUpdaterRunning) return;

    this.inactiveUpdaterRunning = true;
    this.processComplete = false;
    this.processError = "";
    this.countInactivated = 0;
    this.clientService.updateInactiveClients(this.inactivityLimit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.countInactivated = response.updated_count;
          this.processComplete = true;
          this.inactiveUpdaterRunning = false;
        },
        error: error => {
          console.error("Unable to update inactive clients", error);
          this.processError = "Unable to update inactive clients. Please try again.";
          this.inactiveUpdaterRunning = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

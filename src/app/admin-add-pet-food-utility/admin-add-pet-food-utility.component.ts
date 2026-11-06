import { Component, OnDestroy } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-add-pet-food-utility',
  templateUrl: './admin-add-pet-food-utility.component.html',
  styleUrls: ['./admin-add-pet-food-utility.component.css']
})
export class AdminAddPetFoodUtilityComponent implements OnDestroy {

  countItemsAdded = 0;
  petFoodAdderRunning: boolean = false;
  processComplete: boolean = false;
  processError = '';
  backIcon = faChevronLeft;
  private destroy$ = new Subject<void>();

  constructor(private clientService: ClientService) { }

  addPetFood() {
    if (this.petFoodAdderRunning) return;

    this.petFoodAdderRunning = true;
    this.processComplete = false;
    this.processError = '';
    this.countItemsAdded = 0;
    this.clientService.addPetFoodRequestedItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          this.countItemsAdded = response.created_count;
          this.processComplete = true;
          this.petFoodAdderRunning = false;
        },
        error: error => {
          console.error("Unable to add pet food items", error);
          this.processError = "Unable to add pet food items. Please try again.";
          this.petFoodAdderRunning = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

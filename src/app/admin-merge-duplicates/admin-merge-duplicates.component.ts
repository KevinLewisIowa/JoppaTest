import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from 'app/models/client';
import { ClientSearchComponent } from 'app/client-search/client-search.component';
import { MainService } from 'app/services/main.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-merge-duplicates',
  templateUrl: './admin-merge-duplicates.component.html',
  styleUrls: ['./admin-merge-duplicates.component.css']
})
export class AdminMergeDuplicatesComponent implements OnDestroy {
  @ViewChild('clientSearch', { static: false }) clientSearch: ClientSearchComponent;

  duplicateClient: Client = null;
  activeClient: Client = null;
  message = '';
  error = '';
  backIcon = faChevronLeft;
  private clientSelectedSub: Subscription;
  private mergeSub: Subscription;
  private selecting: 'duplicate' | 'active' = 'duplicate';

  constructor(private mainService: MainService, private router: Router) {}

  openSearch(target: 'duplicate' | 'active') {
    this.selecting = target;
    this.message = '';
    this.error = '';
    // open the client search modal component
    if (this.clientSearch && this.clientSearch.showModal) {
      this.clientSearch.showModal();
    }
  }

  // handler bound from template (clientSelected event)
  clientSelectedHandler(client: Client) {
    if (!client) return;
    if (this.selecting === 'duplicate') {
      this.duplicateClient = client;
    } else {
      this.activeClient = client;
    }
    this.message = '';
    this.error = '';
  }

  merge() {
    this.message = '';
    this.error = '';
    if (!this.duplicateClient || !this.activeClient) {
      this.error = 'Please select both a duplicate client and the active client to merge into.';
      return;
    }

    if (this.duplicateClient.id === this.activeClient.id) {
      this.error = 'The duplicate and active client cannot be the same client.';
      return;
    }

    const ok = window.confirm(
      `Merge ${this.duplicateClient.first_name} ${this.duplicateClient.last_name} (duplicate) into ${this.activeClient.first_name} ${this.activeClient.last_name}? This action cannot be undone.`
    );

    if (!ok) return;

    this.mergeSub = this.mainService
      .mergeDuplicateClient(this.duplicateClient.id, this.activeClient.id)
      .subscribe(
        (res: any) => {
          this.message = 'Merge completed.';
          // clear selection after merge
          this.duplicateClient = null;
          this.activeClient = null;
        },
        (err) => {
          console.error(err);
          this.error = 'Error merging clients';
        }
      );
  }

  goBack() {
    // Navigate back to the admin home screen
    this.router.navigate(['/adminHome']);
  }

  ngOnDestroy() {
    if (this.clientSelectedSub) this.clientSelectedSub.unsubscribe();
    if (this.mergeSub) this.mergeSub.unsubscribe();
  }

}

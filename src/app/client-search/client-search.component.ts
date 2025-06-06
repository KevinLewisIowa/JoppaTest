import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ConfirmDialogModel, CustomConfirmationDialogComponent } from 'app/custom-confirmation-dialog/custom-confirmation-dialog.component';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent implements OnInit, OnDestroy {
  @Output() clientSelected = new EventEmitter<Client>();
  @ViewChild('clientSearchMdl', { static: false }) clientSearchMdl: ElementRef;
  clients: Client[] = [];
  nameSearch = '';
  stateSearch = '';
  noResultsMessage = '';
  citySearch = '';
  businessUnitCode: number = -1;
  resultMessage = '';
  page = 1;
  pageSize = 15;
  resultCount = 0;
  previousEnabled = false;
  nextEnabled = false;
  userSubscription;
  searchSubscription;
  isAdmin: boolean = false;
  loading = false;
  showing = '';
  of = '';
  noRecords = '';

  constructor(private clientService: ClientService, private modalService: NgbModal, private renderer: Renderer2, private dialog: MatDialog) { }

  ngOnInit() {
  }

  showModal() {
    this.isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
    this.clients = [];
    this.nameSearch = '';
    this.nextEnabled = false;
    this.previousEnabled = false;
    this.modalService.open(this.clientSearchMdl/*,{ size: 'lg', backdrop: 'static'}*/);
    this.resultMessage = '';
  }

  performSearch() {
    this.page = 1;
    this.search();
  }

  search() {
    this.loading = true;
    this.searchSubscription = this.clientService.getClientsByName(this.nameSearch).subscribe(results => {
      this.loading = false;

      let clients = (results as any[]);
      if (!this.isAdmin) {
        clients = clients.filter(client => client.status !== 'Deceased');
      }

      // Count matches for first and last name
      const searchValue = this.nameSearch.trim().toLowerCase();
      const firstNameMatches = clients.filter(c => c.first_name?.toLowerCase() === searchValue);
      const lastNameMatches = clients.filter(c => c.last_name?.toLowerCase() === searchValue);
      console.log(`First Name Matches: ${firstNameMatches.length}, Last Name Matches: ${lastNameMatches.length}`);

      if (lastNameMatches.length >= firstNameMatches.length) {
        // More matches by last name, sort by first name
        clients = clients.sort((a, b) => a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name));
      } else if (firstNameMatches.length > lastNameMatches.length) {
        // More matches by first name, sort by last name
        clients = clients.sort((a, b) => a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name));
      }

      this.clients = clients;
      this.resultCount = this.clients.length;
      this.noResultsMessage = this.clients.length === 0 ? 'No results.' : '';
    }, error => {
      console.log(error);
      this.clients = [];
      this.noResultsMessage = 'Error getting results';
    });
  }

  selectedClient(client: Client) {
    let title: string = 'Confirm Action';
    let confirmText: string = 'Yes';
    let dismissText: string = 'No';
    let message: string;

    if (client.is_aftercare && !this.isAdmin) {
      alert('This client is in the Aftercare program and cannot be moved to a camp location.  If they are no longer in housing, they need to inform Joppa.  Please tell them that they need to be home to be served on Sunday.  Thank you!');
    } else {
      message = 'Are you sure you want to select ' + client.first_name + ' ' + client.last_name + '?';
      const dialogData = new ConfirmDialogModel(title, message, confirmText, dismissText);
      const dialogRef = this.dialog.open(CustomConfirmationDialogComponent, { data: dialogData, maxWidth: '400px' });

      dialogRef.afterClosed().subscribe(result => {
        let canContinue: boolean = JSON.parse(result);
        if (canContinue) {
          this.clientSelected.emit(client);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.searchSubscription !== undefined) {
      this.searchSubscription.unsubscribe();
    }

    if (this.userSubscription !== undefined) {
      this.userSubscription.unsubscribe();
    }
  }

}

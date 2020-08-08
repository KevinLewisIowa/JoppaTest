import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild, Renderer2} from '@angular/core';
import { Client } from "app/models/client";
import { ClientService } from "app/services/client.service";
import { Store } from "@ngrx/store";
import { IMainStore } from "app/state-management/main.store";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.css']
})
export class ClientSearchComponent implements OnInit, OnDestroy {
  @Output() clientSelected = new EventEmitter<Client>();
  @ViewChild('clientSearchMdl') clientSearchMdl: ElementRef;
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
  loading = false;
  showing = '';
  of = '';
  noRecords = '';

  constructor(private clientService: ClientService, private store: Store<IMainStore>,
              private modalService: NgbModal, private renderer: Renderer2,) { }

  ngOnInit() {
  }

  showModal() {
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
      this.clients = results as any[];
      this.resultCount = this.clients.length;
      if (this.clients.length == 0) {
        this.noResultsMessage = 'No results.';
      } else {
        this.noResultsMessage = '';
      }
    }, error => {
      console.log(error);
      this.clients = [];
      this.noResultsMessage = 'Error getting results';
    });
  }

  selectedClient(client: Client) {
    if (confirm('Are you sure you want to select ' + client.first_name + ' ' + client.last_name + '?')) {
      this.clientSelected.emit(client);
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

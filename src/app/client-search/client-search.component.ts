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
  preferredName = '';
  nameSearch = '';
  stateSearch = '';
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
    console.log('in show modal');
    this.clients = [];
    this.preferredName = '';
    this.nextEnabled = false;
    this.previousEnabled = false;
    this.modalService.open(this.clientSearchMdl/*,{ size: 'lg', backdrop: 'static'}*/);
    this.resultMessage = '';
    //const inputElement = this.renderer.selectRootElement('#focusMe');
    //const docBody = document.body;
    //const docEl = document.documentElement;
    //const scrollTop = window.pageYOffset || docEl.scrollTop || docBody.scrollTop;
    //const clientTop = docEl.clientTop || docBody.clientTop || 0;
    //const newTop = scrollTop - clientTop;
    //inputElement.focus();
    //window.scrollTo(0, newTop);
  }

  performSearch() {
    this.page = 1;
    this.nameSearch = this.preferredName;
    this.search();
  }

  search() {
    this.loading = true;
    this.searchSubscription = this.clientService.getClientsByName(this.preferredName)
    .subscribe(results => {
      this.loading = false;
      this.clients = results as any[];
      this.resultCount = this.clients.length;
      /*if (tot > this.pageSize * this.page) {
        this.nextEnabled = true;
        this.resultMessage =
          this.showing + ` ${(this.pageSize * this.page) - (this.pageSize - 1)}-${this.pageSize * this.page} ` + this.of + ` ${tot}`;
      } else {
        if (this.resultCount > 0) {
          this.resultMessage = this.showing + ` ${(this.pageSize * (this.page - 1)) + 1}-${tot} ` + this.of + ` ${tot}`;
        } else {
          this.resultMessage = this.noRecords;
        }
        this.nextEnabled = false;
      }
      if (this.page === 1) {
        this.previousEnabled = false;
      } else {
        this.previousEnabled = true;
      }*/
    });
  }

  selectedClient(client: Client) {
    this.clientSelected.emit(client);
    // this.store.dispatch({type: 'CLIENT', payload: client});
  }

  nextPage() {
    // if (this.resultCount <= (this.page * this.pageSize)) {
    //   return;
    // } else {
    //   this.page++;
    //   this.search();
    // }
  }

  previousPage() {
    // if (this.page === 1) {
    //   return;
    // } else {
    //   this.page--;
    //   this.search();
    // }
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
import { Component, OnInit } from '@angular/core';
import { Client } from 'app/models/client';
import { ClientService } from 'app/services/client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-client-listing',
  templateUrl: './admin-client-listing.component.html',
  styleUrls: ['./admin-client-listing.component.css']
})
export class AdminClientListingComponent implements OnInit {
  clients: any[] = [];

  constructor(private clientService: ClientService, private router: Router) {
    this.clientService.getClientsByName('').subscribe(data => {
      this.clients = data;
    }, error => console.log(error));
  }

  ngOnInit() {
  }

  viewClient(theClient) {
    localStorage.setItem('selectedClient', JSON.stringify(theClient.id));
    this.router.navigate(['/serviceClient']);
  }

  back() {
    this.router.navigate(['/adminHome']);
  }

}

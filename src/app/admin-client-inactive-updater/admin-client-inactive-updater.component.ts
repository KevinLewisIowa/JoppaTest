import { Component, OnInit } from '@angular/core';
import { ClientService } from 'app/services/client.service';
import { Client } from 'app/models/client';
import {Router} from '@angular/router';
// tslint:disable-next-line:comment-format
//Add the clientService in the component.ts file in the constructor and import ClientService
@Component({
  selector: 'app-admin-client-inactive-updater',
  templateUrl: './admin-client-inactive-updater.component.html',
  styleUrls: ['./admin-client-inactive-updater.component.css']
})
export class AdminClientInactiveUpdaterComponent implements OnInit {
  clients: any[] = [];
  inactivityLimit = 28;
  constructor(private clientService: ClientService, private router: Router) {
    this.clientService.getClientsByName('').subscribe(data =>{
      this.clients = data;
      var today = new Date();


      this.clients.forEach((client: Client) => {
        var difference = today.getTime() - client.last_interaction_date.getTime();
        difference = Math.ceil(difference / (1000 * 3600 * 24));
        if(difference > this.inactivityLimit){
          client.status = "Inactive";
          client.current_camp_id = 0;
          this.clientService.updateClient(client).subscribe(data => {
            //not implemented
          })
        }
      })
    })
  }

  ngOnInit() {
  }

}

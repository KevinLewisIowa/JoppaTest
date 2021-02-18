import { Component, OnInit } from '@angular/core';
import { ClientService } from 'app/services/client.service';
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
  constructor(private clientService: ClientService, private router: Router) {
    this.clientService.getClientsByName('').subscribe(data =>{
      this.clients = data;
      this.clients.forEach((client: Client) => {
        if(client.last_interaction_date){
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

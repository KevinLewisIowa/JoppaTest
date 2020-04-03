import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from 'app/models/client';
import { Appearance } from 'app/models/appearance';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-new-clients-report',
  templateUrl: './new-clients-report.component.html',
  styleUrls: ['./new-clients-report.component.css']
})
export class NewClientsReportComponent implements OnInit {
  clients: any[] = [];
  constructor(private service: ClientService) { };
  backIcon = faChevronLeft;

  ngOnInit() {
    this.service.getClientsNewToCamps().subscribe(data => {
      this.clients = data;
    }, error => {console.log(error)});
  }

  confirm(theClient: Client) {
    if (theClient.previous_camp_id !== 0) {
      let clientAppearance: Appearance = new Appearance();
      clientAppearance.client_id = theClient.id;
      clientAppearance.location_camp_id = theClient.previous_camp_id;
      clientAppearance.still_lives_here = false;
      clientAppearance.serviced = false;
      clientAppearance.was_seen = false;

      this.service.insertClientAppearance(clientAppearance);
    }
    theClient.previous_camp_id = theClient.current_camp_id;

    this.service.updateClient(theClient).subscribe(data => {
      this.clients = this.clients.filter(w => w.id !== theClient.id);
    });
  }
}
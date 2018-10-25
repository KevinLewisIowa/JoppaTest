import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from 'app/models/client';

@Component({
  selector: 'app-new-clients-report',
  templateUrl: './new-clients-report.component.html',
  styleUrls: ['./new-clients-report.component.css']
})
export class NewClientsReportComponent implements OnInit {
  clients = [];
  constructor(private service: ClientService) { }

  ngOnInit() {
    this.service.getClientsNewToCamps().subscribe((data: any[]) => {
      this.clients = data;
    });
  }

  confirm(theClient: Client) {
    theClient.previous_camp_id = theClient.current_camp_id;

    this.service.updateClient(theClient).subscribe(data => {
      this.clients = this.clients.filter(w => w.id !== theClient.id);
    });
  }

}

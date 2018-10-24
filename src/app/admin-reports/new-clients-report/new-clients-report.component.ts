import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-new-clients-report',
  templateUrl: './new-clients-report.component.html',
  styleUrls: ['./new-clients-report.component.css']
})
export class NewClientsReportComponent implements OnInit {
  clients = [];
  constructor(private service: ClientService) { }

  ngOnInit() {
    this.service.getNewClients().subscribe((data: any[]) => {
      this.clients = data;
    });
  }

}

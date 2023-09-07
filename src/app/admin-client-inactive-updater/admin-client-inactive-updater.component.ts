import { Component, OnInit } from "@angular/core";
import { ClientService } from "app/services/client.service";
import { Client } from "app/models/client";
import { Router } from "@angular/router";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

// tslint:disable-next-line:comment-format
//Add the clientService in the component.ts file in the constructor and import ClientService
@Component({
  selector: "app-admin-client-inactive-updater",
  templateUrl: "./admin-client-inactive-updater.component.html",
  styleUrls: ["./admin-client-inactive-updater.component.css"],
})
export class AdminClientInactiveUpdaterComponent implements OnInit {
  clients: any[] = [];
  inactivityLimit = 90;
  countInactivated = 0;
  inactiveUpdaterRunning: boolean = false;
  processComplete: boolean = false;
  backIcon = faChevronLeft;

  constructor(private clientService: ClientService, private router: Router) {}

  updateInactive() {
    this.inactiveUpdaterRunning = true;
    this.processComplete = false;
    this.clientService.getClientsByName("").subscribe((data) => {
      this.clients = data;
      var today = new Date();

      var numClients = this.clients.length;

      var i = 0;
      this.clients.forEach((client: Client) => {
        i++;        
        var difference = today.getTime() - new Date(client.last_interaction_date).getTime();
        difference = Math.ceil(difference / (1000 * 3600 * 24));
        console.log(`${client.first_name} ${client.last_name} difference: ${difference}; inactivity limit: ${this.inactivityLimit}`);
        
        if ((difference > this.inactivityLimit) && (client.status == "Active")) {
          console.log(client.first_name + client.preferred_name + client.last_name);
          client.status = "Inactive";
          client.current_camp_id = 0;
          this.clientService.updateClient(client).subscribe(() => {
            this.countInactivated++;
          });
        }

        if (i == numClients) {
          this.inactiveUpdaterRunning = false;
          this.processComplete = true;
        }
      });
    });
  }

  ngOnInit() {}
}

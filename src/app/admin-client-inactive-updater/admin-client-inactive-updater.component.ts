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
  inactivityLimit = 28;
  countInactivated = 0;
  backIcon = faChevronLeft;

  constructor(private clientService: ClientService, private router: Router) {}

  updateInactive() {
    this.clientService.getClientsByName("").subscribe((data) => {
      this.clients = data;
      var today = new Date();
      console.log(data[0]);

      this.clients.forEach((client: Client) => {
        console.log(client.status);
        // console.log(
        //   "client status true or false: " + (client.status === "Active")
        // );
        var difference =
          today.getTime() - new Date(client.last_interaction_date).getTime();
        difference = Math.ceil(difference / (1000 * 3600 * 24));
        // var clientBool = client.status === "Active";

        if (difference > this.inactivityLimit && (client.status = "Active")) {
          client.status = "Inactive";
          client.current_camp_id = 0;
          this.clientService.updateClient(client).subscribe(() => {
            this.countInactivated++;
          });
        }
        console.log(this.countInactivated + " clients marked as inactivated.");
      });
    });
  }

  ngOnInit() {}
}

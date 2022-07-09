import { throwError as observableThrowError, Observable, forkJoin } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ClientLike } from "../models/client-like";
import { ClientDislike } from "../models/client-dislike";
import { Client } from "../models/client";
import { LocationCamp } from "../models/location-camp";
import { Appearance } from "../models/appearance";
import { HealthConcern } from "../models/health-concern";
import { RequestedItem } from "../models/requested-item";
import { PrayerRequestAndNeed } from "app/models/prayer-request";
import { GoalsNextStep } from "app/models/goals-next-steps";
import { Router } from "@angular/router";
import { Note } from "app/models/note";
import { ClientPet } from "app/models/client-pet";
import { Tent } from "app/models/tent";
import { ReferralsResources } from "app/models/referrals-resources";
import { environment } from "environments/environment";
import { map, catchError } from "rxjs/operators";

// adding a new comment
@Injectable()
export class ClientService {
  theHeader = new HttpHeaders().set("Content-Type", "application/json");
  online = true;
  private baseUrl = environment.api_url;

  constructor(private http: HttpClient, private router: Router) {
    console.log(this.baseUrl);
  }

  getClientLikes(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `likesForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientDislikes(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `dislikesForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }, catchError(this.handleError))
      );
  }

  getClientById(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `clients/${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getBirthdaysByMonth(monthInt: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientsByBirthMonth?monthInt=${monthInt}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getNewClients() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getNewClients`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientsNewToCamps() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientsNewToCamps`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientNotesForRoute(clientId: number, routeInstanceId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `getClientNotesForRoute?clientId=${clientId}&routeInstanceId=${routeInstanceId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientNotesForClient(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientNotesForClient?clientId=${clientId}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientLike(theClientLike: ClientLike) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_likes`,
        { client_like: theClientLike },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientDislike(theClientDislike: ClientDislike) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_dislikes`,
        { client_dislike: theClientDislike },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertNote(theNote: Note) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_notes`,
        { client_note: theNote },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getTentsForClient(client_id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getTentsForClient?clientId=${client_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          console.log(res);
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientTent(theTent: Tent) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_tents`,
        { client_tent: theTent },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientAppearance(clientAppearance: Appearance) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_interactions`,
        { client_interaction: clientAppearance },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClientAppearance(clientAppearance: Appearance) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_interactions/${clientAppearance.id}`,
        { client_interaction: clientAppearance },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHeatersForClient(theClientId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl + `getCurrentHeatersForClient?clientId=${theClientId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHeaterClient(theClientId, theHeaterId, theStatusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateHeaterClient?clientId=${theClientId}&heaterId=${theHeaterId}&status=${theStatusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getCheckedOutHeaters(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientsByName(name) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    if (name == "") {
      name = "ALLCLIENTS";
    }
    return this.http
      .get(this.baseUrl + `getClientsByName?name=${name}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClient(theClient: Client) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `clients`,
        { client: theClient },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateClient(theClient: Client) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `clients/${theClient.id}`,
        { client: theClient },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updatePet(thePet: ClientPet) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `client_pets/${thePet.id}`,
        { client_pet: thePet },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertHealthConcern(concern: HealthConcern) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `health_concerns`,
        { health_concern: concern },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHealthConcerns(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientHealthConcerns?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertRequestedItem(item: RequestedItem) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    item.has_received = false;
    return this.http
      .post(
        this.baseUrl + `requested_items`,
        { requested_item: item },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRequestedItems(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientRequestedItem?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertPet(pet: ClientPet) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .post(
        this.baseUrl + `client_pets`,
        { client_pet: pet },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientPets(id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getClientPets?clientId=${id}`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientHousehold(household_id) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });

    return this.http
      .get(this.baseUrl + `getHousehold?householdId=${household_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  removeReferralResource(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_referrals/${id}`, { headers: myHeader, })
      .pipe(map((res) => {
          return true;
        }), catchError(this.handleError));
  }

  deletedRequestedItem(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `requested_items/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeLike(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_likes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeAppearance(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_interactions/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeDislike(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_dislikes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeTent(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_tents/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removePet(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_pets/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeHealthConcern(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `health_concerns/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removeNote(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `client_notes/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  removePrayerRequestNeed(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `prayer_request_and_needs/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  completePrayerRequestNeed(thePrayerRequestNeed: PrayerRequestAndNeed) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `prayer_request_and_needs/${thePrayerRequestNeed.id}`,
        { prayer_request_and_need: thePrayerRequestNeed },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  deleteGoalAndNextStep(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.delete(this.baseUrl + `goals_and_next_steps/${id}`, { headers: myHeader })
    .pipe(map((res) => {
      return true;
    }), catchError(this.handleError));
  }

  completeGoalAndNextStep(theGoal: GoalsNextStep) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .patch(
        this.baseUrl + `goals_and_next_steps/${theGoal.id}`,
        { goals_and_next_step: theGoal },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  receivedRequestedItem(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `receivedRequestedItem/?requestId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getRecentReceivedItems(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `recentReceivedItems?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientReferralResource(referralsResources: ReferralsResources) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http.post(this.baseUrl + `client_referrals`,{ client_referral: referralsResources }, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getGoalsAndNextSteps(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `goalsForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertGoalAndStep(goal: GoalsNextStep) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `goals_and_next_steps`,
        { goals_and_next_step: goal },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientPrayerRequests(id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `prayerRequestsForClient?clientId=${id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientReferrals(client_id: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getClientReferrals?clientId=${client_id}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  insertClientPrayerRequest(prayerRequest: PrayerRequestAndNeed) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `prayer_request_and_needs`,
        { prayer_request_and_need: prayerRequest },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getHeatEquipmentNotReturned(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return forkJoin([
      this.http.get(
        this.baseUrl + `getHeatersNotReturnedForClient?clientId=${clientId}`,
        { headers: myHeader }
      ),
      this.http.get(
        this.baseUrl + `getHosesNotReturnedForClient?clientId=${clientId}`,
        { headers: myHeader }
      ),
      this.http.get(
        this.baseUrl + `getTanksNotReturnedForClient?clientId=${clientId}`,
        { headers: myHeader }
      ),
    ]).pipe(
      map((data) => {
        const resultArray = [];
        const heaters = data[0] as any[];
        const hoses = data[1] as any[];
        const tanks = data[2] as any[];
        heaters.forEach((item) => {
          resultArray.push({
            Type: "Heater",
            created_at: item.created_at,
            status_id: item.status_id,
            updated_at: item.updated_at,
          });
        });
        hoses.forEach((item) => {
          resultArray.push({
            Type: "Hose",
            created_at: item.created_at,
            status_id: item.heater_status_id,
            updated_at: item.updated_at,
          });
        });
        tanks.forEach((item) => {
          resultArray.push({
            Type: "Tank",
            created_at: item.created_at,
            status_id: item.status_id,
            updated_at: item.updated_at,
          });
        });
        return resultArray;
      }),
      catchError(this.handleError)
    );
  }

  getAllRequestedItems() {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getAllRequestedItems`, { headers: myHeader })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientLoanedTanks(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getTanksLoanedToClient?clientId=${clientId}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getClientLoanedHoses(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(this.baseUrl + `getHosesLoanedToClient?clientId=${clientId}`, {
        headers: myHeader,
      })
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  loanTank(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_tank_interactions`,
        { client_tank_interaction: { client_id: clientId, status_id: 2 } },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  loanHose(clientId: number) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .post(
        this.baseUrl + `client_hose_interactions`,
        {
          client_hose_interaction: { client_id: clientId, heater_status_id: 2 },
        },
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateTankInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateTankInteraction?interactionId=${interactionId}&statusId=${statusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHoseInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateHoseInteraction?interactionId=${interactionId}&statusId=${statusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  updateHeaterInteraction(interactionId, statusId) {
    const myHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("apiToken"),
    });
    return this.http
      .get(
        this.baseUrl +
          `updateHeaterInteraction?interactionId=${interactionId}&statusId=${statusId}`,
        { headers: myHeader }
      )
      .pipe(
        map((res: any) => {
          if (res.message === "invalid-token") {
            window.localStorage.removeItem("apiToken");
            this.router.navigate(["/application-login"]);
          }
          return res;
        }),
        catchError(this.handleError)
      );
  }

  private mapLocations(data: Array<any>): LocationCamp[] {
    return data.map(
      (item) =>
        <LocationCamp>{
          id: item.id,
          route_id: item.route_id,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          notes: item.notes,
          position: item.position,
        }
    );
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ""} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return observableThrowError(errMsg);
  }
}

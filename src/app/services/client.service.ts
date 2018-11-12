import { Injectable }    from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Route } from '../models/route';
import { ClientLike } from '../models/client-like';
import { ClientDislike } from '../models/client-dislike';
import { Client } from '../models/client';
import { Location } from '../models/location';
import { Appearance } from '../models/appearance';
import { HealthConcern } from '../models/health-concern';
import { RequestedItem } from '../models/requested-item';

import 'rxjs/add/operator/toPromise';

import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { PrayerRequestAndNeed } from "app/models/prayer-request";
import { GoalsNextStep } from "app/models/goals-next-steps";


// adding a new comment
@Injectable()
export class ClientService {
  theHeader = new HttpHeaders().set('Content-Type', 'application/json');
  online = true;
  // private baseUrl = 'https://hidden-springs-63744.herokuapp.com/';  // URL to web api
  // private apiUrl = 'https://hidden-springs-63744.herokuapp.com/';
  private baseUrl = 'https://joppa-api-test.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>) { }
  getClientLikes(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `likesForClient?clientId=${id}`, {headers: this.theHeader})
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  getClientDislikes(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `dislikesForClient?clientId=${id}`, {headers: this.theHeader})
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  getClientById(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `clients/${id}`, {headers: this.theHeader})
      .map((response) => {
        return response;
      })
  }

  getNewClients() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getNewClients`, {headers: this.theHeader}).map(response => { return response; });
  }

  getClientsNewToCamps() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getClientsNewToCamps`, {headers: this.theHeader}).map(response => { return response; });
  }

  insertClientLike(theClientLike: ClientLike) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.post(this.baseUrl + `client_likes`, {client_like: theClientLike}, {headers: this.theHeader})
        .map(response => response);
  }

  insertClientDislike(theClientDislike: ClientDislike) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.post(this.baseUrl + `client_dislikes`, {client_dislike: theClientDislike}, {headers: this.theHeader})
            .map(response => response);
  }

  insertClientAppearance(clientAppearance: Appearance){
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.post(this.baseUrl + `client_interactions`, {client_interaction: clientAppearance}, {headers: this.theHeader})
        .map(response => response).subscribe(response => {
        }, error => { console.log('error inserting appearance'); console.log(error)});
  }

  getHeatersForClient(theClientId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getCurrentHeatersForClient?clientId=${theClientId}`, {headers: this.theHeader})
            .map(response => response);
  }

  updateHeaterClient(theClientId, theHeaterId, theStatusId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `updateHeaterClient?clientId=${theClientId}&heaterId=${theHeaterId}&status=${theStatusId}`, {headers: this.theHeader})
          .map(response => response);
  }

  getAvailableHeaters() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getAvailableHeaters`, {headers: this.theHeader})
          .map(response => response);
  }

  getCheckedOutHeaters(id:number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, {headers: this.theHeader})
      .map(res => {return res;})
      .catch(err => this.handleError(err));
  }

  getClientsByName(name) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    if (name == '') {
      name = 'ALLCLIENTS';
    }
    return this.http.get(this.baseUrl + `getClientsByName?name=${name}`, {headers: this.theHeader})
        .map(response => response);
  }

  insertClient(theClient: Client) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.post(this.baseUrl + `clients`, {client: theClient}, {headers: this.theHeader})
        .map(response => response);
  }

  updateClient(theClient: Client) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.patch(this.baseUrl + `clients/${theClient.id}`, { client: theClient}, {headers: this.theHeader})
      .map(response => response);
  }

  insertHealthConcern(concern : HealthConcern) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.post(this.baseUrl + `health_concerns`, {health_concern: concern}, {headers: this.theHeader})
        .map(response => response);
  }

  getHealthConcerns(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.get(this.baseUrl + `getClientHealthConcerns?clientId=${id}`, {headers: this.theHeader})
        .map(response => response);
  }

  insertRequestedItem(item: RequestedItem) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    item.has_received = false;
      return this.http.post(this.baseUrl + `requested_items`, {requested_item: item}, {headers: this.theHeader})
        .map(response => response);
  }

  getRequestedItems(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.get(this.baseUrl + `getClientRequestedItem?clientId=${id}`, {headers: this.theHeader})
        .map(response => { console.log(response); return response; });
  }

  deletedRequestedItem(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.delete(this.baseUrl + `requested_items/${id}`, {headers: this.theHeader});
  }

  removeLike(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.delete(this.baseUrl + `client_likes/${id}`, {headers: this.theHeader});
  }

  removeDislike(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.delete(this.baseUrl + `client_dislikes/${id}`, {headers: this.theHeader});
  }

  removeHealthConcern(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.delete(this.baseUrl + `health_concerns/${id}`, {headers: this.theHeader});
  }

  deleteGoalAndNextStep(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.delete(this.baseUrl + `goals_and_next_steps/${id}`, {headers: this.theHeader});
  }

  completeGoalAndNextStep(theGoal: GoalsNextStep) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.patch(this.baseUrl + `goals_and_next_steps/${theGoal.id}`, {goals_and_next_step: theGoal}, {headers: this.theHeader})
  }

  receivedRequestedItem(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `receivedRequestedItem/?requestId=${id}`, {headers: this.theHeader});
  }

  getRecentReceivedItems(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `recentReceivedItems?clientId=${id}`, {headers: this.theHeader}).map(response => response);
  }

  getGoalsAndNextSteps(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `goalsForClient?clientId=${id}`, {headers: this.theHeader})
      .map(response => response);
  }

  insertGoalAndStep(goal : GoalsNextStep) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.post(this.baseUrl + `goals_and_next_steps`, {goals_and_next_step: goal}, {headers: this.theHeader})
        .map(response => response);
  }

  getClientPrayerRequests(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `prayerRequestsForClient?clientId=${id}`, {headers: this.theHeader})
  }

  insertClientPrayerRequest(prayerRequest: PrayerRequestAndNeed) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.baseUrl + `prayer_request_and_needs`, {prayer_request_and_need: prayerRequest},
      {headers: this.theHeader}).map(response => response);
  }

  getHeatEquipmentNotReturned(clientId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return Observable.forkJoin(
      this.http.get(this.baseUrl + `getHeatersNotReturnedForClient?clientId=${clientId}`, {headers: this.theHeader}),
      this.http.get(this.baseUrl + `getHosesNotReturnedForClient?clientId=${clientId}`, {headers: this.theHeader}),
      this.http.get(this.baseUrl + `getTanksNotReturnedForClient?clientId=${clientId}`, {headers: this.theHeader})
    ).map(data => {
      const resultArray = [];
      const heaters = data[0] as any[];
      const hoses = data[1] as any[];
      const tanks = data[2] as any[];
      heaters.forEach(item => {
        resultArray.push({Type: 'Heater', created_at: item.created_at, status_id: item.status_id, updated_at: item.updated_at});
      });
      hoses.forEach(item => {
        resultArray.push({Type: 'Hose', created_at: item.created_at, status_id: item.heater_status_id, updated_at: item.updated_at});
      });
      tanks.forEach(item => {
        resultArray.push({Type: 'Tank', created_at: item.created_at, status_id: item.status_id, updated_at: item.updated_at});
      });
      return resultArray;
    });
  }

  getAllRequestedItems() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
      return this.http.get(this.baseUrl + `getAllRequestedItems`, {headers: this.theHeader}).map(response => response);
  }

  getClientLoanedTanks(clientId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getTanksLoanedToClient?clientId=${clientId}`, {headers: this.theHeader}).map(response => response);
  }

  getClientLoanedHoses(clientId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `getHosesLoanedToClient?clientId=${clientId}`, {headers: this.theHeader}).map(response => response);
  }

  loanTank(clientId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.baseUrl + `client_tank_interactions`,
                {client_tank_interaction: {client_id: clientId, status_id: 2}}, {headers: this.theHeader})
            .map(response => response);
  }

  loanHose(clientId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.baseUrl + `client_hose_interactions`,
                {client_hose_interaction: {client_id: clientId, heater_status_id: 2}}, {headers: this.theHeader})
            .map(response => response);
  }

  updateTankInteraction(interactionId, statusId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl +
                    `updateTankInteraction?interactionId=${interactionId}&statusId=${statusId}`, {headers: this.theHeader})
            .map(response => response);
  }

  updateHoseInteraction(interactionId, statusId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl +
                  `updateHoseInteraction?interactionId=${interactionId}&statusId=${statusId}`, {headers: this.theHeader})
            .map(response => response);
  }

  updateHeaterInteraction(interactionId, statusId) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl +
                  `updateHeaterInteraction?interactionId=${interactionId}&statusId=${statusId}`, {headers: this.theHeader})
              .map(response => response);
  }

  private mapLocations(data: Array<any>): Location[] {
    return data.map(item => 
      <Location>({
        id: item.id,
        route_id: item.route_id,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        notes: item.notes,
        position: item.position
      })
    );
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.store.dispatch({ type: 'USER_API_ERROR', payload: {'message': errMsg}});
    return Observable.throw(errMsg);
  }
}
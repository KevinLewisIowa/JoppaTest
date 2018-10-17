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

const theHeader = new HttpHeaders().set('Content-Type', 'application/json');
// adding a new comment
@Injectable()
export class ClientService {
  online = true;
  // private baseUrl = 'https://hidden-springs-63744.herokuapp.com/';  // URL to web api
  // private apiUrl = 'https://hidden-springs-63744.herokuapp.com/';
  private baseUrl = 'https://joppa-api-test.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>) { }
  getClientLikes(id) {
    return this.http.get(this.baseUrl + `likesForClient?clientId=${id}`)
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  getClientDislikes(id) {
    return this.http.get(this.baseUrl + `dislikesForClient?clientId=${id}`)
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  getClientById(id) {
    return this.http.get(this.baseUrl + `clients/${id}`)
      .map((response) => {
        return response;
      })
  }

  insertClientLike(theClientLike : ClientLike) {
      return this.http.post(this.baseUrl + `client_likes`, {client_like: theClientLike}, {headers: theHeader})
        .map(response => response);
  }

  insertClientDislike(theClientDislike: ClientDislike) {
      return this.http.post(this.baseUrl + `client_dislikes`, {client_dislike: theClientDislike}, {headers: theHeader})
            .map(response => response);
  }

  insertClientAppearance(clientAppearance: Appearance){
      return this.http.post(this.baseUrl + `client_interactions`, {client_interaction: clientAppearance}, {headers: theHeader})
        .map(response => response).subscribe(response => {
        }, error => { console.log('error inserting appearance'); console.log(error)});
  }

  getHeatersForClient(theClientId) {
    return this.http.get(this.baseUrl + `getCurrentHeatersForClient?clientId=${theClientId}`)
            .map(response => response);
  }

  updateHeaterClient(theClientId, theHeaterId, theStatusId) {
    return this.http.get(this.baseUrl + `updateHeaterClient?clientId=${theClientId}&heaterId=${theHeaterId}&status=${theStatusId}`)
          .map(response => response);
  }

  getAvailableHeaters() {
    return this.http.get(this.baseUrl + `getAvailableHeaters`)
          .map(response => response);
  }

  getCheckedOutHeaters(id:number) {
    return this.http.get(this.baseUrl + `getCheckedOutHeaters?routeInstanceId=${id}`)
      .map(res => {return res;})
      .catch(err => this.handleError(err));
  }

  getClientsByName(name) {
    if (name == '') {
      name = 'ALLCLIENTS';
    }
    return this.http.get(this.baseUrl + `getClientsByName?name=${name}`)
        .map(response => response);
  }

  insertClient(theClient: Client) {
      return this.http.post(this.baseUrl + `clients`, {client: theClient}, {headers: theHeader})
        .map(response => response);
  }

  updateClient(theClient: Client) {
    return this.http.patch(this.baseUrl + `clients/${theClient.id}`, { client: theClient}, {headers: theHeader})
      .map(response => response).subscribe(data => {}, error => { console.log('error updating client')});
  }

  insertHealthConcern(concern : HealthConcern) {
      return this.http.post(this.baseUrl + `health_concerns`, {health_concern: concern}, {headers: theHeader})
        .map(response => response);
  }

  getHealthConcerns(id) {
      return this.http.get(this.baseUrl + `getClientHealthConcerns?clientId=${id}`)
        .map(response => response);
  }

  insertRequestedItem(item : RequestedItem) {
    item.has_received = false;
      return this.http.post(this.baseUrl + `requested_items`, {requested_item: item}, {headers: theHeader})
        .map(response => response);
  }

  getRequestedItems(id) {
      return this.http.get(this.baseUrl + `getClientRequestedItem?clientId=${id}`)
        .map(response => { console.log(response); return response});
  }

  deletedRequestedItem(id: number) {
    return this.http.delete(this.baseUrl + `requested_items/${id}`);
  }

  removeLike(id: number) {
    return this.http.delete(this.baseUrl + `client_likes/${id}`);
  }

  removeDislike(id: number) {
    return this.http.delete(this.baseUrl + `client_dislikes/${id}`);
  }

  removeHealthConcern(id: number) {
    return this.http.delete(this.baseUrl + `health_concerns/${id}`);
  }

  deleteGoalAndNextStep(id: number) {
    return this.http.delete(this.baseUrl + `goals_and_next_steps/${id}`);
  }

  completeGoalAndNextStep(theGoal: GoalsNextStep) {
    return this.http.patch(this.baseUrl + `goals_and_next_steps/${theGoal.id}`, {goals_and_next_step: theGoal}, {headers: theHeader})
  }

  receivedRequestedItem(id: number) {
    return this.http.get(this.baseUrl + `receivedRequestedItem/?requestId=${id}`);
  }

  getRecentReceivedItems(id) {
    return this.http.get(this.baseUrl + `recentReceivedItems?clientId=${id}`).map(response => response);
  }

  getGoalsAndNextSteps(id) {
    return this.http.get(this.baseUrl + `goalsForClient?clientId=${id}`)
      .map(response => response);
  }

  insertGoalAndStep(goal : GoalsNextStep) {
      return this.http.post(this.baseUrl + `goals_and_next_steps`, {goals_and_next_step: goal}, {headers: theHeader})
        .map(response => response);
  }

  getClientPrayerRequests(id) {
    return this.http.get(this.baseUrl + `prayerRequestsForClient?clientId=${id}`)
  }

  insertClientPrayerRequest(prayerRequest: PrayerRequestAndNeed) {
    return this.http.post(this.baseUrl + `prayer_request_and_needs`, {prayer_request_and_need: prayerRequest},
      {headers: theHeader}).map(response => response);
  }

  getHeatEquipmentNotReturned(clientId) {
    return Observable.forkJoin(
      this.http.get(this.baseUrl + `getHeatersNotReturnedForClient?clientId=${clientId}`),
      this.http.get(this.baseUrl + `getHosesNotReturnedForClient?clientId=${clientId}`),
      this.http.get(this.baseUrl + `getTanksNotReturnedForClient?clientId=${clientId}`)
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
      return this.http.get(this.baseUrl + `getAllRequestedItems`).map(response => response);
  }

  getClientLoanedTanks(clientId) {
    return this.http.get(this.baseUrl + `getTanksLoanedToClient?clientId=${clientId}`).map(response => response);
  }

  getClientLoanedHoses(clientId) {
    return this.http.get(this.baseUrl + `getHosesLoanedToClient?clientId=${clientId}`).map(response => response);
  }

  loanTank(clientId) {
    return this.http.post(this.baseUrl + `client_tank_interactions`, {client_tank_interaction: {client_id: clientId, status_id: 2}})
            .map(response => response);
  }

  loanHose(clientId) {
    return this.http.post(this.baseUrl + `client_hose_interactions`, {client_hose_interaction: {client_id: clientId, heater_status_id: 2}})
            .map(response => response);
  }

  updateTankInteraction(interactionId, statusId) {
    return this.http.get(this.baseUrl + `updateTankInteraction?interactionId=${interactionId}&statusId=${statusId}`)
            .map(response => response);
  }

  updateHoseInteraction(interactionId, statusId) {
    return this.http.get(this.baseUrl + `updateHoseInteraction?interactionId=${interactionId}&statusId=${statusId}`)
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
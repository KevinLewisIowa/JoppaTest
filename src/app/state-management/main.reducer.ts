import { GET_USER, GET_LOCATIONS, LOCATION_SELECTED, LOCATION_CAMP_SELECTED, ROUTE_SELECTED } from './main.actions';
import { IUserStore, UserStore } from './main.store';

export function MainReducer (state : IUserStore = UserStore, {type, payload}) {
    switch (type){
        case (GET_USER):
            return Object.assign({}, state, {
                        userName: payload
                    });
        case (GET_LOCATIONS):
            return Object.assign({}, state, {
                locations: payload
            });
        case (ROUTE_SELECTED):
            return Object.assign({}, state, { selectedRoute: payload});
        case (LOCATION_SELECTED):
            return Object.assign({}, state, {selectedLocation: payload});
        case (LOCATION_CAMP_SELECTED):
            return Object.assign({}, state, {selectedLocationCamp: payload})
        default: 
            return state;
    }
}
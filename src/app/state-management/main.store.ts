import { Location } from '../models/location';
import { Route } from '../models/route';
export interface IMainStore {
    userName: string;
    locations: Location[];
    selectedRoute: Route;
    selectedLocation: Location;
}

export const MainStore : IMainStore = {
    userName: "",
    locations: [],
    selectedRoute: undefined,
    selectedLocation: undefined
}
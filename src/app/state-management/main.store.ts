import { Route } from '../models/route';
import { LocationCamp } from "app/models/location-camp";

export interface IMainStore {
    user: IUserStore,
    api: IAPI_Error
}
export interface IUserStore {
    userName: string | null;
    selectedRoute: Route | null;
    selectedLocationCamp: LocationCamp | null;
}

export const UserStore : IUserStore = {
    userName: "",
    selectedRoute: null,
    selectedLocationCamp: null
}

export interface IAPI_Error {
    show: boolean
    _body: string
    headers: {}
    ok: boolean
    status: number
    statusText: string
    type: number
    url: string
    message: string
}

export const API_Error: IAPI_Error = {
    show: false,
    _body: '',
    headers: {},
    ok: null,
    status: null,
    statusText: '',
    type: null,
    url: '',
    message: ''
}
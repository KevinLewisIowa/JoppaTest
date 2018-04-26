import { Location } from '../models/location';
import { Route } from '../models/route';

export interface IMainStore {
    user: IUserStore,
    api: IAPI_Error
}
export interface IUserStore {
    userName: string | null;
    locations: Location[] | null;
    selectedRoute: Route | null;
    selectedLocation: Location | null;
}

export const UserStore : IUserStore = {
    userName: "",
    locations: [],
    selectedRoute: null,
    selectedLocation: null
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
import {USER_API_ERROR } from './main.actions'
import { IAPI_Error, API_Error } from './main.store'

export function APIReducer(state: IAPI_Error = API_Error, { type, payload }) {
    switch (type) {
        case (USER_API_ERROR):
            return Object.assign({}, state, payload);
        default:
            return state;
    }
}
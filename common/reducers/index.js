import { combineReducers } from 'redux'
import counter from './counter'
import { createAction, createReducer } from 'redux-act'
import { origin_actions } from '../actions'


const token = createReducer({
    [origin_actions.set_token]: (token, payload) => {
        try {
            let data = JSON.parse(atob(payload.split('.')[1]))
            if (data.exp * 1000 < Date.now()) {
                return Object.assign({}, token, { data, str: payload })
            }
            return token
        } catch (error) {
            return token
        }
    }
}, null)

export default { counter, token }
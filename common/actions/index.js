import { bindActionCreators } from 'redux'
import { createAction, createReducer } from 'redux-act'

import { initRedux } from '../store'

let store;
try {
  // initReudx 在网页端有缓存，不会重复创建 store ，所以不用担心。这里仅仅是尝试取出 store
  store = initRedux()
} catch (error) {
  store = { dispatch: function() {} }
}

const set_token = createAction('set_token')

const get_token = {};

export const origin_actions = Object.freeze({ set_token })

export const bound_actions = bindActionCreators(origin_actions, store.dispatch)

// export const SET_COUNTER = 'SET_COUNTER'
// export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
// export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'

export const set = (value) => ({
  type: 'SET_COUNTER',
  payload: value
})

export const increment = () => ({
  type: 'INCREMENT_COUNTER'
})

export const decrement = () => ({
  type: 'DECREMENT_COUNTER'
})

export const incrementIfOdd = () => (dispatch, getState) => {
  const { counter } = getState()

  if (counter % 2 === 0) {
    return
  }

  dispatch(increment())
}

export const incrementAsync = (delay = 1000) => dispatch => {
  setTimeout(() => {
    dispatch(increment())
  }, delay)
}


bindActionCreators()
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
// import { Provider } from 'react-redux'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
// import configureStore from '../common/store/configureStore'
import { initApollo, initRedux } from '../common/store'
import App from '../common/containers/App'

const apollo = initApollo({
  initialState: window.__PRELOADED_STATE__.apollo
})
const redux = initRedux(apollo, window.__PRELOADED_STATE__)

const rootElement = document.getElementById('app')

render(
  <ApolloProvider client={apollo} store={redux}>
    <App />
  </ApolloProvider>,
  rootElement
)

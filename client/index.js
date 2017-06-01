import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { StaticRouter, BrowserRouter } from 'react-router-dom'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { initApollo, initRedux } from '../common/store'
import App from '../common/containers/App'

const apollo = initApollo({
  initialState: window.__PRELOADED_STATE__.apollo
})
const redux = initRedux(apollo, window.__PRELOADED_STATE__)

const rootElement = document.getElementById('app')

render(
  <ApolloProvider client={apollo} store={redux}>
    <BrowserRouter><App /></BrowserRouter>
  </ApolloProvider>,
  rootElement
)

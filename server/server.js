/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import Express from 'express'
import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import React from 'react'
import { renderToString } from 'react-dom/server'
// import { Provider } from 'react-redux'
import { ApolloProvider, getDataFromTree } from 'react-apollo'

// import configureStore from '../common/store/configureStore'
import { initApollo, initRedux } from '../common/store'
import App from '../common/containers/App'
// import { fetchCounter } from '../common/api/counter'

const app = new Express()
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// This is fired every time the server side receives a request
app.use(async (req, res) => {
  try {
    const apollo = initApollo()
    const redux = initRedux(apollo)

    // Run all graphql queries
    const app = (
      // No need to use the Redux Provider
      // because Apollo sets up the store for us
      <ApolloProvider client={apollo} store={redux}>
        <App />
      </ApolloProvider>
    )
    await getDataFromTree(app)
    const html = renderToString(app)

    // Extract query data from the store
    const state = redux.getState()
    res.send(renderFullPage(html, state))
  } catch (error) {
    res.end(500)
  }
})

const renderFullPage = (html, preloadedState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Redux Universal Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\x3c')}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})

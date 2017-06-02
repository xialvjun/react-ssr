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
import { StaticRouter } from 'react-router-dom'
import { ApolloProvider, getDataFromTree } from 'react-apollo'

import { initApollo, initRedux } from '../common/store'
import App from '../common/containers/App'

const app = new Express()
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(async (req, res) => {
  try {
    const apollo = initApollo()
    const redux = initRedux(apollo)

    const context = {}

    const vdom = (
      <ApolloProvider client={apollo} store={redux}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    )

    // // Run all graphql queries
    // await getDataFromTree(vdom)
    // const html = renderToString(vdom)

    // if (context.url) {
    //   // Somewhere a `<Redirect>` was rendered
    //   res.redirect(context.status || 301, context.url)
    // } else {
    //   // Extract query data from the store
    //   const state = redux.getState()
    //   res.send(renderFullPage(html, state))
    // }


    // 查看 apollo 源代码，发现是在高阶组建的 componentDidMount 里查询数据的。。说明 getDataFromTree 会运行组建的 constructor componentDidMount 
    // 另外，我们也知道 renderToString 会运行 constructor 但不会运行 componentDidMount
    // 所以，想要得到最正确的 state，应该在 getDataFromTree 就立即获取 state
    // 但是，apollo 的 getDataFromTree 能 await 不代表自己的 componentDidMount 里的异步操作也被 await
    // 所以可以相信自己的同步 state，但不可以相信自己的异步 state
    // Run all graphql queries
    await getDataFromTree(vdom)
    
    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      res.redirect(context.status || 301, context.url)
    } else {
      // Extract query data from the store
      const state = redux.getState()
      const html = renderToString(vdom)
      res.send(renderFullPage(html, state))
    }
  } catch (error) {
    res.end(500)
  }
})

function renderFullPage(html, preloadedState) {
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

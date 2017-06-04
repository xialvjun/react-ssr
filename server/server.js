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
import { origin_actions } from '../common/actions'
import App from '../common/containers/App'

const app = new Express()
const port = 3000

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get('/favicon.ico', (req, res) => {
  res.end()
})

app.use(async (req, res) => {
  try {
    const apollo = initApollo()
    const redux = initRedux(apollo)

    // // 把获取 token 的操作放在 server 端。。。事实上，在没有 apollo 的时候，本来就是由 server 端获取初始状态
    // // 这种想法不行，因为已经登录后，单纯的刷新就造成登出了
    // if (req.query.code) {
    //   let token = await get_token(req.query.code)
    //   redux.dispatch(origin_actions.set_token(token))
    // }

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
    // 后经更详细测试， getDataFromTree 并不会运行组件的 componentDidMount 或者说它只运行 graphql 高阶组件的 componentDidMount
    // Run all graphql queries
    await getDataFromTree(vdom)

    // 见 common/components/App.js 的 git 记录，也许服务端永远都不应该 redirect，因为服务端没有足够的 reduxStore 的内容来判断
    // if (context.url) {
    //   // Somewhere a `<Redirect>` was rendered
    //   res.redirect(context.status || 301, context.url)
    // } else {
      // Extract query data from the store
    const state = redux.getState()
    const html = renderToString(vdom)
    res.send(renderFullPage(html, state))
    // }
  } catch (error) {
    res.status(500).end()
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

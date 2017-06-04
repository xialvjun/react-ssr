import { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import { bound_actions } from '../actions'
import * as api from '../api'


function get_code(search) {
    let code = search.slice(1).split('&').find(s => s.startsWith('code='))
    if (code) {
        code = code.split('=')[1]
    }
    return code
}

class App extends Component {
    async componentDidMount() {
        const location = this.props.location
        const code = get_code(location.search)
        // bound_actions.get_token(code)
        api.get_token(code).then(token => {
            bound_actions.set_token(token)
            localStorage.setItem('token', token)
            this.props.history.replace(location.pathname)
        })
    }
    render() {
        const code = get_code(this.props.location.search)
        // 如果是服务端渲染，则一定不会有 code，但是完全有可能客户端有 token。。。所以不应该返回 Redirect。。。
        // 也许，服务端永远都不应该返回 redirect，因为服务端没有足够的 reduxStore 的内容来判断
        if (code || !process.browser) {
            return <div className='loading' />
        } else if (this.props.token) {
            return <div className="content" />
        }
        return <Redirect to={`http://login.xxx.com/?redirect_url=${location.pathname+location.search}`} />
    }
}

// export default App

// function App({ location, token }) {
//     const code = get_code(location.search)
//     if (code) {
//         bound_actions.get_token(code)
//         return <div className='loading' />
//     } else if (token) {
//         return <div className="content" />
//     }
//     return <Redirect to={`http://login.amiao.com/?redirect_url=${location.pathname+location.search}`} />
// }

export default withRouter(connect(
    state => ({
        token: state.token
    })
)(App))

import { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'

import { bound_actions } from '../actions'


function get_code(search) {
    let code = search.slice(1).split('&').find(s => s.startsWith('code='))
    if (code) {
        code = code.split('=')[1]
    }
    return code
}

class App extends Component {
    componentDidMount() {
        const code = get_code(this.props.location.search)
        bound_actions.get_token(code)
    }
    render() {
        const code = get_code(this.props.location.search)
        if (code) {
            return <div className='loading' />
        } else if (token) {
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

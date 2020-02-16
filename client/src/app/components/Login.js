import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";

import { setStateToken, setAuthToken, exchangeStateAndCodeForToken } from '../store/auth'

import Gh from '../utils/GithubClient'

let mapStateToProps = state => ({
    ghAuthToken: state.auth.ghAuthToken,
    fetchingToken: state.auth.isFetching,
    authError: state.auth.error
})

let mapDispatchToProps = dispatch => ({
    setAuthToken: token => dispatch(setAuthToken(token)),
    exchangeStateAndCodeForToken: (stateToken, code) => dispatch(exchangeStateAndCodeForToken(stateToken, code)),
    setStateToken: stateToken => dispatch(setStateToken(stateToken))
})

@connect(
    mapStateToProps,
    mapDispatchToProps
)
class Login extends Component {
    render() {
        let qs = `client_id=8390933a81635970d3b6&state=${this.state.ghStateToken}&scope=public_repo%20read:user`
        let errorMessage = this.props.authError && (
            <div style={{
                backgroundColor: '#e80801',
                width: '100%',
                position: 'absolute',
                padding: '.25rem',
                color: 'white',
                textAlign: 'center'
            }}>
                <h1 className="notify-title">There was a problem signing into GitHub</h1>
                <p>{ this.props.authError }</p>
            </div>
        )

        return (
            <Fragment>
                { errorMessage }
                <div>
                    <a
                        href={ `https://github.com/login/oauth/authorize?${qs}` }
                        className="editor_button editor_button--primary"
                    >Login to GitHub</a>
                </div>
            </Fragment>
        )
    }
}

export default Login
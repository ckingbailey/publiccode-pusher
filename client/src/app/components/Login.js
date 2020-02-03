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

// @connect(
//     mapStateToProps,
//     mapDispatchToProps
// )
class Login extends Component {
    constructor() {
        super()
        this.state = {
            ghStateToken: null
        }
    }

    getCodeAndStateFromQs(qs) {
        qs = qs.slice(1)
        if (!qs) return false
        let params = qs.split('&')

        let code = params.find(param => param.startsWith('code='))
        code = code && decodeURI(code.split('=')[1])

        let stateToken = params.find(param => param.startsWith('state='))
        stateToken = stateToken && decodeURI(stateToken.split('=')[1])

        return { code, stateToken }
    }

    storeTokenLocally(key, token) {
        if (token) {
            localStorage.setItem(key, token)
            console.log(`done stored token ${token}`)
        }
    }

    /**
     * When component mounts,
     *   1. check for GH auth token on localStorage
     *      - if present, user is authorized
     *   2. if no GH auth token, check for [ GH state token, code ] in `qs` & [ GH state token ] in `localStorage`
     *      - if found, user is mid-auth-flow, exchange GH code for auth token
     *   3. if no [ GH state token | code ] on `qs` or no [ GH state token ] in `localStorage`, user has yet to authorize
     *      - generate Gh state token, hold it in state & save it in localStorage
     */
    componentDidMount() {
        // if ghAuthToken is on localStorage and not Redux, this must be first load
        let storedToken = window.localStorage.getItem('GH_AUTH_TOKEN')
        if (storedToken || this.props.ghAuthToken !== null) {
            if (storedToken && this.props.ghAuthToken === null) {
                this.props.setAuthToken(window.localStorage.getItem('GH_AUTH_TOKEN'))
            }
            // if ghAuthToken is on Redux but not on localStorage, we gotta store it on localStorage
            else if (!storedToken && this.props.ghAuthToken !== null) {
                this.storeTokenLocally('GH_AUTH_TOKEN', this.props.ghAuthToken)
            }
            return
        }

        // if no ghAuthToken found anywhere, check for gh state token & code
        let { code, stateToken } = this.getCodeAndStateFromQs(window.location.search)
        let storedStateToken = window.localStorage.getItem('GH_STATE_TOKEN')
        // if we have code & state tokens match in qs & localStorage
        // use them to fetch ghAuthToken
        if (code && stateToken && storedStateToken && stateToken === storedStateToken) {
            this.props.exchangeStateAndCodeForToken(stateToken, code)
        } else {
            const ghStateToken = Gh.generateState()
            localStorage.setItem('GH_STATE_TOKEN', ghStateToken)
            this.setState({ ghStateToken })
        }
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
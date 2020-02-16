import React, { Component } from "react"
import { connect } from "react-redux";

import { setStateToken, setAuthToken, exchangeStateAndCodeForToken } from '../store/auth'

import Editor from './editor'
import Login from './Login'

import Gh from '../utils/GithubClient'

const mapStateToProps = state => ({
    ghAuthToken: state.auth.ghAuthToken
})

let mapDispatchToProps = dispatch => ({
    setAuthToken: token => dispatch(setAuthToken(token)),
    exchangeStateAndCodeForToken: (stateToken, code) => dispatch(exchangeStateAndCodeForToken(stateToken, code)),
    setStateToken: stateToken => dispatch(setStateToken(stateToken))
})

@connect (
    mapStateToProps,
    mapDispatchToProps
)
class Index extends Component {
    constructor() {
        super()
        this.state = {
            ghStateToken: null
        }
    }

    /**
    * 1. check for GH auth token on sessionStorage and Redux store
    *    - if present, user is authorized
    * 2. if no GH auth token, check for [ GH state token, code ] in `qs` & [ GH state token ] in `sessionStorage`
    *    - if found, user is mid-auth-flow, exchange GH code for auth token
    * 3. if no [ GH state token | code ] on `qs` or no [ GH state token ] in `sessionStorage`, user has yet to authorize
    *    - generate Gh state token, hold it in state & save it in sessionStorage
    */
    handleAuthState() {
        // if ghAuthToken is on sessionStorage and not Redux, this must be first load
        let storedToken = window.sessionStorage.getItem('GH_AUTH_TOKEN') // TODO: use session storage instead
        if (storedToken || this.props.ghAuthToken !== null) {
            // if token is stored in session but not on redux store, set it on redux store
            if (storedToken && this.props.ghAuthToken === null) {
                this.props.setAuthToken(window.sessionStorage.getItem('GH_AUTH_TOKEN'))
            }
            // if ghAuthToken is on store but not on sessionStorage, we gotta store it on sessionStorage
            else if (!storedToken && this.props.ghAuthToken !== null) {
                this.storeTokenLocally('GH_AUTH_TOKEN', this.props.ghAuthToken)
            }

            // Check user permissions on target repo here

            return
        }

        // if no ghAuthToken found anywhere, check for gh state token & code
        let { code, stateToken } = this.getCodeAndStateFromQs(window.location.search)
        let storedStateToken = window.sessionStorage.getItem('GH_STATE_TOKEN')
        // if we have code & state tokens match in qs & sessionStorage
        // use them to fetch ghAuthToken
        if (code && stateToken && storedStateToken && stateToken === storedStateToken) {
            this.props.exchangeStateAndCodeForToken(stateToken, code)
        } else {
            const ghStateToken = Gh.generateState()
            sessionStorage.setItem('GH_STATE_TOKEN', ghStateToken)
            this.setState({ ghStateToken })
        }
    }

    storeTokenLocally(key, token) {
        if (token) {
            localStorage.setItem(key, token)
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

    componentDidMount() {
        this.handleAuthState()
    }

    componentDidUpdate() {
        this.handleAuthState()
    }

    render() {
        return (
            this.props.ghAuthToken
            ? <Editor/>
            : <Login/>
        )
    }
}

export default Index
